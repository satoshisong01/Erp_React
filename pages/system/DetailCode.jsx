import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 시스템관리-코드관리-상세코드관리 */
function DetailCode() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "상세코드",
            col: "code",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "상세코드명",
            col: "codeNm",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "상세코드설명",
            col: "codeDc",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        {
            header: "상세코드번호",
            col: "codeNum",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
        {
            header: "그룹코드명",
            col: "codeIdNm",
            cellWidth: "20%",
            modify: true,
            enable: false,
            //selectOption: true,
            //add: true,
        },
        {
            header: "그룹코드",
            col: "codeId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            listItem: "codeId",
            addListURL: "/system/code/groupCode",
            selectOption: true,
            add: true,
        },
    ];

    const conditionList = [
        {
            title: "상세코드",
            colName: "code", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "상세코드명",
            colName: "codeNm", //컬럼명
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
            <Location pathList={locationPath.DetailCode} />
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

export default DetailCode;
