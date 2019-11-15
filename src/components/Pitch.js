import React, {Component} from "react";
import {Button, Header, Icon, Message, Modal, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import firebase from "../Firebase";
import {ZiggeoPlayer} from 'react-ziggeo'
const ziggeoAPIKey = process.env.REACT_APP_ziggeoAPIKey;

export default class Pitch extends Component {
    state = {
        id: this.props.pitch.id,
        pitchTitle: this.props.pitch.pitchTitle,
        pitchRole: this.props.pitch.pitchRole,
        businessName: this.props.pitch.businessName,
        pitchDate: this.props.pitch.pitchDate,
        presenterName: this.props.pitch.presenterName,
        presenterEmail: this.props.pitch.presenterEmail,
        location: this.props.pitch.location,
        pitchDeckUrl: this.props.pitch.pitchDeckUrl,
        pitchVideoTag: this.props.pitch.pitchVideoTag,
        pitchCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://playback.herokuapp.com/feedback/" + this.props.pitch.id,
        eventUrl: this.props.pitch.eventUrl,

        // feedback Data from pitches/{pitchID}/feedbacks
        score: 0,
        feedbackCount: 0,

        isLoading: false,
        error: null,
        modalOpen: false,
        showVideo: false,
    };

    componentDidMount = async () => {
        const id = this.props.pitch.id;
        if(id){
            await this.handleGetFeedback().catch();
        }
    };

    handleOpen = () => this.setState({modalOpen: true});
    handleClose = () => this.setState({modalOpen: false});
    handleDelete = (e) => {
        e.preventDefault();
        this.setState({
            isLoading: false,
        });
        const {id} = this.state;

        firebase.firestore().collection('pitches').doc(id).delete().then(() => {
            this.props.history.push("/my-pitches")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        this.setState({
            isLoading: false,
        });
    };


    handleGetFeedback = async () => {
        const feedbackRef = await firebase.firestore().collection("pitches").doc(this.state.id).collection('feedback');
        this.unsubscribe = feedbackRef.onSnapshot(this.onFeedbackCollectionUpdate);
    };

    onFeedbackCollectionUpdate = async (querySnapshot) => {
        const feedbacks = [];
        await querySnapshot.forEach((doc) => {
            const {
                rating1,
                rating2,
                rating3,
            } = doc.data();
            feedbacks.push({
                id: doc.id,
                rating1,
                rating2,
                rating3,
            });
        });
        await this.handleGetRatings(feedbacks);

        this.setState({
            feedbacks: feedbacks
        });
    };

    handleGetRatings = async (feedbacks) => {
        // get total count
        const count = feedbacks.length;
        // get total points
        const score = feedbacks.reduce( (score, feedback) => {
            score = score + feedback.rating1 + feedback.rating2 + feedback.rating3;
            return score
        },0);
        this.setState({
            feedbackCount: count,
            score: score,
        })
    };


    handleToggleShowVideo = () => {
        const {showVideo} = this.state;
        if(showVideo === true){
            this.setState({
                showVideo: false
            })
        }
        else {
            this.setState({
                showVideo: true
            })
        }
    };


    render() {

        const {
            id,
            pitchTitle,
            pitchRole,
            pitchDate,
            location,
            pitchDeckUrl,
            presenterName,
            presenterEmail,
            pitchCodeUrl,
            eventUrl,
            pitchVideoTag,

            score,
            feedbackCount,

            error,
            isLoading,
            showVideo
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{pitchDate}</Table.Cell>
                <Table.Cell>{pitchTitle}</Table.Cell>
                <Table.Cell>{presenterName}</Table.Cell>
                <Table.Cell>{pitchRole}</Table.Cell>
                <Table.Cell>{location}</Table.Cell>
                <Table.Cell>{score}</Table.Cell>
                <Table.Cell>{feedbackCount}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={<div>
                                <h3>{pitchTitle} - {id}</h3>
                            </div>}
                            content={
                                <div>
                                    {!showVideo &&
                                    <div>
                                        <p><b>Title:</b> {pitchTitle}</p>
                                        <p><b>Date:</b> {pitchDate}</p>
                                        <p><b>Location:</b> {location}</p>
                                        <p><b>Presenter Name:</b> {presenterName}</p>
                                        <p><b>Presenter Name:</b> {pitchRole}</p>
                                        <p><b>Presenter Email:</b> {presenterEmail}</p>
                                        {eventUrl && <p><b>Event URL:</b> {eventUrl}</p> }
                                        <p><b>Feedback Count:</b> {feedbackCount}</p>
                                        <p><b>Average Rating:</b> {score}</p>
                                        <p><b>Feedback QR:</b></p>
                                        <img hspace="20" alt="pitchCodeUrl" align="top" className="ui tiny image" src={pitchCodeUrl} />
                                        <hr/>
                                        {pitchVideoTag &&
                                            <Button onClick={this.handleToggleShowVideo}><b>Video</b></Button>
                                        }
                                        {pitchDeckUrl &&
                                            <Button href={pitchDeckUrl}><b>PitchDeck</b></Button>
                                        }

                                    </div>
                                    }
                                    {showVideo &&
                                        <div>
                                            <ZiggeoPlayer
                                                apiKey={ziggeoAPIKey}
                                                video={this.state.pitchVideoTag}
                                                theme={'modern'}
                                                themecolor={'red'}
                                                skipinitial={false}
                                                onPlaying={this.playing}
                                                onPaused={this.paused}
                                            />
                                            <Button onClick={this.handleToggleShowVideo}>Back</Button>
                                        </div>
                                    }
                                </div>
                            }/>
                        <Button icon="edit" as={Link} to={`/pitch/${this.props.pitch.id}`}/>
                        {/*<Button icon="reply" as={Link} to={`/my-feedback/${this.props.pitch.id}`}/>*/}
                        <Button as={Link} to={`/my-feedback/${this.props.pitch.id}`}>Feedback</Button>
                        <Modal
                            trigger={<Button icon="delete" onClick={this.handleOpen}/>}
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            basic
                            size="small">
                            {error && <Message error content={error.message}/>}
                            <Header color="red" icon="delete" content="Delete"/>
                            <Modal.Content>
                                <h3>Do you really want to delete {pitchTitle} ?</h3>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button basic color="red" inverted onClick={this.handleClose}>
                                    <Icon name="remove"/>No
                                </Button>
                                <Button color="green" inverted onClick={this.handleDelete} loading={isLoading}>
                                    <Icon name="checkmark"/>Yes
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
