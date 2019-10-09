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

        userId: "",

        email: "",
        password: "playback2020",
        confirmPassword: "playback2020",
        userType: "",
        role: "",
        company: "",

        isEnabled: true,
    };

    componentDidMount = () => {
        this.setState({isLoading: true});
        // const userId = this.props.match.params.id;

        // Get Businesses List
        // getBusinessesList(this.props)
        //     .then(businessesList => {
        //         this.setState({
        //             isLoading: false,
        //             businessesList: businessesList
        //         });
        //     })
        //     .catch(error => {
        //         this.setState({
        //             isLoading: false,
        //             error
        //         });
        //     });


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

    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            // isEnabled: false,
            isLoading: true,
        });
        this.submitCreate();
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

            userId,
            email,
            role,
            // company,
        } = this.state;

        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <h2>Create User</h2>
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}

                        <Form id="userForm" onSubmit={this.handleSignUp}>

                            {userId &&
                            <div className="ui segment">
                                <h5>UserID: {userId}</h5>
                            </div>
                            }

                            <div className="ui segment">
                                <div className="ui container equal width fields">
                                    <Form.Field>
                                        <Form.Input
                                            id="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={this.handleOnChange}
                                            error={!email || email === ""}
                                        />
                                    </Form.Field>
                                </div>

                                <div className="ui container equal width fields">
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



                            <Form.Button
                                loading={isLoading}
                                disabled={
                                    (!isEnabled) ||
                                    (!email && email === "") ||
                                    (!role && role === "")
                                }
                            >
                                Submit
                            </Form.Button>
                        </Form>
                    </Grid.Column>

                    <Button onClick={this.verifyUserEmail}>VerifyUserEmail</Button>

                </Grid>

            </Container>
        );
    }
}
