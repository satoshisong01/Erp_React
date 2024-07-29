import React from "react";
import { useLocation } from "react-router-dom";
import AntTabs from "components/tabs/AntTabs";
import EgovLeftNavSales from "components/leftmenu/EgovLeftNavSales";

export default function SalesTabPage() {
    return (
        <div className="egov-container T_MAIN">
            <div className="c_wrap">
                <div className="colbox">
                    <div className="left_col">
                        <EgovLeftNavSales />
                    </div>

                    <div className="right_col">
                        <AntTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}