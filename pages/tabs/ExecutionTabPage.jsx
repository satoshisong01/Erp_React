import React from "react";
import AntTabs from "components/tabs/AntTabs";
import EgovLeftNavExecution from "components/leftmenu/EgovLeftNavExecution";

export default function ExecutionTabPage() {
    return (
        <div className="egov-container T_MAIN">
            <div className="c_wrap">
                <div className="colbox">
                    <div className="left_col">
                        <EgovLeftNavExecution />
                    </div>

                    <div className="right_col">
                        <AntTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}