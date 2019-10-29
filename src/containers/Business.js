import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message} from "semantic-ui-react";
import {Logo, NavMenu} from "../components/index";
import firebase from '../Firebase';

const projectName = "playback-2a438";

export default class Business extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('businesses');
        this.state = {
            error: null,
            isLoading: false,
            editMode: false,
            isEnabled: true,

            name: "",
            type: "",
            stage: "",
            numberOfEmployees: "",
            corpType: "",
            webpageUrl: "",
            fundingRound: "",
        };
    }

    componentDidMount = () => {
        const businessId = this.props.match.params.id;

        if (businessId) { // EDIT MODE
            this.setState({
                isLoading: true,
                editMode: true,
            });
            console.log("Editing BusinessId: " + businessId);
            // First Get business by Id and populate state data with results
            const ref = firebase.firestore().collection('businesses').doc(businessId);
            ref.get().then((doc) => {
                if (doc.exists) {
                    const business = doc.data();
                    this.setState({
                        key: doc.id,
                        name: business.name,
                        type: business.type,
                        stage: business.stage,
                        numberOfEmployees: business.numberOfEmployees,
                        corpType: business.corpType,
                        webpageUrl: business.webpageUrl,
                        fundingRound: business.fundingRound,
                    });
                } else {
                    console.log("No such document!");
                }
            });
            //  );

            this.setState({
                isLoading: false,
            });
        } // End EditMode
        else {
            // Setup initial conditions upon Create Here:
        }
    };

    handleOnChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    handleSelectChange = (e, {name, value}) => {
        this.setState({[name]: value});
    };

    submitCreate = () => {
        const {
            name,
            type,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        } = this.state;

        // post all business info to firebase

        this.ref.add({
            name,
            type,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        }).then( async (docRef) => {
            const bid = docRef._key.path.segments[1];
            await this.handleAddBusinessClaims(bid);

            this.props.history.push("/")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    submitEdit = () => {
        const {
            name,
            type,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        } = this.state;

        const businessId = this.props.match.params.id;

        const busRef = firebase.firestore().collection('businesses').doc(businessId);

        // post all business info to firebase

        busRef.set({
            name,
            type,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        }).then((docRef) => {
            this.setState({
                name: '',
                type: '',
                stage: '',
                numberOfEmployees: '',
                corpType: '',
                webpageUrl: '',
                fundingRound: '',
            });
            this.props.history.push("/businesses")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });


    };

    onSubmit = e => {
        e.preventDefault();
        this.setState({
            isEnabled: false,
            isLoading: true,
        });
        if (this.state.editMode) {
            this.submitEdit();
        } else {
            this.submitCreate();
        }

        this.setState({
            isEnabled: false,
            isLoading: false,
        });
        console.log("Successfully submitted business");
    };

    handleAddBusinessClaims = async (bid) => {
        const body  = JSON.stringify({
            uid: this.props.userID,
            bid: bid,
        });

        await fetch(`https://us-central1-${projectName}.cloudfunctions.net/AddBusinessClaims`, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
                'cache-control': 'no-cache',
            }),
            body
        })
            .then( (res)=> {
                console.log("RESPONSE: ", res.status)
            }).catch( (err)=> {
                alert("Error setting business claims ");
                console.log("Error setting business claims: ", err)
            })

    };

    render() {
        const {
            error,
            isLoading,
            editMode,
            isEnabled,
            name,
            type,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,

        } = this.state;


        return (
            <Container>
                <Logo/>
                <Grid>
                    <Grid.Column width={4}>
                        <NavMenu {...this.props} />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        {editMode && <h2>Edit Business</h2>}
                        {!editMode && <h2>Create Business</h2>}
                        {error && <Message error content={error.message}/>}
                        {isLoading && (
                            <Dimmer active inverted>
                                <Loader inverted/>
                            </Dimmer>
                        )}
                        <Form onSubmit={this.onSubmit}>
                            <div className="ui segment">
                                <h3>Basic Info</h3>
                                <Form.Field>
                                    <Form.Input
                                        name="name"
                                        placeholder="Business Name"
                                        value={name}
                                        onChange={this.handleOnChange}
                                        error={!name || name === ""}
                                    />
                                </Form.Field>

                                <div className="equal width fields">
                                    <select
                                        name="type"
                                        value={type}
                                        onChange={this.handleOnChange}
                                    >
                                        <option placeholder="-">Business Type</option>
                                        <option value="tech">Tech</option>
                                        <option value="nonprofit">NonProfit</option>
                                    </select>

                                    <select
                                        name="stage"
                                        value={stage}
                                        onChange={this.handleOnChange}
                                    >
                                        <option value="">Stage</option>
                                        <option value="ideation">Ideation</option>
                                        <option value="inProduction">In Production</option>
                                        <option value="revenueGenerating">Revenue Generating</option>
                                        <option value="readyToScale">Ready to Scale</option>
                                        <option value="massProfit">Mass Profit</option>
                                    </select>

                                    <select
                                        name="fundingRound"
                                        value={fundingRound}
                                        onChange={this.handleOnChange}
                                    >
                                        <option placeholder="-">Funding Round</option>
                                        <option value="Self">Self</option>
                                        <option value="Seed">Seed</option>
                                        <option value="SeriesA">SeriesA</option>
                                        <option value="SeriesB">SeriesB</option>
                                    </select>
                                </div>

                                <div className="equal width fields">
                                    <select
                                        name="corpType"
                                        value={corpType}
                                        onChange={this.handleOnChange}
                                    >
                                        <option placeholder="">Corp Type</option>
                                        <option value="llc">LLC</option>
                                        <option value="llp">LLP</option>
                                        <option value="scorp">S Corp</option>
                                    </select>
                                    <select
                                        name="numberOfEmployees"
                                        value={numberOfEmployees}
                                        onChange={this.handleOnChange}
                                    >
                                        <option value=""># of Employees</option>
                                        <option value="1">1</option>
                                        <option value="2-5">2-5</option>
                                        <option value="5-10">5-10</option>
                                        <option value="10-25">10-25</option>
                                        <option value="25-100">25-100</option>
                                    </select>
                                    <Form.Field>
                                        <Form.Input
                                            name="webpageUrl"
                                            placeholder="Business URL"
                                            value={webpageUrl}
                                            onChange={this.handleOnChange}
                                        />
                                    </Form.Field>
                                </div>
                            </div>


                            <Button loading={isLoading}
                                    disabled={
                                        !isEnabled || !name || name === "" ||
                                        !type || type === "" || !stage || stage === "" ||
                                        !corpType || corpType === "" || !webpageUrl || webpageUrl === "" ||
                                        !stage || stage === ""
                                    }
                            >Submit</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
