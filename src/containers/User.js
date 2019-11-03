import React, {Component} from "react";
import firebase from 'firebase';
import {Button, Container, Dimmer, Form, Grid, Loader, Message} from "semantic-ui-react";
import {NavMenu, Logo} from "../components/index";
// const uuidv4 = require('uuid/v4');

export default class User extends Component {
    state = {
        error: null,
        isLoading: false,
        isHidden: true,

        userID: "",

        email: this.props.username,
        password: "",
        confirmPassword: "",
        userType: "",
        role: "",
        company: "",

        isEnabled: true,
        editMode: false,
    };

    componentDidMount = () => {
        this.setState({isLoading: true});
        // const userID = this.props.match.params.userID;
        const pathname = this.props.location.pathname;
        const userID = pathname.split('/user/')[1];
        if(userID){
            const userRef = firebase.firestore().collection('users').doc(userID);
            this.setState({
                editMode: true,
            });
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const user = doc.data();
                    this.setState({
                        key: doc.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        position: user.position,

                    });
                } else {
                    console.log("No such document!");
                }
            });


        }

        this.setState({
            isLoading: false,
        });
    };

    handleOnChange = e => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    submitCreate = (e) => {
        console.log("Submitting Created User");
        // const {
        //     email,
        //     password,
        //     confirmPassword,
        //     userType,
        //     role,
        //     company,
        // } = this.state;

        this.handleSignUp(e);

        // POST User to back end


        // this.verifyUserEmail(this.state.email);
        // this.resetUserPassword(this.state.email);
    };

    handleSignUp = (event) => {
        console.log("Handling Signup:", event);
        event.preventDefault();
        const { confirmPassword, email, password } = this.state;
        if (email && password === confirmPassword) {
            this.setState({ isLoading: true });
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {

                    console.log("Registered new user!");
                    this.setState({
                        registered: true,
                        isLoading: false
                    });
                }, error => {
                    console.log("Error registering user");
                    this.setState({ error: error.message, isLoading: false });
                });
        }
        else {
            this.setState({ error: "Passwords do not match" });
        }
    };

    handleEdit = async (event) => {
        event.preventDefault();
        const userID = this.props.userID;
        console.log("userID: " , userID);
        const { email, firstName, lastName, phoneNumber, position  } = this.state;

        const userRef = await firebase.firestore().collection('users').doc(userID);
        await userRef.set({
            email,
            firstName,
            lastName,
            phoneNumber,
            position,
        }).then((docRef) => {
            alert("Profile Edited Successfully!");
            this.props.history.push("/")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    verifyUserEmail = () => {
        const email = this.state.email;
        const password = this.state.password;
        console.log("Email:", email, "Password:", password);
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                userCredentials.user.sendEmailVerification()
                    .then(() => {
                        console.log("successfully sent email")
                    })
                    .catch();
            })
            .catch();
    };

    disableUser = () => {
        firebase.auth().updateUser(this.props.user.id, {
            disabled: true
        })
            .then(function () {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully disabled user");
            })
            .catch(function (error) {
                console.log("Error updating user record:", error);
            });

    };

    render() {
        const {
            error,
            isLoading,
            isEnabled,
            editMode,

            userId,
            email,
            password,
            role,

            firstName,
            lastName,
            phoneNumber,
            position,
        } = this.state;

        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {!editMode && <h2>Create User</h2>}
                        {editMode && <h2>Edit Profile</h2>}
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}

                        <Form id="userForm">

                            {userId &&
                                <div className="ui segment">
                                    <h5>UserID: {userId}</h5>
                                </div>
                            }

                            {!editMode &&
                                <div className="ui segment">
                                    <div className="ui container equal width">
                                        <Form.Field>
                                            <label>Email</label>
                                            <Form.Input
                                                id="email"
                                                name="email"
                                                placeholder="Email Address"
                                                value={email}
                                                onChange={this.handleOnChange}
                                                error={!email || email === ""}
                                            />
                                        </Form.Field>

                                        <Form.Field>
                                            <label>Password</label>
                                            <Form.Input
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={this.handleOnChange}
                                                error={!password || password === ""}
                                            />
                                        </Form.Field>

                                        <label>Role</label>
                                        <select
                                            name="role"
                                            value={role}
                                            onChange={this.handleOnChange}
                                        >
                                            <option value="">Select User Role</option>
                                            <option value="User">User</option>
                                            <option value="Investor">Investor</option>
                                            <option value="Guest">Guest</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            }

                            {editMode &&
                                <div className="ui segment">
                                    <div className="ui container equal width padded">
                                        <h4>{email}</h4>

                                    </div>
                                    <div className="equal width fields">
                                        <Grid>
                                            <Grid.Column width={8}>
                                                <label>First Name</label>
                                                <Form.Field>
                                                    <Form.Input
                                                        name="firstName"
                                                        value={firstName}
                                                        onChange={this.handleOnChange}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <label>Last Name</label>
                                                <Form.Field>
                                                    <Form.Input
                                                        name="lastName"
                                                        value={lastName}
                                                        onChange={this.handleOnChange}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid>
                                    </div>

                                    <div className="equal width fields">
                                        <Grid>
                                            <Grid.Column width={8}>
                                                <label>Phone Number</label>
                                                <Form.Field>
                                                    <Form.Input
                                                        name="phoneNumber"
                                                        value={phoneNumber}
                                                        onChange={this.handleOnChange}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <label>Business Position</label>
                                                <select
                                                    name="position"
                                                    value={position}
                                                    onChange={this.handleOnChange}
                                                >
                                                    <option value=""> </option>
                                                    <option value="CEO">CEO</option>
                                                    <option value="CFO">CFO</option>
                                                    <option value="COO">COO</option>
                                                    <option value="CTO">CTO</option>
                                                    <option value="BoardMember">Board Member</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </Grid.Column>
                                        </Grid>
                                    </div>
                                </div>
                            }

                            {!editMode &&
                                <Button
                                    onClick={this.handleSignUp}
                                    loading={isLoading}
                                    disabled={
                                        (!isEnabled) ||
                                        (!email && email === "") ||
                                        (!role && role === "")
                                    }
                                >
                                    Submit
                                </Button>
                            }
                            {editMode &&
                            <Button
                                onClick={this.handleEdit}
                                loading={isLoading}
                                disabled={
                                    (!isEnabled) ||
                                    (!firstName && firstName === "") ||
                                    (!lastName && lastName === "") ||
                                    (!phoneNumber && phoneNumber === "") ||
                                    (!position && position === "")
                                }
                            >
                                Submit
                            </Button>
                            }
                        </Form>
                    </Grid.Column>

                    <Button onClick={this.verifyUserEmail}>VerifyUserEmail</Button>

                </Grid>

            </Container>
        );
    }
}
