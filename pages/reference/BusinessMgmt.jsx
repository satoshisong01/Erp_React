import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-사업장관리 */
function BusinessMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        { header: "사업장명", col: "createDate", cellWidth: "500" },
        { header: "사업장코드", col: "createDate", cellWidth: "500" },
        { header: "구분", col: "createIdBy", cellWidth: "500" },
    ];

    const conditionList = [
        {
            title: "사업장명",
            colName: "pgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "사업장코드",
            colName: "pgCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "구분",
            colName: "createIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.BusinessMgmt} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable returnKeyWord={returnKeyWord} columns={columns} suffixUrl="" currentPage="" addBtn={addBtn} />
        </>
    );
}

export default BusinessMgmt;
