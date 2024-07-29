import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { columns } from "constants/columns";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
/** 실행관리-경비-계획 */
function ExpenseMgmtPlan() {
    const { setNameOfButton } = useContext(PageContext);
    const [pjbudgetDatasView, setPjbudgetDatasView] = useState([]); // 경비
    const [condition, setCondition] = useState({});

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 경비 예산관리
    const [cal, setCal] = useState([]);

    /* 중복방지 */
    const validate = (datas) => {
        const seen = new Set();

        for (const data of datas) {
            const key = `${data.pjbgDt.substring(0, 7)}-${data.esntlId}`; //연월, 출장인이 같으면 중복

            if (seen.has(key)) {
                alert(`[${data.pjbgDt.substring(0, 7)}, ${data.empNm}] 데이터가 중복입니다. 날짜를 변경해주세요.`);
                return true;
            }
            seen.add(key);
        }
        return false; // 중복 데이터 없음
    };

    const transformDataToServer = (datas) => {
        datas.forEach((item) => {
            item.modeCode = "BUDGET";

            for (let i = 1; i <= 20; i++) {
                const expnsKey = `EXPNS${i.toString().padStart(2, "0")}`;
                const pjbgTypeKey = `pjbgTypeCode${i}`;
                if (item.hasOwnProperty(expnsKey)) {
                    if (item[expnsKey]) {
                        //값이 있다면
                        item[pjbgTypeKey] = item[expnsKey];
                    }
                    delete item[expnsKey];
                }
            }
        });
        return datas;
    };

    const compareData = (originData, updatedData) => {
        // console.log("updatedData:", updatedData);
        if (!originData) return;
        const isDuplicateData = validate(transformDataToServer(updatedData)); // 중복방지

        if (!isDuplicateData) {
            const filterData = updatedData.filter((data) => data.poiId && data.empNm && data.pjbgBeginDt && data.pjbgEndDt); //pmpMonth가 없는 데이터 제외
            const originDataLength = originData ? originData.length : 0;
            const updatedDataLength = filterData ? filterData.length : 0;

            if (originDataLength > updatedDataLength) {
                //수정
                const updateDataInOrigin = (originData, filterData) => {
                    const updatedArray = [...originData];
                    for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
                        const updatedItem = filterData[i];
                        updatedArray[i] = { ...updatedItem };
                    }
                    return updatedArray;
                };

                const firstRowUpdate = updateDataInOrigin(originData, filterData);

                // console.log("1번 수정.", firstRowUpdate);
                updateItem(firstRowUpdate);

                //삭제
                const delList = [];
                const delListTest = [];

                for (let i = updatedDataLength; i < originDataLength; i++) {
                    const dataObj = originData[i];
                    for (const [key, value] of Object.entries(dataObj)) {
                        if (key.includes("pjbgId") && value !== 0) {
                            delList.push(value);
                        }
                    }
                }
                // console.log("1번 삭제.", delList);
                deleteItem(delList);
            } else if (originDataLength === updatedDataLength) {
                //수정
                // console.log("2번 수정.", filterData);
                updateItem(filterData);
            } else if (originDataLength < updatedDataLength) {
                //수정
                const updateList = [];

                for (let i = 0; i < originDataLength; i++) {
                    updateList.push(filterData[i]);
                }
                // console.log("3번 수정.", updateList);
                updateItem(updateList);

                //추가
                const addList = [];
                for (let i = originDataLength; i < updatedDataLength; i++) {
                    const newItem = filterData[i];

                    addList.push(newItem);
                }
                // console.log("3번 추가.", addList);
                addItem(addList);
            }
        }
    };

    const addItem = async (addData) => {
        const url = `/api/baseInfrm/product/pjbudgetExe/addArrayList.do`;
        const resultData = await axiosPost(url, addData);

        if (resultData) {
            refresh && refresh();
        }
    };

    const updateItem = async (toUpdate) => {
        const url = `/api/baseInfrm/product/pjbudgetExe/editArrayList.do`;
        const resultData = await axiosUpdate(url, toUpdate);

        if (resultData) {
            refresh && refresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const mergedArray = [].concat(...removeItem);
        const url = `/api/baseInfrm/product/pjbudgetExe/removeAll.do`;
        const resultData = await axiosDelete(url, mergedArray);

        if (resultData) {
            refresh && refresh();
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

    const updatePjbgType = (viewData) => {
        const pjbgTypeMap = {
            EXPNS01: "교통비",
            EXPNS02: "숙박비",
            EXPNS03: "일비/파견비",
            EXPNS04: "식비",
            EXPNS05: "자재/소모품외",
            EXPNS06: "국내출장비",
            EXPNS07: "시내교통비",
            EXPNS08: "PJT 파견비",
            EXPNS09: "사무실임대료",
            EXPNS10: "소모품비",
            EXPNS11: "행사비",
            EXPNS12: "요식성경비",
            EXPNS13: "전산소모품비",
            EXPNS14: "도서인쇄비",
            EXPNS15: "통신비",
            EXPNS16: "해외출장비",
            EXPNS17: "배송비",
            EXPNS18: "예비비",
            EXPNS20: "기타",
        };

        const updatedViewData = viewData.map((item) => ({
            ...item,
            pjbgTypeCode: pjbgTypeMap[item.pjbgTypeCode] || item.pjbgTypeCode,
        }));

        return updatedViewData;
    };

    /* 서버 데이터 형태 바꾸기 */
    const transformData = (originalData) => {
        const transformedData = {};

        originalData.forEach((item) => {
            const key = `${item.pjbgDt}_${item.esntlId}_${item.pjbgBeginDt}`;

            if (!transformedData[key]) {
                transformedData[key] = {
                    poiId: item.poiId, //프로젝트ID
                    pjbgDt: item.pjbgDt, //연월
                    esntlId: item.esntlId, //출장인ID
                    pjbgBeginDt: item.pjbgBeginDt, //시작일
                    pjbgEndDt: item.pjbgEndDt, //종료일
                    modeCode: item.modeCode, //경비타입
                    empNm: item.empNm, //출장인
                    pjbgDesc: item.pjbgDesc, //비고
                };
            }

            const typeCodeKey = `EXPNS${item.pjbgTypeCode.substring(5).padStart(2, "0")}`;
            transformedData[key][typeCodeKey] = item.pjbgPrice; //금액

            const pjbgIdKey = `pjbgId${parseInt(item.pjbgTypeCode.substring(5))}`;
            transformedData[key][pjbgIdKey] = item.pjbgId; //각각의 경비 아이디
        });

        const changData = Object.values(transformedData);

        changData.forEach((row) => {
            row.pjbgTotal = 0; //초기화

            Object.keys(row).forEach((key) => {
                if (key.startsWith("EXPNS") && key !== "EXPNS19") {
                    // 'EXPNS'로 시작하고 영업비가 아닌 키
                    row.pjbgTotal += row[key];
                }
            });
        });
        return changData;
    };

    const totalCalculation = (updatedData) => {
        const calculation = updatedData.reduce((result, current) => {
            if (result.length === 0) {
                result.push({ ...current, total: current.EXPNS01 + current.EXPNS02 + current.EXPNS03 + current.EXPNS04 + current.EXPNS05 + current.EXPNS20 });
            } else {
                const existingGroup = result.find((item) => item.pjbgDt.substring(0, 7) === current.pjbgDt.substring(0, 7));
                if (existingGroup) {
                    existingGroup.pjbgDt = current.pjbgDt;
                    existingGroup.total += current.EXPNS01 + current.EXPNS02 + current.EXPNS03 + current.EXPNS04 + current.EXPNS05 + current.EXPNS20;
                    existingGroup.EXPNS01 += current.EXPNS01; //교통비
                    existingGroup.EXPNS02 += current.EXPNS02; //숙박비
                    existingGroup.EXPNS03 += current.EXPNS03; //일비/파견비
                    existingGroup.EXPNS04 += current.EXPNS04; //식비
                    existingGroup.EXPNS05 += current.EXPNS05; //자재/소모품외
                    existingGroup.EXPNS20 += current.EXPNS20; //기타
                } else {
                    result.push({
                        ...current,
                        total: current.EXPNS01 + current.EXPNS02 + current.EXPNS03 + current.EXPNS04 + current.EXPNS05 + current.EXPNS20,
                    });
                }
            }
            return result;
        }, []);

        const total = calculation.reduce(
            (acc, item) => {
                acc.pjbgDt = "TOTAL";
                acc.total += item.total;
                acc.EXPNS01 += item.EXPNS01;
                acc.EXPNS02 += item.EXPNS02;
                acc.EXPNS03 += item.EXPNS03;
                acc.EXPNS04 += item.EXPNS04;
                acc.EXPNS05 += item.EXPNS05;
                acc.EXPNS20 += item.EXPNS20;
                return acc;
            },
            { pjbgDt: "", total: 0, EXPNS01: 0, EXPNS02: 0, EXPNS03: 0, EXPNS04: 0, EXPNS05: 0, EXPNS20: 0 }
        );

        calculation.push({ ...total });

        return calculation;
    };

    /* 데이터 조회 */
    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/pjbudgetExe/totalListAll.do", condition);
        const viewData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", condition);
        const updatedViewData = updatePjbgType(viewData);
        setPjbudgetDatasView(updatedViewData || []);

        if (resultData && resultData.length > 0) {
            setBudgetMgmt(transformData(resultData, condition)); //데이터 형태 변환
            setCal(totalCalculation(transformData(resultData, condition))); //합계
        } else {
            alert("데이터가 없습니다.\n데이터를 입력해 주세요.");
            setBudgetMgmt([]);
        }
    };

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-lightblue" className="mg-b-40">
                <ReactDataTable
                    columns={columns.expenseMgmt.planView}
                    customDatas={pjbudgetDatasView}
                    defaultPageSize={5}
                    hideCheckBox={true}
                    isPageNation={true}
                />
            </HideCard>
            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                <ReactDataTable
                    columns={columns.expenseMgmt.cal}
                    customDatas={cal}
                    defaultPageSize={5}
                    hideCheckBox={true}
                    isPageNation={true}
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
                <ReactDataTableURL
                    editing={true}
                    returnList={compareData}
                    columns={columns.expenseMgmt.budget}
                    customDatas={budgetMgmt}
                    viewPageName={{ name: "경비", id: "ExpenseMgmtPlan" }}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default ExpenseMgmtPlan;
