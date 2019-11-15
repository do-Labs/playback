import React, { Component } from 'react';
import {
    Container
} from "semantic-ui-react";
import {Logo} from "../components/index";

export default class ThankYou extends Component {
    state = {
        error: null,
        isLoading: true,
    };

    render() {
        return (
            <Container>
                <Logo />
                <h1>Thank You for your feedback!!</h1>
                <p>Let us know if you have any comments about the Playback App</p>
                <a href="https://playback.herokuapp.com/register">Sign Up</a>
                <br/>
                <a href="https://playback.dolabs.io">Learn More</a>
                <br/>
                <a href="mailto:humdan@dolabs.io">Contact Us</a>
            </Container>
        );
    }
}