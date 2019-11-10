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
        pitchUrl: this.props.pitch.pitchUrl,
        videoTag: this.props.pitch.videoTag,
        pitchCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://blooming-bastion-98391.herokuapp.com/feedback/" + this.props.pitch.id,
        eventUrl: this.props.pitch.eventUrl,
        avgRating: 0,
        feedbackCount: 0,

        isLoading: false,
        error: null,
        modalOpen: false,
        showVideo: false,
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
            console.log("Document successfully deleted!");
            this.props.history.push("/my-pitches")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        this.setState({
            isLoading: false,
        });
    };

    handleGetFeedbackRatingAverage = () => {

        // get feedback count
    };

    handleGetFeedbackCount = () => {

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
            pitchUrl,
            presenterName,
            presenterEmail,
            pitchCodeUrl,
            eventUrl,
            videoTag,

            avgRating,
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
                <Table.Cell>{avgRating}</Table.Cell>
                <Table.Cell>{feedbackCount}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={pitchTitle}
                            content={
                                <div>
                                    {!showVideo &&
                                    <div>
                                        <p>Id: {id}</p>
                                        <p>Title: {pitchTitle}</p>
                                        <p>Date: {pitchDate}</p>
                                        <p>Location: {location}</p>
                                        <p>Presenter Name: {presenterName}</p>
                                        <p>Presenter Name: {pitchRole}</p>
                                        <p>Presenter Email: {presenterEmail}</p>
                                        <p>Event URL: {eventUrl}</p>
                                        <p>Feedback Count: {feedbackCount}</p>
                                        <p>Average Rating: {avgRating}</p>
                                        <p>Feedback QR:</p>
                                        <img hspace="20" alt="pitchCodeUrl" align="top" className="ui tiny image" src={pitchCodeUrl} />
                                        <hr/>
                                        {videoTag &&
                                            <Button onClick={this.handleToggleShowVideo}>Video</Button>
                                        }
                                        <Button href={pitchUrl}>PitchDeck</Button>
                                    </div>
                                    }
                                    {showVideo &&
                                        <div>
                                            <ZiggeoPlayer
                                                apiKey={ziggeoAPIKey}
                                                video={this.state.videoTag}
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
