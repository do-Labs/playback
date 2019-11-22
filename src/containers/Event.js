import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message, Modal} from "semantic-ui-react";
import {NavMenu, Logo} from "../components/index";
import firebase from '../Firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Base64} from "js-base64";
const projectName = JSON.parse(Base64.decode(process.env.REACT_APP_KEYS_B64)).projectId;


export default class Event extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('events');
        this.state = {
            error: null,
            message: null,
            isLoading: false,
            editMode: false,
            isEnabled: true,

            eventTitle: "",
            businessName: "-",
            eventDate: "MM-DD-YYYY",
            location: "",
            eventUrl: "",

            qrMakerUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=",
            qrPrefix: 'https://playback.herokuapp.com/signIn/',
            eventCodeUrl: "https://tinyurl.com/y6ysz826",
            qrData: "",
            modalOpen: false,

        };
    }

    componentDidMount = async() => {
        const eventID = this.props.match.params.id;
        const businessID = this.props.businessID;

        if(businessID){
            const busRef = await firebase.firestore().collection("businesses").doc(businessID);
            await busRef.get().then(async (doc) => {
                if (doc.exists) {
                    const bus = await doc.data();
                    this.setState({
                        businessName: bus.name,
                    })
                }
            });
        }
        else {
            this.setState({
                error: {
                    message: "No Registered Business Found!"
                }
            })
        }


        if (eventID) {
            this.setState({
                isLoading: true,
                editMode: true,
            });
            const ref = firebase.firestore().collection('events').doc(eventID);
            await ref.get().then((doc) => {
                if (doc.exists) {
                    const event = doc.data();
                    this.setState({
                        key: doc.id,
                        eventTitle: event.eventTitle,
                        businessID: event.businessID,
                        businessName: event.businessName,
                        eventDate: event.eventDate,
                        location: event.location,
                        eventUrl: event.eventUrl,
                    });
                } else {
                    console.log("No such document!");
                }
            });
        }
        this.setState({
            isLoading: false,
            businessID: businessID,
        });

    };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    createQRCode = (qrData) => {
        this.setState({isLoading: true});

        // QR Template:
        // http://www.app.com/instance/{id}/feedbackl/instance/{id}
        // QR Template (display to public for POST to specific
        // events/{eventID}/feedback/

        const {
            qrMakerUrl,
            qrPrefix,
        } = this.state;

        let eventCodeQR = qrMakerUrl + qrPrefix + qrData;
        this.setState({
            eventCodeUrl: eventCodeQR,
            isLoading: false,
        })
    };


    submitCreate = async () => {
        // null handlers
        if(!this.state.eventUrl){
            this.setState({eventUrl : "http://"})
        }

        const {
            eventTitle,
            businessName,
            eventDate,
            location,
            eventUrl,
            businessID,
        } = this.state;

        await this.ref.add({
            timeStamp: Date.now(),
            eventTitle,
            businessName,
            eventDate,
            location,
            eventUrl,
            businessID,
            user: {
                userID: this.props.userID,
                email: this.props.username,
            }
        }).then( async(docRef) => {
            const eid = docRef._key.path.segments[1];
            //handle response
            this.setState({
                eventID: eid,
            });
            await this.createQRCode(eid);
            await this.handleEmailQR();
            // Show Modal with info
            await this.handleOpen();
            // if OK then nav to my-events
            // this.props.history.push("/my-events")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    submitEdit = async () => {
        const eventID = this.props.match.params.id;
        const {
            eventTitle,
            businessName,
            eventDate,
            location,
            eventUrl,
            businessID,
        } = this.state;

        // Then update existing data with a PUT call with all fields
        // Only make the editable fields available for the user to update
        const eventsRef = firebase.firestore().collection('events').doc(eventID);

        // post all events info to firebase

        await eventsRef.update({
            eventTitle,
            businessName,
            eventDate,
            location,
            eventUrl,
            businessID,
        }).then((docRef) => {
            alert("Event Edited Successfully!");
            this.props.history.push("/my-events")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });


    };

    onSubmit = e => {
        e.preventDefault();
        this.setState({
            isEnabled: false,
            isLoading: true,
        });
        if (this.state.editMode) {
            this.submitEdit();
        } else {
            this.submitCreate();
        }

        this.setState({
            isEnabled: false,
            isLoading: false,
        });
    };

    handleEmailQR = async () => {
        const body  = JSON.stringify({
            to: this.props.username,
            content: this.state.eventCodeUrl
        });

        await fetch(`https://us-central1-${projectName}.cloudfunctions.net/EmailQRCode`, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
                'cache-control': 'no-cache',
            }),
            body
        })
            .then( (res)=> {
                if(res.status !== 200){
                    alert("Could not email user")
                }
            }).catch( (err)=> {
            alert("Error sending Email");
            console.log("Error Emailing User: ", err)
        })
    };

    handleOpen = () => this.setState({modalOpen: true});
    handleClose = () => {
        this.setState({modalOpen: false});
        this.props.history.push("/my-events");
    };

    handleDateChange = date => {
        const dateData = date.toString().split(' ');
        // const day = dateData[0];
        const month = dateData[1];
        const dateOfMonth = dateData[2];
        const year = dateData[3];

        const dateFormatted = month + "-" + dateOfMonth + "-" + year;

        this.setState({
            eventDate: dateFormatted,
        });

    };

    render() {
        const {
            error,
            message,
            isLoading,
            editMode,
            eventTitle,
            businessName,
            eventDate,
            location,
            eventCodeUrl,
            eventUrl,
        } = this.state;

        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        {editMode && <h2>Edit Event</h2>}
                        {!editMode && <h2>Create Event</h2>}
                        {error && <Message error content={error.message}/>}
                        {message && <Message success content={message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}

                        <Modal
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            header={<center>Event Created!</center>}
                            content={
                                <div>
                                    <div>
                                        <center>
                                            <h4>EVENT MESSAGE</h4>
                                            <img hspace="20" alt="eventCodeUrl" align="top" className="ui tiny image" src={eventCodeUrl} />
                                        </center>
                                    </div>
                                    <p> </p>
                                    <p> </p>
                                    <h4><b>Event Info</b></h4>
                                    <p><b>Date:</b> {eventDate}</p>
                                    <p><b>Title:</b> {eventTitle}</p>
                                    <p><b>Event URL:</b> <a href={eventUrl}>{eventUrl}</a></p>
                                    <p><b>Location:</b> {location}</p>
                                </div>
                            }/>

                        <Form>

                            <div className="ui segment">
                                <center><h4>{businessName}</h4></center>

                                <div className="equal width fields">
                                    <Form.Field>
                                        <h4>Title</h4>
                                        <Form.Input
                                            name="eventTitle"
                                            placeholder="eventTitle"
                                            value={eventTitle}
                                            onChange={this.handleOnChange}
                                            error={!eventTitle || eventTitle === ""}
                                        />
                                    </Form.Field>

                                    {!editMode &&
                                    <div>
                                        <h4>Event Date</h4>
                                        <DatePicker
                                            selected={this.state.dateOfEvent}
                                            onChange={this.handleDateChange}
                                            value={this.state.eventDate}
                                        />
                                    </div>
                                    }

                                    {editMode &&
                                    <div>
                                        <Form.Field>
                                            <h4>Event Date</h4>
                                            <h5>{eventDate}</h5>
                                        </Form.Field>
                                    </div>
                                    }

                                </div>
                                <Form.Field>
                                    <h4>Location</h4>
                                    <Form.Input
                                        name="location"
                                        placeholder="1MC Dallas"
                                        value={location}
                                        onChange={this.handleOnChange}
                                        error={!location || location === ""}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <h4>Event URL</h4>
                                    <Form.Input
                                        name="eventUrl"
                                        placeholder="http://"
                                        value={eventUrl}
                                        onChange={this.handleOnChange}
                                    />
                                </Form.Field>
                            </div>

                            {!editMode &&
                            <Button loading={isLoading}
                                    onClick={this.submitCreate}
                                    disabled={
                                        !eventTitle || eventTitle === "" ||
                                        !eventDate || eventDate === "MM-DD-YYYY" ||
                                        !location || location === ""
                                    }
                            >Create</Button>
                            }

                            {editMode &&
                            <Button loading={isLoading}
                                    onClick={this.submitEdit}
                                    disabled={
                                        !eventTitle || eventTitle === "" ||
                                        !eventDate || eventDate === "MM-DD-YYYY" ||
                                        !location || location === ""
                                    }
                            >Update</Button>
                            }
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
