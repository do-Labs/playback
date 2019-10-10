import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message} from "semantic-ui-react";
import {NavMenu, Logo, Upload} from "../components/index";
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
            nickname: "",
            company: "",
            dateOfPitch: "",
            presenterName: "",
            presenterEmail: "humdan@dolabs.io",
            location: "",
            pitchUrl: "",

            qrMakerUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=",
            qrPrefix: 'https://blooming-bastion-98391.herokuapp.com/feedback/',
            pitchCodeUrl: "https://tinyurl.com/y6ysz826",
            qrData: "",
        };
    }

    componentDidMount = () => {
        const pitchId = this.props.match.params.id;

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
                        nickname: pitch.nickname,
                        company: pitch.company,
                        dateOfPitch: pitch.dateOfPitch,
                        presenterName: pitch.presenterName,
                        presenterEmail: pitch.presenterEmail,
                        location: pitch.location,
                        pitchUrl: pitch.pitchUrl,
                    });
                } else {
                    console.log("No such document!");
                }
            });


            this.setState({
                isLoading: false,
            });
        }

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


    submitCreate = () => {
        const {
            nickname,
            company,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
        } = this.state;

        this.ref.add({
            nickname,
            company,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
        }).then((docRef) => {

            const pid = docRef._key.path.segments[1];
            console.log("POSTED Pitch Data", docRef);
            console.log("RESSS", pid);
            //handle response
            this.setState({
                pitchID: pid,
            });


            this.createQRCode(pid)

            // this.props.history.push("/pitches")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    submitEdit = () => {
        const pitchId = this.props.match.params.id;
        console.log("PITCHID: " , pitchId);
        const {
            nickname,
            company,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
        } = this.state;

        // Then update existing data with a PUT call with all fields
        // Only make the editable fields available for the user to update
        const pitchRef = firebase.firestore().collection('pitches').doc(pitchId);

        // post all pitch info to firebase

        pitchRef.set({
            nickname,
            company,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
        }).then((docRef) => {
            alert("Pitch Edited Successfully!");
            this.props.history.push("/pitches")
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
            nickname,
            company,
            dateOfPitch,
            presenterName,
            presenterEmail,
            location,
            pitchUrl,
            pitchCodeUrl,

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
                                <h3>Pitch Info</h3>
                                <div className="ui segment">
                                    <Form.Field>
                                        Pitch Nickname
                                        <Form.Input
                                            name="nickname"
                                            placeholder="Pitch Nickname"
                                            value={nickname}
                                            onChange={this.handleOnChange}
                                            error={!nickname || nickname === ""}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        Company
                                        <Form.Input
                                            name="company"
                                            placeholder="Company"
                                            value={company}
                                            onChange={this.handleOnChange}
                                            error={!company || company === ""}
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
                                        PitchURL
                                        <Form.Input
                                            name="pitchUrl"
                                            placeholder="http://"
                                            value={pitchUrl}
                                            onChange={this.handleOnChange}
                                            error={!pitchUrl || pitchUrl === ""}
                                        />
                                    </Form.Field>
                                </div>

                                <div className="four wide column">

                                    {pitchCodeUrl && <img alt="pitchCodeUrl" align="right" className="ui tiny image" src={pitchCodeUrl} />
                                    }
                                </div>

                                <Upload/>

                            </div>


                            <Button loading={isLoading}
                                    // disabled={
                                    //     !isEnabled || !nickname || nickname === "" ||
                                    //     !dateOfPitch || !dateOfPitch || dateOfPitch === "" ||
                                    //     !presenterName || !presenterName || presenterName === "" ||
                                    //     !presenterEmail || !presenterEmail || presenterEmail === "" ||
                                    //     !location || !location || location === ""
                                    // }
                            >Submit</Button>
                        </Form>
                    </Grid.Column>
                    <Button onClick={this.handleEmailQR}>handleEmailQR</Button>
                </Grid>
            </Container>
        );
    }
}
