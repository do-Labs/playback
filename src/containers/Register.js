import React, { Component } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import Logo from "../components/Logo";
// import { Redirect } from "react-router-dom";
import firebase from '../Firebase';
import { browserHistory } from 'react-router';

const projectName = "playback-2a438";

class Register extends Component {
    state = {
        isLoading: false,
        email: "",
        password: "",
        confirmPassword: "",
        userType: "",
        user: {},
        showConfirmation: false,
        error: null
    };

    signInWithFirebase = async () => {
        console.log("signInWithFirebase");
        try {
            this.setState({isLoading: true});
            await firebase.auth().signInWithEmailAndPassword(
                this.state.email,
                this.state.password
            );
            await firebase.auth().currentUser.getIdTokenResult(true)
                .then(res => {
                    console.log("IDTOKEN1: ", res.token);
                    this.setState({
                        isLoading: false,
                        token: res.token
                    });
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
                .then( async () => {
                    browserHistory.push('/login');
                    console.log("Registered new user!");
                    // Get Token
                    await this.signInWithFirebase()
                        .then( async ()=> {
                            console.log("IDTOKEN2: ", this.state.token);
                            await this.handleEmailWelcome(this.state.token);
                        });
                    // Email Welcome to user
                    // this.handleEmailWelcome();
                    this.setState({
                        registered: true,
                        isLoading: false
                    });
                }, error => {
                    console.log("Error registering user");
                    this.setState({
                        error: error.message,
                        isLoading: false
                    });
                });
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

    render() {
        const {
            email,
            password,
            confirmPassword,
            // userType,
            error,
            registered,
            isLoading,
        } = this.state;

        return (
            <div style={{ height: "100%", paddingTop: "10%" }}>
                <Grid
                    textAlign="center"
                    style={{ height: "100%" }}
                    verticalAlign="middle"
                >
                    <Grid.Column textAlign="left" style={{ maxWidth: 450 }}>
                        <Segment>
                            Register Page
                            <Button style={{position: 'absolute', right: 0}} href="/login" ><i className="left chevron icon"> </i></Button>
                            <Logo />
                            {error &&  !registered && <Message error content={error.message}>{this.state.error}</Message>}
                            {registered && <Message success >Success!  Click back to login</Message> }
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

                                <Form.Field>
                                    <Form.Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>


                                {/*<select*/}
                                    {/*name="userType"*/}
                                    {/*value={userType}*/}
                                    {/*onChange={this.handleOnChange}*/}
                                {/*>*/}
                                    {/*<option placeholder="">User Type</option>*/}
                                    {/*<option value="admin">Admin</option>*/}
                                    {/*<option value="startup">Startup</option>*/}
                                    {/*<option value="general">General</option>*/}
                                {/*</select>*/}

                                <Button loading={isLoading}
                                        // onClick={this.registerUser}
                                        onClick={this.handleSignUp}
                                        disabled={
                                            !email || email === "" ||
                                            !password || password === "" ||
                                            !confirmPassword || confirmPassword === ""
                                        }
                                >Submit</Button>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )

    }
}

export default Register;