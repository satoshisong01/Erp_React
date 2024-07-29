import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import HideCard from "components/HideCard";
import { PageContext } from "components/PageProvider";
import RefreshButton from "components/button/RefreshButton";
import URL from "constants/url";
import ModButton from "components/button/ModButton";

/** 전자결재-결재대기함(승인자기준) */
function PendingBox() {
    const { currentPageName } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터

    const columnsList = [
        { header: "결재아이디", col: "sgnId", notView: true },
        { header: "기안자부서", col: "sgnSenderGroupNm", notView: true },
        { header: "기안자직급", col: "sgnSenderPosNm", notView: true },
        { header: "프로젝트아이디", col: "poiId", notView: true },
        { header: "버전아이디", col: "versionId", notView: true },
        { header: "버전명", col: "versionNum", notView: true },
        { header: "수주아이디", col: "poId", notView: true },
        { header: "결재아이디", col: "sttId", notView: true },
        { header: "발신자아이디", col: "sgnSenderId", notView: true },
        { header: "수신자아이디", col: "sgnReceiverId", notView: true },
        { header: "고객사", col: "cltNm", notView: true },
        { header: "영업대표", col: "poiSalmanagerId", notView: true },
        { header: "담당자", col: "poiManagerId", notView: true },
        { header: "납기시작일", col: "poiDueBeginDt", notView: true },
        { header: "납기종료일", col: "poiDueEndDt", notView: true },
        { header: "계약금(천원)", col: "orderTotal", notView: true },
        { header: "요청일", col: "sngSignData", notView: true },
        { header: "결재제목", col: "sgnTitle", cellWidth: "300", textAlign: "left" },
        { header: "프로젝트명", col: "poiNm", cellWidth: "250", textAlign: "left" },
        { header: "결재종류", col: "sgnType", cellWidth: "100" },
        { header: "기안자", col: "sgnSenderNm", cellWidth: "70" },
        { header: "기안일", col: "sgnSigndate", cellWidth: "130" },
        { header: "결재상태", col: "sgnAt", cellWidth: "70" },
        { header: "비고", col: "sgnDesc", cellWidth: "559", textAlign: "left", notView: true },
        { header: "코멘트", col: "sgnComment", cellWidth: "419", textAlign: "left" },
    ];

    const conditionList = [
        { title: "프로젝트명", colName: "clCode", type: "input" },
        {
            title: "결재종류",
            colName: "empNm",
            type: "select",
            option: [
                { value: "", label: "전체" },
                { value: "사전원가서", label: "사전원가서" },
                { value: "실행예산서", label: "실행예산서" },
                { value: "사후정산서", label: "사후정산서" },
                { value: "수주보고서", label: "수주보고서" },
                { value: "완료보고서", label: "완료보고서" },
            ],
        },
        {
            title: "결재상태",
            colName: "sgnResult",
            type: "select",
            option: [
                { value: "전체", label: "전체" },
                { value: "발신", label: "발신" },
                { value: "수신", label: "수신" },
                { value: "반려", label: "반려" },
                { value: "완료", label: "완료" },
                { value: "회수", label: "회수" },
            ],
        },
        { title: "기안자", colName: "empNm", type: "input" },
        { title: "기안일", colName: "sgnSigndate", type: "dayPicker" },
    ];

    useEffect(() => {
        if (currentPageName.id === "PendingBox") {
            fetchAllData({ sttApproverId: localStorage.uniqId, sgnAt: "진행" });
        }
    }, [currentPageName]);

    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/system/signState/totalListAll.do", condition || {});
        console.log(resultData);
        setTableData(resultData);
    };

    const refresh = () => {
        fetchAllData({ sttApproverId: localStorage.uniqId, sgnAt: "진행" });
    };

    const returnData = (row) => {
        if (row.sgnId && selectedRows.sgnId !== row.sgnId) {
            setSelectedRows(row);
        }
    };

    const openPopup = () => {
        if (selectedRows?.sgnId) {
            const sendData = {
                label: "전자결재",
                ...selectedRows,
            };
            const url = `${URL.SignDocument}?data=${encodeURIComponent(JSON.stringify(sendData))}`;
            const width = 1200;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
            window.open(url, "pendingBoxWindow", windowFeatures);
        }
    };

    return (
        <>
            <Location pathList={locationPath.Approval} />
            <SearchList conditionList={conditionList} />
            <HideCard title="결재대기 목록" color="back-lightblue" className="mg-b-40">
                <div className="table-buttons mg-t-10 mg-b-10">
                    {/* <PopupButtonNL targetUrl={URL.PreCostDoc} data={{ label: "수주보고서", type: "document", ...condition }} /> */}
                    {/* <PopupButtonSign targetUrl={URL.SignDocument} data={{ label: "전자결재", ...selectedRows }}/> */}
                    <ModButton label="전자결재" onClick={openPopup} />
                    {/* <ViewButton label={"보기"} onClick={() => setIsOpenView(true)} /> */}
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    columns={columnsList}
                    customDatas={tableData}
                    viewPageName={{ name: "결재대기함", id: "PendingBox" }}
                    returnSelect={returnData}
                    isSingleSelect={true}
                />
            </HideCard>
        </>
    );
}

export default PendingBox;
