import React, {Component} from "react";
import {Container, Dimmer, Grid, Loader, Message, Table} from "semantic-ui-react";
import {NavMenu, Logo} from "../components/index";
import firebase from '../Firebase';

export default class Feedbacks extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('pitches');
        this.state = {
            error: null,
            isLoading: false,
            editMode: false,
            isEnabled: true,

            // name: "",
            // type: "",
            // stage: "",
            // corpType: "",
            // businessURL: "",

            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            city: "",
            state: "",
            timeStamp: "",
            rating: "",
            comment: "",
            isAnonymous: "",
        };
    }

    componentDidMount = () => {
        const pathName = this.props.history.location.pathname;
        console.log("PATHNAME: " ,pathName);
        const temp = pathName.split(`/feedbacks/`);
        const id = temp[1];
        console.log("ID: ", id);

        if (id) { // MY-FEEDBACK MODE
            this.setState({
                isLoading: true,
                editMode: true,
            });
            console.log("Viewing Feedback for Pitch ID: " + id);
            const ref = firebase.firestore().collection('pitches');
            // const ref = firebase.firestore().collection('pitches').doc(id).collection('feedback');
            // const ref = firebase.firestore().collection('pitches').doc(id).collection('feedback');
            console.log("REF:", ref);
            ref.get().then((doc) => {
                console.log("Document: ", doc);

                if (doc.empty !== false) {
                    const feedbacks = doc.data();
                    console.log("Feedbacks:: ", feedbacks);
                    this.setState({
                        key: doc.id,
                        // firstName,
                        // lastName,
                        // email,
                        // phoneNumber,
                        // cityState,
                        // timeStamp,
                        // rating,
                        // comment,
                        // isAnonymous,
                        firstName: feedbacks.firstName,
                        lastName: feedbacks.lastName,
                        email: feedbacks.email,
                        phoneNumber: feedbacks.phoneNumber,
                        city: feedbacks.city,
                        state: feedbacks.state,
                        timeStamp: feedbacks.timeStamp,
                        rating: feedbacks.rating,

                    });
                } else {
                    console.log("No such document!");
                }
            });
            //  );

            this.setState({
                isLoading: false,
            });
        } // End EditMode
        else {
            // Setup initial conditions upon Create Here:
        }
    };








    render() {
        const {
            error,
            isLoading,
            // feedbacks,

        } = this.state;


        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <h1>Feedbacks/ID</h1>
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}
                        <Table celled singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>TimeStamp</Table.HeaderCell>
                                    <Table.HeaderCell>Rating</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {/*{feedbacks.map(feedback => (*/}
                                    {/*<Feedback*/}
                                        {/*key={Math.random()}*/}
                                        {/*feedback={feedback}*/}
                                        {/*{...this.props}*/}
                                        {/*handleDelete={this.handleDelete}*/}
                                    {/*/>*/}
                                {/*))}*/}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
