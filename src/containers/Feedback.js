import React, {Component} from "react";
import {Button, Container, Dimmer, Dropdown, Form, Grid, Loader, Message} from "semantic-ui-react";
import {Logo} from "../components/index";
import usStates from "../states";
import firebase from '../Firebase';
import StarRatingComponent from "react-star-rating-component";
import AddToCalendar from 'react-add-to-calendar';
import {Base64} from "js-base64";

const moment = require('moment');
const projectName = JSON.parse(Base64.decode(process.env.REACT_APP_KEYS_B64)).projectId;

export default class Feedback extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore();
        this.state = {
            error: null,
            isLoading: true,
            isEnabled: true,

            // Form Vars:
            roles: [
                {
                    "text": "Entrepreneur",
                    "value": "Entrepreneur",
                    "key": "Entrepreneur"
                },
                {
                    "text": "Investor",
                    "value": "Investor",
                    "key": "Investor"
                },
                {
                    "text": "CorporateExec",
                    "value": "CorporateExec",
                    "key": "CorporateExec"
                },
                {
                    "text": "Student",
                    "value": "Student",
                    "key": "Student"
                },
                {
                    "text": "Other",
                    "value": "Other",
                    "key": "Other"
                },
            ],
            options: [
                {
                    "text": "Yes",
                    "value": "Yes",
                    "key": "Yes"
                },
                {
                    "text": "No",
                    "value": "No",
                    "key": "No"
                },
            ],
            // Reminder Data
            event: {
                title: null,
                description: null,
                location: null,
                startTime: null,
            },

            // Pitch Data
            businessID: "",
            businessName: "",
            webpageUrl: "",
            pitchDate: "",
            location: "",
            pitchTitle: "",
            pitchDeckUrl: "",
            eventUrl: "",
            presenterEmail: "",
            presenterName: "",
            pitchRole: "",

            // Feedback Data
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            city: "Dallas",
            state: "Texas",
            role: "Audience",
            comment: "",
            isAnonymous: "",
            wantsToMeet: "",
            rating1: 0, // communication of business concept
            rating2: 0, // Validity of problem statement
            rating3: 0, // value value of solution

            questions: [],
            answers: [],

            // UserData
            givenFeedback: [],
        };
    }

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
            await this.handleGetBusinessData().catch();
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
                    key: doc.id,
                    businessID: data.businessID,
                    businessName: data.businessName,
                    pitchDate: data.pitchDate,
                    location: data.location,
                    pitchTitle: data.pitchTitle,
                    pitchDeckUrl: data.pitchDeckUrl,
                    presenterEmail: data.presenterEmail,
                    presenterName: data.presenterName,
                    pitchRole: data.pitchRole,
                    questions: data.questions
                })
            } else {
                console.log("No such document!");
                this.setState({
                    key: "error",
                    businessID: "error",
                    // businessName: "ERROR BUSINESS DOES NOT EX",
                    error: {
                        message: "PAGE DOES NOT EXIST"
                    }
                });
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
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        // this.unsubscribe = await refPitch.onSnapshot(this.onCollectionUpdate);
    };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    handleSelectChange = (e, {name, value}) => {
        this.setState({[name]: value});
    };

    onStarClick(nextValue, prevValue, name) {
        const state = this.state;
        state[name] = nextValue;
        this.setState(state)
    }

    setReminderDate = async () => {
        const nowEpoch = await Date.now();
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
            questions,
            answers,
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
            questions,
            answers,
            isAnonymous,
            wantsToMeet,
        }).then(async (docRef) => {
            console.log("Wrote Feedback");
            await this.handleAnonymousSignIn()
                .then(async (user) => {
                    console.log("Signed In Anonymous");
                    setTimeout(async () => {
                        await this.handleAddUser();
                    }, 1000);
                    // await this.handleEmailFeedback();
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

        await this.submitFeedback();
        // await this.handleEmailFeedback();

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

    handleEmailFeedback = async () => {
        const body = JSON.stringify({
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
            .catch((err) => {
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
            role,
            businessID,
            givenFeedback
        } = this.state;

        await givenFeedback.push(businessID);


        const usersRef = await this.ref.collection('users').doc(userID);

        await usersRef.set({
            role,
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            givenFeedback,
        }).catch((err)=>{
            console.log("Error Setting User Data:", err)
        })
    };

    handleChangeAnswer = (e, { name, value }, i) => {
        const {answers} = this.state;
        // console.log("E:", e);
        // console.log("name:", name);
        // console.log("value:", value);
        // console.log("i:", i);

        answers[i] = value;
        // this.setState({
        //     // answersVar: answers
        // });
    };

    render() {
        const {
            error,
            isEnabled,
            isLoading,
            roles,
            options,

            pitchTitle,
            businessName,
            pitchDate,
            presenterName,
            pitchRole,
            pitchDeckUrl,
            eventUrl,
            webpageUrl,
            questions,

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

                        <Form onSubmit={this.onSubmit}>
                            {/*<h2>Leave Feedback for: {id}</h2>*/}
                            <p><b>Business Name:</b> <a href={webpageUrl}>{businessName}</a></p>
                            <p><b>Pitch Title:</b> {pitchTitle}</p>
                            <p><b>Pitch Date:</b> {pitchDate}</p>
                            <p><b>Presenter Name:</b> {presenterName}</p>
                            <p><b>Role:</b> {pitchRole}</p>
                            {pitchDeckUrl && <p><a href={pitchDeckUrl}>View PitchDeck</a></p>}
                            {eventUrl && <p><b>EventUrl:</b> {eventUrl}</p>}
                            <center>
                                <AddToCalendar
                                    buttonLabel="Remind me later"
                                    event={this.state.event}/>
                            </center>

                            <div className="ui segment">
                                <h4><center>Rate The Presenter</center></h4>
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

                            </div>

                            {questions &&
                                <div className="ui segment">
                                    <h4><center>Presenter Questions</center></h4>
                                    <div>
                                        {questions.map((question, i) => (
                                            <Form.Group
                                                widths="equal"
                                                key={Math.random()}
                                            >
                                                <h4>{i+1}. &nbsp;  {this.state.questions[i]}</h4>
                                                {/*<h4>{question}</h4>*/}
                                                <Form.Field>
                                                    <Form.Input
                                                        name="answer"
                                                        value={this.state.answers[i]}
                                                        // onChange={this.handleOnChange}
                                                        onChange={(
                                                            event,
                                                            data
                                                        ) => {
                                                            this.handleChangeAnswer(
                                                                event,
                                                                data,
                                                                i,
                                                            );
                                                        }}
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                        ))}
                                    </div>
                                </div>
                            }

                            <div className="ui segment">
                                <h4><center>User Info</center></h4>
                                <div className="equal width fields">
                                    <Grid>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <label><span id="firstName">First Name</span></label>
                                                <Form.Input
                                                    name="firstName"
                                                    value={firstName}
                                                    onChange={this.handleOnChange}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <label><span id="lastName">Last Name</span></label>
                                                <Form.Input
                                                    name="lastName"
                                                    value={lastName}
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
                                                <label><span id="email">Email</span></label>
                                                <Form.Input
                                                    name="email"
                                                    value={email}
                                                    onChange={this.handleOnChange}
                                                    error={!email || email === ""}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <label><span id="phoneNumber">Phone#</span></label>
                                                <Form.Input
                                                    name="phoneNumber"
                                                    placeholder=""
                                                    value={phoneNumber}
                                                    onChange={this.handleOnChange}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                                <div className="">
                                    <Grid>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <label><span id="city">City</span></label>
                                                <Form.Input
                                                    name="city"
                                                    value={city}
                                                    onChange={this.handleOnChange}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Form.Field>
                                                <label><span id="state">State</span></label>
                                                <Dropdown
                                                    // width={2}
                                                    name="state"
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

                                <div className="">
                                    <Grid>
                                        <Grid.Column width={8}>
                                            <label><span id="role"><b>Role</b></span></label>
                                            <Dropdown
                                                name="role"
                                                fluid
                                                search
                                                selection
                                                options={roles}
                                                value={role}
                                                onChange={(event, data) => {
                                                    this.handleSelectChange(event, data);
                                                }}
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <label><span id="wantsToMeet"><b>Wanna Get Coffee?</b></span></label>
                                            <Dropdown
                                                name="wantsToMeet"
                                                fluid
                                                search
                                                selection
                                                options={options}
                                                value={wantsToMeet}
                                                onChange={(event, data) => {
                                                    this.handleSelectChange(event, data);
                                                }}
                                            />
                                        </Grid.Column>
                                    </Grid>
                                </div>


                                <div className="equal width fields">
                                    <Grid>
                                        {/*<Grid.Column width={10}>*/}
                                            {/*<div>*/}
                                                {/*<label><span id="role"><b>Role</b></span></label>*/}
                                                {/*<Dropdown*/}
                                                    {/*name="role"*/}
                                                    {/*fluid*/}
                                                    {/*search*/}
                                                    {/*selection*/}
                                                    {/*options={roles}*/}
                                                    {/*value={role}*/}
                                                    {/*onChange={(event, data) => {*/}
                                                        {/*this.handleSelectChange(event, data);*/}
                                                    {/*}}*/}
                                                {/*/>*/}
                                            {/*</div>*/}
                                        {/*</Grid.Column>*/}
                                        {/*<Grid.Column width={6}>*/}
                                            {/*<label><span id="wantsToMeet"><b>Wanna Get Coffee?</b></span></label>*/}
                                            {/*<Dropdown*/}
                                                {/*name="wantsToMeet"*/}
                                                {/*fluid*/}
                                                {/*search*/}
                                                {/*selection*/}
                                                {/*options={options}*/}
                                                {/*value={wantsToMeet}*/}
                                                {/*onChange={(event, data) => {*/}
                                                    {/*this.handleSelectChange(event, data);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</Grid.Column>*/}
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
                                        !email || email === ""
                                    }
                            >Submit</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
