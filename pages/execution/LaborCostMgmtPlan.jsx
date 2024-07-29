import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import { columns } from "constants/columns";
import RefreshButton from "components/button/RefreshButton";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import { ChangePrmnPlanData } from "components/DataTable/function/ReplaceDataFormat";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";

/** 실행관리-인건비-계획 */
function LaborCostMgmtPlan() {
    const { unitPriceList, currentPageName, unitPriceListRenew, setNameOfButton } = useContext(PageContext);

    const [condition, setCondition] = useState({});

    const columnlabor = [
        //인건비
        { header: "연월", col: "pmpMonth", cellWidth: "100", type: "datePicker" },
        { header: "M/M", col: "total", cellWidth: "80" },
        { header: "금액", col: "totalPrice", cellWidth: "174", type: "number" },
        { header: "임원", col: "pmpmmPositionCode1", notView: true },
        { header: "특급기술사", col: "pmpmmPositionCode2", notView: true },
        { header: "고급기술사", col: "pmpmmPositionCode3", notView: true },
        { header: "중급기술사", col: "pmpmmPositionCode4", notView: true },
        { header: "초급기술사", col: "pmpmmPositionCode5", notView: true },
        { header: "고급기능사", col: "pmpmmPositionCode6", notView: true },
        { header: "중급기능사", col: "pmpmmPositionCode7", notView: true },
        { header: "초급기능사", col: "pmpmmPositionCode8", notView: true },
        { header: "부장", col: "pmpmmPositionCode9", cellWidth: "170", type: "input" },
        { header: "차장", col: "pmpmmPositionCode10", cellWidth: "170", type: "input" },
        { header: "과장", col: "pmpmmPositionCode11", cellWidth: "170", type: "input" },
        { header: "대리", col: "pmpmmPositionCode12", cellWidth: "170", type: "input" },
        { header: "주임", col: "pmpmmPositionCode13", cellWidth: "170", type: "input" },
        { header: "사원", col: "pmpmmPositionCode14", cellWidth: "170", type: "input" },
    ];

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, poiMonth: value.poiMonth, typeCode: "MM", modeCode: "BUDGET" };
                fetchAllData(newCondition);
                return newCondition;
            } else {
                fetchAllData(prev);
                return prev;
            }
        });
    };

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 실행인건비계획
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 영업인건비
    const [budgetCal, setBudgetCal] = useState([]); // 합계

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", condition);
        const viewResult = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", { poiId: condition.poiId, costAt: "Y" });
        const changeData = ChangePrmnPlanData(viewResult);

        changeData.forEach((Item) => {
            const yearFromPmpMonth = Item.pmpMonth.slice(0, 4);
            const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === yearFromPmpMonth);
            if (matchingAItem) {
                let totalPrice = 0;
                for (let i = 1; i <= 14; i++) {
                    const gupPriceKey = `gupPrice${i}`;
                    const pmpmmPositionCodeKey = `pmpmmPositionCode${i}`;
                    if (matchingAItem[gupPriceKey]) {
                        totalPrice += matchingAItem[gupPriceKey] * Item[pmpmmPositionCodeKey];
                    }
                }
                Item.totalPrice = totalPrice;
            }
        });

        setBudgetMgmtView(changeData);

        if (resultData && resultData.length > 0) {
            if (unitPriceList && unitPriceList.length > 0) {
                const updatedDatas = resultData.map((data) => {
                    const unit = unitPriceList.find((unit) => data.pecPosition === unit.guppName && unit.gupBaseDate === condition.poiMonth);
                    const price = unit ? data.pecMm * unit.gupPrice : 0;
                    return { ...data, price, positionPrice: unit ? unit.gupPrice : 0 };
                });
                setBudgetMgmt(updatedDatas); //본문

                // pgNm 추출
                const extractPgNm = (dateString) => {
                    if (dateString) {
                        const extraDatas = dateString.split("_");
                        return extraDatas[0]; //0번째 배열 리턴
                    }
                };

                // 새로운 배열로 복사하여 pgNm 변경
                const changeDatas = updatedDatas.map((item) => ({ ...item, pgNm: extractPgNm(item.pgNm) }));

                const groupedByPgnm = changeDatas.reduce((result, current) => {
                    const { pgNm } = current;

                    if (!result[pgNm]) {
                        result[pgNm] = [];
                    }

                    result[pgNm].push(current);

                    return result;
                }, {});

                //month 추출
                const extractMonth = (dateString) => dateString && dateString.substring(0, 7);

                const mergeArr = [];
                Object.keys(groupedByPgnm).forEach((pgNm) => {
                    const groupedData = groupedByPgnm[pgNm].reduce((result, current) => {
                        const dateToGroup = extractMonth(current.pecStartdate); // 연월 부분 추출
                        let existingGroup = result.find((group) => extractMonth(group.month) === dateToGroup);

                        if (!existingGroup) {
                            // 그룹이 없을 경우 초기값 설정
                            existingGroup = {
                                pgNm: "",
                                month: dateToGroup,
                                totalMm: 0,
                                totalPrice: 0,
                                mm9: 0,
                                price9: 0,
                                mm10: 0,
                                price10: 0,
                                mm11: 0,
                                price11: 0,
                                mm12: 0,
                                price12: 0,
                                mm13: 0,
                                price13: 0,
                                mm14: 0,
                                price14: 0,
                            };

                            result.push(existingGroup);
                        }

                        // 누적 값 할당
                        existingGroup.pgNm = current.pgNm;
                        existingGroup.totalMm += Number(current.pecMm);
                        existingGroup.totalPrice += Number(current.price);
                        if (current.pecPosition === "부장") {
                            existingGroup.mm9 += Number(current.pecMm);
                            existingGroup.price9 += Number(current.price);
                        } else if (current.pecPosition === "차장") {
                            existingGroup.mm10 += Number(current.pecMm);
                            existingGroup.price10 += Number(current.price);
                        } else if (current.pecPosition === "과장") {
                            existingGroup.mm11 += Number(current.pecMm);
                            existingGroup.price11 += Number(current.price);
                        } else if (current.pecPosition === "대리") {
                            existingGroup.mm12 += Number(current.pecMm);
                            existingGroup.price12 += Number(current.price);
                        } else if (current.pecPosition === "주임") {
                            existingGroup.mm13 += Number(current.pecMm);
                            existingGroup.price13 += Number(current.price);
                        } else if (current.pecPosition === "사원") {
                            existingGroup.mm14 += Number(current.pecMm);
                            existingGroup.price14 += Number(current.price);
                        }

                        return result;
                    }, []);

                    mergeArr.push(...groupedData);
                });

                let temp = {
                    pgNm: "TOTAL",
                    month: "",
                    totalMm: 0,
                    totalPrice: 0,
                    price9: 0,
                    price10: 0,
                    price11: 0,
                    price12: 0,
                    price13: 0,
                    price14: 0,
                    mm9: 0,
                    mm10: 0,
                    mm11: 0,
                    mm12: 0,
                    mm13: 0,
                    mm14: 0,
                };

                mergeArr.forEach((item) => {
                    temp.totalMm += item.totalMm;
                    temp.totalPrice += item.totalPrice;
                    temp.price9 += item.price9;
                    temp.price10 += item.price10;
                    temp.price11 += item.price11;
                    temp.price12 += item.price12;
                    temp.price13 += item.price13;
                    temp.price14 += item.price14;
                    temp.mm9 += item.mm9;
                    temp.mm10 += item.mm10;
                    temp.mm11 += item.mm11;
                    temp.mm12 += item.mm12;
                    temp.mm13 += item.mm13;
                    temp.mm14 += item.mm14;
                });

                mergeArr.forEach((item) => {
                    item.price9 = item.price9.toLocaleString() + " (" + item.mm9 + ")";
                    item.price10 = item.price10.toLocaleString() + " (" + item.mm10 + ")";
                    item.price11 = item.price11.toLocaleString() + " (" + item.mm11 + ")";
                    item.price12 = item.price12.toLocaleString() + " (" + item.mm12 + ")";
                    item.price13 = item.price13.toLocaleString() + " (" + item.mm13 + ")";
                    item.price14 = item.price14.toLocaleString() + " (" + item.mm14 + ")";
                });

                mergeArr.push({
                    ...temp,
                    price9: temp.price9.toLocaleString() + " (" + temp.mm9 + ")",
                    price10: temp.price10.toLocaleString() + " (" + temp.mm10 + ")",
                    price11: temp.price11.toLocaleString() + " (" + temp.mm11 + ")",
                    price12: temp.price12.toLocaleString() + " (" + temp.mm12 + ")",
                    price13: temp.price13.toLocaleString() + " (" + temp.mm13 + ")",
                    price14: temp.price14.toLocaleString() + " (" + temp.mm14 + ")",
                });

                setBudgetCal(mergeArr);
            }
        } else {
            alert("데이터가 없습니다.\n데이터를 입력해 주세요.");
            setBudgetMgmt([]); // 빈 배열 보내주기
        }
    };

    /* 중복방지 */
    const validate = (datas) => {
        const seen = new Set();

        for (const data of datas) {
            const key = `${data.pgNm}-${data.esntlId}-${data.pecStartdate.substring(0, 7)}`; //시작월이 같으면 중복

            if (seen.has(key)) {
                alert(`[${data.pgNm}, ${data.empNm}] 데이터가 중복입니다. 날짜를 변경해주세요.`);
                return true;
            }
            seen.add(key);
        }

        return false; // 중복 데이터 없음
    };

    const compareData = (originData, updatedData) => {
        const isDuplicateData = validate(updatedData);

        if (!isDuplicateData) {
            if (currentPageName.id !== "LaborCostMgmtPlan") return;
            const filterData = updatedData.filter((data) => data.pgNm); //pgNm 없는 데이터 제외
            const originDataLength = originData ? originData.length : 0;
            const updatedDataLength = filterData ? filterData.length : 0;

            if (originDataLength > updatedDataLength) {
                const updateDataInOrigin = (originData, filterData) => {
                    // 복제하여 새로운 배열 생성
                    const updatedArray = [...originData];
                    // updatedData의 길이만큼 반복하여 originData 갱신
                    for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
                        const updatedItem = filterData[i];
                        updatedArray[i] = { ...updatedItem, pecId: updatedArray[i].pecId };
                    }
                    return updatedArray;
                };

                const firstRowUpdate = updateDataInOrigin(originData, filterData);
                updateList(firstRowUpdate);

                const toDelete = [];
                for (let i = updatedDataLength; i < originDataLength; i++) {
                    toDelete.push(originData[i].pecId);
                }
                deleteList(toDelete);
            } else if (originDataLength === updatedDataLength) {
                updateList(filterData);
            } else if (originDataLength < updatedDataLength) {
                const toAdds = [];
                const addUpdate = [];
                for (let i = 0; i < originDataLength; i++) {
                    addUpdate.push(filterData[i]);
                }
                updateList(addUpdate);

                for (let i = originDataLength; i < updatedDataLength; i++) {
                    // const add = { poiId: condition.poiId };
                    // const typeCode = { typeCode: "MM" };
                    // const modeCode = { modeCode: "BUDGET" };
                    toAdds.push({ ...filterData[i], poiId: condition.poiId, typeCode: "MM", modeCode: "BUDGET" });
                }
                addList(toAdds);
            }
        }
    };

    const addList = async (addNewData) => {
        console.log("❗addList:", addNewData);
        const url = `/api/baseInfrm/product/prstmCost/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        refresh();
    };
    const updateList = async (toUpdate) => {
        console.log("❗updateList:", toUpdate);
        const updatedFilterData = toUpdate.map((data) => ({
            ...data,
            useAt: "Y",
            deleteAt: "N",
        }));
        const url = `/api/baseInfrm/product/prstmCost/editList.do`;
        const resultData = await axiosUpdate(url, updatedFilterData);
        refresh();
    };

    const deleteList = async (removeItem) => {
        console.log("❗deleteList:", removeItem);
        const url = `/api/baseInfrm/product/prstmCost/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        refresh();
    };

    return (
        <>
            <Location pathList={locationPath.LaborCostMgmt} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-lightblue" className="mg-b-40">
                <ReactDataTable columns={columnlabor} customDatas={budgetMgmtView} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                <ReactDataTable
                    columns={columns.laborCostMgmt.budgetView}
                    customDatas={budgetCal}
                    defaultPageSize={5}
                    hideCheckBox={true}
                    isSpecialRow={true}
                />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    editing={true}
                    columns={columns.laborCostMgmt.budget}
                    customDatas={budgetMgmt}
                    viewPageName={{ name: "인건비계획", id: "LaborCostMgmtPlan" }}
                    returnList={compareData}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default LaborCostMgmtPlan;
