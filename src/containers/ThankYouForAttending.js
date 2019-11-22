import React, { Component } from 'react';
import {
    Container,
    Icon,
} from "semantic-ui-react";
import {Logo} from "../components/index";

export default class ThankYouForAttending extends Component {
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
                        <h1>Thank You for Attending!!</h1>
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