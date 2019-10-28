import React, {Component} from "react";
import {Button, Container, Dimmer, Dropdown, Form, Grid, Loader, Message} from "semantic-ui-react";
import {Logo} from "../components/index";
import usStates from "../states";
import firebase from '../Firebase';
import StarRatingComponent from "react-star-rating-component";
import AddToCalendar from 'react-add-to-calendar';
// import AddToCalendar from '../components/add-to-calendar';
const moment = require('moment');

const projectName = "playback-2a438";

export default class Feedback extends Component {

    constructor() {
        super();
        this.refPitches = firebase.firestore().collection('pitches');
        this.state = {
            error: null,
            isLoading: true,
            // // Pitch Data
            businessID: "",
            businessName: "",
            dateOfPitch: "",
            location: "",
            pitchTitle: "",
            pitchUrl: "",
            eventUrl: "",
            presenterEmail: "",
            presenterName: "",

            // Feedback Data
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            city: "",
            state: "",
            comment: "",
            isAnonymous: "",
            wantsToMeet: "no",
            rating1: 0, // communication of business concept
            rating2: 0, // Validity of problem statement
            rating3: 0, // value value of solution
        };
    }

    setReminderDate = () => {
        const nowEpoch = Date.now();
        const laterEpoch = nowEpoch; // add 3 hours
        const start = moment(laterEpoch).format();


        this.setState({
            event: {
                title: 'Remember to leave Feedback',
                description: `leave your feedback for ${this.state.businessName}`,
                location: 'Wherever you are',
                startTime: start,
            }
        })

    };

    componentDidMount = async () => {
        const id = this.props.match.params.id;
        this.setState({
            isLoading: true,
            id: id,
        });
        if (id) {
            console.log('ID: ', id);
            this.setState({
                id: this.props.match.params.id,
                isLoading: true,
            });

            // get pitch data
            await this.handleGetPitchData(id).catch();
            // set reminder date
            await this.setReminderDate();

            this.setState({
                isLoading: false,
            });


        }
        else {
            this.setState({
                isLoading: false,
                id: null
            });
        }
    };
    

    handleGetPitchData = async (id) => {
        console.log('getting pitch data');
        const refPitch = firebase.firestore().collection('pitches').doc(id);

        await refPitch.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log("data:", data);
                this.setState({
                    pitchData: {
                        key: doc.id,
                        businessID: data.businessID,
                        businessName: data.businessName,
                        dateOfPitch: data.dateOfPitch,
                        location: data.location,
                        pitchTitle: data.pitchTitle,
                        pitchUrl: data.pitchUrl,
                        presenterEmail: data.presenterEmail,
                        presenterName: data.presenterName,
                    },
                    businessID: data.businessID,
                    businessName: data.businessName,
                    dateOfPitch: data.dateOfPitch,
                    location: data.location,
                    pitchTitle: data.pitchTitle,
                    pitchUrl: data.pitchUrl,
                    presenterEmail: data.presenterEmail,
                    presenterName: data.presenterName,
                })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        // this.unsubscribe = await refPitch.onSnapshot(this.onCollectionUpdate);
    };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    onStarClick(nextValue, prevValue, name) {
        const state = this.state;
        state[name] = nextValue;
        this.setState(state)
    }

    submitFeedback = async () => {
        const id = this.state.id;
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            rating1,
            rating2,
            rating3,
            comment,
            isAnonymous,
            wantsToMeet,
        } = this.state;
        console.log("Submitting Feedback...", id);
        const feedbackRef = this.refPitches.doc(id).collection('feedback');

        feedbackRef.add({
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            timeStamp: Date.now(),
            rating1,
            rating2,
            rating3,
            comment,
            isAnonymous,
            wantsToMeet,
        }).then( async (docRef) => {
            await this.handleAnonymousSignIn();
            await this.handleEmailFeedback();
            this.props.history.push('/thankyou');
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    onSubmit = async () => {
        // e.preventDefault();
        this.setState({
            isEnabled: false,
            isLoading: true,
        });

        await this.submitFeedback();
        // await this.handleEmailFeedback();

        this.setState({
            isEnabled: false,
            isLoading: false,
        });
        console.log("Successfully submitted Feedback");
    };

    handleAnonymousSignIn = async () => {
        firebase.auth().signInAnonymously().catch(function(error) {
            let errorMessage = error.message;
            alert(errorMessage)
        });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("User is signed in!");
                this.setState({
                    token: user.ra
                })
            } else {
                console.log("User is signed out!")
            }
        });
    };

    handleEmailFeedback = async () => {
        const body  = JSON.stringify({
            to: this.state.presenterEmail,
            businessID: this.state.businessID,
            pitchTitle: this.state.pitchTitle,
            comment: this.state.comment,
            rating1: this.state.rating1,
            rating2: this.state.rating2,
            rating3: this.state.rating3,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            city: this.state.city,
            state: this.state.state,
            wantsToMeet: this.state.wantsToMeet,
        });
        console.log("BODY: ", body);

        await fetch(`https://us-central1-${projectName}.cloudfunctions.net/EmailFeedback`, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + this.state.token,
                "Content-Type": "application/json",
                'cache-control': 'no-cache',
            }),
            body
        })
            .then( (res)=> {
                console.log("Emailed user");
                console.log("RESPONSE: ", res.status)
            }).catch( (err)=> {
            alert("Error sending Email");
            console.log("Error Emailing User: ", err)
        })

    };

    render() {
        const {
            error,
            isLoading,
            pitchTitle,
            businessName,
            dateOfPitch,
            presenterName,
            eventUrl,

            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            rating1,
            rating2,
            rating3,
            comment,
            wantsToMeet

        } = this.state;


        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column>
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}

                        <Form onSubmit={this.onSubmit}>
                            {/*<h2>Leave Feedback for: {id}</h2>*/}
                            <p>Business Name:   {businessName}</p>
                            <p>Pitch Title:   {pitchTitle}</p>
                            <p>Date Of Pitch:   {dateOfPitch}</p>
                            <p>Presenter Name:   {presenterName}</p>
                            {eventUrl &&
                                <p>EventUrl: {eventUrl}</p>
                            }

                            <center>
                                <AddToCalendar
                                    buttonLabel="Remind me later"
                                    event={this.state.event}/>
                            </center>

                            <div className="ui segment">
                                <div>
                                    <StarRatingComponent
                                        name="rating1"
                                        starCount={5}
                                        value={rating1}
                                        onStarClick={this.onStarClick.bind(this)}
                                    />
                                    Communication of business concept
                                </div>
                                <div>
                                    <StarRatingComponent
                                        name="rating2"
                                        starCount={5}
                                        value={rating2}
                                        onStarClick={this.onStarClick.bind(this)}
                                    />
                                    Problem Validity
                                </div>
                                <div>
                                    <StarRatingComponent
                                        name="rating3"
                                        starCount={5}
                                        value={rating3}
                                        onStarClick={this.onStarClick.bind(this)}
                                    />
                                    Value of Solution
                                </div>
                                <hr/>

                                <div className="equal width fields">
                                    <Grid>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <Form.Input
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    value={firstName}
                                                    onChange={this.handleOnChange}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <Form.Input
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    value={lastName}
                                                    onChange={this.handleOnChange}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                                <div className="equal width fields">
                                    <Grid>
                                        <Grid.Column width={9}>
                                            <Form.Field>
                                                <Form.Input
                                                    name="email"
                                                    placeholder="Email Address"
                                                    value={email}
                                                    onChange={this.handleOnChange}
                                                    error={!email || email === ""}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={7}>
                                            <Form.Field>
                                                <Form.Input
                                                    name="phoneNumber"
                                                    placeholder="Phone Number"
                                                    value={phoneNumber}
                                                    onChange={this.handleOnChange}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                                <div className="equal width fields">
                                    <Grid>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <Form.Input
                                                    name="city"
                                                    placeholder="City"
                                                    value={city}
                                                    onChange={this.handleOnChange}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <Dropdown
                                                    width={2}
                                                    name="state"
                                                    placeholder="State"
                                                    fluid
                                                    search
                                                    selection
                                                    options={usStates}
                                                    value={state}
                                                    onChange={(event, data) => {
                                                        this.handleSelectChange(event, data);
                                                    }}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid>
                                </div>


                                <div className="equal width fields">
                                    <Grid>
                                        <Grid.Column width={14}>
                                            <div>
                                                <p><span id="requestMeeting">Wanna Get Coffee?</span></p>
                                                <select
                                                    name="wantsToMeet"
                                                    value={wantsToMeet}
                                                    onChange={this.handleOnChange}
                                                >
                                                    <option value="no">No</option>
                                                    <option value="yes">Yes</option>
                                                </select>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            {/*<label>*/}
                                                {/*<p><span id="isAnonymous"> Anonymous?</span></p>*/}
                                                {/*<input*/}
                                                    {/*name="isAnonymous"*/}
                                                    {/*type="checkbox"*/}
                                                    {/*checked={this.state.isAnonymous}*/}
                                                    {/*// onChange={this.handleCheckBoxChange}*/}
                                                {/*/>*/}
                                            {/*</label>*/}
                                        </Grid.Column>
                                    </Grid>
                                </div>
                                <div className="equal">
                                    <div className="ui form">
                                        <div className="field">
                                            <label>Additional Comments</label>
                                            <textarea
                                                name="comment"
                                                value={comment}
                                                onChange={this.handleOnChange}
                                                placeholder="Enter a comment"
                                            >
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button loading={isLoading}
                            >Submit</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
