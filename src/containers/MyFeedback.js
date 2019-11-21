import React, {Component} from "react";
import {Feedback, NavMenu, Logo} from "../components/index";
import {
    Loader, Message, Table, Grid, Dimmer, Container
} from "semantic-ui-react";
import firebase from '../Firebase';
import CsvDownload from 'react-json-to-csv'

export default class MyFeedback extends Component {

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            feedbacks: [],
            businessID: this.props.businessID,
        };
    }

    onCollectionUpdate = async (querySnapshot) => {
        const feedbacks = [];
        await querySnapshot.forEach((doc) => {
            const {
                role,
                firstName,
                lastName,
                email,
                phoneNumber,
                city,
                state,
                timeStamp,
                rating1,
                rating2,
                rating3,
                comment,
                isAnonymous,
                wantsToMeet,
                questions,
                answers,
            } = doc.data();
            feedbacks.push({
                id: doc.id,
                role,
                firstName,
                lastName,
                email,
                phoneNumber,
                city,
                state,
                timeStamp,
                rating1,
                rating2,
                rating3,
                comment,
                isAnonymous,
                wantsToMeet,
                questions,
                answers,
            });
        });
        this.setState({
            feedbacks
        });
    };


    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    componentDidMount = async () => {
        this.setState({isLoading: true});
        const path = this.props.location.pathname;
        const arr = path.split('/');
        const id = arr[2];
        this.setState({
            pitchID: id,
        });

        const pitchesRef = await firebase.firestore().collection("pitches");
        const myFeedbacksRef = pitchesRef.doc(id).collection("feedback");
        this.unsubscribe = await myFeedbacksRef.onSnapshot(this.onCollectionUpdate);
        this.setState({isLoading: false});
    };

    getMyFeedback = async () => {
        this.setState({isLoading: true});
        const {
            pitchID
        } = this.state;

        const pitchesRef = firebase.firestore().collection("pitches");
        const myFeedbacksRef = pitchesRef.doc(pitchID).collection("feedback");

        this.unsubscribe = await myFeedbacksRef.onSnapshot(this.onCollectionUpdate);
        this.setState({isLoading: false});
    };

    render() {
        const cProps = {
            onBusinessDeleted: this.getBusinessesList
        };

        const {
            error,
            isLoading,
            feedbacks,
        } = this.state;

        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <h2>
                           My Feedback
                            <CsvDownload style={{float: "right"}} data={feedbacks} />
                        </h2>
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}
                        <Table celled singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>Avg Score</Table.HeaderCell>
                                    <Table.HeaderCell>Total Score</Table.HeaderCell>
                                    <Table.HeaderCell>Followup</Table.HeaderCell>
                                    {/*<Table.HeaderCell>Comment</Table.HeaderCell>*/}
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {feedbacks.map(feedback => (
                                    <Feedback
                                        key={Math.random()}
                                        feedback={feedback}
                                        {...this.props}
                                        {...cProps}
                                        handleDelete={this.handleDelete}
                                    />
                                ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
