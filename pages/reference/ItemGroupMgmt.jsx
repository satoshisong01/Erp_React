import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import { PageContext } from "components/PageProvider";
import { columns } from "constants/columns";
import AddModModal from "components/modal/AddModModal";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import DeleteModal from "components/modal/DeleteModal";

/** 기준정보관리-품목관리-품목그룹관리 */
function ItemGroupMgmt() {
    const { setNameOfButton, currentPageName } = useContext(PageContext);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const itemGroupMgmtTable = useRef(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    useEffect(() => {
        // console.log(selectedRows);
        selectedRows && setDeleteNames(selectedRows.map((row) => row.pgNm));
    }, [selectedRows]);

    useEffect(() => {
        fetchAllData();
    }, [currentPageName]);

    const refresh = () => {
        fetchAllData();
    };

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
        const url = `/api/baseInfrm/product/productGroup/add.do`;
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

        const url = `/api/baseInfrm/product/productGroup/edit.do`;
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
            const poiNms = selectedRows.map((row) => row.pgId);
            const url = `/api/baseInfrm/product/productGroup/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/product/productGroup/totalListAll.do`;
        const resultData = await axiosFetch(url, {});
        setTableData(resultData);
        setIsLoading(false);
    };

    const conditionList = [
        {
            title: "품목그룹명",
            colName: "pgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "작성자",
            colName: "createIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
    ];

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
                    <Location pathList={locationPath.ItemGroupMgmt} />
                    <SearchList conditionList={conditionList} />
                    <div className="table-buttons">
                        <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                        <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                        <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                        <RefreshButton onClick={() => setNameOfButton("refresh")} />
                    </div>
                    <ReactDataTable
                        columns={columns.reference.itemGroupMgmt}
                        customDatas={tableData}
                        tableRef={itemGroupMgmtTable}
                        viewPageName={{ name: "품목그룹관리", id: "ItemGroupMgmt" }}
                        returnSelectRows={(data) => {
                            setSelectedRows(data);
                        }}
                        isPageNation={true}
                        isPageNationCombo={true}
                        defaultPageSize={20}
                    />
                    {isOpenAdd && (
                        <AddModModal
                            width={500}
                            height={120}
                            list={columns.reference.groupAddMod}
                            resultData={addToServer}
                            onClose={() => setIsOpenAdd(false)}
                            title="품목그룹 추가"
                        />
                    )}
                    {isOpenMod && (
                        <AddModModal
                            width={500}
                            height={120}
                            list={columns.reference.groupModifyMod}
                            initialData={selectedRows}
                            resultData={modifyToServer}
                            onClose={() => setIsOpenMod(false)}
                            title="품목그룹 수정"
                        />
                    )}
                    {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
                </div>
            )}
        </>
    );
}

export default ItemGroupMgmt;
