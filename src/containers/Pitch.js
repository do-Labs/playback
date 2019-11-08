import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message, Modal} from "semantic-ui-react";
import {NavMenu, Logo} from "../components/index";
import firebase from '../Firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ZiggeoRecorder } from 'react-ziggeo';
const projectName = "playback-2a438";
const ziggeoAPIKey = process.env.REACT_APP_ziggeoAPIKey;


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
            pitchRole: "",
            businessName: "-",
            pitchDate: "MM-DD-YYYY",
            presenterName: "",
            // presenterEmail: this.props.username,
            location: "",
            pitchUrl: "",
            eventUrl: "",

            qrMakerUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=",
            qrPrefix: 'https://blooming-bastion-98391.herokuapp.com/feedback/',
            pitchCodeUrl: "https://tinyurl.com/y6ysz826",
            qrData: "",
            modalOpen: false,
            isRecordingPitch: false,
            videoTag: "",
        };
    }

    componentDidMount = async() => {
        const pitchId = this.props.match.params.id;
        const businessID = this.props.businessID;
        const username = this.props.username;

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
            this.setState({
                presenterEmail: username
            })
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
            const ref = firebase.firestore().collection('pitches').doc(pitchId);
            ref.get().then((doc) => {
                if (doc.exists) {
                    const pitch = doc.data();
                    this.setState({
                        key: doc.id,
                        pitchTitle: pitch.pitchTitle,
                        pitchRole: pitch.pitchRole,
                        businessName: pitch.businessName,
                        pitchDate: pitch.pitchDate,
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
        // http://www.app.com/instance/{id}/feedbackl/instance/{id}
        // QR Template (display to public for POST to specific
        // pitches/{pitchID}/feedback/

        const {
            qrMakerUrl,
            qrPrefix,
        } = this.state;

        let pitchCodeQR = qrMakerUrl + qrPrefix + qrData;
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
            pitchRole,
            businessName,
            pitchDate,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            eventUrl,
            businessID,
            videoTag,
        } = this.state;

        this.ref.add({
            pitchTitle,
            pitchRole,
            businessName,
            pitchDate,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            eventUrl,
            businessID,
            videoTag,
        }).then( async(docRef) => {
            const pid = docRef._key.path.segments[1];
            //handle response
            this.setState({
                pitchID: pid,
            });
            await this.createQRCode(pid);
            await this.handleEmailQR();
            // Show Modal with info
            await this.handleOpen();
            // if OK then nav to my-pitches
            // this.props.history.push("/my-pitches")
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
            pitchRole,
            businessName,
            pitchDate,
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
            pitchRole,
            businessName,
            pitchDate,
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

    handleOpen = () => this.setState({modalOpen: true});
    handleClose = () => {
        this.setState({modalOpen: false});
        this.props.history.push("/my-pitches");
    };

    handleDateChange = date => {

        console.log("Date:", date.toString());
        console.log("DateArray:", date.toString().split(' '));
        const dateData = date.toString().split(' ');
        // const day = dateData[0];
        const month = dateData[1];
        const dateOfMonth = dateData[2];
        const year = dateData[3];

        const dateFormatted = month + "-" + dateOfMonth + "-" + year;

        this.setState({
            pitchDate: dateFormatted,
        });

    };

    handleToggleRecord = () => {
        if(this.state.isRecordingPitch){
            this.setState({
                isRecordingPitch: false
            })
        }
        else{
            this.setState({
                isRecordingPitch: true
            })
        }
    };



    recorderUploaded = () => {

        console.log('Recorder onRecorderUploaded');
    };

    setVideoTag = (videoID) => {
        this.setState({
            videoTag: videoID
        })
    };

    recorderUploading = async (embedding) => {
        console.log('Recorder recorderUploading', embedding);
        const pitchVideoID = embedding.video;
        this.setVideoTag(pitchVideoID);
        console.log('id:', pitchVideoID);
        return pitchVideoID
    };


    render() {
        const {
            error,
            isLoading,
            editMode,
            pitchTitle,
            pitchRole,
            businessName,
            pitchDate,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            pitchCodeUrl,
            eventUrl,

            isRecordingPitch

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

                        <Modal
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            content={
                                <div>
                                    <div>
                                        <center>
                                            <h4>Attach this QR Code to the last slide in your presentation</h4>
                                            <img hspace="20" alt="pitchCodeUrl" align="top" className="ui tiny image" src={pitchCodeUrl} />
                                        </center>
                                    </div>
                                    <p> </p>
                                    <p> </p>
                                    <h4>Pitch Info</h4>
                                    <p>Pitch Title: {pitchTitle}</p>
                                    <p>Pitch Date: {pitchDate}</p>
                                    <p>Location: {location}</p>
                                    <p>PitchDeckURL: {pitchUrl}</p>
                                    <p>Presenter Name: {presenterName}</p>
                                    <p>Role: {pitchRole}</p>
                                    <p>Presenter Email: {presenterEmail}</p>
                                    <p>Event URL: {eventUrl}</p>
                                </div>
                            }/>

                        <Form onSubmit={this.onSubmit}>

                            {!isRecordingPitch &&
                            <div className="ui segment">
                                <center><h4>{businessName}</h4></center>
                                <center><h4>{presenterEmail}</h4></center>

                                <div className="equal width fields">
                                    <Form.Field>
                                        <h4>Title</h4>
                                        <Form.Input
                                            name="pitchTitle"
                                            placeholder="Pitch pitchTitle"
                                            value={pitchTitle}
                                            onChange={this.handleOnChange}
                                            error={!pitchTitle || pitchTitle === ""}
                                        />
                                    </Form.Field>

                                    {!editMode &&
                                        <div>
                                            <h4>Pitch Date</h4>
                                            <DatePicker
                                                selected={this.state.dateOfPitch}
                                                onChange={this.handleDateChange}
                                                value={this.state.pitchDate}
                                            />
                                        </div>
                                    }

                                    {editMode &&
                                    <div>
                                        <Form.Field>
                                            <h4>Pitch Date</h4>
                                            <h5>{pitchDate}</h5>
                                        </Form.Field>
                                    </div>
                                    }


                                </div>

                                <div className="equal width fields">
                                    <Form.Field>
                                        <h4>Presenter Name</h4>
                                        <Form.Input
                                            name="presenterName"
                                            value={presenterName}
                                            onChange={this.handleOnChange}
                                            error={!presenterName || presenterName === ""}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        <h4>Role</h4>
                                        <select
                                            name="pitchRole"
                                            value={pitchRole}
                                            onChange={this.handleOnChange}
                                        >
                                            <option placeholder=""> </option>
                                            <option value="entrepreneur">Entrepreneur</option>
                                            <option value="educator">Educator</option>
                                            <option value="investor">Investor</option>
                                            <option value="mentor">Mentor</option>
                                            <option value="non-profit">Non-Profit</option>
                                            <option value="academic-researcher">Academic Researcher</option>
                                            <option value="community-advocate">Community Advocate</option>
                                            <option value="government-employee">Government Employee</option>
                                            <option value="economic-development">Economic Development</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </Form.Field>
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

                                <Form.Field>
                                    <h4>Pitch Deck URL</h4>
                                    <Form.Input
                                        name="pitchUrl"
                                        placeholder="http://"
                                        value={pitchUrl}
                                        onChange={this.handleOnChange}
                                    />
                                </Form.Field>
                                <Button onClick={this.handleToggleRecord}>RecordPitch</Button>
                            </div>
                            }


                            {isRecordingPitch &&
                            <div>
                                <center><p>This is a beta feature and may not function as expected</p></center>
                                <ZiggeoRecorder
                                    apiKey={ziggeoAPIKey}
                                    height={400}
                                    width={800}
                                    preventReRenderOnUpdate={false}
                                    // onRecording={this.handleIsRecording}
                                    onUploading={this.recorderUploading}
                                    onUploaded={this.recorderUploaded}
                                />
                                {/*<Button onClick={this.handleToggleRecord}>Back</Button>*/}
                            </div>
                            }


                            {!isRecordingPitch &&
                            <Button loading={isLoading}
                                    disabled={
                                        !pitchTitle || pitchTitle === "" ||
                                        !pitchRole || pitchRole === "" ||
                                        !pitchDate || pitchDate === "" ||
                                        !presenterName || !presenterName || presenterName === "" ||
                                        !presenterEmail || !presenterEmail || presenterEmail === ""
                                    }
                            >Submit</Button>
                            }
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
