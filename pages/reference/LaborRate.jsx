import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import AddModModal from "components/modal/AddModModal";
import DeleteModal from "components/modal/DeleteModal";
import { columns } from "constants/columns";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";

/** 기준정보관리-원가기준관리-외주사인건비 */
function LaborRate() {
    const { setNameOfButton } = useContext(PageContext);
    const LaborRateTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록

    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    const tableColumns = [
        {
            header: "인건비단가ID",
            col: "peId",
            cellWidth: "0",
            modify: true,
            add: true,
            notView: true,
        },
        {
            header: "기준연도",
            col: "peBaseDate",
            cellWidth: "130",
        },
        {
            header: "회사이름",
            col: "cltNm",
            cellWidth: "208",
        },
        {
            header: "특2",
            col: "peLv7",
            cellWidth: "130",
            modify: true,
            add: true,
        },
        {
            header: "특1",
            col: "peLv6",
            cellWidth: "130",
            modify: true,
            add: true,
        },
        {
            header: "고2",
            col: "peLv5",
            cellWidth: "130",
            modify: true,
            add: true,
        },
        {
            header: "고1",
            col: "peLv4",
            cellWidth: "130",
            modify: true,
            add: true,
        },
        {
            header: "중",
            col: "peLv3",
            cellWidth: "130",
            modify: true,
            add: true,
        },
        {
            header: "초2",
            col: "peLv2",
            cellWidth: "130",
            modify: true,
            add: true,
        },
        {
            header: "초1",
            col: "peLv1",
            cellWidth: "130",
            modify: true,
            add: true,
        },
        {
            header: "제경비",
            col: "peDesc",
            cellWidth: "130",
        },
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    const refresh = () => {
        fetchAllData();
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/product/personelXp/totalListAll.do`;
        const resultData = await axiosFetch(url, {});
        setTableData(resultData);
        setIsLoading(false);
    };

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
        const url = `/api/baseInfrm/product/personelXp/add.do`;
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

        const url = `/api/baseInfrm/product/personelXp/edit.do`;
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
            const poiNms = selectedRows.map((row) => row.peId);
            const url = `/api/baseInfrm/product/personelXp/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    //const [length, setLength] = useState(0);
    //const setLengthSelectRow = (length) => {
    //    setLength(length);
    //};

    const returnData = (row) => {
        setDeleteNames([row.peBaseDate]);
        if (row.peId && selectedRows.peId !== row.peId) {
            setSelectedRows([row]);
            console.log(row);
        }
    };

    console.log(selectedRows);

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
                    <Location pathList={locationPath.LaborRate} />
                    <div className="table-buttons">
                        <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                        <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                        <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                        <RefreshButton onClick={() => setNameOfButton("refresh")} />
                    </div>
                    <ReactDataTable
                        columns={tableColumns}
                        customDatas={tableData}
                        tableRef={LaborRateTable}
                        viewPageName={{ name: "외주사인건비", id: "LaborRate" }}
                        returnSelect={returnData}
                        isSingleSelect={true}
                        //isPageNation={true}
                        //isPageNationCombo={true}
                        //defaultPageSize={20}
                    />
                    {isOpenAdd && (
                        <AddModModal
                            width={500}
                            height={270}
                            list={columns.reference.laborRateAdd}
                            resultData={addToServer}
                            onClose={() => setIsOpenAdd(false)}
                            title="외주사인건비 추가"
                        />
                    )}
                    {isOpenMod && (
                        <AddModModal
                            width={500}
                            height={270}
                            list={columns.reference.laborRateAdd}
                            initialData={selectedRows}
                            resultData={modifyToServer}
                            onClose={() => setIsOpenMod(false)}
                            title="외주사인건비 수정"
                        />
                    )}
                    {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
                </div>
            )}
        </>
    );
}
export default LaborRate;
