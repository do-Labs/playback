import React, {Component} from "react";
import {Button, Header, Icon, Message, Modal, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default class Feedback extends Component {
    state = {
        id: this.props.feedback.id,
        firstName: this.props.feedback.firstName,
        lastName: this.props.feedback.lastName,
        email: this.props.feedback.email,
        phoneNumber: this.props.feedback.phoneNumber,
        city: this.props.feedback.city,
        state: this.props.feedback.state,
        timeStamp: this.props.feedback.timeStamp,
        rating: this.props.feedback.rating,
        comment: this.props.feedback.comment,
        isAnonymous: this.props.feedback.isAnonymous,

        isLoading: false,
        error: null,
        modalOpen: false
    };

    handleOpen = () => this.setState({modalOpen: true});
    handleClose = () => this.setState({modalOpen: false});

    render() {

        const {
            id,
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            timeStamp,
            rating,
            comment,
            isAnonymous,
            error,
            isLoading
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{timeStamp}</Table.Cell>
                <Table.Cell>{rating}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={id}
                            content={
                                <div>
                                    <p>Id: {id}</p>
                                    <p>TimeStamp: {timeStamp}</p>
                                    <p>IsAnonymous: {isAnonymous}</p>
                                    <p>City: {city}</p>
                                    <p>State: {state}</p>
                                    <p>FirstName: {firstName}</p>
                                    <p>LastName: {lastName}</p>
                                    <p>Email: {email}</p>
                                    <p>PhoneNumber: {phoneNumber}</p>
                                    <p>Comment: {comment}</p>
                                </div>
                            }/>
                        <Button icon="edit" as={Link} to={`/feedback/${this.props.feedback.id}`}/>
                        <Modal
                            trigger={<Button icon="delete" onClick={this.handleOpen}/>}
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            basic
                            size="small">
                            {error && <Message error content={error.message}/>}
                            <Header color="red" icon="delete" content="Delete"/>
                            <Modal.Content>
                                <h3>Do you really want to delete {id} ?</h3>
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
                        <Button icon="users" as={Link} to={`/users/${id}`}/>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
