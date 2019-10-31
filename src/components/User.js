import React, {Component} from "react";
import firebase from "firebase";
import {Button, Header, Icon, Message, Modal, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default class User extends Component {
  state = {
    uid: this.props.user.id,
    isLoading: false,
    error: null,
    modalOpen: false,
    firstName: this.props.user.firstName,
    lastName: this.props.user.lastName,
    status: this.props.user.status,
    phoneNumber: this.props.user.phoneNumber,
    email: this.props.user.email,
    address: this.props.user.address,
    picture: this.props.user.picture,
    position: this.props.user.position,
    // businessRole: this.props.user.CustomClaims.BusinessRoles,
  };

  handleOpen = () => this.setState({modalOpen: true});
  handleClose = () => this.setState({modalOpen: false});
  handleDelete = () => {
    this.setState({
      isLoading: true,
    });
    // Get the id for the selected User and pass that to deleteUser()
    console.log("Delete USER CALLED FOR:", this.props.user.UID)
    // fetch(`/users/${this.props.user.UID}`, {
    //   method: "DELETE",
    //   headers: new Headers({
    //     Authorization: "Bearer " + this.props.token,
    //     "Content-Type": "application/json"
    //   })
    // })
        .then(()=> {
          this.setState({
            isLoading: false,
            modalOpen: false,
          }, () => {
            this.props.handleDelete(this.props.user.UID)
            //this.props.history.push("/users");
            //window.location.reload()
          });
          this.props.history.push("/users");
        });
  };

  handleDisable = () => {
    this.setState({
      isLoading: true,
    });
    // Get the id for the selected User and pass that to deleteUser()
    console.log("DISABLE USER CALLED FOR:", this.props.user.UID);
    fetch(`/users/${this.props.user.UID}`, {
      method: "DELETE",
      headers: new Headers({
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json"
      })
    })
        .then(()=> {
          this.setState({
            isLoading: false,
            modalOpen: false,
          }, () => {
            this.props.handleDisable(this.props.user.UID)
            //this.props.history.push("/users");
            //window.location.reload()
          });
          this.props.history.push("/users");
        });
  };


  resetUserPassword = () => {
    let auth = firebase.auth();
    const email = this.state.email;
    console.log("Resetting Email Password for:", email);
    // send user password reset email immediately upon creation

    auth.sendPasswordResetEmail(email).then(function() {
      // Email sent.
      console.log("Reset Email sent to User")
    }).catch(function(error) {
      // An error happened.
    });
    this.setState({
      isLoading: false,
      modalOpen: false,
    });
  };

  disableUser = () => {
    const uid = this.state.uid;
    firebase.auth().updateUser(uid, {
      disabled: true
    })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully updated user record", userRecord.toJSON());
        })
        .catch(function(error) {
          console.log("Error updating user record:", error);
        });
    this.setState({
      isLoading: false,
      modalOpen: false,
    });
  };

  render() {
    const {
      error,
      isLoading,
      uid,
      firstName,
      lastName,
      email,
      phoneNumber,
    } = this.state;

    return (
     <Table.Row>
       <Table.Cell>{email}</Table.Cell>
       <Table.Cell collapsing>
         <Button.Group icon>
           <Modal
            trigger={<Button icon="eye"/>}
            header={email}
            content={
              <div>
                <p>UID: {uid}</p>
                <p>FirstName: {firstName}</p>
                <p>LastName: {lastName}</p>
                <p>Phone#: {phoneNumber}</p>
                <Button
                    onClick={this.resetUserPassword}>Force Password Reset
                </Button>
                <Button onClick={this.handleDelete}>Delete User</Button>
              </div>
            }/>
           <Button icon="edit" as={Link} to={`/user/${this.state.uid}`}/>
           <Modal
            trigger={<Button icon="pause circle outline" onClick={this.handleOpen}/>}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            basic
            size="small">
             {error && <Message error content={error.message}/>}
             <Header color="red" icon="pause circle outline" content="Disable User"/>
             <Modal.Content>
               <h3>Do you really want to disable {email} ?</h3>
             </Modal.Content>
             <Modal.Actions>
               <Button basic color="red" inverted onClick={this.handleClose}>
                 <Icon name="remove"/>No
               </Button>
               <Button color="green" inverted onClick={this.handleDisable} loading={isLoading}>
                 <Icon name="checkmark"/>Yes
               </Button>
             </Modal.Actions>
           </Modal>
           {/*<Button icon="building" as={Link} to={`/business/${id}`}/>*/}
         </Button.Group>
       </Table.Cell>
     </Table.Row>
    );
  }
}
