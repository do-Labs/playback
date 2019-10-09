import React, {Component} from "react";
import {Button, Header, Icon, Message, Modal, Table} from "semantic-ui-react";

export default class Startup extends Component {
    state = {
        id: this.props.startup.id,
        name: this.props.startup.name,
        industry: this.props.startup.industry,
        type: this.props.startup.type,
        stage: this.props.startup.stage,
        location: this.props.startup.location,

        isLoading: false,
        error: null,
        modalOpen: false
    };

    handleOpen = () => this.setState({modalOpen: true});
    handleClose = () => this.setState({modalOpen: false});

    render() {

        const {
            id,
            name,
            industry,
            type,
            stage,
            location,
            error,
            isLoading
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{industry}</Table.Cell>
                <Table.Cell>{type}</Table.Cell>
                <Table.Cell>{stage}</Table.Cell>
                <Table.Cell>{location}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={name}
                            content={
                                <div>
                                    <p>Id: {id}</p>
                                    <p>Name: {name}</p>
                                    <p>Industry: {industry}</p>
                                    <p>Type: {type}</p>
                                    <p>Stage: {stage}</p>
                                    <p>Location: {location}</p>
                                </div>
                            }/>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
