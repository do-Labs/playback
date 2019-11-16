import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message, Modal} from "semantic-ui-react";
import {NavMenu, Logo, Upload} from "../components/index";
import firebase from '../Firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ZiggeoRecorder } from 'react-ziggeo';
import {Base64} from "js-base64";
// const projectName = "playback-2a438";
const projectName = JSON.parse(Base64.decode(process.env.REACT_APP_KEYS_B64)).projectId;
const ziggeoAPIKey = process.env.REACT_APP_ziggeoAPIKey;


export default class Pitch extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('pitches');
        this.setUrl = this.setUrl.bind(this);
        this.state = {
            error: null,
            message: null,
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
            pitchDeckUrl: "",
            pitchVideoTag: "",
            eventUrl: "",

            qrMakerUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=",
            qrPrefix: 'https://playback.herokuapp.com/feedback/',
            pitchCodeUrl: "https://tinyurl.com/y6ysz826",
            qrData: "",
            modalOpen: false,
            isRecordingPitch: false,
            
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
                        pitchDeckUrl: pitch.pitchDeckUrl,
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
            pitchDeckUrl,
            eventUrl,
            businessID,
            pitchVideoTag,
        } = this.state;

        this.ref.add({
            pitchTitle,
            pitchRole,
            businessName,
            pitchDate,
            presenterName,
            presenterEmail,
            location,
            pitchDeckUrl,
            eventUrl,
            businessID,
            pitchVideoTag,
            user: {
                userID: this.props.userID,
                email: this.props.username,
            }
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
        const {
            pitchTitle,
            pitchRole,
            businessName,
            pitchDate,
            presenterName,
            presenterEmail,
            location,
            pitchDeckUrl,
            eventUrl,
            businessID,
        } = this.state;

        // Then update existing data with a PUT call with all fields
        // Only make the editable fields available for the user to update
        const pitchRef = firebase.firestore().collection('pitches').doc(pitchId);

        // post all pitch info to firebase

        pitchRef.update({
            pitchTitle,
            pitchRole,
            businessName,
            pitchDate,
            presenterName,
            presenterEmail,
            location,
            pitchDeckUrl,
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
    };

    handleEmailQR = () => {
        const body  = JSON.stringify({
            to: this.state.presenterEmail,
            content: this.state.pitchCodeUrl
        });

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
        this.props.history.push("/my-pitches");
    };

    handleDateChange = date => {
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
    };

    setUrl = (dataFromChild) => {
        this.setState({
            pitchDeckUrl: dataFromChild,
            message: "Uploaded Pitch Deck"
        });
    };

    setVideoUrl = (dataFromChild) => {
        const tag = dataFromChild.video;
        this.setState({
            pitchVideoTag: tag,
            isRecordingPitch: false,
            message: "Attached Pitch Video"
        });
    };

    recorderUploading = async (embedding) => {
        console.log('Recorder recorderUploading', embedding);
        const pitchVideoID = embedding.video;
        // this.setVideoUrl(pitchVideoID);
        console.log('id:', pitchVideoID);
        return pitchVideoID
    };

    render() {
        const {
            error,
            message,
            isLoading,
            editMode,
            pitchTitle,
            pitchRole,
            businessName,
            pitchDate,
            presenterName,
            presenterEmail,
            location,
            pitchDeckUrl,
            pitchCodeUrl,
            eventUrl,

            isRecordingPitch,
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
                        {/*{!editMode && <center><h4>Video Tag: {pitchVideoTag}</h4></center>}*/}
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
                            header={<center>Pitch Created!</center>}
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
                                    <h4><b>Pitch Info</b></h4>
                                    <p><b>Date:</b> {pitchDate}</p>
                                    <p><b>Title:</b> {pitchTitle}</p>
                                    <p><b>Presenter:</b> {presenterName}</p>
                                    <p><b>Email:</b> {presenterEmail}</p>
                                    <p><b>Role:</b> {pitchRole}</p>
                                    <p><b>Event URL:</b> <a href={eventUrl}>{eventUrl}</a></p>
                                    <p><b>Location:</b> {location}</p>
                                    {pitchDeckUrl && <p><b>PitchDeckURL:</b> {pitchDeckUrl}</p> }
                                </div>
                            }/>

                        <Form>

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

                                {!editMode &&
                                    <div className="segment">
                                        <Form.Field>
                                            <h4>Pitch Deck</h4>
                                            {/*Upload Pitch Deck*/}
                                            <Upload
                                                width={800}
                                                url={this.setUrl}
                                            />

                                            <center><h4>OR</h4></center>
                                            <Form.Input
                                                name="pitchDeckUrl"
                                                placeholder="http://"
                                                value={pitchDeckUrl}
                                                onChange={this.handleOnChange}
                                            />
                                        </Form.Field>
                                        <Button onClick={this.handleToggleRecord}>RecordPitch</Button>
                                    </div>
                                }

                                {editMode &&
                                <div>
                                    <Form.Field>
                                        {pitchDeckUrl &&
                                            <div>
                                                <h4>Pitch Deck</h4>
                                                <h3><a href={pitchDeckUrl}>View Pitch Deck</a></h3>
                                                {/*<h3><a href={pitchVideoTag}>View Elevator Pitch</a></h3>*/}
                                            </div>
                                        }
                                    </Form.Field>
                                </div>
                                }
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
                                    onVerified={this.setVideoUrl}
                                />
                                <Button onClick={this.handleToggleRecord}>Back</Button>
                            </div>
                            }


                            {!isRecordingPitch &&!editMode &&
                            <Button loading={isLoading}
                                    onClick={this.submitCreate}
                                    disabled={
                                        !pitchTitle || pitchTitle === "" ||
                                        !pitchRole || pitchRole === "" ||
                                        !pitchDate || pitchDate === "MM-DD-YYYY" ||
                                        !location || location === "" ||
                                        !presenterName || !presenterName || presenterName === "" ||
                                        !presenterEmail || !presenterEmail || presenterEmail === ""
                                    }
                            >Create</Button>
                            }

                            {editMode &&
                            <Button loading={isLoading}
                                    onClick={this.submitEdit}
                                    disabled={
                                        !pitchTitle || pitchTitle === "" ||
                                        !pitchRole || pitchRole === "" ||
                                        !pitchDate || pitchDate === "" ||
                                        !location || location === "" ||
                                        !presenterName || !presenterName || presenterName === ""
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
