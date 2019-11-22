import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message} from "semantic-ui-react";
import {Logo} from "../components/index";
import firebase from '../Firebase';

export default class SignInSheet extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore();
        this.state = {
            error: null,
            isLoading: true,
            isEnabled: true,

            // Event Data
            businessID: "",
            businessName: "",
            webpageUrl: "",
            eventDate: "",
            location: "",
            eventTitle: "",
            eventUrl: "",

            // attendance Data
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",

            // UserData
            events: [],
        };
    }

    componentDidMount = async () => {
        const eid = this.props.match.params.id;
        this.setState({
            isLoading: true,
            eventID: eid,
        });
        if (eid) {
            this.setState({
                isLoading: true,
            });

            // get event data
            await this.handleGetEventData(eid).catch();
            await this.handleGetBusinessData().catch();

            this.setState({
                isLoading: false,
            });
        }
        else {
            this.setState({
                isLoading: false,
                pitchID: null
            });
        }
    };


    handleGetEventData = async (eid) => {
        const refEvent = firebase.firestore().collection('events').doc(eid);

        await refEvent.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                this.setState({
                    key: doc.id,
                    businessID: data.businessID,
                    businessName: data.businessName,
                    eventDate: data.eventDate,
                    location: data.location,
                    eventTitle: data.eventTitle,
                })
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    };

    handleGetBusinessData = async () => {
        const refBus = await firebase.firestore().collection('businesses').doc(this.state.businessID);

        await refBus.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                this.setState({
                    webpageUrl: data.webpageUrl
                })
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    submitAttendance = async () => {
        this.setState({
            isEnabled: false,
            isLoading: true,
        });
        const eid = this.state.eventID;
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
        } = this.state;
        console.log("Submitting attendance...", eid);
        const attendeesRef = await this.ref.collection('events').doc(eid).collection('attendees');

        await attendeesRef.add({
            timestamp: Date.now(),
            firstName,
            lastName,
            email,
            phoneNumber,
        }).then(async (docRef) => {
            console.log("Wrote Attendance");
            await this.handleAnonymousSignIn()
                .then(async (user) => {
                    console.log("Signed In Anonymous");
                    this.props.history.push('/thankyou');

                }).catch(()=>{
                    this.setState({
                        isEnabled: true,
                        isLoading: false,
                    })
                })
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
                this.setState({
                    isEnabled: true,
                    isLoading: false,
                });
            });
    };

    onSubmit = async () => {
        // e.preventDefault();
        this.setState({
            isEnabled: false,
            isLoading: true,
        });

        await this.submitAttendance();

        this.setState({
            isEnabled: false,
            isLoading: false,
        });
    };

    handleAnonymousSignIn = async () => {
        await firebase.auth().signInAnonymously().catch(function (error) {
            let errorMessage = error.message;
            alert(errorMessage)
        });
        await firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    token: user.ra,
                    userID: user.uid
                })
            }
            return user
        });
    };





    render() {
        const {
            error,
            isEnabled,
            isLoading,
            eventTitle,
            businessName,
            eventDate,
            eventUrl,
            location,
            webpageUrl,

            firstName,
            lastName,
            email,
            phoneNumber,

        } = this.state;


        return (
            <Container>
                <br/>
                <Logo/>
                <Grid>
                    <Grid.Column>
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}
                        <center><h2>Sign In</h2></center>

                        <Form onSubmit={this.onSubmit}>
                            {/*<h2>Leave Feedback for: {id}</h2>*/}
                            <p><b>Business Name:</b> <a href={webpageUrl}>{businessName}</a></p>
                            <p><b>Event Title:</b> {eventTitle}</p>
                            <p><b>Date:</b> {eventDate}</p>
                            <p><b>Location:</b> {location}</p>
                            {eventUrl &&
                            <p><b>EventUrl:</b> {eventUrl}</p>
                            }

                            <div className=" centered">
                                <br/>

                                <Grid>
                                    <Grid.Column width={3}>
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <Form.Field>
                                            <label><span id="firstName">First Name</span></label>
                                            <Form.Input
                                                name="firstName"
                                                value={firstName}
                                                onChange={this.handleOnChange}
                                                error={!firstName || firstName === ""}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label><span id="lastName">Last Name</span></label>
                                            <Form.Input
                                                name="lastName"
                                                value={lastName}
                                                onChange={this.handleOnChange}
                                                error={!lastName || lastName === ""}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label><span id="email">Email</span></label>
                                            <Form.Input
                                                name="email"
                                                value={email}
                                                onChange={this.handleOnChange}
                                                error={!email || email === ""}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label><span id="phoneNumber">Phone#</span></label>
                                            <Form.Input
                                                name="phoneNumber"
                                                placeholder="XXX-XXX-XXXX"
                                                value={phoneNumber}
                                                onChange={this.handleOnChange}
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid>
                                <br/><br/>
                                <center>
                                    <Button loading={isLoading}
                                            disabled={
                                                !isEnabled ||
                                                !email || email === "" ||
                                                !firstName || firstName === "" ||
                                                !lastName || lastName === ""
                                            }
                                    >Submit</Button>
                                </center>
                            </div>


                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
