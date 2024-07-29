import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 시스템관리-게시판관리-프로그램목록관리 */
function ProgramList() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "프로그램ID",
            col: "name",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "파일명",
            col: "code",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "저장경로",
            col: "startDate",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "한글명", col: "currency", cellWidth: "20%" },
        { header: "설명", col: "vendor", cellWidth: "20%" },
        { header: "URL", col: "contactPerson", cellWidth: "20%" },
        { header: "분류코드", col: "endDate", cellWidth: "30%" },
        { header: "변수", col: "orderAmount", cellWidth: "20%" },
        { header: "최초등록시점", col: "orderAmount", cellWidth: "30%" },
        { header: "최초수정시점", col: "orderAmount", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "한글명",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "파일명",
            colName: "selectedDate",
            type: "input",
            value: "",
            searchLevel: "0",
        },
        {
            title: "URL",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "분류코드",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "담당자",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "거래처",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.ProgramList} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code/clCode"
                addBtn={addBtn}
            />
        </>
    );
}

export default ProgramList;
