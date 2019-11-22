import React, {Component} from "react";
import {Button, Modal, Table} from "semantic-ui-react";

export default class Attendee extends Component {
    state = {
        id: this.props.attendee.id,
        firstName: this.props.attendee.firstName,
        lastName: this.props.attendee.lastName,
        email: this.props.attendee.email,
        phoneNumber: this.props.attendee.phoneNumber,

        isLoading: false,
        error: null,
        modalOpen: false
    };

    componentDidMount = () => {

    };

    render() {

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{firstName} {lastName}</Table.Cell>
                <Table.Cell>{email}</Table.Cell>
                <Table.Cell>{phoneNumber}</Table.Cell>
                {/*<Table.Cell><h6>{comment}</h6></Table.Cell>*/}
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            content={
                                <div>
                                    <p><b>Email:</b> {email}</p>
                                    {firstName && <p><b>FirstName:</b> {firstName}</p> }
                                    {lastName && <p><b>LastName:</b> {lastName}</p> }
                                    {phoneNumber && <p><b>PhoneNumber:</b> {phoneNumber}</p> }
                                </div>
                            }/>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
