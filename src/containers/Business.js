import React, {Component} from "react";
import {Button, Container, Dimmer, Form, Grid, Loader, Message} from "semantic-ui-react";
import {Logo, NavMenu} from "../components/index";
import firebase from '../Firebase';
import {Redirect} from "react-router-dom";

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
            industry: "",
            stage: "",
            numberOfEmployees: "",
            corpType: "",
            webpageUrl: "",
            fundingRound: "",
        };
    }

    componentDidMount = () => {
        const businessId = this.props.businessID;

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
                        industry: business.industry,
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

    submitCreate = async () => {
        await this.handleAddBusiness()
            .catch((err)=> {
                console.log("Error adding business: ", err);
                alert(`Error adding business: \n ${err}`);
        });
    };

    handleSetProps = () => {
        // const {businessID} = this.state;
        return this.props.businessID("TESTBUSINESS");
    };

    handleAddBusiness = async () => {
        const {
            name,
            industry,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        } = this.state;

        // post all business info to firebase

        await this.ref.add({
            name,
            industry,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
            user: {
                userID: this.props.userID,
                email: this.props.username,
            }

        }).then( async (docRef) => {
            console.log("added business");
            const bid = docRef._key.path.segments[1];
            await this.handleAddBusinessClaims(bid);
            await this.setBusinessId(bid);
            alert("Registered Business!");

            this.props.history.push("/my-pitches")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    submitEdit = () => {
        const {
            name,
            industry,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        } = this.state;

        const businessId = this.props.match.params.id;

        const busRef = firebase.firestore().collection('businesses').doc(businessId);

        // post all business info to firebase

        busRef.update({
            name,
            industry,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        }).then((docRef) => {
            this.setState({
                name: '',
                industry: '',
                stage: '',
                numberOfEmployees: '',
                corpType: '',
                webpageUrl: '',
                fundingRound: '',
            });
            alert("Successfully Edited Business");
            this.props.history.push("/")
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

    setBusinessId = (bid) => {
        return this.props.setBusiness(bid);
    };

    render() {
        const {
            error,
            isLoading,
            editMode,
            isEnabled,
            name,
            industry,
            stage,
            numberOfEmployees,
            corpType,
            webpageUrl,
            fundingRound,
        } = this.state;

        return this.props.businessID ? (
            <Redirect to="/" />
        ) : (
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
                        <Form>
                            <div className="ui segment">
                                <h3>Basic Info</h3>
                                <label><b>Business Name</b></label>
                                <Form.Field>
                                    <Form.Input
                                        name="name"
                                        value={name}
                                        onChange={this.handleOnChange}
                                        error={!name || name === ""}
                                    />
                                </Form.Field>

                                <div className="equal width fields">
                                    <div>
                                        <label><b>Industry</b></label>
                                        <select
                                            name="industry"
                                            value={industry}
                                            onChange={this.handleOnChange}
                                        >
                                            <option placeholder=""> </option>
                                            <option value="tech">Tech</option>
                                            <option value="nonprofit">NonProfit</option>
                                            <option value="e-commerce">E-Commerce</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="financial-services">Financial Services</option>
                                            <option value="logistics">Logistics</option>
                                            <option value="construction">Construction</option>
                                            <option value="realestate">Real Estate</option>
                                            <option value="retail">Retail</option>
                                            <option value="consulting">Consulting</option>
                                            <option value="general-contracting">Contracting</option>
                                            <option value="agriculture">Agriculture</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label><b>Stage</b></label>
                                        <select
                                            name="stage"
                                            value={stage}
                                            onChange={this.handleOnChange}
                                        >
                                            <option placeholder=""> </option>
                                            <option value="ideation">Ideation</option>
                                            <option value="inProduction">In Production</option>
                                            <option value="revenueGenerating">Revenue Generating</option>
                                            <option value="readyToScale">Ready to Scale</option>
                                            <option value="massProfit">Mass Profit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label><b>Funding Round</b></label>
                                        <select
                                            name="fundingRound"
                                            value={fundingRound}
                                            onChange={this.handleOnChange}
                                        >
                                            <option placeholder=""> </option>
                                            <option value="Self">Self</option>
                                            <option value="Seed">Seed</option>
                                            <option value="SeriesA">SeriesA</option>
                                            <option value="SeriesB">SeriesB</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="equal width fields">
                                    <div>
                                        <label><b>Corp Type</b></label>
                                        <select
                                            name="corpType"
                                            value={corpType}
                                            onChange={this.handleOnChange}
                                        >
                                            <option value=""> </option>
                                            <option value="none">None</option>
                                            <option value="soleProprietor">Sole Prop</option>
                                            <option value="llc">LLC</option>
                                            <option value="llp">LLP</option>
                                            <option value="scorp">S Corp</option>
                                            <option value="partnership">Partnership</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label><b># of Employees</b></label>
                                        <select
                                            name="numberOfEmployees"
                                            value={numberOfEmployees}
                                            onChange={this.handleOnChange}
                                        >
                                            <option value=""> </option>
                                            <option value="1">1</option>
                                            <option value="2-5">2-5</option>
                                            <option value="5-10">5-10</option>
                                            <option value="10-25">10-25</option>
                                            <option value="25-100">25-100</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label>Business URL</label>
                                    <Form.Field>
                                        <Form.Input
                                            name="webpageUrl"
                                            placeholder=""
                                            value={webpageUrl}
                                            onChange={this.handleOnChange}
                                        />
                                    </Form.Field>
                                </div>
                            </div>

                            {/*<Button onClick={this.setBusinessId.bind(this, businessID)}> handleSetProps</Button>*/}

                            <Button loading={isLoading}
                                    onClick={this.onSubmit}
                                    disabled={
                                        !isEnabled || !name || name === "" ||
                                        !industry || industry === "" || !stage || stage === "" ||
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
