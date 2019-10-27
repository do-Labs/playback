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
            company: "",
            dateOfPitch: "",
            location: "",
            nickname: "",
            pitchUrl: "",
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
            wantsToMeet: "",
            rating: 1,
        };
    }

    setReminderDate = () => {
        console.log(Date.now());
        // console.log(Date("1495159447834").toDateString());
        // console.log(Date.parse('2019-09-16T20:15:00-04:00'));
        const nowEpoch = Date.now();
        console.log('nowEpoch  ', nowEpoch);
        const laterEpoch = nowEpoch; // add 3 hours
        // const laterEpoch = nowEpoch + 20000000; // add 3 hours
        console.log('laterEpoch', laterEpoch);
        const start = moment(laterEpoch).format();
        console.log("moment Start: ", start );

        this.setState({
            event: {
                title: 'Remember to leave Feedback',
                description: `leave your feedback for `,
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
            this.setReminderDate();
            // get current date
            // const today = Date.now();
            // convert current date
            this.setState({
                id: this.props.match.params.id,
                isLoading: true,
            });

            // get pitch data
            await this.handleGetPitchData(id).catch();
            this.setState({
                isLoading: false,
            });
        }
        else {
            this.setState({ isLoading: false });
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
                        company: data.company,
                        dateOfPitch: data.dateOfPitch,
                        location: data.location,
                        nickname: data.nickname,
                        pitchUrl: data.pitchUrl,
                        presenterEmail: data.presenterEmail,
                        presenterName: data.presenterName,
                    },
                    businessID: data.businessID,
                    company: data.company,
                    dateOfPitch: data.dateOfPitch,
                    location: data.location,
                    nickname: data.nickname,
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
        this.setState({rating: nextValue});
    }

    submitFeedback = () => {
        const id = this.state.id;
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            rating,
            comment,
            isAnonymous,
            wantsToMeet,
        } = this.state;

        console.log("Submitting Feedback...");

        const feedbackRef = this.refPitches.doc(id).collection('feedback');

        feedbackRef.add({
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            timeStamp: Date.now(),
            rating,
            comment,
            isAnonymous,
            wantsToMeet,
        }).then((docRef) => {
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

    handleEmailFeedback = () => {
        const body  = JSON.stringify({
            to: this.state.presenterEmail,
            businessID: this.state.businessID,
            nickname: this.state.nickname,
        });
        console.log("BODY: ", body);

        fetch(`http://us-central1-${projectName}.cloudfunctions.net/EmailFeedback`, {
            method: "POST",
            headers: new Headers({
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
            nickname,
            company,
            dateOfPitch,
            presenterName,

            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            rating,
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
                            <p>Company: {company}</p>
                            <p>Pitch Title: {nickname}</p>
                            <p>DateOfPitch: {dateOfPitch}</p>
                            <p>PresenterName: {presenterName}</p>
                            {/*<p>PresenterEmail: {presenterEmail}</p>*/}

                            <center>
                                <AddToCalendar
                                    buttonLabel="Remind me later"
                                    event={this.state.event}/>
                            </center>

                            <div className="ui segment">
                                <div>
                                    <StarRatingComponent
                                        name="rating"
                                        starCount={5}
                                        value={rating}
                                        onStarClick={this.onStarClick.bind(this)}
                                    />
                                    Communication of business concept
                                </div>
                                <div>
                                    <StarRatingComponent
                                        name="rating"
                                        starCount={5}
                                        value={rating}
                                        onStarClick={this.onStarClick.bind(this)}
                                    />
                                    Business Model
                                </div>
                                <div>
                                    <StarRatingComponent
                                        name="rating"
                                        starCount={5}
                                        value={rating}
                                        onStarClick={this.onStarClick.bind(this)}
                                    />
                                    Confidence in pitch
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
                                                <p><span id="requestMeeting"> Request Meeting?</span></p>
                                                <select
                                                    name="wantsToMeet"
                                                    value={wantsToMeet}
                                                    onChange={this.handleOnChange}
                                                >
                                                    <option placeholder="-">-</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
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
                                            <label>Leave Feedback</label>
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
