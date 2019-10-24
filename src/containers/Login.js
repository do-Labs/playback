import React, { Component } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import Logo from "../components/Logo";
import { Redirect } from "react-router-dom";
import firebase from 'firebase';

class Login extends Component {
    state = {
        isLoading: false,
        email: "",
        password: "",
        authCode: "",
        user: {},
        results: "",
        showConfirmation: false,
        error: null
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    registerUser = async event => {
        console.log("registering new user");
        event.preventDefault();
        // try {
        //     this.setState({isLoading: true});
        //     console.log("Mock registered!!!")
        // }
        // catch (error) {
        //     this.setState({error, isLoading: false});
        // }
    };

    signInWithFirebase = async event => {
        console.log("signInWithFirebase");
        event.preventDefault();
        try {
            this.setState({isLoading: true});
            const user = await firebase.auth().signInWithEmailAndPassword(
                this.state.email,
                this.state.password
            );
            firebase.auth().currentUser.getIdTokenResult(true)
                .then(idToken => {
                    console.log("User Authenticated with Firebase");
                    this.setState({user, isLoading: false});
                    this.userAuthenticatesWithFirebase(user, idToken.token);
                    sessionStorage.setItem('auth', JSON.stringify({
                        token: idToken.token,
                        username: this.state.email,
                        refreshToken: user.user.refreshToken,
                    }));

                    if (idToken.claims.admin === true) {
                        console.log("User is an admin!");
                    }
                    else if (idToken.claims.businessID) {
                        console.log("Registered Business User Access!");
                        console.log(idToken.claims.businessID);
                    } else {
                        console.log("Guest Access");
                    }

                }).catch();
        }
        catch (error) {
            this.setState({error, isLoading: false});
        }
    };

    userAuthenticates = (user) => {
        console.log("userAuthenticates");
        this.props.userHasAuthenticated(
            true,
            user.signInUserSession.idToken.payload.name,
            user.signInUserSession.idToken.jwtToken
        );
    };

    userAuthenticatesWithFirebase = (user, token) => {
        console.log("userAuthenticatesWithFirebase");
        this.props.userHasAuthenticated(
            true,
            user.user.email,
            token,
        );
        // firebase.auth().signInWithCustomToken(token)
        //     .then( function() {
        //         console.log("Signed in with Custom Token");
        //     })
        //     .catch(function(error) {
        //         console.log("Error Signing in with customToken:", error);
        //     });

    };

    confirmSignIn = () => {
        console.log("confirmSignIn");
        this.setState({ isLoading: true });
        firebase.auth.confirmSignIn(this.state.user, this.state.authCode, this.state.user.challengeName)
            .then(user => {
                this.setState({ isLoading: false });
                this.userAuthenticates(user)
            })
            .catch(err => {
                console.error(err);
                this.setState({ error: err })
            })
    };

    render() {
        const { email, password, authCode, error, isLoading, showConfirmation } = this.state;

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
                            Login Page
                            <Logo />

                            {error && <Message error content={error.message} />}
                            <Form>
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
                                {showConfirmation && <Form.Field>
                                    <label>OTP confirmation code</label>
                                    <Form.Input
                                        name="authCode"
                                        placeholder="Auth code"
                                        value={authCode}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>}
                                {!showConfirmation && <Button fluid size="large" loading={isLoading} onClick={this.signInWithFirebase}>
                                    Login
                                </Button>}
                                {showConfirmation && <Button fluid size="large" loading={isLoading} onClick={this.confirmSignIn}>
                                    Confirm login
                                </Button>}
                            </Form>
                            <hr/>
                            <Button fluid size="large" loading={isLoading} href="/register">
                                Register
                            </Button>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Login;