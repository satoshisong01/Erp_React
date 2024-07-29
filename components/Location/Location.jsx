import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";

export default function Location({ pathList }) {
    return (
        <div className="location mg-b-20">
            {/* <ul>
                <li><Link to="/" className="home">Home</Link></li>
                <li><Link to="#" onClick={(e) => store.dispatch(selectLnb(pathList[0]))}> {pathList[1]} </Link></li>
                <li>{pathList[2]}</li>
            </ul> */}
        </div>
    );
}
