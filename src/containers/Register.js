import React, { Component } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import Logo from "../components/Logo";
// import { Redirect } from "react-router-dom";
import firebase from '../Firebase';
import { browserHistory } from 'react-router';

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

    handleSignUp = (event) => {
        event.preventDefault();
        const { confirmPassword, email, password } = this.state;
        if (email && password === confirmPassword) {
            this.setState({ isLoading: true });
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    browserHistory.push('/login');
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

    handleChange = (e, { name, value }) => this.setState({ [name]: value });


    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
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
                            {error && <Message error content={error.message}>Error Registering User</Message>}
                            {registered && <Message success >Success!</Message> }
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