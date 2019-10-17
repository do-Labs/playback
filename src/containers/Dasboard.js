import React, { Component } from 'react';
import {
    Grid,
    Container
} from "semantic-ui-react";
import {Logo, NavMenu} from "../components/index";

export default class Dasboard extends Component {
    state = {
        error: null,
        isLoading: true,
    };

    render() {
        return (
            <Container>
                <Logo />
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}