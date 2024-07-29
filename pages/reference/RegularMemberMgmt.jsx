import React, { useContext, useEffect, useRef, useState } from "react";
import DataTable from "components/DataTable/DataTable";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";

/** 기준정보관리-원가기준관리-일반회원관리 */
function RegularMemberMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const RegularMemberTable = useRef(null);
    const [groupIdArray, setGroupIdArray] = useState([]);

    const columns = [
        {
            header: "고유ID",
            col: "uniqId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "회원ID",
            col: "mbId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "회원명",
            col: "mbNm",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "비밀번호",
            col: "password",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        {
            header: "회원상태코드",
            col: "mbStuCd",
            cellWidth: "35%",
            modify: true,
            add: true,
        },
        {
            header: "잠금여부",
            col: "lockAt",
            lockAt: true,
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        {
            header: "이메일",
            col: "mbEmAdr",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        { header: "전화번호", col: "mbTelNm", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "20%" },
        {
            header: "그룹ID",
            col: "groupId",
            cellWidth: "20%",
            enable: false,
            type: "select",
            option: groupIdArray,
            modify: true,
            add: true,
            require: true,
        },
    ];

    const conditionList = [
        {
            title: "회원ID",
            colName: "mbId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "회원명",
            colName: "mbNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "권한",
            colName: "sbsDt", //컬럼명
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const url = `/api/baseInfrm/member/authorGroup/totalListAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            const ArrayList = resultData.map((item, index) => ({
                value: index + 1,
                label: item.groupId, // 원하는 속성 이름을 여기에 추가
            }));
            setGroupIdArray(ArrayList);
        }
    };

    const [length, setLength] = useState(0);
    const setLengthSelectRow = (length) => {
        setLength(length);
    };

    return (
        <>
            <Location pathList={locationPath.RegularMemberMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} length={length} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} length={length} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                columns={columns}
                suffixUrl="/baseInfrm/member/generalMember"
                tableRef={RegularMemberTable}
                setLengthSelectRow={setLengthSelectRow}
                viewPageName={{ name: "일반회원관리", id: "RegularMemberMgmt" }}
            />
        </>
    );
}

export default RegularMemberMgmt;
