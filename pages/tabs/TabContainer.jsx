import React, { useContext } from "react";
import AntTabs from "components/tabs/AntTabs";
import EgovLeftNavSales from "components/leftmenu/EgovLeftNavSales";
import EgovLeftNavExecution from "components/leftmenu/EgovLeftNavExecution";
import EgovLeftNavSystem from "components/leftmenu/EgovLeftNavSystem";
import EgovLeftNavReference from "components/leftmenu/EgovLeftNavReference";
import { PageContext } from "components/PageProvider";
import EgovLeftNavMailBox from "components/leftmenu/EgovLeftNavMailBox";

function TabContainer() {
    const { gnbLabel } = useContext(PageContext);
    return (
        <div className="egov-container T_MAIN">
            <div className="c_wrap">
                <div className="colbox">
                    <div className="left_col">
                        {gnbLabel === "기준정보관리" && <EgovLeftNavReference />}
                        {gnbLabel === "영업관리" && <EgovLeftNavSales />}
                        {gnbLabel === "실행관리" && <EgovLeftNavExecution />}
                        {gnbLabel === "전자결재" && <EgovLeftNavMailBox />}
                        {gnbLabel === "시스템관리" && <EgovLeftNavSystem />}
                    </div>

                    <div className="right_col">
                        <AntTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabContainer;
