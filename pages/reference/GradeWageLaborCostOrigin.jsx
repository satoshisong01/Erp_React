import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { ReorganizeManCostOrigin } from "components/DataTable/function/ReorganizeData";
import SaveButton from "components/button/SaveButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import BasicButton from "components/button/BasicButton";

/** 기준정보관리-원가기준관리-급별단가(인건비) */
function GradeWageLaborCost() {
    const { setNameOfButton } = useContext(PageContext);
    const [tableData, setTableData] = useState([]);
    const gradeWageExpenseTable = useRef(null);
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [edit, setEdit] = useState(false);

    const handleChangeEdit = () => {
        setEdit(!edit);
    };

    const { innerPageName, setInnerPageName } = useContext(PageContext);
    useEffect(() => {
        fetchAllData();
        setInnerPageName("급별단가(인건비)");
    }, []);

    const columns = [
        { header: "단가ID", col: "gupId", cellWidth: "0", type: "input", notView: true },
        { header: "기준연도", col: "year", cellWidth: "104", type: "input" },
        // { header: "단위", col: "gupUnit", cellWidth: "100", type: "input" },
        // { header: "기준명", col: "gupDesc", cellWidth: "100", type: "input" },
        { header: "임원", col: "gupPrice1", cellWidth: "100", type: "input", textAlign: "right" },
        { header: "부장", col: "gupPrice9", cellWidth: "100", type: "input", textAlign: "right" },
        { header: "차장", col: "gupPrice10", cellWidth: "100", type: "input", textAlign: "right" },
        { header: "과장", col: "gupPrice11", cellWidth: "100", type: "input", textAlign: "right" },
        { header: "대리", col: "gupPrice12", cellWidth: "100", type: "input", textAlign: "right" },
        { header: "주임", col: "gupPrice13", cellWidth: "100", type: "input", textAlign: "right" },
        { header: "사원", col: "gupPrice14", cellWidth: "100", type: "input", textAlign: "right" },
        { header: "특급기술사", col: "gupPrice2", cellWidth: "82", type: "input", textAlign: "right" },
        { header: "고급기술사", col: "gupPrice3", cellWidth: "82", type: "input", textAlign: "right" },
        { header: "중급기술사", col: "gupPrice4", cellWidth: "82", type: "input", textAlign: "right" },
        { header: "초급기술사", col: "gupPrice5", cellWidth: "82", type: "input", textAlign: "right" },
        { header: "고급기능사", col: "gupPrice6", cellWidth: "82", type: "input", textAlign: "right" },
        { header: "중급기능사", col: "gupPrice7", cellWidth: "82", type: "input", textAlign: "right" },
        { header: "초급기능사", col: "gupPrice8", cellWidth: "82", type: "input", textAlign: "right" },
    ];

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/product/gradeunitPrice/type/p/listAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "resultData18148");
        console.log(ReorganizeManCostOrigin(resultData), "이게왜 이따구로");
        setTableData(ReorganizeManCostOrigin(resultData));
        setIsLoading(false);
    };

    useEffect(() => {
        console.log(tableData, "tableData");
    }, [tableData]);

    const returnList = (originTableData, tableData) => {
        console.log(originTableData, "오리지날");
        console.log(tableData, "ㅌ[ㅔ이블");
        compareData(originTableData, tableData);
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.year); //gupDesc 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        console.log(originDataLength, "오리지날길이");
        console.log(updatedDataLength, "업데이트길이");

        if (originDataLength > updatedDataLength) {
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, gupId: updatedArray[i].gupId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateItemArray(firstRowUpdate);

            const toDelete = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                toDelete.push(originData[i].gupId);
            }
            deleteItem(toDelete);
        } else if (originDataLength === updatedDataLength) {
            updateItemArray(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            updateItemArray(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const toAdd = { ...filterData[i] };
                toAdd.useAt = "Y";
                toAdd.deleteAt = "N";
                toAdd.gupType = "P";
                toAdd.gupUnit = "원";
                toAdd.gupDesc = "인건비";
                toAdd.gupBaseDate = filterData[i].year;

                for (let j = 1; j <= 14; j++) {
                    if (toAdd[`gupPrice${j}`] === null) {
                        toAdd[`gupPrice${j}`] = 0;
                    }
                }

                toAdds.push(toAdd);
            }
            addItemArray(toAdds);
        }
    };

    const addItemArray = async (addData) => {
        console.log(addData, "추가들어오려는값");
        const url = `/api/baseInfrm/product/gradeunitPrice/addList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "더해진 배열 맞음?");
        if (resultData) {
            refresh();
        }
    };

    const updateItemArray = async (toUpdate) => {
        console.log(toUpdate, "업데이트되는 데이터 퓨어값");
        const dataArray = generateUpdateObjects(toUpdate);
        console.log(dataArray, "dataArray🔥🔥🔥 변경값");
        const url = `/api/baseInfrm/product/gradeunitPrice/editList.do`;
        const resultData = await axiosUpdate(url, dataArray);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            refresh();
        }
    };

    const deleteItem = async (removeItem) => {
        console.log(removeItem, "삭제될것들");
        const url = `/api/baseInfrm/product/gradeunitPrice/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem[0]);
        console.log(resultData, "지워진거맞음?");

        if (resultData) {
            refresh();
        }
    };

    const refresh = () => {
        fetchAllData();
    };

    const generateUpdateObjects = (updatedData) => {
        let updates = [];

        console.log(updatedData, "퓨어 받언거");

        updatedData.forEach((upItem) => {
            const { gupId } = upItem; // id 배열
            const { guppId } = upItem; // id 배열
            const colNames = Object.keys(upItem).filter((key) => key.startsWith("gupPrice")); // 경비종류 배열
            if (gupId && colNames && gupId.length > 0 && colNames.length > 0 && gupId.length === colNames.length) {
                colNames.forEach((name, index) => {
                    const dataSet = {
                        gupDesc: upItem.gupDesc,
                        gupId: gupId[index],
                        gupPrice: upItem[name],
                        gupType: upItem.gupType,
                        gupBaseDate: upItem.year,
                        year: upItem.year,
                        guppId: guppId[index],
                    };

                    updates.push(dataSet);
                });
            }
        });
        console.log(updates, "변경되고난후 값 배열안 객체여야함");
        return updates;
    };

    const returnData = (row) => {
        console.log(row.gupId);
        if (row.gupId && selectedRows.peId !== row.gupId) {
            setSelectedRows(row.gupId);
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
                    <Location pathList={locationPath.GradeWageLaborCost} />
                    <div className="table-buttons mg-t-10 mg-b-10">
                        <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                        <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                        <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                        <BasicButton label={"활성화"} onClick={() => handleChangeEdit()} />
                        <RefreshButton onClick={refresh} />
                    </div>
                    <ReactDataTable
                        editing={edit}
                        isSingleSelect={true}
                        columns={columns}
                        customDatas={tableData}
                        returnList={returnList}
                        returnSelect={returnData}
                        //suffixUrl="/api/baseInfrm/product/gradeunitPrice/type/p"
                        tableRef={gradeWageExpenseTable}
                        //setLengthSelectRow={setLengthSelectRow}
                        viewPageName={{ name: "급별단가(인건비)", id: "GradeWageLaborCost" }}
                    />
                </div>
            )}
        </>
    );
}

export default GradeWageLaborCost;
