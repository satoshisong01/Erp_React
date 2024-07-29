import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { columns } from "constants/columns";
import RefreshButton from "components/button/RefreshButton";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import SaveButton from "components/button/SaveButton";
import { ChangePrmnPlanData } from "components/DataTable/function/ReplaceDataFormat";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import BasicButton from "components/button/BasicButton";

/** 실행관리-인건비-실행 */
function LaborCostMgmtExe() {
    const { innerPageName, unitPriceList, currentPageName, setNameOfButton } = useContext(PageContext);

    const [condition, setCondition] = useState({});

    const columnBugetView = [
        //인건비 예산
        { header: "프로젝트ID", col: "poiId", notView: true },
        {
            header: "구분코드",
            col: "modeCode",
            notView: true,
        },
        {
            header: "타입코드",
            col: "typeCode",
            notView: true,
        },
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "235",
            type: "productGroup",
            require: true,
        },
        { header: "담당자", col: "empNm", cellWidth: "150", type: "employerInfo", require: true },
        { header: "담당자ID", col: "esntlId", cellWidth: "150", notView: true },
        { header: "부서", col: "orgNm", cellWidth: "150" },
        {
            header: "직급",
            col: "posNm",
            cellWidth: "150",
            //type: "select",
            options: [
                { value: "", label: "선택" },
                { value: "부장", label: "부장" },
                { value: "차장", label: "차장" },
                { value: "과장", label: "과장" },
                { value: "대리", label: "대리" },
                { value: "주임", label: "주임" },
                { value: "사원", label: "사원" },
            ],
        },
        {
            header: "시작일",
            col: "pecStartdate",
            cellWidth: "150",
            type: "dayPicker",
        },
        {
            header: "종료일",
            col: "pecEnddate",
            cellWidth: "150",
            type: "dayPicker",
        },
        {
            header: "예산(M/M)",
            col: "pecMm",
            cellWidth: "150",
            type: "input",
            require: true,
        },
        {
            header: "금액",
            col: "price",
            cellWidth: "245",
            //type: "input",
        },
    ];

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, poiMonth: value.poiMonth, typeCode: "MM", modeCode: "EXECUTE" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const [budgetMgmtRun, setBudgetMgmRun] = useState([]); // 실행인건비실행
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 실행인건비실행
    const [budgetCal, setBudgetCal] = useState([]); // 합계

    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", condition);
        const viewResult = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", { ...condition, modeCode: "BUDGET" });
        const viewUpdatedDatas = calculation(unitPriceList, viewResult, condition.poiMonth);
        setBudgetMgmtView(viewUpdatedDatas);
        if (resultData && resultData.length > 0) {
            if (unitPriceList && unitPriceList.length > 0) {
                const updatedDatas = calculation(unitPriceList, resultData, condition.poiMonth);
                setBudgetMgmRun(updatedDatas);

                // 월을 추출하는 함수
                function extractMonth(dateString) {
                    return dateString && dateString.substring(0, 7);
                }

                const groupedData = updatedDatas.reduce((result, current) => {
                    const dateToGroup = extractMonth(current.pecStartdate); // 연월 부분 추출
                    let existingGroup = result.find((group) => extractMonth(group.month) === dateToGroup);

                    console.log("current:", current.pecPosition);

                    if (!existingGroup) {
                        // 그룹이 없을 경우 초기값 설정
                        existingGroup = {
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

                let temp = {
                    month: "TOTAL",
                    totalMm: 0,
                    totalPrice: 0,
                    price9: 0,
                    price10: 0,
                    price11: 0,
                    price12: 0,
                    price13: 0,
                    price14: 0,
                };

                groupedData.forEach((item) => {
                    temp.totalMm += item.totalMm;
                    temp.totalPrice += item.totalPrice;
                    temp.price9 += item.price9;
                    temp.price10 += item.price10;
                    temp.price11 += item.price11;
                    temp.price12 += item.price12;
                    temp.price13 += item.price13;
                    temp.price14 += item.price14;
                });

                groupedData.forEach((item) => {
                    item.price9 = item.price9.toLocaleString() + " (" + item.mm9 + ")";
                    item.price10 = item.price10.toLocaleString() + " (" + item.mm10 + ")";
                    item.price11 = item.price11.toLocaleString() + " (" + item.mm11 + ")";
                    item.price12 = item.price12.toLocaleString() + " (" + item.mm12 + ")";
                    item.price13 = item.price13.toLocaleString() + " (" + item.mm13 + ")";
                    item.price14 = item.price14.toLocaleString() + " (" + item.mm14 + ")";
                });

                groupedData.push({ ...temp });

                setBudgetCal(groupedData);
            }
        } else {
            alert("데이터가 없습니다.\n데이터를 입력해 주세요.");
            setBudgetMgmRun([]);
        }
    };

    const calculation = (unitPriceList, resultData, month) => {
        const updatedDatas = resultData.map((data) => {
            const unit = unitPriceList.find((unit) => data.pecPosition === unit.guppName && unit.gupBaseDate === month);
            if (unit) {
                const price = unit ? data.pecMm * unit.gupPrice : 0; // 적절한 기본값 사용
                return { ...data, price: price, positionPrice: unit.gupPrice };
            } else {
                return { ...data, price: 0, positionPrice: 0 };
            }
        });
        return updatedDatas;
    };

    /* 중복방지 */
    const validate = (datas) => {
        const seen = new Set();

        for (const data of datas) {
            const key = `${data.pgNm}-${data.esntlId}-${data.pecStartdate.substring(0, 7)}`; //시작월이 같으면 중복

            console.log("실행: ", key);
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
                    const add = { poiId: condition.poiId };
                    const typeCode = { typeCode: "MM" };
                    const modeCode = { modeCode: "EXECUTE" };
                    toAdds.push({ ...filterData[i], ...add, ...typeCode, ...modeCode });
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
            <ApprovalFormExe viewPageName="인건비실행" returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-lightblue" className="mg-b-40">
                <ReactDataTable columns={columnBugetView} customDatas={budgetMgmtView} defaultPageSize={5} hideCheckBox={true} isPageNation={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                <ReactDataTable
                    columns={columns.laborCostMgmt.budgetView}
                    customDatas={budgetCal}
                    defaultPageSize={5}
                    hideCheckBox={true}
                    isPageNation={true}
                    isSpecialRow={true}
                />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <BasicButton label={"가져오기"} onClick={() => setNameOfButton("load")} />
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    editing={true}
                    columns={columns.laborCostMgmt.run}
                    viewLoadDatas={budgetMgmtView}
                    customDatas={budgetMgmtRun}
                    viewPageName={{ name: "인건비실행", id: "LaborCostMgmtExe" }}
                    returnList={compareData}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default LaborCostMgmtExe;
