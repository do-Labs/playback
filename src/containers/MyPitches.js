import React, {Component} from "react";
import {
    Pitch,
    Logo,
    NavMenu,
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
            });
            await this.getMyPitches();
        }

        this.setState({isLoading: false});
    };

    onPitchesCollectionUpdate = async (querySnapshot) => {
        const pitches = [];
        await querySnapshot.forEach((doc) => {
            const {
                pitchTitle,
                pitchDate,
                company,
                location,
                presenterName,
                pitchRole,
                presenterEmail,
                eventUrl,
                pitchDeckUrl,
                pitchVideoTag,
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
                pitchDeckUrl,
                pitchVideoTag,
            });
        });
        this.setState({
            pitches
        });
    };

    handleDelete = async (id) => {
        this.setState({pitches: this.state.pitches.filter(pitch => pitch.id !== id)});
        await this.ref.doc(id).delete()
            .catch((error) => {
            console.error("Error removing document: ", error);
        });
    };

    getMyPitches = async () => {
        const myPitchesRef = firebase.firestore().collection("pitches");
        const pitches = await myPitchesRef.where("businessID", "==", this.props.businessID);
        this.unsubscribe = await pitches.onSnapshot(this.onPitchesCollectionUpdate);
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
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Title</Table.HeaderCell>
                                    <Table.HeaderCell>Presenter</Table.HeaderCell>
                                    <Table.HeaderCell>Role</Table.HeaderCell>
                                    <Table.HeaderCell>Location</Table.HeaderCell>
                                    <Table.HeaderCell>Score</Table.HeaderCell>
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
