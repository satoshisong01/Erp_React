import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import AddModModal from "components/modal/AddModModal";
import DeleteModal from "components/modal/DeleteModal";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import { columns } from "constants/columns";

/** 기준정보관리-원가기준관리-사전원가지표 */
function CostIndex() {
    const [tableData, setTableData] = useState([]);
    const costIndexMgmtTable = useRef(null);
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록

    const { setNameOfButton, innerPageName, setInnerPageName } = useContext(PageContext);

    const columnsTable = [
        { header: "원가지표ID", type: "input", col: "cbId", cellWidth: "0", notView: true },
        { header: "기준연도", type: "input", col: "cbMonth", cellWidth: "350" },
        { header: "분류코드", col: "cbTypeCode", cellWidth: "350" },
        { header: "비용처명", type: "input", col: "cbName", cellWidth: "350" },
        { header: "비율", type: "input", col: "cbPer", cellWidth: "300" },
    ];

    useEffect(() => {
        setInnerPageName("사전원가지표");
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/product/costBase/totalListAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "이게원본데이터");
        //setTableData(reorganizeData(resultData));
        setTableData(resultData);
        setIsLoading(false);
    };

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
        const url = `/api/baseInfrm/product/costBase/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
        };
        const resultData = await axiosPost(url, dataToSend);
        console.log(resultData);
        if (resultData) {
            alert("추가되었습니다");
            refresh();
        } else {
            alert("error!");
        }
    };

    const modifyToServer = async (updatedData) => {
        console.log("💜 modifyToServer:", updatedData);
        if (updatedData.length === 0) {
            alert("수정할 항목을 선택하세요.");
            return;
        }

        const url = `/api/baseInfrm/product/costBase/edit.do`;
        const updated = { ...updatedData, lockAt: "Y", useAt: "Y" };
        console.log(updated, "수정");
        const resultData = await axiosUpdate(url, updated);
        console.log(resultData);
        if (resultData) {
            alert("수정되었습니다");
            refresh();
        } else {
            alert("error!!수정");
        }
    };

    const deleteToServer = async (value) => {
        if (value === "임시삭제") {
            /* 임시삭제 코드 구현 */
        } else if (value === "영구삭제") {
            const poiNms = selectedRows.map((row) => row.cbId);
            const url = `/api/baseInfrm/product/costBase/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const roleMapping = {
        간접원가: 1,
        판매비: 2,
        사내본사비: 3,
        일반관리비: 4,
        영업외수지: 5,
    };

    useEffect(() => {
        console.log(tableData, "tableData");
    }, [tableData]);

    const [costIndex, setCostIndex] = useState([]); //사전원가지표

    console.log(costIndex, "costIndex");

    const refresh = () => {
        fetchAllData();
    };

    const returnData = (row) => {
        console.log(row);
        setDeleteNames([`${(row.cbMonth, row.cbTypeCode)}`]);
        if (row.cbId && selectedRows.cbId !== row.cbId) {
            setSelectedRows([row]);
            console.log(row);
        }
    };

    return (
        <>
            {isLoading ? (
                // 로딩 화면을 보여줄 JSX
                <div className="Loading">
                    <div className="spinner"></div>
                    <div> Loading... </div>
                </div>
            ) : (
                <div>
                    <Location pathList={locationPath.CostIndex} />
                    <div className="table-buttons">
                        <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                        <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                        <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                        <RefreshButton onClick={() => setNameOfButton("refresh")} />
                    </div>
                    <ReactDataTable
                        columns={columnsTable}
                        returnSelect={returnData}
                        customDatas={tableData}
                        //suffixUrl="/baseInfrm/product/costBase"
                        tableRef={costIndexMgmtTable}
                        viewPageName={{ name: "사전원가지표", id: "CostIndex" }}
                        perSent=" %"
                    />
                    {isOpenAdd && (
                        <AddModModal
                            width={500}
                            height={160}
                            list={columns.reference.CostIndex}
                            resultData={addToServer}
                            onClose={() => setIsOpenAdd(false)}
                            title="사전원가지표 추가"
                        />
                    )}
                    {isOpenMod && (
                        <AddModModal
                            width={500}
                            height={160}
                            list={columns.reference.CostIndex}
                            initialData={selectedRows}
                            resultData={modifyToServer}
                            onClose={() => setIsOpenMod(false)}
                            title="사전원가지표 수정"
                        />
                    )}
                    {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
                </div>
            )}
        </>
    );
}

export default CostIndex;
