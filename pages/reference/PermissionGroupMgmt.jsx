import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";

/** 기준정보관리-원가기준관리-권한그룹정보관리 */
function PermissionGroupMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const permissionTable = useRef(null);
    const [orgIdArray, setOrgIdArray] = useState([]);

    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "그룹ID",
            col: "groupId",
            cellWidth: "30%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "그룹명",
            col: "groupNm",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "그룹코드",
            col: "groupCode",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "그룹설명",
            col: "groupDc",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        { header: "가입일자", col: "groupCreatDe", cellWidth: "30%" },
        { header: "작성일", col: "createDate", cellWidth: "30%" },
        { header: "작성자", col: "createIdBy", cellWidth: "30%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "30%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "30%" },
        {
            header: "조직ID",
            col: "orgId",
            cellWidth: "30%",
            enable: false,
            type: "select",
            option: orgIdArray,
            modify: true,
            add: true,
            require: true,
        },
    ];

    const conditionList = [
        {
            title: "그룹ID",
            colName: "groupId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "그룹명",
            colName: "groupNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "권한",
            colName: "sbsDt", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const url = `/api/baseInfrm/member/orgNzt/totalListAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            const ArrayList = resultData.map((item, index) => ({
                value: index + 1,
                label: item.orgId, // 원하는 속성 이름을 여기에 추가
            }));
            setOrgIdArray(ArrayList);
        }
    };

    const [length, setLength] = useState(0);
    const setLengthSelectRow = (length) => {
        setLength(length);
    };

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    return (
        <>
            <Location pathList={locationPath.PermissionGroupMgmt} />
            {/*<SearchList conditionList={conditionList} onSearch={handleReturn} />*/}
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} length={length} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} length={length} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                //returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/baseInfrm/member/authorGroup"
                tableRef={permissionTable}
                setLengthSelectRow={setLengthSelectRow}
                viewPageName={{ name: "권한그룹정보관리", id: "PermissionGroupMgmt" }}
            />
        </>
    );
}

export default PermissionGroupMgmt;
