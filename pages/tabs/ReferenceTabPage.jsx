import React from "react";
import AntTabs from "components/tabs/AntTabs";
import EgovLeftNavReference from "components/leftmenu/EgovLeftNavReference";

export default function ReferenceTabPage() {
    return (
        <div className="egov-container T_MAIN">
            <div className="c_wrap">
                <div className="colbox">
                    <div className="left_col">
                        <EgovLeftNavReference />
                    </div>

                    <div className="right_col">
                        <AntTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}