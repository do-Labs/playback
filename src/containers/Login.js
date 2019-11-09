import React, { Component } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import Logo from "../components/Logo";
import { Redirect } from "react-router-dom";
import firebase from '../Firebase';

class Login extends Component {
    state = {
        isLoading: false,
        email: "",
        password: "",
        authCode: "",
        user: {},
        showConfirmation: false,
        error: null,
        message: null,
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    signInWithFirebase = async event => {
        console.log("signInWithFirebase");
        event.preventDefault();

        this.setState({isLoading: true});
        const user = await firebase.auth().signInWithEmailAndPassword(
            this.state.email,
            this.state.password
        ).catch((error)=> {
            console.log('error:', error);
            this.setState({
                error: error,
                isLoading: true
            })
        });
        if (user){
            await firebase.auth().currentUser.getIdTokenResult(true)
                .then(idTokenResult => {
                    console.log("User Authenticated with Firebase");
                    this.setState({user, isLoading: false});
                    this.userAuthenticatesWithFirebase(user, idTokenResult.token);
                    sessionStorage.setItem('auth', JSON.stringify({
                        token: idTokenResult.token,
                        username: this.state.email,
                        refreshToken: user.user.refreshToken,
                    }));
                    this.checkClaims(idTokenResult)

                }).catch((error)=> {
                    console.log("error at signInWithFirebase2", error);
                    this.setState({
                        isLoading: false,
                        error: error.code
                    })
                });
        }
        else{
            this.setState({
                isLoading: false,
            })
        }
        // try {
        //
        //
        // }
        // catch (error) {
        //     this.setState({error, isLoading: false});
        // }
    };

    checkClaims = (idToken) => {
        if (idToken.claims.admin === true) {
            console.log("User is an admin!");
        }
        else if (idToken.claims.businessID) {
            console.log("Registered Business User Access!");
            console.log(idToken.claims.businessID);
        } else {

            console.log("Guest Access");
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
    };

    confirmSignIn = () => {
        console.log("confirmSignIn");
        this.setState({ isLoading: true });
        firebase.auth.confirmSignIn(this.state.user, this.state.authCode, this.state.user.challengeName)
            .then(user => {
                this.setState({ isLoading: false });
                this.userAuthenticates(user);
                console.log("user")
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    error: err
                })
            })
    };



    handleResetPassword = () => {
        const email = this.state.email;
        console.log("email", email);
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            console.log("Sending reset email")
            this.setState({
                message: "Emailed Password Reset "
            })
        }).catch((error)=> {
            console.log('error:', error)
            this.setState({
                error: error
            })
        });

    };

    render() {
        const { message, error, email, password, authCode, isLoading, showConfirmation } = this.state;

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
                            <Logo />

                            <center><p>version {process.env.REACT_APP_VERSION}</p></center>
                            {error && <Message error content={error.code} />}
                            {message && <Message success >{message} </Message>}
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
                                {!showConfirmation && <Button
                                    disabled={
                                        (!email) ||
                                        (!password && password === "")
                                    }
                                        fluid size="large" loading={isLoading} onClick={this.signInWithFirebase}>
                                    Login
                                </Button>}
                                {showConfirmation && <Button fluid size="large" loading={isLoading} onClick={this.confirmSignIn}>
                                    Confirm login
                                </Button>}
                            </Form>
                            <hr/>
                            <Button
                                disabled={
                                    (!email)
                                }
                                    fluid size="large" loading={isLoading} onClick={this.handleResetPassword}>
                                Reset Password
                            </Button>
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