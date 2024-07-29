import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 시스템관리-접속이력관리 */
function AccessHistoryMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "No",
            col: "codeId",
            cellWidth: "5%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "접속ID",
            col: "codeIdNm",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "접속이름",
            col: "code",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "로그시간",
            col: "codeNm",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "로그정보",
            col: "codeDc",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "접속IP",
            col: "codeNum",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "최근접속일시", col: "createIdBy", cellWidth: "20%" },
        { header: "결과", col: "createDate", cellWidth: "20%" },
    ];

    const conditionList = [
        {
            title: "접속ID",
            colName: "code", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "기간검색",
            colName: "selectedDate",
            type: "datepicker",
            searchLevel: "0",
        },
        {
            title: "접속이름",
            colName: "createIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "결과",
            colName: "name",
            type: "select",
            option: [{ value: "성공" }, { value: "실패" }],
            searchLevel: "3",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.AccessHistoryMgmt} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code/detailCode"
                addBtn={addBtn}
            />
        </>
    );
}

export default AccessHistoryMgmt;
