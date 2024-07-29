import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { ReorganizeData } from "components/DataTable/function/ReorganizeData";
import SaveButton from "components/button/SaveButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import BasicButton from "components/button/BasicButton";
import RefreshButton from "components/button/RefreshButton";
import { PageContext } from "components/PageProvider";
import AddModModal from "components/modal/AddModModal";
import DeleteModal from "components/modal/DeleteModal";
import ModButton from "components/button/ModButton";
import { columns } from "constants/columns";

/** 기준정보관리-원가기준관리-급별단가(경비) */
function GradeWageExpense() {
    const { setNameOfButton } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const gradeWageExpenseTable = useRef(null);
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)
    const [edit, setEdit] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);

    const columnsTable = [
        { header: "단가ID", col: "gupId", cellWidth: "0", type: "input", notView: true },
        { header: "기준연도", col: "gupBaseDate", cellWidth: "300", type: "input" },
        { header: "기준명", col: "gupDesc", cellWidth: "350", type: "input", textAlign: "left" },
        { header: "직책", col: "guppName", cellWidth: "350", type: "input", textAlign: "right" },
        { header: "단가", col: "gupPrice", cellWidth: "363", type: "input", textAlign: "right" },
        { header: "직책번호", col: "guppId", cellWidth: "0", type: "input", textAlign: "right", notView: true },
    ];

    const handleChangeEdit = () => {
        setEdit(!edit);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/product/gradeunitPrice/type/g/listAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        //console.log(resultData, "resultData🤔🤔🤔🤔🤔");
        //console.log(ReorganizeData(resultData), "⭐⭐⭐⭐⭐");
        //setTableData(ReorganizeData(resultData));
        setTableData(resultData);
        setIsLoading(false);
    };

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
        const url = `/api/baseInfrm/product/gradeunitPrice/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
            gupType: "G",
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

        const url = `/api/baseInfrm/product/gradeunitPrice/edit.do`;
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
            const poiNms = selectedRows.map((row) => row.gupId);
            const url = `/api/baseInfrm/product/gradeunitPrice/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const refresh = () => {
        fetchAllData();
    };

    const returnData = (row) => {
        console.log(row);
        setDeleteNames([row.guppName]);
        if (row.gupId && selectedRows.gupId !== row.gupId) {
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
                    <Location pathList={locationPath.GradeWageExpense} />
                    <div className="table-buttons">
                        <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                        <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                        <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                        <RefreshButton onClick={() => setNameOfButton("refresh")} />
                    </div>
                    <ReactDataTable
                        editing={edit}
                        isSingleSelect={true}
                        columns={columnsTable}
                        customDatas={tableData}
                        tableRef={gradeWageExpenseTable}
                        returnSelect={returnData}
                        //setLengthSelectRow={setLengthSelectRow}
                        viewPageName={{ name: "급별단가(경비)", id: "GradeWageExpense" }}
                    />
                    {isOpenAdd && (
                        <AddModModal
                            width={500}
                            height={160}
                            list={columns.reference.GradeWageExpAdd}
                            resultData={addToServer}
                            onClose={() => setIsOpenAdd(false)}
                            title="급별단가(경비) 추가"
                        />
                    )}
                    {isOpenMod && (
                        <AddModModal
                            width={500}
                            height={160}
                            list={columns.reference.GradeWageExpAdd}
                            initialData={selectedRows}
                            resultData={modifyToServer}
                            onClose={() => setIsOpenMod(false)}
                            title="급별단가(경비) 수정"
                        />
                    )}
                    {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
                </div>
            )}
        </>
    );
}

export default GradeWageExpense;
