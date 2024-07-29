import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import RefreshButton from "components/button/RefreshButton";
import DelButton from "components/button/DelButton";
import ModButton from "components/button/ModButton";
import AddButton from "components/button/AddButton";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { columns } from "constants/columns";
import AddModModal from "components/modal/AddModModal";
import HideCard from "components/HideCard";
import DeleteModal from "components/modal/DeleteModal";

/** 영업관리-프로젝트관리 */
function ProjectMgmt() {
    const { projectInfo, currentPageName } = useContext(PageContext);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [tableData, setTableData] = useState([]);
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록

    useEffect(() => {
        // console.log(selectedRows);
        selectedRows && setDeleteNames(selectedRows.map((row) => row.poiNm));
    }, [selectedRows]);

    useEffect(() => {
        if (currentPageName.id === "ProjectMgmt") {
            // fetchAllData({poiStatusBudget : "ALL"}); //맨처음에 부르기..
            fetchAllData(); //맨처음에 부르기..
        }
    }, [currentPageName]);

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
        const url = `/api/baseInfrm/product/pjOrdrInfo/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
            poiId: projectInfo.poiId,
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

        const url = `/api/baseInfrm/product/pjOrdrInfo/edit.do`;
        const updated = { ...updatedData, lockAt: "Y", useAt: "Y" };
        const resultData = await axiosUpdate(url, updated);
        console.log(resultData);
        if (resultData) {
            alert("수정되었습니다");
            refresh();
        } else {
            alert("error!!");
        }
    };

    const deleteToServer = async (value) => {
        if (value === "임시삭제") {
            /* 임시삭제 코드 구현 */
        } else if (value === "영구삭제") {
            const poiNms = selectedRows.map((row) => row.poiId);
            const url = `/api/baseInfrm/product/pjOrdrInfo/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 프로젝트가 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const refresh = () => {
        // fetchAllData({poiStatusBudget : "ALL"});
        fetchAllData();
    };

    const onSearch = (condition) => {
        fetchAllData(condition);
    };

    const fetchAllData = async (condition) => {
        const url = `/api/baseInfrm/product/pjOrdrInfo/totalListAll.do`;
        // console.log("condition:", condition);
        const resultData = await axiosFetch(url, condition || {});
        setTableData(resultData);
    };

    return (
        <>
            <Location pathList={locationPath.projectMgmt} />
            <SearchList conditionList={columns.projectMgmt.condition} onSearch={onSearch} />
            <HideCard title="프로젝트 목록" color="back-lightblue" className="mg-b-40">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                    <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                    <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    columns={columns.projectMgmt.project}
                    customDatas={tableData}
                    viewPageName={{id:"ProjectMgmt", name:"프로젝트관리"}}
                    returnSelectRows={(data) => {
                        setSelectedRows(data);
                    }}
                    isPageNation={true}
                    isSingleSelect={true}
                />
            </HideCard>
            {isOpenAdd && (
                <AddModModal
                    width={500}
                    height={480}
                    list={columns.projectMgmt.addMod}
                    resultData={addToServer}
                    onClose={() => setIsOpenAdd(false)}
                    title="프로젝트 추가"
                />
            )}
            {isOpenMod && (
                <AddModModal
                    width={500}
                    height={480}
                    list={columns.projectMgmt.addMod}
                    initialData={selectedRows}
                    resultData={modifyToServer}
                    onClose={() => setIsOpenMod(false)}
                    title="프로젝트 수정"
                />
            )}
            {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
        </>
    );
}

export default ProjectMgmt;
