import React, { Component } from 'react';
import {
    Grid,
    Container
} from "semantic-ui-react";
import {Logo, NavMenu, Upload} from "../components/index";



export default class RecordPitch extends Component {
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoading: true,
            data: "Default parent state"
        };
        this.setUrl = this.setUrl.bind(this)
    }

    setUrl = (dataFromChild) => {
        this.setState({
            data: dataFromChild
        });
    };


    render() {
        const {
            data,
        } = this.state;
        return (
            <Container>
                <Logo />
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <h2>Record Pitch</h2>
                        <h2>Upload Pitch</h2>
                        <p>{data}</p>
                        <Upload
                            url={this.setUrl}
                        />
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }


}