import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message} from "semantic-ui-react";
import {NavMenu, Logo} from "../components/index";
import firebase from '../Firebase';
const projectName = "playback-2a438";

export default class Pitch extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('pitches');
        this.state = {
            error: null,
            isLoading: false,
            editMode: false,
            isEnabled: true,
            pitchTitle: "",
            businessName: "-",
            dateOfPitch: "",
            presenterName: "",
            presenterEmail: "",
            location: "",
            pitchUrl: "",
            eventUrl: "",

            qrMakerUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=",
            qrPrefix: 'https://blooming-bastion-98391.herokuapp.com/feedback/',
            pitchCodeUrl: "https://tinyurl.com/y6ysz826",
            qrData: "",
        };
    }

    componentDidMount = async() => {
        const pitchId = this.props.match.params.id;
        const businessID = this.props.businessID;

        if(businessID){
            const busRef = await firebase.firestore().collection("businesses").doc(businessID);
            busRef.get().then(async (doc) => {
                if (doc.exists) {
                    const bus = await doc.data();
                    this.setState({
                        businessName: bus.name,
                    })
                }
            });
            console.log('busId:', businessID);
            console.log('businessName:', this.state.businessName);
        }
        else {
            this.setState({
                error: {
                    message: "No Registered Business Found!"
                }
            })
        }


        if (pitchId) {
            this.setState({
                isLoading: true,
                editMode: true,
            });
            console.log("Editing Pitch: " + pitchId);
            const ref = firebase.firestore().collection('pitches').doc(pitchId);
            ref.get().then((doc) => {
                if (doc.exists) {
                    const pitch = doc.data();
                    this.setState({
                        key: doc.id,
                        pitchTitle: pitch.pitchTitle,
                        businessName: pitch.businessName,
                        dateOfPitch: pitch.dateOfPitch,
                        presenterName: pitch.presenterName,
                        presenterEmail: pitch.presenterEmail,
                        location: pitch.location,
                        pitchUrl: pitch.pitchUrl,
                        eventUrl: pitch.eventUrl,
                        businessID: pitch.businessID,
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
        // http://www.app.com/instance/{id}/feedbackPortal/instance/{id}
        // QR Template (display to public for POST to specific
        // pitches/{pitchID}/feedback/

        const {
            qrMakerUrl,
            qrPrefix,
        } = this.state;

        // let pitchCodeQR = qrMakerUrl + 'www.playback.io/feedback/' + qrData;
        let pitchCodeQR = qrMakerUrl + qrPrefix + qrData;


        console.log(`QRData: ${qrData}`);
        console.log(`pitchcodeQR: ${pitchCodeQR}`);


        this.setState({
            pitchCodeUrl: pitchCodeQR,
            isLoading: false,
        })
    };


    submitCreate = async () => {
        // null handlers
        if(!this.state.eventUrl){
            this.setState({eventUrl : "http://"})
        }

        const {
            pitchTitle,
            businessName,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            eventUrl,
            businessID,
        } = this.state;

        this.ref.add({
            pitchTitle,
            businessName,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            eventUrl,
            businessID,
        }).then( async(docRef) => {
            const pid = docRef._key.path.segments[1];
            //handle response
            this.setState({
                pitchID: pid,
            });
            await this.createQRCode(pid);
            await this.handleEmailQR();

            // this.props.history.push("/pitches")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    submitEdit = () => {
        // null handlers
        if(!this.state.eventUrl){
            console.log('no event url');
            this.setState({eventUrl : "http://"})
        }

        const pitchId = this.props.match.params.id;
        console.log("PITCHID: " , pitchId);
        const {
            pitchTitle,
            businessName,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            eventUrl,
            businessID,
        } = this.state;

        // Then update existing data with a PUT call with all fields
        // Only make the editable fields available for the user to update
        const pitchRef = firebase.firestore().collection('pitches').doc(pitchId);

        // post all pitch info to firebase

        pitchRef.set({
            pitchTitle,
            businessName,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            eventUrl,
            businessID,
        }).then((docRef) => {
            alert("Pitch Edited Successfully!");
            this.props.history.push("/my-pitches")
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
        console.log("Successfully submitted pitch");
    };

    setUrl = (pitchCodeUrl) => {
        this.setState({
            pitchCodeUrl
        });
    };

    handleEmailQR = () => {
        const body  = JSON.stringify({
            to: this.state.presenterEmail,
            content: this.state.pitchCodeUrl
        });
        console.log("BODY: ", body);

        fetch(`https://us-central1-${projectName}.cloudfunctions.net/EmailQRCode`, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
                'cache-control': 'no-cache',
            }),
            body
        })
            .then( (res)=> {
                console.log("Emailed user");
                console.log("RESPONSE: ", res)
            }).catch( (err)=> {
            alert("Error sending Email");
            console.log("Error Emailing User: ", err)
        })
    };


    render() {
        const {
            error,
            isLoading,
            editMode,
            pitchTitle,
            businessName,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            pitchCodeUrl,
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
                        {editMode && <h2>Edit Pitch</h2>}
                        {!editMode && <h2>Create Pitch</h2>}
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}

                        <Form onSubmit={this.onSubmit}>
                            <div className="ui segment">
                                <center><h4>{businessName}</h4></center>
                                <Form.Field>
                                    Pitch Title
                                    <Form.Input
                                        name="pitchTitle"
                                        placeholder="Pitch pitchTitle"
                                        value={pitchTitle}
                                        onChange={this.handleOnChange}
                                        error={!pitchTitle || pitchTitle === ""}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    Date of Pitch
                                    <Form.Input
                                        name="dateOfPitch"
                                        value={dateOfPitch}
                                        onChange={this.handleOnChange}
                                        error={!dateOfPitch || dateOfPitch === ""}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    Presenter Name
                                    <Form.Input
                                        name="presenterName"
                                        value={presenterName}
                                        onChange={this.handleOnChange}
                                        error={!presenterName || presenterName === ""}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    Presenter Email
                                    <Form.Input
                                        name="presenterEmail"
                                        value={presenterEmail}
                                        onChange={this.handleOnChange}
                                        error={!presenterEmail || presenterEmail === ""}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    Location
                                    <Form.Input
                                        name="location"
                                        placeholder="1MC Dallas"
                                        value={location}
                                        onChange={this.handleOnChange}
                                        error={!location || location === ""}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    Event URL
                                    <Form.Input
                                        name="eventUrl"
                                        placeholder="http://"
                                        value={eventUrl}
                                        onChange={this.handleOnChange}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    Pitch Deck URL
                                    <Form.Input
                                        name="pitchUrl"
                                        placeholder="http://"
                                        value={pitchUrl}
                                        onChange={this.handleOnChange}
                                    />
                                </Form.Field>

                                <div className="ui">
                                    {pitchCodeUrl && <img alt="pitchCodeUrl" align="right" className="ui tiny image" src={pitchCodeUrl} />}
                                </div>

                            </div>


                            <Button loading={isLoading}
                                    disabled={
                                        !pitchTitle || pitchTitle === "" ||
                                        !presenterName || !presenterName || presenterName === "" ||
                                        !presenterEmail || !presenterEmail || presenterEmail === ""
                                    }
                            >Submit</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
