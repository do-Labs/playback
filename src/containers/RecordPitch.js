import React, { Component } from 'react';
import {
    Grid,
    Container
} from "semantic-ui-react";
import {Logo, NavMenu} from "../components/index";
// import ZiggeoRecorder from 'react-ziggeo'
import { ZiggeoRecorder } from 'react-ziggeo';
const ziggeoAPIKey = "47a5c78a5b0a1dcf28ba33ca0bd6ee46";
const ziggeoVideoToken = "";

export default class RecordPitch extends Component {
    state = {
        error: null,
        isLoading: true,
    };

    recorderRecording = (embedding /* only starting from react-ziggeo 3.3.0 */) => {
        console.log('Recorder onRecording', embedding.video);
    };

    recorderUploading = (embedding /* only starting from react-ziggeo 3.3.0 */) => {
        console.log('Recorder uploading', embedding.video);
    };

    playing = (embedding /* only starting from react-ziggeo 3.3.0 */) => {
        console.log('it\'s playing, your action here');
    };

    paused = (embedding /* only starting from react-ziggeo 3.3.0 */) => {
        console.log('it\'s paused, your action when pause');
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
                        <ZiggeoRecorder
                            apiKey={ziggeoAPIKey}
                            video={ziggeoVideoToken}
                            height={400}
                            width={800}
                            preventReRenderOnUpdate={false}
                            onRecording={this.recorderRecording}
                            onUploading={this.recorderUploading}
                        />
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }


}