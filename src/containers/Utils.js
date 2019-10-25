import React, { Component } from 'react';
import {
    Grid,
    Container, Button, Form
} from "semantic-ui-react";
import {Logo, NavMenu} from "../components/index";

const projectName = "playback-2a438";

export default class Utils extends Component {
    state = {
        error: null,
        isLoading: true,
        email: "humdan@dolabs.io",
        content: "0000"
    };


    handleGetToken = () => {

        console.log("token:");
        console.log(this.props.token)
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleEmailWelcome = () => {
        const body  = JSON.stringify({
            to: this.state.email,
        });

        fetch(`https://us-central1-${projectName}.cloudfunctions.net/EmailWelcome`, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + this.props.token,
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

    handleEmailQR = () => {
        const body  = JSON.stringify({
            to: this.state.email,
            content: this.state.content
        });
        console.log("BODY: ", body);

        fetch(`https://us-central1-${projectName}.cloudfunctions.net/EmailQRCode`, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + this.props.token,
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
            content,
        } = this.state;

        return (
            <Container>
                <Logo />
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Button onClick={this.handleGetToken}>GetToken</Button>
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
                        </Form>
                        <Form>
                            <Form.Field>
                                <label>Content</label>
                                <Form.Input
                                    name="content"
                                    placeholder="QR content"
                                    value={content}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                        <Button onClick={this.handleEmailWelcome}>EmailWelcome</Button>
                        <Button onClick={this.handleEmailQR}>EmailQR</Button>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}