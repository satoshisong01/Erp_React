import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import { columns } from "constants/columns";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import BasicButton from "components/button/BasicButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import SearchModal from "components/modal/SearchModal";

/** 실행관리-구매관리 */
function PurchasingMgmtExe() {
    const { setNameOfButton } = useContext(PageContext);
    const [condition, setCondition] = useState({});
    const [runMgmt, setRunMgmt] = useState([]); // 구매 실행관리
    const [view, setView] = useState([]); // 계획 조회
    const [buyCall, setBuyCall] = useState([]); //합계 - 품목그룹&판매사&모델명
    const [isOpenSearch, setIsOpenSearch] = useState(false);

    const fetchAllData = async (condition) => {
        const datas = await axiosFetch("/api/baseInfrm/product/receivingInfo/totalListAll.do", condition);
        const viewData = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", { ...condition, modeCode: "BUDGET" });

        setView(viewData);
        if (datas && datas.length > 0) {
            const calData = changeData(datas);

            const groupedCalData = calData.reduce((result, current) => {
                const existingGroup = result.find(
                    (group) => group.pgNm === current.pgNm && group.pdiNum === current.pdiNum && group.pdiSeller === current.pdiSeller
                );
                if (existingGroup) {
                    existingGroup.byQunty = current.byQunty; //구매수량
                    existingGroup.price = current.price; //구매금액
                    existingGroup.rcvPrice += current.rcvPrice; //입고금액
                    existingGroup.rcvQunty += current.rcvQunty; //입고수량
                    existingGroup.rcvState = setState(existingGroup.byQunty, existingGroup.rcvQunty);
                } else {
                    result.push({ ...current, rcvState: setState(current.byQunty, current.rcvQunty) });
                }

                return result;
            }, []);

            //마지막 토탈 행 구하기
            const totalSummary = groupedCalData.reduce(
                (summary, item) => {
                    summary.byQunty += item.byQunty || 0;
                    summary.price += item.price || 0;
                    summary.rcvPrice += item.rcvPrice || 0;
                    summary.rcvQunty += item.rcvQunty || 0;
                    return summary;
                },
                { byQunty: 0, price: 0, rcvPrice: 0, rcvQunty: 0 }
            );

            groupedCalData.push({
                pgNm: "TOTAL",
                pdiSeller: "",
                byQunty: totalSummary.byQunty,
                price: totalSummary.price,
                rcvPrice: totalSummary.rcvPrice,
                rcvQunty: totalSummary.rcvQunty,
                rcvState: "",
            });

            //상태 업데이트
            calData.forEach((item) => {
                const correspondingGroup = groupedCalData.find(
                    (group) => group.pgNm === item.pgNm && group.pdiNum === item.pdiNum && group.pdiSeller === item.pdiSeller
                );
                if (correspondingGroup) {
                    item.rcvState = correspondingGroup.rcvState;
                }
            });

            setRunMgmt(calData);
            setBuyCall(groupedCalData);
        } else {
            alert("데이터가 없습니다.\n데이터를 입력해 주세요.");
            setRunMgmt([]);
            setBuyCall([]);
        }
    };

    const changeData = (datas) => {
        const calData = datas.map((data) => ({
            ...data,
            price: data.byUnitPrice * data.byQunty,
            rcvPrice: data.rcvUnitPrice * data.rcvQunty,
            rcvState: setState(data.byQunty, data.rcvQunty),
        }));

        return calData;
    };

    const setState = (byQunty, rcvQunty) => {
        if (byQunty < rcvQunty) {
            return "초과입고";
        } else if (byQunty - rcvQunty === 0) {
            return "입고완료";
        } else if (byQunty - rcvQunty === byQunty) {
            return "미입고";
        } else if (byQunty > rcvQunty) {
            return "입고중";
        } else {
            return "상태이상";
        }
    };

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmtExe} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-lightblue" className="mg-b-40">
                <ReactDataTable columns={columns.PurchasingMgmtExe.view} customDatas={view} defaultPageSize={5} hideCheckBox={true} isPageNation={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                <ReactDataTable
                    columns={columns.PurchasingMgmtExe.buyCal}
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
                    suffixUrl="/baseInfrm/product/receivingInfo"
                    editing={true}
                    columns={columns.PurchasingMgmtExe.run}
                    viewLoadDatas={view}
                    customDatas={runMgmt}
                    viewPageName={{ name: "구매(재료비)", id: "PurchasingMgmtExe" }}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
            <SearchModal
                returnData={(companyInfo) => fetchAllData({ ...companyInfo, ...condition })}
                onClose={() => setIsOpenSearch(false)}
                isOpen={isOpenSearch}
                width={350}
                height={210}
                title="구매내역 검색"
            />
        </>
    );
}

export default PurchasingMgmtExe;
