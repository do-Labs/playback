import React, {Component} from "react";
import {
    Event,
    Logo,
    NavMenu,
} from "../components/index";
import {Button, Container, Dimmer, Grid, Icon, Loader, Message, Table} from "semantic-ui-react";
import firebase from '../Firebase';
import {Link} from "react-router-dom";


export default class MyEvents extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('events');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            events: [],
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
            await this.getMyEvents();
        }

        this.setState({isLoading: false});
    };

    onEventsCollectionUpdate = async (querySnapshot) => {
        const events = [];
        await querySnapshot.forEach((doc) => {
            const {
                eventTitle,
                eventDate,
                company,
                location,
                presenterName,
                eventInfoEmail,
                url,
            } = doc.data();
            events.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                eventTitle,
                eventDate,
                company,
                location,
                presenterName,
                eventInfoEmail,
                url,
            });
        });
        this.setState({
            events
        });
    };

    handleDelete = async (id) => {
        this.setState({events: this.state.events.filter(event => event.id !== id)});
        await this.ref.doc(id).delete()
            .catch((error) => {
            console.error("Error removing document: ", error);
        });
    };

    getMyEvents = async () => {
        const myEventsRef = firebase.firestore().collection("events");
        const events = await myEventsRef.where("businessID", "==", this.props.businessID);
        console.log('events:', events);
        this.unsubscribe = await events.onSnapshot(this.onEventsCollectionUpdate);
    };


    render() {

        const {
            error,
            isLoading,
            events
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
                            My Events
                            <Button secondary animated='fade' as={Link} to="/event" style={{float: "right"}}>
                                <Button.Content visible>Add Event</Button.Content>
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
                                    <Table.HeaderCell>Location</Table.HeaderCell>
                                    <Table.HeaderCell>Score</Table.HeaderCell>
                                    <Table.HeaderCell>Count</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {events.map(event => (
                                    <Event
                                        key={Math.random()}
                                        event={event}
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
