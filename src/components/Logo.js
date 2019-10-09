import React from "react";
import { Link } from "react-router-dom";
import logo from "../playback-logo.png";

const Logo = () => {
    return (
        <Link to="/">
            <img alt="logo" className="ui centered tiny image" src={logo} style={{paddingBottom: '10px'}} />
        </Link>
    );
};

export default Logo;
