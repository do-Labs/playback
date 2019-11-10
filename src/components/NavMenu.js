import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import firebase from '../Firebase';

export default class NavMenu extends Component {
    state = {
        userID: this.props.userID,
        role: this.props.role,
        isAdmin: false,
        isBusinessUser: false,
    };

    handleLogout = async event => {
        event.preventDefault();
        await firebase.auth().signOut();
        await this.props.userHasAuthenticated(false, "", "");
        await sessionStorage.clear();
    };

    componentDidMount = async () => {
        const role = await this.props.role;
        if(role === "admin"){
            this.setState({
                isAdmin : true,
            })
        }
        else if(role === "businessUser"){
            this.setState({
                isBusinessUser : true,
            })
        }
    };

    render() {
        const {
            isAdmin,
            isBusinessUser,

        } = this.state;

        return (
            <Menu vertical>
                <Menu.Item>
                    {/*<Icon name="large lock open" />*/}
                    Connected as <strong>{this.props.username}</strong>
                    <Menu.Menu>
                        <p>{this.props.userID}</p>
                    </Menu.Menu>
                    <Menu.Menu>
                        <Menu.Item onClick={this.handleLogout}>
                            Logout
                        </Menu.Item>
                        <Menu.Item name="editProfile" as={NavLink} to={`/user/${this.props.userID}`}>
                            Edit Profile
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>

                <Menu.Item>
                    {/*<Icon name="large building" />*/}
                    Business
                    <Menu.Menu>
                        {!isBusinessUser &&
                            <Menu.Item name="new" as={NavLink} to="/business">
                                Register Business
                            </Menu.Item>
                        }
                        {isBusinessUser &&
                            <Menu.Item name="edit" as={NavLink} to={`/business/${this.props.businessID}`}>
                                Edit Business
                            </Menu.Item>
                        }
                    </Menu.Menu>
                </Menu.Item>

                {/*<Menu.Item>*/}
                    {/*/!*<Icon name="large user" />*!/*/}
                    {/*User*/}
                    {/*<Menu.Menu>*/}
                        {/**/}
                    {/*</Menu.Menu>*/}
                {/*</Menu.Item>*/}

                {isBusinessUser &&
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
                        </Menu.Menu>
                    </Menu.Item>
                }

                {/*<Menu.Item>*/}
                    {/*/!*<Icon name="large binoculars" />*!/*/}
                    {/*Explore*/}
                    {/*<Menu.Menu>*/}
                        {/*<Menu.Item name="explorestartups" as={NavLink} to="/explore">*/}
                            {/*Explore Startups*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item name="cowork" as={NavLink} to="/explore">*/}
                            {/*Coworking Spaces*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item name="pitchopportunities" as={NavLink} to="/explore">*/}
                            {/*Pitch Opportunities*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item name="search" as={NavLink} to="/search">*/}
                            {/*Search*/}
                        {/*</Menu.Item>*/}
                    {/*</Menu.Menu>*/}
                {/*</Menu.Item>*/}
                {isAdmin &&
                    <Menu.Item>
                        {/*<Icon name="large binoculars" />*/}
                        Admin Only
                        <Menu.Menu>
                            <Menu.Item name="utils" as={NavLink} to="/utils">
                                Utils
                            </Menu.Item>
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
                }
            </Menu>
        );
    }
}
