import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import firebase from "firebase";
const uuid = require('uuid/v4');


export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            url: '',
            progress: null,
            testContent: "TESTTT FROM CHILD"
        };
        this.handleChange = this
            .handleChange
            .bind(this);
        if(props.handleUpload){
            props.handleUpload(this.handleUpload.bind(this));
        }
    }

    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({image}));
        }
    };


    handleUpload = async () => {
        this.setState({isLoading: true});
        const storage = firebase.storage();
        let fileName = uuid();
        const {image} = this.state;
        const uploadTask = storage.ref(`pitchdecks/`+ fileName).put(image);
        await uploadTask.on('state_changed',
            (snapshot) => {
                // progress function ....
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({progress});
            },
            (error) => {
                console.log(error);
            },
            async () => {
                await storage.ref('pitchdecks').child(fileName).getDownloadURL().then(url => {
                    console.log(url);
                    this.setState({url});
                    this.props.url(url);
                })
            });
        this.setState({isLoading: false});
    };

    render() {
        const style = {
            height: '10vh',
            width: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            image: ''
        };

        const {
            progress
        } = this.state;

        return (


            <div className="ui container">
                <div
                    style={style}>
                    <input
                        type="file" onChange={this.handleChange} />
                    {progress &&
                        <progress value={this.state.progress} max="100"/>
                    }
                    <Button
                        onClick={this.handleUpload}
                    >Upload</Button>
                </div>
            </div>
        )
    }
}

