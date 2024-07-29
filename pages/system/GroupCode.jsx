import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 시스템관리-게시판관리-그룹코드관리 */
function GroupCode() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "그룹코드",
            col: "codeId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "그룹코드명",
            col: "codeIdNm",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "그룹코드설명",
            col: "codeIdDc",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
        {
            header: "분류코드",
            col: "clCode",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            selectOption: true,
            listItem: "clCode",
            addListURL: "/system/code/clCode",
        },
    ];

    const conditionList = [
        {
            title: "그룹코드",
            colName: "codeId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "그룹코드명",
            colName: "codeIdNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "작성자",
            colName: "createIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "수정자",
            colName: "lastModifiedIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "정렬",
            colName: "name",
            type: "select",
            option: [
                { value: "다섯글자의옵션1" },
                { value: "다섯글자의옵션2" },
            ],
            searchLevel: "3",
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
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.GroupCode} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code/groupCode"
                addBtn={addBtn}
            />
        </>
    );
}

export default GroupCode;
