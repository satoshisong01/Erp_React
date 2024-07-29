import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";

/** 기준정보관리-원가기준관리-조직부서정보관리 */
function OrganizationMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const organizationTable = useRef(null);

    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "조직ID",
            col: "orgId",
            cellWidth: "30%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "조직이름",
            col: "orgNm",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "조직코드",
            col: "orgCd",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "조직설명",
            col: "orgDc",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        { header: "작성일", col: "createDate", cellWidth: "30%" },
        { header: "작성자", col: "createIdBy", cellWidth: "30%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "30%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "조직ID",
            colName: "orgId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "조직이름",
            colName: "orgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.OrganizationMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                columns={columns}
                suffixUrl="/baseInfrm/member/orgNzt"
                tableRef={organizationTable}
                viewPageName={{ name: "조직부서정보관리", id: "OrganizationMgmt" }}
                addBtn={addBtn}
            />
        </>
    );
}

export default OrganizationMgmt;
