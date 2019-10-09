import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import firebase from 'firebase';

export default class NavMenu extends Component {
    state = {
        userId: this.props.userId,
    };

    handleLogout = async event => {
        event.preventDefault();
        await firebase.auth().signOut();
        this.props.userHasAuthenticated(false, "", "");
        sessionStorage.clear();

    };

    render() {
        return (
            <Menu vertical>
                <Menu.Item>
                    {/*<Icon name="large lock open" />*/}
                    Connected as <strong>{this.props.username}</strong>
                    <Menu.Menu>
                        <p>{this.props.userId}</p>
                    </Menu.Menu>
                    <Menu.Menu>
                        <Menu.Item onClick={this.handleLogout}>
                            Logout
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>

                <Menu.Item>
                    {/*<Icon name="large building" />*/}
                    Business
                    <Menu.Menu>
                        <Menu.Item name="new" as={NavLink} to="/business">
                            Register Startup
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>

                {/*<Menu.Item>*/}
                    {/*/!*<Icon name="large user" />*!/*/}
                    {/*User*/}
                    {/*<Menu.Menu>*/}
                        {/**/}
                    {/*</Menu.Menu>*/}
                {/*</Menu.Item>*/}

                <Menu.Item>
                    {/*<Icon name="large microphone" />*/}
                    Pitch
                    <Menu.Menu>
                        <Menu.Item name="myPitches" as={NavLink} to="/my-pitches">
                            My Pitches
                        </Menu.Item>
                        <Menu.Item name="new" as={NavLink} to="/pitch">
                            New
                        </Menu.Item>
                        <Menu.Item name="record" as={NavLink} to="/record-pitch">
                            Record
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>

                <Menu.Item>
                    {/*<Icon name="large reply all" />*/}
                    Feedback
                    <Menu.Menu>
                        <Menu.Item name="myFeedback" as={NavLink} to="/my-feedback">
                            My Feedback
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>

                <Menu.Item>
                    {/*<Icon name="large binoculars" />*/}
                    Explore
                    <Menu.Menu>
                        <Menu.Item name="explorestartups" as={NavLink} to="/explore">
                            Explore Startups
                        </Menu.Item>
                        <Menu.Item name="cowork" as={NavLink} to="/explore">
                            Coworking Spaces
                        </Menu.Item>
                        <Menu.Item name="pitchopportunities" as={NavLink} to="/explore">
                            Pitch Opportunities
                        </Menu.Item>
                        <Menu.Item name="search" as={NavLink} to="/search">
                            Search
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>

                <Menu.Item>
                    {/*<Icon name="large binoculars" />*/}
                    Admin Only
                    <Menu.Menu>
                            Businesses
                        <Menu.Item name="listallbusinesses" as={NavLink} to="/businesses">
                            List
                        </Menu.Item>
                            Pitches
                        <Menu.Item name="listallpitches" as={NavLink} to="/pitches">
                            List
                        </Menu.Item>
                            Users
                        <Menu.Item name="listallusers" as={NavLink} to="/users">
                            List
                        </Menu.Item>
                        <Menu.Item name="newuser" as={NavLink} to="/user">
                            Create User
                        </Menu.Item>
                            Feedback
                        <Menu.Item name="listallfeedback" as={NavLink} to="/all-feedback">
                            List
                        </Menu.Item>
                        <Menu.Item name="newfeedback" as={NavLink} to="/feedback">
                            Test Feedback
                        </Menu.Item>
                            Explore
                        <Menu.Item name="listallexplorestartups" as={NavLink} to="/explore">
                            List All
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>
            </Menu>
        );
    }
}
