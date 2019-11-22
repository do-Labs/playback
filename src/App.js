import React, {Component} from "react";
import "semantic-ui-css/semantic.min.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
// import {Button} from "semantic-ui-react";
import {PrivateRoute} from "./components/index";
import {
    Business,
    Businesses,
    Dashboard,
    Explore,
    Search,
    Login,
    Register,
    User,
    Users,
    Pitches,
    MyPitches,
    Pitch,
    AllFeedback,
    MyFeedback,
    MyEvents,
    Event,
    Feedbacks,
    Feedback,
    ThankYou,
    ThankYouForAttending,
    Utils,
    SignInSheet,
    Attendees,
} from "./containers/index.js"
import jwtDecode from "jwt-decode";


class App extends Component {
    state = {
        isAuthenticated: false,
        isAuthenticating: true,
        username: "",
        token: "",
        userID: "",
        role: "",
        businessID: "",
    };

    componentDidMount = async () => {
        const auth =sessionStorage.getItem('auth');
        if (auth) {
            const { token, username } = JSON.parse(auth);
            this.userHasAuthenticated(true, username, token);
            await this.checkUserClaims(token)
        }
        this.setState({
            isAuthenticating: false,
        });
    };

    userHasAuthenticated = async (authenticated, username, token, userID, role, businessID) => {
        this.setState({
            isAuthenticated: authenticated,
            username: username,
            token: token,
            userID: userID,
            role: role,
            businessID: businessID,
        });
        // await this.checkUserClaims(token);
    };

    setUserClaims = () => {
        const claims = "";
        console.log("claims:", claims);
        this.setState({
            claims: claims
        });
    };

    setBusiness = (business) => {
        console.log("Business:", business);
        this.setState({
            businessID: business,
            role: "businessUser",
        });
    };

    checkUserClaims = (token) => {
        const decoded = jwtDecode(token);
        const userID = decoded.user_id;
        // Determine role
        if(decoded.role === "admin"){
            this.setState({
                role : 'admin',
            })
        } else if(decoded.role === "businessUser"){
            this.setState({
                role : 'businessUser',
                businessID : decoded.businessID,
            })
        } else {
            this.setState({
                role: 'guest',
                businessID: null,
            });
        }
        this.setState({
            userID: userID,
        });
    };


    render() {
        const props = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            username: this.state.username,
            userID: this.state.userID,
            token: this.state.token,
            role: this.state.role,
            setBusiness: this.setBusiness,
            businessID: this.state.businessID,
        };
        return (
            !this.state.isAuthenticating &&
            <div className="App">
                <Router basename={"admin"}>
                    <Switch>
                        <Route
                            path="/login"
                            render={() =>
                                <Login
                                {...props}

                                />}
                            callbackFromParent={this.setUserClaims}
                        />
                        <Route
                            path="/register"
                            render={() => <Register {...props}/>}
                        />
                        <PrivateRoute
                            exact
                            path="/"
                            component={Dashboard}
                            props={props}
                        />
                        <PrivateRoute
                            path="/businesses"
                            component={Businesses}
                            props={props}
                        />
                        <PrivateRoute
                            path="/business/:id"
                            component={Business}
                            props={props}
                        />
                        <PrivateRoute
                            path="/business"
                            component={Business}
                            props={props}
                            businessID={this.setBusiness}
                        />
                        <PrivateRoute
                            path="/users"
                            component={Users}
                            props={props}
                        />
                        <PrivateRoute
                            path="/user"
                            component={User}
                            props={props}
                        />
                        <PrivateRoute
                            path="/user/:id"
                            component={User}
                            props={props}
                        />
                        <PrivateRoute
                            path="/pitches"
                            component={Pitches}
                            props={props}
                        />
                        <PrivateRoute
                            path="/my-pitches"
                            component={MyPitches}
                            props={props}
                        />
                        <PrivateRoute
                            path="/pitch/:id"
                            component={Pitch}
                            props={props}
                        />
                        <PrivateRoute
                            path="/pitch"
                            component={Pitch}
                            props={props}
                        />
                        <PrivateRoute
                            path="/my-events"
                            component={MyEvents}
                            props={props}
                        />
                        <PrivateRoute
                            path="/event/:id"
                            component={Event}
                            props={props}
                        />
                        <PrivateRoute
                            path="/event"
                            component={Event}
                            props={props}
                        />
                        <PrivateRoute
                            path="/explore"
                            component={Explore}
                            props={props}
                        />
                        <PrivateRoute
                            path="/search"
                            component={Search}
                            props={props}
                        />
                        <PrivateRoute
                            path="/all-feedback/"
                            component={AllFeedback}
                            props={props}
                        />
                        <PrivateRoute
                            path="/my-feedback"
                            component={MyFeedback}
                            props={props}
                        />
                        <PrivateRoute
                            path="/feedbacks"
                            component={Feedbacks}
                            props={props}
                        />
                        <PrivateRoute
                            path="/feedbacks/:id"
                            component={Feedbacks}
                            props={props}
                        />
                        <PrivateRoute
                            path="/utils/"
                            component={Utils}
                            props={props}
                        />
                        <Route
                            path="/feedback/:id"
                            component={Feedback}
                            props={props}
                        />
                        <Route
                            path="/feedback"
                            component={Feedback}
                            props={props}
                        />
                        <PrivateRoute
                            path="/attendees/:id"
                            component={Attendees}
                            props={props}
                        />
                        <Route
                            path="/signIn/:id"
                            component={SignInSheet}
                            props={props}
                        />
                        <Route
                            path="/thankyou"
                            component={ThankYou}
                            props={props}
                        />
                        <Route
                            path="/thankyou2"
                            component={ThankYouForAttending}
                            props={props}
                        />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
