import React, { Component } from 'react';
import {
    Button,
    Container,
    Icon,
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
                <br/>
                <br/>
                <Logo />
                <div>
                    <center>
                        <h1>Thank You for your feedback!!</h1>
                        <p>Let us know if you have any comments<br/> about the <b>Playback App</b></p>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div><a href="https://playback.herokuapp.com/register"><Icon name="signup large"/>Sign Up</a></div>
                        <br/>
                        <div><a href="https://playback.dolabs.io"><Icon name="info large"/>Learn More</a></div>
                        <br/>
                        <div><a href="mailto:humdan@dolabs.io"><Icon name="chat large"/>Contact Us</a></div>
                    </center>
                </div>
            </Container>
        );
    }
}