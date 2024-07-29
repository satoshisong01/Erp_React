import React from "react";
import AntTabs from "components/tabs/AntTabs";
import EgovLeftNavSystem from "components/leftmenu/EgovLeftNavSystem";

export default function SystemTabPage() {
    return (
        <div className="egov-container T_MAIN">
            <div className="c_wrap">
                <div className="colbox">
                    <div className="left_col">
                        <EgovLeftNavSystem />
                    </div>

                    <div className="right_col">
                        <AntTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}