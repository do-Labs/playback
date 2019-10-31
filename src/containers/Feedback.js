import React, {Component} from "react";
import {Button, Container, Dimmer, Dropdown, Form, Grid, Loader, Message} from "semantic-ui-react";
import {Logo} from "../components/index";
import usStates from "../states";
import firebase from '../Firebase';
import StarRatingComponent from "react-star-rating-component";
import AddToCalendar from 'react-add-to-calendar';
const moment = require('moment');

const projectName = "playback-2a438";

export default class Feedback extends Component {

    constructor() {
        super();
        // this.refPitches = firebase.firestore().collection('pitches');
        this.ref = firebase.firestore();
        this.state = {
            error: null,
            isLoading: true,
            isEnabled: true,
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
            role: "",
            comment: "",
            isAnonymous: "",
            wantsToMeet: "no",
            rating1: 0, // communication of business concept
            rating2: 0, // Validity of problem statement
            rating3: 0, // value value of solution

            // UserData
            givenFeedback: [],
        };
    }

    setReminderDate = () => {
        const nowEpoch = Date.now();
        const start = moment(nowEpoch).format();

        this.setState({
            event: {
                title: 'Leave Feedback',
                description: `Leave your feedback for ${this.state.businessName}`,
                location: 'Wherever you are',
                startTime: start,
            }
        })
    };

    componentDidMount = async () => {
        const pid = this.props.match.params.id;
        this.setState({
            isLoading: true,
            pitchID: pid,
        });
        if (pid) {
            // console.log('ID: ', id);
            this.setState({
                isLoading: true,
            });

            // get pitch data
            await this.handleGetPitchData(pid).catch();
            // set reminder date
            await this.setReminderDate();

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
    

    handleGetPitchData = async (pid) => {
        const refPitch = firebase.firestore().collection('pitches').doc(pid);

        await refPitch.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
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
        this.setState({
            isEnabled: false,
            isLoading: true,
        });
        const pid = this.state.pitchID;
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            role,
            rating1,
            rating2,
            rating3,
            comment,
            isAnonymous,
            wantsToMeet,
        } = this.state;
        console.log("Submitting Feedback...", pid);
        const feedbackRef = await this.ref.collection('pitches').doc(pid).collection('feedback');

        await feedbackRef.add({
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            role,
            timeStamp: Date.now(),
            rating1,
            rating2,
            rating3,
            comment,
            isAnonymous,
            wantsToMeet,
        }).then( async (docRef) => {
            await this.handleAnonymousSignIn()
                .then( async (user)=> {
                    setTimeout(async () => {
                        await this.handleAddUser();
                        }, 1000);
                    // await this.handleEmailFeedback();
                    this.props.history.push('/thankyou');

                });
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
                    token: user.ra,
                    userID: user.uid
                })
            } else {
                console.log("User is signed out!")
            }
            return user
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
            role: this.state.role,
            wantsToMeet: this.state.wantsToMeet,
        });

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
                console.log("res: ", res.status)
            }).catch( (err)=> {
            alert("Error sending Email");
            console.log("Error Emailing User: ", err)
        })

    };

    handleAddUser = async () => {
        const {
            userID,
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            businessID,
            givenFeedback
        } = this.state;
        console.log("userID:", userID);

        const role = "audience";
        await givenFeedback.push(businessID);


        const usersRef = this.ref.collection('users').doc(userID);

        await usersRef.set({
            role,
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            givenFeedback,
        }).catch()
    };

    render() {
        const {
            error,
            isEnabled,
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
            role,
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
                                    Communication of Concept
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
                                        <Grid.Column width={8}>
                                            <div>
                                                <p><span id="role">Role</span></p>
                                                <select
                                                    name="role"
                                                    value={role}
                                                    onChange={this.handleOnChange}
                                                >
                                                    <option value="Audience">Audience</option>
                                                    <option value="CorporateExec">Corporate Exec</option>
                                                    <option value="Investor">Investor</option>
                                                    <option value="Entrepreneur">Entrepreneur</option>
                                                    <option value="Student">Student</option>
                                                </select>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
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
                                    </Grid>
                                </div>
                                <div className="equal">
                                    <div className="ui form">
                                        <div className="field">
                                            <label>Additional Comments</label>
                                            <textarea
                                                rows="4"
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
                                    disabled={
                                        !isEnabled ||
                                        !rating1 || rating1 === "" ||
                                        !rating2 || rating2 === "" ||
                                        !rating3 || rating3 === ""
                                    }
                            >Submit</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
