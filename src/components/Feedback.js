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
        rating1: this.props.feedback.rating1,
        rating2: this.props.feedback.rating2,
        rating3: this.props.feedback.rating3,
        comment: this.props.feedback.comment,
        isAnonymous: this.props.feedback.isAnonymous,
        wantsToMeet: this.props.feedback.wantsToMeet,
        ratingAvg: 0,

        isLoading: false,
        error: null,
        modalOpen: false
    };

    componentDidMount = () => {
        this.handleAvgRating();
    };

    handleAvgRating = () => {
        console.log('averaging ratings...');
        const {
            rating1,
            rating2,
            rating3,
        } = this.state;

        const ratingAvg = Math.round( (rating1 + rating2 + rating3)/3 );
        if(ratingAvg){
            this.setState({ ratingAvg: ratingAvg})
        }
        else {
            this.setState({ ratingAvg: 0})
        }

    };

    render() {

        const {
            id,
            timeStamp,
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            ratingAvg,
            rating1,
            rating2,
            rating3,
            comment,
            wantsToMeet,
            isAnonymous,
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{timeStamp}</Table.Cell>
                <Table.Cell>{firstName} {lastName}</Table.Cell>
                <Table.Cell>{ratingAvg}</Table.Cell>
                <Table.Cell>{wantsToMeet}</Table.Cell>
                <Table.Cell>{comment}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={id}
                            content={
                                <div>
                                    <p>Id: {id}</p>
                                    <p>TimeStamp: {timeStamp}</p>
                                    {isAnonymous &&
                                        <p>IsAnonymous: {isAnonymous}</p>
                                    }
                                    <p>City: {city}</p>
                                    <p>State: {state}</p>
                                    <p>FirstName: {firstName}</p>
                                    <p>LastName: {lastName}</p>
                                    <p>Email: {email}</p>
                                    <p>PhoneNumber: {phoneNumber}</p>
                                    <p>Comment: {comment}</p>
                                    <hr/>
                                    <p>Communication: {rating1}</p>
                                    <p>Valid problem Statement: {rating2}</p>
                                    <p>Valuable Soution: {rating3}</p>
                                </div>
                            }/>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
