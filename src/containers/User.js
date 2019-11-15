import React, {Component} from "react";
import firebase from 'firebase';
import {Button, Container, Dimmer, Form, Grid, Loader, Message} from "semantic-ui-react";
import {NavMenu, Logo} from "../components/index";
// const uuidv4 = require('uuid/v4');

export default class User extends Component {
    state = {
        error: null,
        message: null,
        isLoading: false,
        isHidden: true,
        isEnabled: true,
        editMode: false,

        userID: this.props.userID,
        // email: "",
        email: this.props.username,
        password: "",
        confirmPassword: "",
        userType: "",
        company: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        newRole: "",
        position: "",
        dateOfBirth: "",
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
                    console.log("Got doc", user);
                    this.setState({
                        key: doc.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        position: user.position,
                        dateOfBirth: user.dateOfBirth,
                        role: user.role,
                    });
                } else {
                    console.log("No such document!");
                }
            });
        }
        this.setState({isLoading: false});
    };

    handleOnChange = e => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    handleCreateUser = (event) => {
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
        const { email, firstName, lastName, phoneNumber, newRole, position, dateOfBirth  } = this.state;

        const userRef = await firebase.firestore().collection('users').doc(userID);
        await userRef.set({
            email,
            firstName,
            lastName,
            phoneNumber,
            position,
            role: newRole,
            dateOfBirth,
        }).then((docRef) => {
            alert("Profile Edited Successfully!");
            this.props.history.push("/")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };


    handleChangePassword = () => {
        this.setState({isLoading: true});
        const {
            password,
            confirmPassword
        } = this.state;
        console.log("TODO: Handling change password");
        if(confirmPassword === password) {
            firebase.auth().currentUser.updatePassword(password).then(()=>{
                this.setState({
                    message: {
                        message: "Updated password!"
                    }
                });

                console.log("Changed password");

            }).catch((err)=>{
                console.log("err:", err);
                this.setState({
                    error: {
                        message: err.code
                    }
                });
                console.log("Error changing password")
            });
        } else {
            this.setState({
                error: {
                    message: "Passwords do not match"
                }
            })
        }
        this.setState({isLoading: false})
    };

    render() {
        const {
            error,
            message,
            isLoading,
            isEnabled,
            editMode,
            password,
            confirmPassword,


            userID,
            email,
            role,
            newRole,

            firstName,
            lastName,
            phoneNumber,
            position,
            dateOfBirth,
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
                        {message && <Message success >Success! </Message>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}

                        <Form id="userForm">

                            {userID &&
                                <div className="ui segment">
                                    <h5>UserID: {userID}</h5>
                                    <h5>Email: {email}</h5>
                                    <h5>Registered Role: {role}</h5>
                                </div>
                            }

                            {!editMode &&
                                <div className="ui segment">
                                    <div className="ui container equal width">
                                        <Form.Field>
                                            <label><b>Email</b></label>
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
                                            <label><b>Password</b></label>
                                            <Form.Input
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={this.handleOnChange}
                                                error={!password || password === ""}
                                            />
                                        </Form.Field>

                                        <label><b>Role</b></label>
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
                                    <div className="equal width fields">
                                        <Grid>
                                            <Grid.Column width={8}>
                                                <label><b>First Name</b></label>
                                                <Form.Field>
                                                    <Form.Input
                                                        name="firstName"
                                                        value={firstName}
                                                        onChange={this.handleOnChange}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <label><b>Last Name</b></label>
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
                                                <label><b>Phone Number</b></label>
                                                <Form.Field>
                                                    <Form.Input
                                                        name="phoneNumber"
                                                        value={phoneNumber}
                                                        onChange={this.handleOnChange}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <label><b>Business Position</b></label>
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
                                            <Grid.Column width={8}>
                                                <label><b>Date of Birth</b></label>
                                                <Form.Field>
                                                    <Form.Input
                                                        name="dateOfBirth"
                                                        value={dateOfBirth}
                                                        placeholder="MM/DD/YYYY"
                                                        onChange={this.handleOnChange}
                                                    />
                                                </Form.Field>
                                                <Form.Field>
                                                    <label>Select New Role</label>
                                                    <select
                                                        name="newRole"
                                                        value={newRole}
                                                        onChange={this.handleOnChange}
                                                    >
                                                        <option value="">-</option>
                                                        <option value="audience">Audience</option>
                                                        <option value="corporateExec">Corporate Exec</option>
                                                        <option value="investor">Investor</option>
                                                        <option value="entrepreneur">Entrepreneur</option>
                                                        <option value="student">Student</option>
                                                    </select>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid>
                                    </div>
                                    <div className="equal width fields">
                                        <Form.Field>
                                            <label>New Password</label>
                                            <Form.Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={password}
                                                onChange={this.handleOnChange}
                                                error={!password || password === ""}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Confirm Password</label>
                                            <Form.Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={this.handleOnChange}
                                                error={!confirmPassword || confirmPassword === ""}
                                            />
                                        </Form.Field>
                                    </div>
                                    <Button
                                        disabled={
                                            (!password && password === "") ||
                                            (!confirmPassword && confirmPassword === "")
                                        }
                                        onClick={this.handleChangePassword}
                                    >
                                        Change Password
                                    </Button>
                                </div>
                            }

                            {!editMode &&
                                <Button
                                    onClick={this.handleCreateUser}
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
                </Grid>

            </Container>
        );
    }
}
