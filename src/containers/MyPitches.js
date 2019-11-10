import React, {Component} from "react";
import {
    Pitch,
    Logo,
    NavMenu,
    // Pitch
} from "../components/index";
import {Button, Container, Dimmer, Grid, Icon, Loader, Message, Table} from "semantic-ui-react";
import firebase from '../Firebase';
import {Link} from "react-router-dom";


export default class MyPitches extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('pitches');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            pitches: [],
            businessID: this.props.businessID
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const pitches = [];
        querySnapshot.forEach((doc) => {
            const {
                pitchTitle,
                pitchDate,
                company,
                location,
                presenterName,
                pitchRole,
                presenterEmail,
                eventUrl,
                pitchUrl,
                videoTag,
            } = doc.data();
            pitches.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                pitchTitle,
                pitchDate,
                company,
                location,
                presenterName,
                pitchRole,
                presenterEmail,
                eventUrl,
                pitchUrl,
                videoTag,
            });
        });
        this.setState({
            pitches
        });
    };

    componentDidMount = async () => {
        this.setState({isLoading: true});
        const businessID = this.props.businessID;

        if(!this.props.businessID){
            this.setState({
                businessID : null
            })
        }
        else {
            this.setState({
                businessID : businessID,
            })
        }

        await this.getMyPitches();
        this.setState({isLoading: false});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.pitches.pitch !== prevState.count) {
            this.setState({isLoading: true});
        }
    }

    handleDelete = (id) => {
        console.log("DEL: ", id);
        this.setState({pitches: this.state.pitches.filter(pitch => pitch.id !== id)});
        this.ref.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            // this.props.history.push("/my-pitches")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    getMyPitches = async () => {
        const myPitchesRef = await firebase.firestore().collection("pitches");
        const pitches = await myPitchesRef.where("businessID", "==", this.state.businessID);

        this.unsubscribe = pitches.onSnapshot(this.onCollectionUpdate);
    };



    render() {

        const {
            error,
            isLoading,
            pitches
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
                            <Button secondary animated='fade' as={Link} to="/pitch" style={{float: "right"}}>
                                <Button.Content visible>Add Pitch</Button.Content>
                                <Button.Content hidden><Icon name="add"/></Button.Content>
                            </Button>
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
                                    <Table.HeaderCell>PitchDate</Table.HeaderCell>
                                    <Table.HeaderCell>Pitch Title</Table.HeaderCell>
                                    <Table.HeaderCell>PresenterName</Table.HeaderCell>
                                    <Table.HeaderCell>Role</Table.HeaderCell>
                                    <Table.HeaderCell>Location</Table.HeaderCell>
                                    <Table.HeaderCell>Rating</Table.HeaderCell>
                                    <Table.HeaderCell>Count</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {pitches.map(pitch => (
                                    <Pitch
                                        key={Math.random()}
                                        pitch={pitch}
                                        {...this.props}
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
