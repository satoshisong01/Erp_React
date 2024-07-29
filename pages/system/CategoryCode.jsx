import React, { useState } from "react";
import DataTable from "components/DataTable/DataTable";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";

/** 시스템관리-코드관리-분류코드관리 */
function CategoryCode() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "분류코드",
            pk: true,
            col: "clCode",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "분류코드명",
            col: "clCodeNm",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "분류코드설명",
            col: "clCodeDc",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
    ];

    const conditionList = [
        {
            title: "분류코드",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "5",
        },
        {
            title: "분류코드명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "6",
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
            searchLevel: "4",
        },
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    //const conditionList = {
    //    clCode: "",
    //    clCodeNm: "",
    //    clCodeDc: "",
    //    useAt: "Y",
    //    searchCondition: "0",
    //    searchKeyword: "",
    //    createIdBy: "USRCNFRM_00000000000",
    //    createDate: "2023-08-04",
    //};

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.CategoryCode} />
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

export default CategoryCode;
