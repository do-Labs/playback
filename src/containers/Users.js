import React, {Component} from "react";
import {Button, Container, Icon, Grid, Table, Message, Dimmer, Loader} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {User, NavMenu, Logo} from "../components/index";
import firebase from "../Firebase";

export default class Users extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            users: []
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
            const {
                firstName,
                lastName,
                email,
                role,

            } = doc.data();
            users.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                firstName,
                lastName,
                email,
                role

            });
            console.log("BID: ", doc.id)
        });
        this.setState({
            users
        });
    };

    componentDidMount = () => {
        this.setState({ isLoading: true });
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
        this.setState({ isLoading: false });
    };
  handleDelete = (uid) => {
    this.setState({users: this.state.users.filter(user => user.UID !== uid)})
  };

  handleDisable = (uid) => {
      this.setState({users: this.state.users.filter(user => user.UID !== uid)})
  };

  render() {
    const {error, isLoading, users} = this.state;

    return (
     <Container>
       <Logo/>
       <Grid>
         <Grid.Column width={4}>
           <NavMenu {...this.props} />
         </Grid.Column>
         <Grid.Column width={12}>
           <h2>
             Users List
             <Button secondary animated='fade' as={Link} to="/user" style={{float: "right"}}>
               <Button.Content visible>Add User</Button.Content>
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
                 <Table.HeaderCell>Email</Table.HeaderCell>
                 <Table.HeaderCell>Status</Table.HeaderCell>
                 <Table.HeaderCell>Action</Table.HeaderCell>
               </Table.Row>
             </Table.Header>
             <Table.Body>
               {users.map(user => (
                <User
                    key={Math.random()}
                    user={user}
                    {...this.props}
                    handleDisable={this.handleDisable}
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
