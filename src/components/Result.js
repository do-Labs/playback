import React from "react";
import { Segment, Icon } from "semantic-ui-react";

const Result = ({ results }) => {
    return (
        <Segment color="black">
            <h3>
                <Icon style={{ float: "right" }} name="copy outline" /> Result:
            </h3>
            <pre style={{ overflow: "hidden", textOverflow: "ellipsis"}}>{JSON.stringify(results, null, 1)}</pre>
        </Segment>
    );
};

export default Result;
