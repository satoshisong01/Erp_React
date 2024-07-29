import React, { useState, useEffect, useRef } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { axiosFetch } from "api/axiosFetch";
import BasicDataTable from "components/DataTable/BasicDataTable";
import FormDataTable from "components/DataTable/FormDataTable";

/* 실행원가서(사후정산서) */
const BusiCalculateDoc = () => {
    const coreTable = useRef(null); // 손익계산서 테이블
    const purchasingTable = useRef(null); // 구매재료비 테이블
    const chargeTable = useRef(null); // 경비테이블
    const outsourcingTable = useRef(null); // 외주 테이블
    const laborTable = useRef(null); // 인건비 테이블

    /* ⭐ 데이터 없을 시 초기화 필요 */
    const [coreTableData, setCoreTableData] = useState([{ data: [''], className: [''] }]); //손익계산서 데이터
    const [purchasingTableData, setPurchasingTableData] = useState([{ data: ['', '', ''], className: [] }]); //구매재료비
    const [chargeTableData, setChargeTableData] = useState([{ data: [''], className: [''] }]); //경비
    const [outTableData, setOutTableData] = useState([{ data: ['', '', ''], className: [''] }]); //개발외주비
    const [laborTableData, setLaborTableData] = useState([{ data: [''], className: [''] }]); //인건비
    const [projectInfo, setProjectInfo] = useState({});

    const purStyle = { marginBottom: 20, maxHeight: 250 }
    const chargeStyle = { maxHeight: 860 }

    useEffect(() => {
        getInitData(); // 종합집계표 데이터 가져오기
    }, []);

    const infoColumns = [
        [
            { label: "프로젝트 이름", key: "poiNm", type: "data", colSpan: "3", value: projectInfo.poiNm},
            { label: "프로젝트 코드", key: "poiCode", type: "data", colSpan: "3", value: projectInfo.poiCode},
        ],
        [
            { label: "수주부서", key: "poiGroupId", type: "data", value: projectInfo.poiGroupId},
            { label: "매출부서", key: "poiSalesGroupId", type: "data", value: projectInfo.poiSalesGroupId},
            { label: "영업대표", key: "poiSalmanagerId", type: "data", value: projectInfo.poiSalmanagerId},
            { label: "담당자(PM)", key: "poiManagerId", type: "data", value: projectInfo.poiManagerId},
        ],
        [
            { label: "수주 시작일", key: "poiBeginDt", type: "data", value: projectInfo.poiBeginDt},
            { label: "수주 마감일", key: "poiEndDt", type: "data", value: projectInfo.poiEndDt},
            { label: "사전원가 기준 이익률", key: "standardMargin", type: "data", value: projectInfo.standardMargin+'%'},
            { label: "상태", key: "poiStatus", type: "data", value: projectInfo.poiStatus},
        ],
    ];

    const coreColumns = [
        { header: "구분", col: "item", className: "flex-col-2" },
        { header: "전체", col: "total", className: "flex-col-2" },
        { header: "자체용역", col: "inHouse", className: "flex-col-2" },
        { header: "%", col: "inHousePercent", className: "flex-col-1" },
        { header: "외주", col: "outSourcing", className: "flex-col-2" },
        { header: "%", col: "outSourcingPercent", className: "flex-col-1" },
        { header: "H/W 및 S/W", col: "purchasing", className: "flex-col-2" },
        { header: "%", col: "purchasingPercent", className: "flex-col-1" },
        { header: "판관비", col: "overhead", className: "flex-col-2" },
        { header: "NEGO", col: "nego", className: "flex-col-2" },
        { header: "자사솔루션", col: "proprietarySolution", className: "flex-col-2" },
        { header: "도입솔루션", col: "implementedSolution", className: "flex-col-2" },
    ];

    const purchasingColumns = [
        { header: "품목", col: "item", className: "flex-col-2" },
        { header: "일반/도입", col: "type", className: "flex-col-2" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];
    const outsourcingColumns = [
        { header: "회사", col: "company", className: "flex-col-2" },
        { header: "턴키/MM", col: "mm", className: "flex-col-2" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];
    const laborColumns = [
        { header: "M/M", col: "mm", className: "flex-col-2" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];
    const chargeColumns = [
        { header: "구분", col: "item", className: "flex-col-2" },
        { header: "산출근거", col: "remarks", className: "flex-col-4" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];

    const changTypeStr = (code) => {
        if(code === "EXPNS01") {
            return "교통비"
        } else if(code === "EXPNS02") {
            return "숙박비"
        } else if(code === "EXPNS03") {
            return "파견비"
        } else if(code === "EXPNS04") {
            return "식비"
        } else if(code === "EXPNS05") {
            return "자재/소모품"
        } else if(code === "EXPNS06") {
            return "영업비"
        }
    }
    
    const getInitData = async () => {
        const url = "http://localhost:8080/api/baseInfrm/product/prstmCost/exe/listAll.do";
        // const url = "/api/baseInfrm/product/prstmCost/mm/listAll.do";
        const requestData = {poiId: 88820230824014};
        const resultData = await axiosFetch(url, requestData);

        const {
            projectInfo,//수주정보
            salesBudgetIn, //수주액>자체용역
            laborTotalMM, //인건비 총 mm
            laborTotalPrice, //인건비 총 합
            insuranceTotalPrice, //인건비성복후비
            budgetList, //경비목록
            budgetTotalPrice, //경비 총 합
            outLaborList, //개발외주비 목록
            outLaborTotalMM, //개발외주비  총 mm
            outLaborTotalPrice, //개발외주비 총 합
            negoTotalPrice, //네고 합
            legalTotalPrice, //판관비 합
        } = resultData;

        /* 프로젝트 정보 */
        setProjectInfo(projectInfo);

        /* 경비 테이블 데이터 */
        if(budgetList) {
            const updatedChargeData = budgetList.map(item => {
                return {
                    data: [changTypeStr(item.budgetTypeCode), item.budgetDesc, item.budgetPrice],
                    className: ['', '', '']
                };
            });
    
            const charTotalRow = {
                data: ['합계', '', budgetTotalPrice],
                className: ['point line-t', 'line-t', 'line-t']
            };
    
            const newChargeTableData = [
                // ...chargeTableData, 
                {
                    data: ['인건비성복후비', '', insuranceTotalPrice],
                    className: ['', '', '']
                },
                ...updatedChargeData,  // 업데이트된 데이터 추가
                charTotalRow  // 합계 데이터 추가
            ];
            
            setChargeTableData(newChargeTableData);
        }

        /* 외주비 테이블 데이터 */
        if(outLaborList) {
            const updatedOutData = outLaborList.map(item => {
                return {
                    data: [item.esntlId, item.pjbgDesc, item.pjbgPrice],
                    className: ['', '', '']
                };
            });
            const outTotalRow = {
                data: ['합계', outLaborTotalMM, outLaborTotalPrice],
                className: ['point line-t', 'line-t', 'line-t']
            };
            setOutTableData([...updatedOutData, outTotalRow]);
    
        }

        /* 인건비 테이블 데이터 */
        setLaborTableData([{
            data: [laborTotalMM, laborTotalPrice],
            className: ['', '']
        }])

        /* 원가지표 */
        let idInPer = 0; // 간접원가>자체용역 %
        let idOutPer = 0; // 간접원가>외주 %
        let idHSPer = 0; // 간접원가>H/W및S/W %

        let genInPer = 0; // 일반관리비>자체용역 %
        let genOutPer = 0; // 일반관리비>외주 %
        let genHSPer = 0; // 일반관리비>H/W및S/W %

        let selInPer = 0; // 판매비>자체용역 %
        let corpInPer = 0; // 사내본사비>자체용역 %
        let nonInPer = 0; // 영업외수지>자체용역 %

        const costIndicator = [ //사전원가지표: 원가(CB_PER), 원가명(CB_NAME), 분류코드(CB_TYPE_CODE)
            { CB_TYPE_CODE: '간접원가', CB_PER: 20.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '간접원가', CB_PER: 20.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '간접원가', CB_PER: 20.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '판매비', CB_PER: 5.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '판매비', CB_PER: 5.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '판매비', CB_PER: 5.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '사내본사비', CB_PER: 8.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '사내본사비', CB_PER: 8.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '사내본사비', CB_PER: 8.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '일반관리비', CB_PER: 8.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '일반관리비', CB_PER: 8.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '일반관리비', CB_PER: 8.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '영업외수지', CB_PER: 3.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '영업외수지', CB_PER: 3.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '영업외수지', CB_PER: 3.0, CB_NAME: 'H/W및S/W' },
        ];

        costIndicator.map((item) => {
            if (item.CB_TYPE_CODE === '간접원가') {
                if (item.CB_NAME === '자체용역') {
                    idInPer = item.CB_PER;
                } else if (item.CB_NAME === '외주') {
                    idOutPer = item.CB_PER;
                } else if (item.CB_NAME === 'H/W및S/W') {
                    idHSPer = item.CB_PER;
                }
            }
            if (item.CB_TYPE_CODE === '일반관리비') {
                if (item.CB_NAME === '자체용역') {
                    genInPer = item.CB_PER;
                } else if (item.CB_NAME === '외주') {
                    genOutPer = item.CB_PER;
                } else if (item.CB_NAME === 'H/W및S/W') {
                    genHSPer = item.CB_PER;
                }
            }
            if (item.CB_NAME === '자체용역') {
                if (item.CB_TYPE_CODE === '판매비') {
                    selInPer = item.CB_PER;
                } else if (item.CB_TYPE_CODE === '사내본사비') {
                    corpInPer = item.CB_PER;
                } else if (item.CB_TYPE_CODE === '영업외수지') {
                    nonInPer = item.CB_PER;
                }
            }

        })

        // const salesBudgetIn = 110260622; // 수주액>자체용역⭐
        const salesBudgetOut = 0; // 수주액>외주⭐
        const salesBudgetHS = 0; // 수주액>H/W및S/W⭐
        const purchaseTotalPrice = 0; //구매 총 합 //현재없음⭐
        const excOutPurchase = 0; // 재료비>외주 //현재없음⭐

        /* 손익계산서 변수들 */
        const salesOrderTotal = (salesBudgetIn + salesBudgetOut + 0 + legalTotalPrice) - negoTotalPrice; // 수주액 row 합
        const purchaseTotal = 0; // 재료비 row 합 // 인건비 사전원가서에서는 필요없는 항목
        const laborTotal = laborTotalPrice + outLaborTotalPrice; // 인건비 row 합
        const chargeTotal = budgetTotalPrice; // 경비 row 합
        const exeInCost = laborTotalPrice + budgetTotalPrice; // 직접원가>자체용역: 인건비총금액+경비총금액
        const exeOutCost = outLaborTotalPrice; // 직접원가>외주: 재료비외주+인건비외주+경비외주
        const exePurCost = 0; // 직접원가>H/W및S/W //구매없음
        const exeCostTotal = purchaseTotal + laborTotal + chargeTotal; // 직접원가 전체 row 합
        const exeMarginalIn = salesBudgetIn - exeInCost; // 실한계이익>자체용역
        const exeMarginalOut = salesBudgetOut - exeOutCost; // 실한계이익>외주
        const exeMarginalHS = 0 - exePurCost;// 실한계이익>H/W및S/W
        const exeMarginalTotal = salesOrderTotal - exeCostTotal; // 실한계이익>전체
        const materialCostIn = 0;// 사내재료비>자체용역
        const materialCostOut = 0;// 사내재료비>외주
        const materialCostHS = 0;// 사내재료비>H/W및S/W
        const materialCostTotal = 0;// 사내재료비>전체
        const marginalIn = exeMarginalIn - materialCostIn; // 한계이익>자체용역
        const marginalOut = exeMarginalOut - materialCostOut; // 한계이익>외주
        const marginalHS = exeMarginalHS - materialCostHS; // 한계이익>H/W및S/W
        const marginalTotal = exeMarginalTotal - materialCostTotal; // 한계이익>전체
        const indirectIn = laborTotalPrice * idInPer/100; // 간접원가>자체용역
        const indirectOut = outLaborTotalPrice * idOutPer/100; // 간접원가>외주
        const indirectHS = 0 * idHSPer/100; // 간접원가>H/W및S/W
        const indirectCost = indirectIn + indirectOut + indirectHS; // 간접원가>전체
        const grossProfitIn = marginalIn - indirectIn; // 매출이익>자체용역
        const grossProfitOut = marginalOut - indirectOut; // 매출이익>외주
        const grossProfitHS = marginalHS - indirectHS; // 매출이익>H/W및S/W
        const grossProfitTotal = marginalTotal - indirectCost; // 매출이익>전체
        const sellingIn = laborTotalPrice * selInPer/100; // 판매비>자체용역
        const sellingTotal = sellingIn; // 판매비>전체
        const corpIn = laborTotalPrice * corpInPer/100; // 사내본사비>자체용역
        const corpHQTotal = corpIn; // 사내본사비>전체
        const genAdminIn = laborTotalPrice * genInPer/100; // 일반관리비>자체용역
        const genOut = outLaborTotalPrice * genOutPer/100; // 일반관리비>외주
        const genHS = 0 * genHSPer/100; // 일반관리비>H/W및S/W
        const genAdminTotal = genAdminIn + genOut + genHS; // 일반관리비>전체
        const operProfitIn = grossProfitIn - (sellingIn + corpIn + genAdminIn); // 영업이익>자체용역
        const operProfitOut = grossProfitOut - genOut; // 영업이익>외주
        const operProfitHS = grossProfitHS-genHS; // 영업이익>H/W및S/W
        const operProfitTotal = grossProfitTotal - (sellingTotal + corpHQTotal + genAdminTotal); // 영업이익>전체
        const nonIn = laborTotalPrice * nonInPer/100; //영업외수지>자체용역
        const nonOperIncTotal = nonIn; //영업외수지>전체
        const ordIncIn = (operProfitIn-nonIn); // 경상이익>자체용역
        const ordIncOut = operProfitOut; // 경상이익>외주
        const ordIncHS = operProfitHS; // 경상이익>H/W및S/W
        const ordIncTotal = operProfitTotal - nonOperIncTotal; // 경상이익>전체
        const mmUnitPriceIn = (salesBudgetIn-budgetTotalPrice)/laborTotalMM; // MM단가>자체용역 ⭐laborTotalMM를 나누는게 아니고 원래 위에 써진거?
        const mmUnitPriceTotal = mmUnitPriceIn; // MM단가>전체

        const division = (value1, value2) => {
            if(value1 === 0 || value2 === 0 ) {
                return 0+"%";
            }
            return ((value1/value2)*100).toFixed(1)+'%';
        }

        /* 손익계산서 테이블 데이터 */
        setCoreTableData([
            {
                // data: ['수주액', formattedValue.salesOrderTotal, salesBudgetIn, '', salesBudgetOut, '', salesBudgetHS, '', legalTotalPrice, negoTotalPrice, '', ''],
                data: ['수주액', salesOrderTotal.toLocaleString(), salesBudgetIn.toLocaleString(), '', salesBudgetOut.toLocaleString(), '', salesBudgetHS.toLocaleString(), '', legalTotalPrice.toLocaleString(), negoTotalPrice.toLocaleString(), '', ''],
                className: ['point', 'b-highlight', '', 'b-gray', '', 'b-gray', '', 'b-gray', '', '', 'b-gray', 'b-gray'],
            },
            {
                // data: ['재료비', formattedValue.purchaseTotal, '', '', excOutPurchase, '', purchaseTotalPrice, '', '', '', '', ''],
                data: ['재료비', purchaseTotal.toLocaleString(), '', '', excOutPurchase.toLocaleString(), '', purchaseTotalPrice.toLocaleString(), '', '', '', '', ''],
                className: ['point', 'b-highlight', 'b-gray', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                // data: ['인건비', formattedValue.laborTotal, laborTotalPrice, '', outLaborTotalPrice, '', '', '', '', '', '', ''],
                data: ['인건비', laborTotal.toLocaleString(), laborTotalPrice.toLocaleString(), '', outLaborTotalPrice.toLocaleString(), '', '', '', '', '', '', ''],
                className: ['point', 'b-highlight', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                // data: ['경비', formattedValue.chargeTotal, budgetTotalPrice, '', '', '', '', '', '', '', '', ''],
                data: ['경비', chargeTotal.toLocaleString(), budgetTotalPrice.toLocaleString(), '', '', '', '', '', '', '', '', ''],
                className: ['point', 'b-highlight', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                // data: ['직접원가', formattedValue.exeCostTotal, formattedValue.exeInCost, '', formattedValue.exeOutCost, '', formattedValue.exePurCost, '', '', '', '', ''],
                data: ['직접원가', exeCostTotal.toLocaleString(), exeInCost.toLocaleString(), '', exeOutCost.toLocaleString(), '', exePurCost.toLocaleString(), '', '', '', '', ''],
                className: ['col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header'],
            },
            {
                data: ['실한계이익', exeMarginalTotal.toLocaleString(), exeMarginalIn.toLocaleString(), '', exeMarginalOut.toLocaleString(), '', exeMarginalHS.toLocaleString(), '', '', '', '', ''],
                className: ['point', ' ', ' ', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(실한계이익률)', division(exeMarginalTotal,salesOrderTotal), division(exeMarginalIn,salesBudgetIn), '', division(exeMarginalOut,salesBudgetOut), '', division(exeMarginalHS,salesBudgetHS), '', '', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['사내재료비', materialCostTotal.toLocaleString(), '', '', '', '', '', '', '', '', '', ''],
                className: ['b-lightblue text-primary point', 'b-highlight', 'b-highlight', 'b-gray', 'b-highlight', 'b-gray', 'b-highlight', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['한계이익', marginalTotal.toLocaleString(), marginalIn.toLocaleString(), '', marginalOut.toLocaleString(), '', marginalHS.toLocaleString(), '', '', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(한계이익률)', division(marginalTotal,salesOrderTotal), division(marginalIn,salesBudgetIn), '', division(marginalOut,salesBudgetOut), '', division(marginalHS,salesBudgetHS), '', '', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['간접원가', indirectCost.toLocaleString(), indirectIn.toLocaleString(), idInPer+'%', indirectOut.toLocaleString(), idOutPer+'%', indirectHS.toLocaleString(), idHSPer+'%', '', '', '', ''],
                className: ['b-lightblue point', 'b-highlight', 'b-highlight', 'b-highlight', 'b-highlight', 'b-highlight', 'b-highlight', 'b-highlight', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['매출이익', grossProfitTotal.toLocaleString(), grossProfitIn.toLocaleString(), '', grossProfitOut.toLocaleString(), '', grossProfitHS.toLocaleString(), '', '', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(매출이익률)', division(grossProfitTotal,salesOrderTotal), division(grossProfitIn,salesBudgetIn), '', division(grossProfitOut,salesBudgetOut), '', division(grossProfitHS,salesBudgetHS), '', '', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['판매비', sellingTotal.toLocaleString(), sellingIn.toLocaleString(), selInPer+'%', '', '', '', '', '', '', '', ''],
                className: ['b-lightblue text-danger point', '', '', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['사내본사비', corpHQTotal.toLocaleString(), corpIn.toLocaleString(), corpInPer+'%', '', '', '', '', '', '', '', ''],
                className: ['b-lightblue text-danger point', '', '', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['일반관리비', genAdminTotal.toLocaleString(), genAdminIn.toLocaleString(), genInPer+'%', genOut.toLocaleString(), genOutPer+'%', genHS.toLocaleString(), genHSPer+'%', '', '', '', ''],
                className: ['b-lightblue text-danger point', '', '', '', '', '', '', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['영업이익', operProfitTotal.toLocaleString(), operProfitIn.toLocaleString(), '', operProfitOut.toLocaleString(), '', operProfitHS.toLocaleString(), '', '', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(영업이익률)', division(operProfitTotal,salesOrderTotal), division(operProfitIn,salesBudgetIn), '', division(operProfitOut,salesBudgetOut), '', division(operProfitHS,salesBudgetHS), '', '', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['영업외수지', nonOperIncTotal.toLocaleString(), nonIn.toLocaleString(), nonInPer+'%', '', '', '', '', '', '', '', ''],
                className: ['b-lightblue text-primary point', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['경상이익', ordIncTotal.toLocaleString(), ordIncIn.toLocaleString(), '', ordIncOut.toLocaleString(), '', ordIncHS.toLocaleString(), '', '', '', '', ''],
                className: ['point ', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(경상이익률)', division(ordIncTotal,salesOrderTotal), division(ordIncIn,salesBudgetIn), '', division(ordIncOut,salesBudgetOut), '', division(ordIncHS,salesBudgetHS), '', '', '', '', ''],
                className: ['point ', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['M/M단가', mmUnitPriceTotal.toLocaleString(), mmUnitPriceIn.toLocaleString(), '', '', '', '', '', '', '', '', ''],
                className: ['b-lightblue point', '', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
        ]);

    };

    return (
        <div className="precost-container">
            <div className="flex-column mg-t-20 mg-b-20">
                <FormDataTable formTableColumns={infoColumns} useStatus={false}/>

                <div className="precost-title">1.손익계산서</div>
                <BasicDataTable colums={coreColumns} data={coreTableData} datatableRef={coreTable} />

                <div className="empty" />

                <div className="precost-title">2.직접원가 내역</div>
                <div className="wrap">
                    <div style={{ flex: 4 }}>
                        <BasicDataTable colums={purchasingColumns} data={purchasingTableData} datatableRef={purchasingTable} tableSize={purStyle} subtitle='재료비' />
                        <BasicDataTable colums={outsourcingColumns} data={outTableData} datatableRef={outsourcingTable} tableSize={purStyle} subtitle='개발외주비' />
                        <BasicDataTable colums={laborColumns} data={laborTableData} datatableRef={laborTable} subtitle='인건비' />
                    </div>
                    <div style={{ flex: 0.5 }} />
                    <div style={{ flex: 5.5 }}>
                        <BasicDataTable colums={chargeColumns} data={chargeTableData} datatableRef={chargeTable} tableSize={chargeStyle} subtitle='경비' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusiCalculateDoc;
