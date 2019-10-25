import React, {Component} from "react";
import {Feedback, NavMenu, Logo} from "../components/index";
import {
    Loader, Message, Table, Grid, Dimmer, Container, Form, Button
} from "semantic-ui-react";
import firebase from '../Firebase';


export default class MyFeedback extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('pitches');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            feedbacks: [],
            businessID: "dHcEljBfajdYx0s6cU9O",
            pitchID: "hj02axeVCqtwh04CA325"
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const feedbacks = [];
        querySnapshot.forEach((doc) => {
            const {
                firstName,
                lastName,
                email,
                phoneNumber,
                cityState,
                timeStamp,
                rating,
                comment,
                isAnonymous,
                wantsToMeet,
            } = doc.data();
            feedbacks.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                firstName,
                lastName,
                email,
                phoneNumber,
                cityState,
                timeStamp,
                rating,
                comment,
                isAnonymous,
                wantsToMeet,
            });
            console.log("ID: ", doc.id)
        });
        this.setState({
            feedbacks
        });
    };


    // componentDidMount = async () => {
    //     this.setState({ isLoading: true });
    //     const id = this.props.match.params.id;
    //     // get custom claims for user
    //     if (id) {
    //         console.log('ID: ', id);
    //         this.feedbackRef = this.refPitches.doc(id).collection('feedback');
    //         this.unsubscribe = this.feedbackRef.onSnapshot(this.onCollectionUpdate);
    //         this.setState({
    //             isLoading: false,
    //         });
    //     }
    //     else {
    //         console.log("No Id found")
    //         this.setState({
    //             isLoading: false,
    //         });
    //     }
    // };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    componentDidMount = async () => {
        this.setState({isLoading: true});
        const {
            pitchID
        } = this.state;

        const pitchesRef = await firebase.firestore().collection("pitches");
        const myFeedbacksRef = pitchesRef.doc(pitchID).collection("feedback");
        this.unsubscribe = myFeedbacksRef.onSnapshot(this.onCollectionUpdate);
        this.setState({isLoading: false});
    };

    getMyFeedback = async () => {
        this.setState({isLoading: true});

        const {
            pitchID
        } = this.state;

        const pitchesRef = await firebase.firestore().collection("pitches");
        const myFeedbacksRef = pitchesRef.doc(pitchID).collection("feedback")

        this.unsubscribe = myFeedbacksRef.onSnapshot(this.onCollectionUpdate);
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
            pitchID,
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
                        </h2>
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}
                        <Form>
                            <Form.Field>
                                PitchID
                                <Form.Input
                                    name="pitchID"
                                    value={pitchID}
                                    onChange={this.handleOnChange}
                                />
                            </Form.Field>
                            <Button onClick={this.getMyFeedback}>Get Pitches</Button>
                        </Form>
                        <Table celled singleLine>
                            <Table.Header>
                                <Table.Row>
                                    {/*<Table.HeaderCell>PitchNickname</Table.HeaderCell>*/}
                                    <Table.HeaderCell>TimeStamp</Table.HeaderCell>
                                    <Table.HeaderCell>Rating</Table.HeaderCell>
                                    <Table.HeaderCell>Followup</Table.HeaderCell>
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
