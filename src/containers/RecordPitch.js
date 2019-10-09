import React, { Component } from 'react';
import {
    Grid,
    Container
} from "semantic-ui-react";
import {Logo, NavMenu} from "../components/index";



export default class RecordPitch extends Component {
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
                        <h2>Record Pitch</h2>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }


}