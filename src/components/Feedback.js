import React, {Component} from "react";
import {Button, Modal, Table} from "semantic-ui-react";

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
        wantsToMeet: this.props.feedback.wantsToMeet,

        isLoading: false,
        error: null,
        modalOpen: false
    };

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
            wantsToMeet,
            isAnonymous,
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{timeStamp}</Table.Cell>
                <Table.Cell>{rating}</Table.Cell>
                <Table.Cell>{wantsToMeet}</Table.Cell>
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
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
