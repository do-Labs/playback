import React, {Component} from "react";
import {Dropdown} from "semantic-ui-react";
import {Link} from "react-router-dom";
import firebase from "../Firebase";

export default class Pitch extends Component {
    constructor() {
        super();

        this.refPitches = firebase.firestore().collection('pitches');
        this.unsubscribe = null;
        this.state = {
            error: null,
            pitches: [],
            pid: ""
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        this.getPitchList(querySnapshot);
    };

    componentDidMount = () => {
        this.setState({ isLoading: true });
        this.unsubscribe = this.refPitches.onSnapshot(this.onCollectionUpdate);
        this.setState({ isLoading: false });
    };

    // Dev Only function
    getPitchList = (querySnapshot) => {
        const pitches = [];
        querySnapshot.forEach((doc) => {
            const {
                nickname,
                company,
                dateOfPitch,
                presenterName,
            } = doc.data();
            pitches.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                nickname,
                company,
                dateOfPitch,
                presenterName,
            });
            console.log("Pitches: ", doc.id)
        });
        this.setState({
            pitches
        });
        console.log("pitches: ", this.state.pitches)
    };

    handleChangePitch = (e, {name, value}, i) => {
        const pitches = this.state.pitches;

        console.log('NAME: ', name);
        console.log('Value: ', value);

        this.setState({
            pid: value,
        });
    };


    render() {

        const {
            pitches,
            error,
        } = this.state;

        if(pitches){
            return (
                <Dropdown
                    name="pid"
                    placeholder="Select a pitch to rate (devOnly)"
                    fluid
                    search
                    selection
                    options={pitches.map(pitch => ({
                        key: pitch.id,
                        text: pitch.nickname,
                        value: pitch.id,
                    }))}
                    onChange={this.handleChangePitch}
                />
            );
        }
        else {
            return (
                <Dropdown
                    name="pid"
                    placeholder="Error getting pitches"
                    fluid
                    search
                    selection
                />
            );
        }


    }
}
