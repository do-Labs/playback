import React, {Component} from "react";
import {Button, Container, Dimmer, Dropdown, Form, Grid, Loader, Message} from "semantic-ui-react";
import {Logo} from "../components/index";
import usStates from "../states";
import firebase from '../Firebase';
import StarRatingComponent from "react-star-rating-component";

const projectName = "playback-2a438";

export default class Feedback extends Component {

    constructor() {
        super();
        this.refPitches = firebase.firestore().collection('pitches');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
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

            pitches: [],
            pid: ""
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        this.getPitchList(querySnapshot);
    };

    getPitchList = (querySnapshot) => {
        const pitches = [];
        querySnapshot.forEach((doc) => {
            const {
                nickname,
                company,
                dateOfPitch,
                presenterName,
                presenterEmail,
                location,
            } = doc.data();
            pitches.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                nickname,
                company,
                dateOfPitch,
                presenterName,
                presenterEmail,
                location,
            });
        });
        this.setState({
            pitches
        });
    };

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const id = this.props.match.params.id;
        if (id) {
            console.log('ID: ', id);
            this.setState({
                id: this.props.match.params.id,
                pid: this.props.match.params.id,
                isLoading: true,
            });
            console.log("Writing Feedback for PitchID: " + id);

            this.unsubscribe = this.refPitches.onSnapshot(this.onCollectionUpdate);
            // get pitch data
            setTimeout(() => {
                this.handleGetPitch().then(()=>{console.log("GotPitchData")})
            }, 3000);
            this.setState({
                isLoading: false,
            });
        }
        else {
            this.setState({
                id: this.props.match.params.id,
                cleanMode: true,
            });
            this.unsubscribe = this.refPitches.onSnapshot(this.onCollectionUpdate);
            this.setState({ isLoading: false });
        }
    };

    handleGetPitch = async () => {
        const id = this.state.id;
        const pitches = this.state.pitches;
        console.log(`Getting Pitch Data for ${id}`);
        console.log("all pitches: ", this.state.pitches);
        const pitch = pitches.find(x => x.id === id);
        console.log("PITCH FOUND: ", pitch);

        if(pitches !== null){
            this.setState({
                nickname: pitch.nickname,
                company: pitch.company,
                dateOfPitch: pitch.dateOfPitch,
                presenterName: pitch.presenterName,
                presenterEmail: pitch.presenterEmail,
                location: pitch.location,
            })
        }
    };

    componentDidUpdate = () => {
        console.log("DID UPDAT#E")
    };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

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
        await this.handleEmailFeedback();

        this.setState({
            isEnabled: false,
            isLoading: false,
        });
        console.log("Successfully submitted Feedback");
    };

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    handleSelectPitch = (e, {name, value}, i) => {
        console.log('Value: ', value);

        this.setState({
            pid: value,
            id: value,
            cleanMode: false,
        });

        setTimeout(() => {
            this.handleGetPitch().then(()=>{console.log("GotPitchData")})
        }, 2000);

    };

    handleRemindMe = () => {
        console.log("Handle Remindme Later")
    }

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
            cleanMode,

            nickname,
            company,
            dateOfPitch,
            presenterName,
            presenterEmail,

            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            rating,
            comment,
            pitches,
            pid,
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

                        {cleanMode &&
                        <div className="ui segment">
                            <h2>Create Feedback</h2>
                            <Dropdown
                                name="pid"
                                placeholder="Select a pitch to rate (devOnly)"
                                fluid
                                search
                                selection
                                options={pitches.map(pitch => ({
                                    key: pitch.id,
                                    text: pitch.company,
                                    value: pitch.id,
                                }))}
                                onChange={this.handleSelectPitch}
                            />
                        </div>

                        }

                        {!cleanMode &&
                        <Form onSubmit={this.onSubmit}>
                            <h2>Leave Feedback for: {pid}</h2>
                            <p>Company: {company}</p>
                            <p>Pitch Nickname: {nickname}</p>
                            <p>DateOfPitch: {dateOfPitch}</p>
                            <p>PresenterName: {presenterName}</p>
                            <p>PresenterEmail: {presenterEmail}</p>
                            <div className="ui segment">
                                <center>
                                    <div>
                                        Leave a rating
                                        <StarRatingComponent
                                            name="rating"
                                            starCount={5}
                                            value={rating}
                                            onStarClick={this.onStarClick.bind(this)}
                                        />
                                    </div>
                                </center>

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
                                            <label>
                                                <p><span id="isAnonymous"> Anonymous?</span></p>
                                                <input
                                                    name="isAnonymous"
                                                    type="checkbox"
                                                    checked={this.state.isAnonymous}
                                                    // onChange={this.handleCheckBoxChange}
                                                />
                                            </label>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                                <div className="equal">
                                    <div className="ui form">
                                        <div className="field">
                                            <label>Text</label>
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
                        }
                        <Button loading={isLoading} onClick={this.handleRemindMe}
                        >RemindMeLater</Button>
                    </Grid.Column>
                </Grid>
                {/*<Button onClick={this.handleGetPitch}>GetPitch</Button>*/}


            </Container>
        );
    }
}
