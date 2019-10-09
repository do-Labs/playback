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
            </Container>
        );
    }
}