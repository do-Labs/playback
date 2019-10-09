import React, {Component} from "react";
import {Feedback, NavMenu, Logo} from "../components/index";
import {Loader, Message, Table, Grid, Dimmer, Container
} from "semantic-ui-react";
import firebase from '../Firebase';


export default class AllFeedback extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('pitches');
        // this.ref = firebase.firestore().collection('pitches').doc('feedback');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            feedbacks: []
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
                starsGiven,
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
                starsGiven,
            });
            console.log("ID: ", doc.id)
        });
        this.setState({
            feedbacks
        });
    };

    // componentDidMount = () => {
    //     this.setState({ isLoading: true });
    //     this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    //     this.setState({ isLoading: false });
    // };


    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const id = this.props.match.params.id;
        if (id) {
            console.log('ID: ', id);


            this.setState({
                isLoading: false,
            });
        }
        else {
            console.log("No Id found")
            this.setState({
                isLoading: false,
            });
        }
    };

    render() {
        const cProps = {
            onBusinessDeleted: this.getBusinessesList
        };

        const {error, isLoading, feedbacks} = this.state;

        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <h2>
                            Feedback List
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
                                    <Table.HeaderCell>PitchNickname</Table.HeaderCell>
                                    <Table.HeaderCell>TimeStamp</Table.HeaderCell>
                                    <Table.HeaderCell>Rating</Table.HeaderCell>
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
