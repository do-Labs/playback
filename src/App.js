import React, {Component} from "react";
import "semantic-ui-css/semantic.min.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
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
    Feedbacks,
    Feedback,
    ThankYou,
    RecordPitch,
} from "./containers/index.js"
import jwtDecode from "jwt-decode";
import firebase from "./Firebase";



class App extends Component {
    state = {
        isAuthenticated: false,
        isAuthenticating: true,
        username: '',
        token: '',
        userId: '',
    };

    componentDidMount = async () => {
        const auth =sessionStorage.getItem('auth');
        if (auth) {
            const { token, username } = JSON.parse(auth);
            this.userHasAuthenticated(true, username, token);
            const decoded = jwtDecode(token);
            const userId = decoded.user_id;
            this.setState({
                userId: userId,
                token: token,
            });
        }
        this.setState({
            isAuthenticating: false,
        });
    };


    userHasAuthenticated = (authenticated, username, token) => {
        this.setState({
            isAuthenticated: authenticated,
            username,
            token,
        });
    };

    render() {
        const props = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            getClaims: this.getClaims,
            username: this.state.username,
            userId: this.state.userId,
            token: this.state.token,
        };
        return (
            !this.state.isAuthenticating &&
            <div className="App">
                <Router basename={"admin"}>
                    <Switch>
                        <Route
                            path="/login"
                            render={() => <Login {...props}/>}
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
                            path="/record-pitch"
                            component={RecordPitch}
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
                        <Route
                            path="/thankyou"
                            component={ThankYou}
                            props={props}
                        />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
