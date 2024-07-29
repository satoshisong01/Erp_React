import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import { columns } from "constants/columns";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import BasicButton from "components/button/BasicButton";
import DelButton from "components/button/DelButton";
import AddButton from "components/button/AddButton";
import SearchModal from "components/modal/SearchModal";

/** 실행관리-구매-계획 */
function PurchasingMgmtPlan() {
    const { setNameOfButton } = useContext(PageContext);
    const [condition, setCondition] = useState({});
    const [budgetMgmt, setBudgetMgmt] = useState([]);
    const [buyCall, setBuyCall] = useState([]);
    const [view, setView] = useState([]);
    const [totalSummary, setTotalSummary] = useState({ byQunty: 0, price: 0 });
    const [isOpenSearch, setIsOpenSearch] = useState(false);

    const fetchAllData = async (condition) => {
        const data = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", condition);
        const viewResult = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", { poiId: condition.poiId, costAt: "Y" });
        setView(viewResult);
        if (data && data.length > 0) {
            const changes = changeData(data);
            setBudgetMgmt(changes);
            const groupedData = changes.reduce((result, current) => {
                const existingGroup = result.find((group) => group.pdiSeller === current.pdiSeller && group.pgNm === current.pgNm); //제조사, 품목그룹
                if (existingGroup) {
                    existingGroup.byQunty += current.byQunty;
                    existingGroup.price += current.price;
                } else {
                    result.push({ ...current });
                }
                return result;
            }, []);

            //마지막 토탈 행 구하기
            const temp = groupedData.reduce(
                (summary, item) => {
                    summary.byQunty += item.byQunty || 0;
                    summary.price += item.price || 0;
                    return summary;
                },
                { byQunty: 0, price: 0 }
            );

            groupedData.push({
                pgNm: "TOTAL",
                pdiSeller: "",
                byQunty: temp.byQunty,
                price: temp.price,
            });

            setTotalSummary({ byQunty: temp.byQunty.toLocaleString() || 0, price: temp.price.toLocaleString() || 0 });
            setBuyCall(groupedData); //합계
        } else {
            alert("데이터가 없습니다.\n데이터를 입력해 주세요.");
            setBuyCall([]);
            setBudgetMgmt([]);
        }
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({ ...data, price: data.byUnitPrice * data.byQunty }));
        return updateData;
    };

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, modeCode: "BUDGET" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-lightblue" className="mg-b-40">
                <ReactDataTable columns={columns.PurchasingMgmtExe.planView} customDatas={view} defaultPageSize={5} hideCheckBox={true} isPageNation={true} />
            </HideCard>
            <HideCard title={"합계 [수량:" + totalSummary.byQunty + " 금액:" + totalSummary.price + "]"} color="back-lightblue" className="mg-b-40">
                <ReactDataTable
                    columns={columns.PurchasingMgmtPlan.total}
                    customDatas={buyCall}
                    defaultPageSize={5}
                    hideCheckBox={true}
                    isPageNation={true}
                    isSpecialRow={true}
                />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <BasicButton label="검색하기" onClick={() => setIsOpenSearch(true)} />
                    <BasicButton label={"가져오기"} onClick={() => setNameOfButton("load")} />
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTablePdorder
                    suffixUrl="/baseInfrm/product/buyIngInfoExe"
                    editing={true}
                    columns={columns.PurchasingMgmtExe.budget}
                    viewLoadDatas={view}
                    customDatas={budgetMgmt}
                    viewPageName={{ name: "구매(재료비)", id: "PurchasingMgmtPlan" }}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
            <SearchModal
                returnData={(condition) => fetchAllData(condition)}
                onClose={() => setIsOpenSearch(false)}
                isOpen={isOpenSearch}
                width={350}
                height={210}
                title="구매내역 검색"
            />
        </>
    );
}

export default PurchasingMgmtPlan;
