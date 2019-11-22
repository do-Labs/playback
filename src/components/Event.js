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
        location: this.props.event.location,
        eventCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://playback.herokuapp.com/signIn/` + this.props.event.id,
        eventUrl: this.props.event.eventUrl,

        // feedback Data from events/{eventID}/signIns
        score: 0,
        headCount: 0,

        isLoading: false,
        error: null,
        modalOpen: false,
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
        const feedbackRef = await firebase.firestore().collection("events").doc(this.state.id).collection('attendees');
        this.unsubscribe = feedbackRef.onSnapshot(this.onAttendeesCollectionUpdate);
    };

    onAttendeesCollectionUpdate = async (querySnapshot) => {
        const attendees = [];
        await querySnapshot.forEach((doc) => {
            const {
                firstName,
                lastName,
                email,
                phoneNumber,
            } = doc.data();
            attendees.push({
                id: doc.id,
                firstName,
                lastName,
                email,
                phoneNumber,
            });
        });
        await this.handleGetRatings(attendees);

        this.setState({
            attendees: attendees
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
            headCount: count,
            score: score,
        })
    };

    render() {

        const {
            id,
            eventTitle,
            eventDate,
            location,
            eventCodeUrl,
            eventUrl,

            headCount,

            error,
            isLoading,
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{eventDate}</Table.Cell>
                <Table.Cell>{eventTitle}</Table.Cell>
                <Table.Cell>{location}</Table.Cell>
                <Table.Cell>{headCount}</Table.Cell>
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
                                        <p><b>Location:</b> {location}</p>
                                        {eventUrl && <p><b>Event URL:</b> {eventUrl}</p> }
                                        <p><b>HeadCount:</b> {headCount}</p>
                                        <p><b>Sign In QR:</b></p>
                                        <img hspace="20" alt="eventCodeUrl" align="top" className="ui tiny image" src={eventCodeUrl} />
                                    </div>
                                </div>
                            }/>
                        <Button icon="edit" as={Link} to={`/event/${this.props.event.id}`}/>
                        {/*<Button icon="reply" as={Link} to={`/my-feedback/${this.props.event.id}`}/>*/}
                        {/*<Button as={Link} to={`/attendees/${this.props.event.id}`}>Attendees</Button>*/}
                        <Button icon="user" as={Link} to={`/attendees/${this.props.event.id}`}/>
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
