import React, {Component} from "react";
import {Button, Header, Icon, Message, Modal, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import firebase from "../Firebase";

export default class Business extends Component {
    state = {
        id: this.props.business.id,
        name: this.props.business.name,
        industry: this.props.business.industry,
        stage: this.props.business.stage,
        corpType: this.props.business.corpType,
        webpageUrl: this.props.business.webpageUrl,
        fundingRound: this.props.business.fundingRound,
        numberOfEmployees: this.props.business.numberOfEmployees,

        isLoading: false,
        error: null,
        modalOpen: false
    };

    handleOpen = () => this.setState({modalOpen: true});
    handleClose = () => this.setState({modalOpen: false});
    handleDelete = (e) => {
        e.preventDefault();
        const {id} = this.state;
        this.setState({
            isLoading: true,
        });
        console.log("DELETEBUSINESS CALLED");

        firebase.firestore().collection('businesses').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            this.props.history.push("/businesses")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        this.setState({
            isLoading: false,
        });
    };

    render() {

        const {
            id,
            name,
            industry,
            stage,
            corpType,
            webpageUrl,
            fundingRound,
            numberOfEmployees,
            error,
            isLoading
        } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{industry}</Table.Cell>
                <Table.Cell>{stage}</Table.Cell>
                <Table.Cell collapsing>
                    <Button.Group icon>
                        <Modal
                            trigger={<Button icon="eye"/>}
                            header={name}
                            content={
                                <div>
                                    <p>Id: {id}</p>
                                    <p>Stage: {stage}</p>
                                    <p>Industry: {industry}</p>
                                    <p>CorpType: {corpType}</p>
                                    <p>WebpageUrl: {webpageUrl}</p>
                                    <p>Funding Round: {fundingRound}</p>
                                    <p>Number of Employees: {numberOfEmployees}</p>
                                </div>
                            }/>
                        <Button icon="edit" as={Link} to={`/business/${this.props.business.id}`}/>
                        <Button icon="user" as={Link} to={`/users/${id}`}/>
                        <Button icon="target" as={Link} to={`/pitches/${this.props.business.id}`}/>
                        <Modal
                            trigger={<Button icon="delete" onClick={this.handleOpen}/>}
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            basic
                            size="small">
                            {error && <Message error content={error.message}/>}
                            <Header color="red" icon="delete" content="Delete"/>
                            <Modal.Content>
                                <h3>Do you really want to delete {name} ?</h3>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button basic color="red" inverted onClick={this.handleClose}>
                                    <Icon name="remove"/>No
                                </Button>
                                <Button color="green" inverted onClick={this.handleDelete} loading={isLoading}>
                                    <Icon name="checkmark"/>Yes
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
