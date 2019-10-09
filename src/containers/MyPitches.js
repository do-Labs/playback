import React, {Component} from "react";
import {
    Logo,
    NavMenu,
    // Pitch
} from "../components/index";
import {Container, Dimmer, Grid, Loader, Message, Table} from "semantic-ui-react";
import firebase from '../Firebase';


export default class MyPitches extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('pitches');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            pitches: []
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const pitches = [];
        querySnapshot.forEach((doc) => {
            const {
                nickname,
                dateOfPitch,
                company,
                location,
                presenterName,
                presenterEmail,
            } = doc.data();
            pitches.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                nickname,
                dateOfPitch,
                company,
                location,
                presenterName,
                presenterEmail,
            });
            console.log("PITCHID: ", doc.id)
        });
        this.setState({
            pitches
        });
    };

    componentDidMount = () => {
        this.setState({isLoading: true});

        const token = this.props.token;
        console.log(token);

        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
        this.setState({isLoading: false});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.pitches.pitch !== prevState.count) {
            this.setState({isLoading: true});
        }
    }

    handleDelete = (id) => {
        console.log("DEL: ", id);
        this.setState({pitches: this.state.pitches.filter(pitch => pitch.id !== id)})
        this.ref.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            this.props.history.push("/")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    };

    // handleDelete(id) {
    //     console.log("Deleting ", id);
    //     this.ref.doc(id).delete().then(() => {
    //         console.log("Document successfully deleted!");
    //         this.props.history.push("/")
    //     }).catch((error) => {
    //         console.error("Error removing document: ", error);
    //     });
    // }

    render() {

        const {
            error,
            isLoading,
            // pitches
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
                            My Pitches
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
                                    <Table.HeaderCell>DateOfPitch</Table.HeaderCell>
                                    <Table.HeaderCell>Pitch Nickname</Table.HeaderCell>
                                    <Table.HeaderCell>Company</Table.HeaderCell>
                                    <Table.HeaderCell>PresenterName</Table.HeaderCell>
                                    <Table.HeaderCell>Location</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>

                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
