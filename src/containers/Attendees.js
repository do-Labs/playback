import React, {Component} from "react";
import {Attendee, NavMenu, Logo} from "../components/index";
import {
    Loader, Message, Table, Grid, Dimmer, Container
} from "semantic-ui-react";
import firebase from '../Firebase';
import CsvDownload from 'react-json-to-csv'

export default class Attendees extends Component {

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            attendees: [],
            businessID: this.props.businessID,
        };
    }

    onCollectionUpdate = async (querySnapshot) => {
        const attendees = [];
        await querySnapshot.forEach((doc) => {
            const {

                firstName,
                lastName,
                email,
                phoneNumber,
            } = doc.data();
            attendees.push({
                id: doc.id,
                firstName,
                lastName,
                email,
                phoneNumber,
            });
        });
        this.setState({
            attendees
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
            eventID: id,
        });

        const eventsRef = await firebase.firestore().collection("events");
        const attendeesRef = eventsRef.doc(id).collection("attendees");
        this.unsubscribe = await attendeesRef.onSnapshot(this.onCollectionUpdate);
        this.setState({isLoading: false});
    };

    getAttendees = async () => {
        this.setState({isLoading: true});
        const {
            eventID
        } = this.state;

        const eventsRef = firebase.firestore().collection("events");
        const attendeesRef = eventsRef.doc(eventID).collection("attendees");

        this.unsubscribe = await attendeesRef.onSnapshot(this.onCollectionUpdate);
        this.setState({isLoading: false});
    };

    render() {
        const cProps = {
            // onBusinessDeleted: this.getBusinessesList
        };

        const {
            error,
            isLoading,
            attendees,
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
                            Attendees
                            <CsvDownload style={{float: "right"}} data={attendees} />
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
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>PhoneNumber</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {attendees.map(attendee => (
                                    <Attendee
                                        key={Math.random()}
                                        attendee={attendee}
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
