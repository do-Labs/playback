import React, {Component} from "react";
import {Button, Header, Icon, Message, Modal, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import firebase from "../Firebase";

export default class Event extends Component {
    state = {
        id: this.props.event.id,
        eventTitle: this.props.event.eventTitle,
        businessName: this.props.event.businessName,
        eventDate: this.props.event.eventDate,
        presenterName: this.props.event.presenterName,
        presenterEmail: this.props.event.presenterEmail,
        location: this.props.event.location,
        eventCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://playback.herokuapp.com/feedback/` + this.props.event.id,
        eventUrl: this.props.event.eventUrl,

        // feedback Data from events/{eventID}/feedbacks
        score: 0,
        feedbackCount: 0,

        isLoading: false,
        error: null,
        modalOpen: false,
        showVideo: false,
    };

    componentDidMount = async () => {
        const id = this.props.event.id;
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

        firebase.firestore().collection('events').doc(id).delete().then(() => {
            this.props.history.push("/my-events")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        this.setState({
            isLoading: false,
        });
    };


    handleGetFeedback = async () => {
        const feedbackRef = await firebase.firestore().collection("events").doc(this.state.id).collection('feedback');
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
            eventTitle,
            eventDate,
            location,
            presenterName,
            presenterEmail,
            eventCodeUrl,
            eventUrl,

            score,
            feedbackCount,

            error,
            isLoading,
            showVideo
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{eventDate}</Table.Cell>
                <Table.Cell>{eventTitle}</Table.Cell>
                <Table.Cell>{presenterName}</Table.Cell>
                <Table.Cell>{location}</Table.Cell>
                <Table.Cell>{score}</Table.Cell>
                <Table.Cell>{feedbackCount}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={<div>
                                <h3>{eventTitle} - {id}</h3>
                            </div>}
                            content={
                                <div>
                                    <div>
                                        <br/>
                                        <p><b>Date:</b> {eventDate}</p>
                                        <p><b>Email:</b> {presenterEmail}</p>
                                        <p><b>Name:</b> {presenterName}</p>
                                        <p><b>Location:</b> {location}</p>
                                        {eventUrl && <p><b>Event URL:</b> {eventUrl}</p> }
                                        <p><b>Feedback Count:</b> {feedbackCount}</p>
                                        <p><b>Average Rating:</b> {score}</p>
                                        <p><b>Feedback QR:</b></p>
                                        <img hspace="20" alt="eventCodeUrl" align="top" className="ui tiny image" src={eventCodeUrl} />
                                    </div>
                                </div>
                            }/>
                        <Button icon="edit" as={Link} to={`/event/${this.props.event.id}`}/>
                        {/*<Button icon="reply" as={Link} to={`/my-feedback/${this.props.event.id}`}/>*/}
                        <Button as={Link} to={`/my-feedback/${this.props.event.id}`}>Feedback</Button>
                        <Modal
                            trigger={<Button icon="delete" onClick={this.handleOpen}/>}
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            basic
                            size="small">
                            {error && <Message error content={error.message}/>}
                            <Header color="red" icon="delete" content="Delete"/>
                            <Modal.Content>
                                <h3>Do you really want to delete {eventTitle} ?</h3>
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
