import React, { Component } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import Logo from "../components/Logo";
import { Redirect } from "react-router-dom";
import firebase from '../Firebase';
import jwtDecode from "jwt-decode";

const projectName = "playback-2a438";

class Register extends Component {
    state = {
        isLoading: false,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        user: {},
        showConfirmation: false,
        error: null
    };

    signInWithFirebase = async () => {
        try {
            this.setState({isLoading: true});
            const user = await firebase.auth().signInWithEmailAndPassword(
                this.state.email,
                this.state.password
            );
            await firebase.auth().currentUser.getIdTokenResult(true)
                .then(res => {
                    this.setState({
                        isLoading: false,
                        token: res.token
                    });
                    this.userAuthenticatesWithFirebase(user, res.token);
                    sessionStorage.setItem('auth', JSON.stringify({
                        token: res.token,
                        username: this.state.email,
                        refreshToken: user.user.refreshToken,
                    }));
                    return res.token;
                }).catch();
        }
        catch (error) {
            this.setState({error, isLoading: false});
        }
    };

    handleSignUp = async (event) => {
        event.preventDefault();
        const { confirmPassword, email, password } = this.state;
        if (email && password === confirmPassword) {
            this.setState({ isLoading: true });
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then( async (response) => {
                    const uid = response.user.uid;
                    // Get Token
                    await this.signInWithFirebase()
                        .then( async ()=> {
                            // Email Welcome to user
                            await this.handleEmailWelcome(this.state.token);
                            // post user to /users
                            console.log("User created: ", uid);
                            await this.handleAddUser(uid);
                            this.setState({
                                email: "",
                                password: "",
                                confirmPassword: "",
                            });

                        }).catch((err)=>{
                            console.log("Error emailing user", err)
                        });
                    this.setState({
                        registered: true,
                        isLoading: false,
                    });
                }, error => {
                    console.log("Error registering user");
                    this.setState({
                        error: error.message,
                        isLoading: false
                    });
                })
        }
        else {
            this.setState({ error: "Passwords do not match" });
        }
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });


    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    handleEmailWelcome = (token) => {
        const body  = JSON.stringify({
            to: this.state.email,
        });

        fetch(`https://us-central1-${projectName}.cloudfunctions.net/EmailWelcome`, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                'cache-control': 'no-cache',
            }),
            body
        })
            .then( (res)=> {
                console.log("Emailed user");
                console.log("RESPONSE: ", res)
            }).catch( (err)=> {
            alert("Error sending Email");
            console.log("Error Emailing User: ", err)
        })
    };

    handleAddUser = async (userID) => {
        const {
            firstName,
            lastName,
            email,
            role,
        } = this.state;

        const usersRef = await firebase.firestore().collection('users').doc(userID);

        usersRef.set({
            firstName,
            lastName,
            email,
            role,
        }).then((docRef)=> {
            console.log("Added User:", docRef);
        })
    };

    handleSignIn = async () => {
        try {
            this.setState({isLoading: true});
            const user = await firebase.auth().signInWithEmailAndPassword(
                this.state.email,
                this.state.password
            );
            firebase.auth().currentUser.getIdTokenResult(true)
                .then(idTokenResult => {
                    console.log("User Authenticated with Firebase");
                    this.setState({user, isLoading: false});
                    this.userAuthenticatesWithFirebase(user, idTokenResult.token);
                    sessionStorage.setItem('auth', JSON.stringify({
                        token: idTokenResult.token,
                        username: this.state.email,
                        refreshToken: user.user.refreshToken,
                    }));

                }).catch();
        }
        catch (error) {
            this.setState({error, isLoading: false});
        }
    };

    userAuthenticatesWithFirebase = (user, token) => {
        console.log("userAuthenticatesWithFirebase");
        const decoded = jwtDecode(token);
        const userID = decoded.user_id;
        this.props.userHasAuthenticated(
            true,
            user.user.email,
            token,
            userID,
        );
    };

    render() {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
            error,
            registered,
            isLoading,
        } = this.state;

        return this.props.isAuthenticated ? (
            <Redirect to="/" />
        ) : (
            <div style={{ height: "100%", paddingTop: "10%" }}>
                <Grid
                    textAlign="center"
                    style={{ height: "100%" }}
                    verticalAlign="middle"
                >
                    <Grid.Column textAlign="left" style={{ maxWidth: 450 }}>
                        <Segment>
                            <Button style={{position: 'absolute', right: 0}} href="/login" ><i className="left chevron icon"> </i></Button>
                            <Logo />
                            {error &&  !registered && <Message error content={error.message}>{this.state.error}</Message>}
                            {registered && <Message success >Success!  Click back to login</Message> }
                            <Form>
                                <div className="equal width fields">
                                    <Form.Field>
                                        <label>First Name</label>
                                        <Form.Input
                                            name="firstName"
                                            placeholder="FirstName"
                                            value={firstName}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Last Name</label>
                                        <Form.Input
                                            name="lastName"
                                            placeholder="lastName"
                                            value={lastName}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Field>
                                </div>
                                <div>
                                    <Form.Field>
                                        <label>Select a Role</label>
                                        <select
                                            name="role"
                                            value={role}
                                            onChange={this.handleOnChange}
                                        >
                                            <option value=""> </option>
                                            <option value="audience">Audience</option>
                                            <option value="corporateExec">Corporate Exec</option>
                                            <option value="investor">Investor</option>
                                            <option value="entrepreneur">Entrepreneur</option>
                                            <option value="student">Student</option>
                                        </select>
                                    </Form.Field>
                                </div>
                                <Form.Field>
                                    <label>Email</label>
                                    <Form.Input
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Password</label>
                                    <Form.Input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <Form.Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                            </Form>
                        </Segment>
                        <Button loading={isLoading}
                                onClick={this.handleSignUp}
                                disabled={
                                    !email || email === "" ||
                                    !password || password === "" ||
                                    !role || role === "" ||
                                    !confirmPassword || confirmPassword === ""
                                }
                        >Submit</Button>
                    </Grid.Column>
                </Grid>
            </div>
        )

    }
}

export default Register;