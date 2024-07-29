import React from "react";
import { Link } from "react-router-dom";

import EgovLoginContent from "pages/login/EgovLoginContent";

import URL from "constants/url";

function EgovLogin(props) {
    console.group("EgovLogin");
    console.log("[Start] EgovLogin ------------------------------");
    console.log("EgovLogin [props] : ", props);

    const onChangeLogin = (user) => {
        props.onChangeLogin(user);
    };

    console.log("------------------------------EgovLogin [End]");
    console.groupEnd("EgovLogin");

    return (
        <div className="egov-container">
            <div className="c_wrap">
                <div className="layout">
                    <EgovLoginContent
                        onChangeLogin={onChangeLogin}></EgovLoginContent>
                </div>
            </div>
        </div>
    );
}

export default EgovLogin;
