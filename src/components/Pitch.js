import React, {Component} from "react";
import {Button, Header, Icon, Message, Modal, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import firebase from "../Firebase";

export default class Pitch extends Component {
    state = {
        id: this.props.pitch.id,
        nickname: this.props.pitch.nickname,
        company: this.props.pitch.company,
        dateOfPitch: this.props.pitch.dateOfPitch,
        presenterName: this.props.pitch.presenterName,
        presenterEmail: this.props.pitch.presenterEmail,
        location: this.props.pitch.location,
        pitchUrl: this.props.pitch.pitchUrl,
        pitchCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=http://192.168.1.66:3000/feedback/" + this.props.pitch.id,

        isLoading: false,
        error: null,
        modalOpen: false
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
            this.props.history.push("/pitches")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        this.setState({
            isLoading: false,
        });
    };

    render() {

        const {
            id,
            nickname,
            dateOfPitch,
            company,
            location,
            pitchUrl,
            presenterName,
            presenterEmail,
            pitchCodeUrl,

            error,
            isLoading
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{dateOfPitch}</Table.Cell>
                <Table.Cell>{nickname}</Table.Cell>
                <Table.Cell>{company}</Table.Cell>
                <Table.Cell>{presenterName}</Table.Cell>
                <Table.Cell>{location}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={nickname}
                            content={
                                <div>
                                    <p>Id: {id}</p>
                                    <p>Nickname: {nickname}</p>
                                    <p>Date: {dateOfPitch}</p>
                                    <p>Company: {company}</p>
                                    <p>Location: {location}</p>
                                    <p>PitchURL: {pitchUrl}</p>
                                    <p>Presenter Name: {presenterName}</p>
                                    <p>Presenter Email: {presenterEmail}</p>
                                    <img alt="pitchCodeUrl" align="right" className="ui tiny image" src={pitchCodeUrl} />
                                </div>
                            }/>
                        <Button icon="edit" as={Link} to={`/pitch/${this.props.pitch.id}`}/>
                        <Button icon="reply" as={Link} to={`/feedbacks/${this.props.pitch.id}`}/>
                        <Modal
                            trigger={<Button icon="delete" onClick={this.handleOpen}/>}
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            basic
                            size="small">
                            {error && <Message error content={error.message}/>}
                            <Header color="red" icon="delete" content="Delete"/>
                            <Modal.Content>
                                <h3>Do you really want to delete {nickname} ?</h3>
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
