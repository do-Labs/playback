import React, {Component} from "react";
import {Button, Modal, Table} from "semantic-ui-react";
const moment = require('moment');

export default class Feedback extends Component {
    state = {
        id: this.props.feedback.id,
        role: this.props.feedback.role,
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
        ratingTotal: 0,
        questions: this.props.feedback.questions,
        answers: this.props.feedback.answers,

        isLoading: false,
        error: null,
        modalOpen: false
    };

    componentDidMount = () => {
        this.handleAvgRating();
        this.handleGetDateTime();

    };

    handleAvgRating = () => {
        const {
            rating1,
            rating2,
            rating3,
        } = this.state;

        const ratingAvg = Math.round( (rating1 + rating2 + rating3)/3 );
        const ratingTotal = rating1 + rating2 + rating3;

        this.setState({
            ratingAvg: ratingAvg,
            ratingTotal: ratingTotal,
        })
    };

    handleGetDateTime = () => {
        const { timeStamp } = this.state;
        const dateTime = moment(timeStamp).format();
        const date = dateTime.split('T')[0];
        const timeString = dateTime.split('T')[1];
        const time = timeString.split('-')[0];
        this.setState({
            timeStamp: dateTime,
            date: date,
            time: time,
        })

        //format time to AM PM
    };

    render() {

        const {
            date,
            // time,
            role,
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            ratingAvg,
            ratingTotal,
            rating1,
            rating2,
            rating3,
            comment,
            wantsToMeet,
            questions,
            answers,
            isAnonymous,
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{date}</Table.Cell>
                <Table.Cell>{firstName} {lastName}</Table.Cell>
                <Table.Cell>{email}</Table.Cell>
                <Table.Cell>{ratingAvg}</Table.Cell>
                <Table.Cell>{ratingTotal}</Table.Cell>
                <Table.Cell>{wantsToMeet}</Table.Cell>
                {/*<Table.Cell><h6>{comment}</h6></Table.Cell>*/}
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={<h2>{date}</h2>}
                            content={
                                <div>
                                    {isAnonymous &&
                                        <p>IsAnonymous: {isAnonymous}</p>
                                    }
                                    <p><b>Date: </b>{date}</p>
                                    {firstName && <p><b>FirstName:</b> {firstName}</p> }
                                    {lastName && <p><b>LastName:</b> {lastName}</p> }
                                    <p><b>Email:</b> {email}</p>
                                    {phoneNumber && <p><b>PhoneNumber:</b> {phoneNumber}</p> }
                                    <p><b>Role:</b> {role}</p>
                                    {city && <p><b>City:</b> {city}</p> }
                                    {state && <p><b>State:</b> {state}</p> }
                                    {comment &&
                                        <div className="ui segment">
                                            <p><b>Comment:</b> {comment}</p>
                                        </div>
                                    }
                                    <hr/>
                                    <p><b>Average Rating:</b> {ratingAvg}</p>
                                    {rating1 > 0 && <p><b>Communication:</b> {rating1}</p> }
                                    {rating2 > 0 && <p><b>Valid problem Statement:</b> {rating2}</p> }
                                    {rating3 > 0 && <p><b>Valuable Soution:</b> {rating3}</p> }
                                    {questions &&
                                        <div><b>Questions:</b> {questions.map((question, i) => (
                                            <div>
                                                <p>
                                                    {i+1}) {question}
                                                    <br/><em>{answers[i]}</em>
                                                </p>
                                                {/*<p key={Math.random()}>{i+1}) {question}</p>*/}
                                                {/*<div><b>Questions:</b>*/}
                                                    {/*{questions.map((question, i) => (*/}
                                                        {/*<p key={Math.random()}>{i+1}) {question}</p>*/}
                                                    {/*))}*/}
                                                {/*</div>*/}
                                            </div>
                                        ))}</div>
                                    }
                                </div>
                            }/>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
