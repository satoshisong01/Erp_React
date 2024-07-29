import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import SaveButton from "components/button/SaveButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";

/** 영업관리-영업비(정산) : 실행경비 */
function SalesExpenses() {
    const { currentPageName, setNameOfButton } = useContext(PageContext);

    const [condition, setCondition] = useState({ poiId: "", pjbgTypeCode: "EXPNS19", modeCode: "EXECUTE" });

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, pjbgTypeCode: "EXPNS19", modeCode: "EXECUTE" };
                fetchAllData(newCondition);
                return newCondition;
            } else {
                fetchAllData(prev);
            }
            return prev;
        });
    };

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const [salesCost, setSalesCost] = useState([]); //실행 영업비
    const [salesCostView, setSalesCostView] = useState([]); //영업 영업비
    const [salesCostTotal, setSalesCostTotal] = useState([{ totalPrice: 0 }]); // 구매합계

    let totalPrice = 0;

    useEffect(() => {
        if (condition.poiId === undefined || condition.poId === "") {
            //테이블 초기화
            setSalesCost([]);
        }
    }, [currentPageName, condition]);

    const costListCol = [
        { header: "프로젝트ID", col: "poiId", notView: true },
        { header: "사용여부", col: "deleteAt", notView: true },
        { header: "삭제여부", col: "useAt", notView: true },
        { header: "타입코드", col: "pjbgTypeCode", notView: true },
        { header: "내용", col: "pjbgDesc", cellWidth: "933" },
        { header: "금액", col: "pjbgPrice", cellWidth: "441" },
    ];
    const columnsData = [
        { header: "프로젝트ID", col: "poiId", notView: true },
        { header: "사용여부", col: "deleteAt", notView: true },
        { header: "삭제여부", col: "useAt", notView: true },
        { header: "타입코드", col: "pjbgTypeCode", notView: true },
        { header: "내용", col: "pjbgDesc", cellWidth: "900", type: "input" },
        { header: "금액", col: "pjbgPrice", cellWidth: "441", type: "input", require: true },
    ];

    const totalColumns = [
        {
            header: "총 영업비",
            col: "totalPrice",
            cellWidth: "1378",
        },
    ];

    const choiceData = {
        poiId: condition.poiId,
        pjbgTypeCode: "EXPNS19",
    };

    const fetchAllData = async (condition) => {
        const exeDatas = await axiosFetch("/api/baseInfrm/product/pjbudgetExe/totalListAll.do", condition);
        const salesDatas = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", choiceData);
        console.log("영업조회:", salesDatas);
        setSalesCost(exeDatas);
        console.log("실행조회:", exeDatas);
        setSalesCostView(salesDatas);
        let countTotal = 0;
        exeDatas.map((item) => {
            countTotal += item.pjbgPrice;
        });
        setSalesCostTotal([{ totalPrice: countTotal }]);
    };

    useEffect(() => {
        setSalesCost([]);
    }, [condition]);

    //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
    const updateDataInOrigin = (originData, updatedData) => {
        const updatedArray = [...originData];
        for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
            const updatedItem = updatedData[i];
            updatedArray[i] = { ...updatedItem, pjbgId: updatedArray[i].pjbgId };
        }
        return updatedArray;
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pjbgPrice); //pjbgPrice 없는 데이터 제외
        filterData.forEach((el) => {
            return (
                (el.poiId = condition.poiId), (el.modeCode = condition.modeCode), (el.pjbgTypeCode = condition.pjbgTypeCode), (el.esntlId = "USR_0000000003") //이수형 고정(필수값)
            );
        });
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            const isMod = updateItem(firstRowUpdate); //수정

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].pjbgId);
                delListTest.push(originData[i]);
            }
            const isDel = deleteItem(delList); //삭제
            if (isMod && isDel) {
                alert("저장완료");
            }
        } else if (originDataLength === updatedDataLength) {
            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            const isMod = updateItem(firstRowUpdate); //수정
            if (isMod) {
                alert("저장완료");
            }
        } else if (originDataLength < updatedDataLength) {
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            const isMod = updateItem(firstRowUpdate); //수정

            const addList = [];
            for (let i = originDataLength; i < updatedDataLength; i++) {
                addList.push(filterData[i]);
            }
            const isAdd = addItem(addList); //추가
            if (isMod && isAdd) {
                alert("저장완료");
            }
        }
        refresh();
    };

    const addItem = async (addData) => {
        if (!addData || addData?.length === 0) return;
        const resultData = await axiosPost("/api/baseInfrm/product/pjbudgetExe/addList.do", addData); //---> pjbgcode1이렇게하는게 아닌거?
        if (resultData) {
            return true;
        } else {
            return false;
        }
    };

    const updateItem = async (toUpdate) => {
        if (!toUpdate || toUpdate?.length === 0) return;
        const resultData = await axiosUpdate("/api/baseInfrm/product/pjbudgetExe/editList.do", toUpdate);
        if (resultData) {
            return true;
        } else {
            return false;
        }
    };

    const deleteItem = async (removeItem) => {
        const mergedArray = [].concat(...removeItem);
        const resultData = await axiosDelete("/api/baseInfrm/product/pjbudgetExe/removeAll.do", mergedArray);
        if (resultData) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            <Location pathList={locationPath.SalesExpenses} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-lightblue" className="mg-b-40">
                <ReactDataTable columns={costListCol} customDatas={salesCostView} defaultPageSize={5} hideCheckBox={true} isPageNation={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                <ReactDataTable columns={totalColumns} customDatas={salesCostTotal} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTableURL
                    editing={true}
                    columns={columnsData}
                    returnList={(origin, update) => compareData(origin, update)}
                    customDatas={salesCost}
                    viewPageName={{ name: "영업비(정산)", id: "SalesExpenses" }}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default SalesExpenses;
