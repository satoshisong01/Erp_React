import React, { useState, useEffect, useRef, useContext } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import meccaImg from "../EstimateMgmt/img/meccaImg.png";
import sign from "../EstimateMgmt/img/CEOsign.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
/* 갑지 */
const LaborCostDoc = ({ displayNone }) => {
    /* ⭐ 데이터 없을 시 초기화 필요 */
    const [title, setTitle] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [tableDatas, setTableDatas] = useState([]);

    const [devVisible, setDevVisible] = useState(true);
    const [buyVisible, setBuyVisible] = useState(true);
    const [expensesVisible, setExpensesVisible] = useState(true);
    const [negoVisible, setNegoVisible] = useState(true);
    const [profitVisible, setProfitVisible] = useState(true);
    const [costVisible, setCostVisible] = useState(true);
    const [indexNum, setIndexNum] = useState(0);

    const [etcCost, setEtcCost] = useState(0);
    const [devCost, setDevCost] = useState(0);

    let baseRows = 1 + (negoVisible ? 4 : 3) + 1;

    // tableDatas 배열을 이용한 row 수 계산
    let dataRows = tableDatas.reduce((acc, data) => {
        // 각 data 항목에 대한 기본 row(1) + data.estItem 배열의 길이
        return acc + 1 + data.estItem.length;
    }, 0);
    let totalRows = baseRows + dataRows;

    // "네고" 행의 표시 상태를 토글하는 함수
    const toggleDev = () => {
        setDevVisible(!devVisible);
    };

    const toggleBuy = () => {
        setBuyVisible(!buyVisible);
    };

    const toggleExpenses = () => {
        setExpensesVisible(!expensesVisible);
    };

    const toggleNego = () => {
        setNegoVisible(!negoVisible);
    };
    const toggleProfit = () => {
        setProfitVisible(!profitVisible);
    };
    const toggleCost = () => {
        setCostVisible(!costVisible);
    };

    const [tableData, setTableData] = useState([
        {
            ctcNum: "", // 이 필드에 초기값을 지정합니다. 예: '1234'
            ctcDateCreated: "", // 이 필드에 초기값을 지정합니다. 예: '2021-01-01'
            ctcReception: "", // 이 필드에 초기값을 지정합니다.
            ctcReference: "", // 이 필드에 초기값을 지정합니다.
            ctcSent: "", // 이 필드에 초기값을 지정합니다.
            ctcContact: "", // 이 필드에 초기값을 지정합니다.
            ctcPaymentCondition: "", // 이 필드에 초기값을 지정합니다.
            ctcDelivery: "", // 이 필드에 초기값을 지정합니다.
            ctcDesc: "", // 이 필드에 초기값을 지정합니다.
            ctcExpenses: "",
            // 추가적인 필드와 초기값을 여기에 설정할 수 있습니다.
        },
    ]);

    //만단위 절사
    //function truncateToTenThousand(number) {
    //    return Math.floor(number / 10000) * 10000;
    //}

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        // 월은 0부터 시작하므로 1을 더해주어야 합니다.
        // `.slice(-2)`는 결과값이 항상 두 자리가 되도록 해줍니다. (예: '01', '02')
        const month = `0${today.getMonth() + 1}`.slice(-2);
        const day = `0${today.getDate()}`.slice(-2);

        return `${year}-${month}-${day}`;
    };

    const [buyTable, setBuyTable] = useState([]);

    useEffect(() => {
        let calculatedCost = 0;
        let countIndex = 0;
        if (tableDatas[0]) {
            if (devVisible) {
                //인건비
                calculatedCost += devCost ? devCost : 0;
                countIndex++;
            }
        }
        if (buyTable[0]) {
            if (buyVisible) {
                //자재비
                calculatedCost += buyTable[0]?.estAmount;
                countIndex++;
            }
        }
        if (tableData[0]) {
            if (costVisible) {
                //일반관리비
                calculatedCost += tableData[0]?.slsmnAdmnsCost;
                countIndex++;
            }

            if (profitVisible) {
                //기업이윤
                calculatedCost += tableData[0]?.slsmnEnterpriseProfit;
                countIndex++;
            }

            if (negoVisible) {
                //네고
                calculatedCost -= tableData[0]?.slsmnNego;
                countIndex++;
            }

            if (expensesVisible) {
                //제경비
                calculatedCost += tableData[0]?.ctcExpenses;
                countIndex++;
            }
        }

        setEtcCost(calculatedCost);
        setIndexNum(countIndex);
    }, [negoVisible, profitVisible, costVisible, tableData, tableDatas, buyTable, devVisible, buyVisible, expensesVisible]);

    useEffect(() => {
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter);
        setProjectTitle(data.tableData[0]?.poiNm);
        setTableDatas(sortEstItems(restructureData(data.tableData)));
        setDevCost(calculateTotal(sortEstItems(restructureData(data.tableData))));
        const { label, poiId, versionId } = data;
        setTitle(label);
        if (poiId && versionId) {
            fetchAllData(poiId, versionId);
        }
        // 총 row 수
    }, []);

    function calculateTotal(dataArray) {
        // 전체 합계를 저장할 변수를 초기화합니다.
        let totalSum = 0;

        // 주어진 데이터 배열을 순회합니다.
        dataArray.forEach((data) => {
            // 각 항목의 estItem 배열을 순회합니다.
            data.estItem.forEach((item) => {
                // price와 estMmTotal의 곱을 합계에 더합니다.
                totalSum += item.price * item.estMmTotal;
            });
        });

        // 계산된 전체 합계를 반환합니다.
        return totalSum;
    }

    const fetchAllData = async (poiId, versionId) => {
        const resultData = await axiosFetch("/api/cost/contract/totalListAll.do", {
            poiId: poiId,
            versionId: versionId,
            ctcType: "T",
        });
        console.log(resultData);
        if (resultData.length === 0) {
            addData(poiId, versionId);
        } else {
            // 각 항목의 ctcDateCreated와 ctcSent를 수정합니다.
            const updatedData = resultData.map((item) => ({
                ...item,
                ctcDateCreated: item.ctcDateCreated ? item.ctcDateCreated : getTodayDate() || "", // ctcDateCreated가 유효한 값이면 사용, 그렇지 않으면 poiBeginDt 사용
                ctcSent: item.ctcSent ? item.ctcSent : item.lastModifiedIdBy || "", // ctcSent가 유효한 값이면 사용, 그렇지 않으면 lastModifiedIdBy 사용
                ctcPaymentCondition: item.ctcPaymentCondition ? item.ctcPaymentCondition : "고객사 지급기준에 준함",
                ctcDelivery: item.ctcDelivery ? item.ctcDelivery : "계약 후 5 개월",
                ctcReference: item.ctcReference ? item.ctcReference : "이주현", // ctcReference가 유효한 값이면 사용, 그렇지 않으면 "이주현" 사용
                ctcExpenses: item.ctcExpenses ? item.ctcExpenses : 0,
                ctcDesc: item.ctcDesc
                    ? item.ctcDesc
                    : `1. 견적유효기간: 2024/04/01\n2. 견적 범위 : 자재 납품 / 시험조건 중 시험조건 ( 설치장소 : 세메스 화성 사업장 )`,
                // 필요하다면 여기에 추가적인 필드를 설정할 수 있습니다.
            }));

            setTableData(updatedData);
        }
        console.log(poiId, versionId);
        const resultData2 = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", {
            poiId: poiId,
            versionId: versionId,
        });
        if (resultData2.length > 0) {
            setBuyTable(resultData2);
            console.log(resultData2, "구매견적불러오기");
        }
    };

    const addData = async (poiId, versionId) => {
        const resultData = await axiosPost("/api/cost/contract/add.do", {
            poiId: poiId,
            versionId: versionId,
            ctcNum: "",
            ctcReception: "",
            ctcReference: "",
            ctcSent: "",
            ctcType: "T",
            ctcContact: "",
            ctcDateCreated: "",
            ctcPaymentCondition: "",
            ctcExpenses: 0,
            ctcDelivery: "",
            ctcDesc: "",
        });
        setTableData(resultData);
        fetchAllData(poiId, versionId);
        console.log(resultData, "초기에 빈값추가해주기");
    };

    const updatedData = async (ctcId, poiId, versionId) => {
        if (!tableData || tableData.length === 0) {
            console.error("tableData is empty or undefined");
            return;
        }

        const resultData = await axiosUpdate("/api/cost/contract/edit.do", {
            ctcId: ctcId,
            poiId: poiId,
            versionId: versionId,
            ctcNum: tableData[0].ctcNum,
            ctcReception: tableData[0].ctcReception,
            ctcReference: tableData[0].ctcReference,
            ctcSent: tableData[0].ctcSent,
            ctcDateCreated: tableData[0].ctcDateCreated,
            ctcContact: tableData[0].ctcContact,
            ctcPaymentCondition: tableData[0].ctcPaymentCondition,
            ctcExpenses: tableData[0].ctcExpenses,
            ctcDelivery: tableData[0].ctcDelivery,
            ctcDesc: tableData[0].ctcDesc,
        });
        console.log(resultData, "업데이트한건데");
        setTableData([resultData]);
        fetchAllData(poiId, versionId);
    };

    const handleChange = (e, fieldName, dataIndex) => {
        const { value } = e.target;
        console.log(value);
        console.log(fieldName, dataIndex);

        // tableData 배열에 요소가 있는지 확인
        if (tableData.length > 0) {
            // tableData 배열에 요소가 있는 경우에만 값을 변경
            const updatedTableData = [...tableData];
            updatedTableData[dataIndex][fieldName] = value;

            // 상태 업데이트 함수를 사용하여 상태를 업데이트하고 화면을 다시 렌더링
            setTableData(updatedTableData);
        }
    };

    const handleChange2 = (e, fieldName, dataIndex) => {
        const { value } = e.target;
        console.log(value);
        console.log(fieldName, dataIndex);

        // tableData 배열에 요소가 있는지 확인
        if (tableData.length > 0) {
            // 숫자로 변환된 값 저장
            let parsedValue = value.replace(/,/g, ""); // 쉼표 제거
            parsedValue = parseFloat(parsedValue); // 문자열을 숫자로 변환

            // tableData 배열에 요소가 있는 경우에만 값을 변경
            const updatedTableData = [...tableData];
            updatedTableData[dataIndex][fieldName] = parsedValue;

            // 상태 업데이트 함수를 사용하여 상태를 업데이트하고 화면을 다시 렌더링
            setTableData(updatedTableData);
        }
    };

    const handleChange3 = (e) => {
        const { value } = e.target;
        setEtcCost(value);
    };

    const handleKeyPress = (e) => {
        // 엔터키가 눌렸을 때만 실행
        if (e.key === "Enter") {
            // updatedData 함수 호출
            updatedData(tableData[0].ctcId, tableData[0].poiId, tableData[0].versionId, tableData);
        }
    };

    const printFn = () => {
        updatedData(tableData[0].ctcId, tableData[0].poiId, tableData[0].versionId, tableData);
        alert("출력합니다");

        // titleInput 클래스명을 가진 input 요소들의 border 값을 변경
        const inputs = document.querySelectorAll(".titleInput");
        inputs.forEach((input) => {
            input.style.border = "none";
        });
        const printButton = document.getElementById("printButton");
        const negoBtn = document.getElementById("negoBtn");
        const expensesBtn = document.getElementById("expensesBtn");
        const devBtn = document.getElementById("devBtn");
        const buyBtn = document.getElementById("buyBtn");
        const profitBtn = document.getElementById("profitBtn");
        const costBtn = document.getElementById("costBtn");

        if (expensesBtn) expensesBtn.style.display = "none";
        if (negoBtn) negoBtn.style.display = "none";
        if (buyBtn) buyBtn.style.display = "none";
        if (devBtn) devBtn.style.display = "none";
        if (profitBtn) profitBtn.style.display = "none";
        if (costBtn) costBtn.style.display = "none";

        if (printButton) printButton.style.display = "none";
        window.print();
        if (expensesBtn) expensesBtn.style.display = "block";
        if (negoBtn) negoBtn.style.display = "block";
        if (buyBtn) buyBtn.style.display = "block";
        if (devBtn) devBtn.style.display = "block";
        if (profitBtn) profitBtn.style.display = "block";
        if (costBtn) costBtn.style.display = "block";
        if (printButton) printButton.style.display = "block";
    };

    useEffect(() => {
        const printButton = document.getElementById("printButton");
        const expensesBtn = document.getElementById("expensesBtn");
        const negoBtn = document.getElementById("negoBtn");
        const devBtn = document.getElementById("devBtn");
        const buyBtn = document.getElementById("buyBtn");
        const profitBtn = document.getElementById("profitBtn");
        const costBtn = document.getElementById("costBtn");
        if (expensesBtn) expensesBtn.style.display = "block";
        if (negoBtn) negoBtn.style.display = "block";
        if (devBtn) devBtn.style.display = "block";
        if (buyBtn) buyBtn.style.display = "block";
        if (profitBtn) profitBtn.style.display = "block";
        if (costBtn) costBtn.style.display = "block";
        if (printButton) printButton.style.display = "block"; // 컴포넌트가 마운트될 때 프린트 버튼 보이기

        // 프린트가 완료된 후 실행될 함수
        const afterPrint = () => {
            // titleInput 클래스명을 가진 input 요소들의 border 값을 다시 설정
            const inputs = document.querySelectorAll(".titleInput");
            inputs.forEach((input) => {
                input.style.border = ""; // 빈 문자열로 설정하여 기본 스타일로 돌아감
            });
            // 프린트 버튼 다시 보이기
            if (expensesBtn) expensesBtn.style.display = "block";
            if (negoBtn) negoBtn.style.display = "block";
            if (devBtn) devBtn.style.display = "block";
            if (buyBtn) buyBtn.style.display = "block";
            if (profitBtn) profitBtn.style.display = "block";
            if (costBtn) costBtn.style.display = "block";
            if (printButton) printButton.style.display = "block";
        };

        // 프린트 이벤트 리스너 등록
        window.addEventListener("afterprint", afterPrint);

        // cleanup 함수: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener("afterprint", afterPrint);
        };
    }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

    function restructureData(data) {
        const result = [];

        // 데이터를 순회하면서 estPosition을 기준으로 객체들을 그룹화
        const groupedData = {};
        data.forEach((item) => {
            if (!groupedData[item.estPosition]) {
                groupedData[item.estPosition] = [];
            }
            groupedData[item.estPosition].push(item);
        });

        // 그룹화된 데이터를 원하는 형태로 재구성
        for (const estPosition in groupedData) {
            const estItems = groupedData[estPosition];
            const mergedEstItem = mergeAndSumEstItem(estItems);

            result.push({
                estItem: mergedEstItem,
            });
        }

        return result;
    }

    //직급합치기
    function mergeAndSumEstItem(items) {
        const mergedItems = {};
        items.forEach((item) => {
            if (!mergedItems[item.estPosition]) {
                mergedItems[item.estPosition] = {
                    estMmTotal: 0,
                    estPosition: item.estPosition,
                    price: item.estUnitPrice,
                    total: 0,
                    estDesc: item.estDesc,
                    pdiUnit: item.pdiUnit,
                };
            }
            mergedItems[item.estPosition].estMmTotal += item.total; // 수정된 부분
            mergedItems[item.estPosition].total += item.total;
        });

        return Object.values(mergedItems);
    }

    //직급합치기
    //function mergeDuplicatePositions(data) {
    //    // 각 pgNm 별로 중복된 estPosition 항목을 병합
    //    data.forEach((pg) => {
    //        const itemMap = {}; // estPosition을 키로 하는 맵

    //        // estItem 배열을 순회하며 중복된 estPosition 항목을 병합
    //        pg.estItem.forEach((item) => {
    //            if (itemMap[item.estPosition]) {
    //                // 이미 존재하는 estPosition인 경우, estMmTotal을 더함
    //                itemMap[item.estPosition].estMmTotal += item.estMmTotal;
    //            } else {
    //                // 새로운 estPosition인 경우, itemMap에 추가
    //                itemMap[item.estPosition] = item;
    //            }
    //        });

    //        // 중복된 estPosition을 병합한 결과를 estItem에 할당
    //        pg.estItem = Object.values(itemMap);
    //    });

    //    // 수정된 데이터 반환
    //    return data;
    //}

    // URL에서 쿼리 문자열 파라미터를 읽는 함수
    function getQueryParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    useEffect(() => {
        console.log(tableDatas, "데이터 변환한것");
    }, [tableDatas]);

    const firstItemTotal = tableDatas.length > 0 ? etcCost : 0;

    // 숫자를 한자로 변환하는 함수
    function convertToChinese(number) {
        const digits = ["零", "一", "二", "三", "四", "五", "六", "柒", "八", "九"];
        const units = ["", "十", "百", "千"];
        const bigUnits = ["", "萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量大数"];

        const digitsArray = String(number).split("").map(Number);
        const len = digitsArray.length;
        let result = "";

        for (let i = 0; i < len; i++) {
            const digit = digitsArray[i];
            const unit = len - i - 1;
            if (digit !== 0) {
                result += digits[digit] + units[unit % 4];
            }
            if (unit % 4 === 0 && i !== len - 1) {
                result += bigUnits[Math.floor(unit / 4)];
            }
        }

        return result;
    }

    //순서변경
    function sortEstItems(data) {
        // estPosition 값에 따른 우선 순위 정의
        const order = ["특2", "특1", "고2", "고1", "중", "초2", "초1"];

        // 주어진 estPosition의 우선 순위를 반환하는 함수
        function getPositionPriority(estPosition) {
            const index = order.indexOf(estPosition);
            return index === -1 ? order.length : index; // 목록에 없는 경우 가장 낮은 우선 순위
        }

        // 비교 함수: estPosition에 따라 정렬
        function compare(a, b) {
            const aPriority = getPositionPriority(a.estItem[0].estPosition);
            const bPriority = getPositionPriority(b.estItem[0].estPosition);

            return aPriority - bPriority;
        }

        // 데이터 정렬
        return data.sort(compare);
    }

    function numberWithCommas(x) {
        if (!x) return ""; // 값이 없을 경우 빈 문자열 반환
        const number = typeof x === "string" ? parseFloat(x.replace(/,/g, "")) : parseFloat(x);
        return number.toLocaleString(); // 3자리마다 쉼표 추가하여 반환
    }

    const firstItemChineseTotal = convertToChinese(firstItemTotal);

    return (
        <>
            <div>
                <header>
                    <h1 className="EstimateHeader">{title}</h1>
                </header>
                <body className="EstimateBody">
                    <div className="titleTotal">
                        <div className="titleLeft">
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">관</span>
                                    <span className="boxTitle">리</span>
                                    <span className="boxTitle">번</span>
                                    <span className="boxTitle lastTitle">호:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcNum : ""}
                                    onChange={(e) => handleChange(e, "ctcNum", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">작</span>
                                    <span className="boxTitle">성</span>
                                    <span className="boxTitle">일</span>
                                    <span className="boxTitle lastTitle">자:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcDateCreated : ""}
                                    onChange={(e) => handleChange(e, "ctcDateCreated", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">수</span>
                                    <span className="boxTitle lastTitle">신:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcReception : ""}
                                    onChange={(e) => handleChange(e, "ctcReception", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">참</span>
                                    <span className="boxTitle lastTitle">조:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcReference : ""}
                                    onChange={(e) => handleChange(e, "ctcReference", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">발</span>
                                    <span className="boxTitle lastTitle">신:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcSent : ""}
                                    onChange={(e) => handleChange(e, "ctcSent", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">연</span>
                                    <span className="boxTitle">락</span>
                                    <span className="boxTitle lastTitle">처:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcContact : ""}
                                    onChange={(e) => handleChange(e, "ctcContact", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                            <p style={{ fontSize: "16px", fontWeight: "700" }}>아래와 같이 견적합니다</p>
                        </div>
                        <div className="spanBody3">
                            <img className="mecca" src={meccaImg} alt="" />
                        </div>
                        <div className="titleRight">
                            <div className="spanBody">
                                <span className="bodySpan">
                                    경기도 화성시 동탄대로
                                    <br /> 636-3(영천동)
                                </span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">메가비즈타워 C동 13층</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">Tel)031-376-7567(대표)</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">Fax)031-376-7565</span>
                            </div>
                            <div className="spanBodyFooter">
                                <div className="h2Body">
                                    <p className="footerTitle">메카테크놀러지(주)</p>
                                    <p className="footerTitle">대 표 이 사&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;김 용 일</p>
                                    {/*<p className="footerTitle">김&nbsp;&nbsp;용&nbsp;&nbsp;일</p>*/}
                                </div>
                                <img className="signImg" src={sign} alt="" />
                            </div>
                        </div>
                    </div>
                    <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
                        <span className="SumCount">
                            一金 : {firstItemChineseTotal ? firstItemChineseTotal : ""}원整(₩{firstItemTotal ? firstItemTotal.toLocaleString() : ""} - VAT 별도)
                        </span>
                    </div>
                    <div className="condition">
                        <div className="conditionSpan">
                            <div className="rightBox">
                                <div className="boxHome2">
                                    <span className="boxTitle">대</span>
                                    <span className="boxTitle">급</span>
                                    <span className="boxTitle">지</span>
                                    <span className="boxTitle">급</span>
                                    <span className="boxTitle">조</span>
                                    <span className="boxTitle lastTitle">건:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcPaymentCondition : ""}
                                    onChange={(e) => handleChange(e, "ctcPaymentCondition", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                            <div className="rightBox">
                                <div className="boxHome2">
                                    <span className="boxTitle">납</span>
                                    <span className="boxTitle lastTitle">기:</span>
                                </div>
                                <input
                                    className="titleInput"
                                    type="text"
                                    value={tableData.length ? tableData[0].ctcDelivery : ""}
                                    onChange={(e) => handleChange(e, "ctcDelivery", 0)}
                                    onKeyDown={handleKeyPress} // 엔터 키 감지를 위해 이벤트 리스너 추가
                                />
                            </div>
                        </div>
                    </div>
                    <h3 className="projectName">{projectTitle}</h3>
                    <div className="tableParent">
                        <table className="width90">
                            <tbody className="tableBody">
                                <div className="width90"></div>
                                <tr className="tableTr">
                                    <td className="tableRedPercent">no</td>
                                    <td className="tableItem">Item Name</td>
                                    <td className="tableRedPercent">Q'ty</td>
                                    <td className="tableRedPercent">Unit</td>
                                    <td className="table4-3">Unit Price</td>
                                    <td className="table4-3">Amount</td>
                                </tr>
                                {tableDatas.length > 0 && (
                                    <React.Fragment>
                                        {buyVisible && (
                                            <tr className="tableTr">
                                                <td className="tableRedPercentW">{1}</td>
                                                <td className="tableWhiteItem" style={{ textAlign: "left" }}>
                                                    　자재비
                                                </td>
                                                <td className="tableRedPercentW">1</td>
                                                <td className="tableRedPercentW">lot</td>
                                                <td className="table4-3White" style={{ textAlign: "right" }}>
                                                    　
                                                </td>
                                                <td className="table4-3White" style={{ textAlign: "right", fontWeight: 800, fontSize: "20px" }}>
                                                    {`${buyTable[0]?.estAmount ? buyTable[0]?.estAmount.toLocaleString() : ""}　`}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )}
                                {devVisible &&
                                    tableDatas.map((data, index) => (
                                        <React.Fragment key={index}>
                                            {index === 0 && (
                                                <tr className="tableTr">
                                                    <td className="tableRedPercentW" style={{ borderBottom: "none" }}>
                                                        {buyVisible ? 2 : 1}
                                                    </td>
                                                    <td className="tableWhiteItem" style={{ textAlign: "left", borderBottom: "none" }}>
                                                        {"　개발인건비"}
                                                    </td>
                                                    <td className="tableRedPercentW" style={{ borderBottom: "none" }}>
                                                        {"1"}
                                                    </td>
                                                    <td className="tableRedPercentW" style={{ borderBottom: "none" }}>
                                                        {"Lot"}
                                                    </td>
                                                    <td className="table4-3White" style={{ borderBottom: "none" }}></td>
                                                    <td
                                                        className="table4-3White"
                                                        style={{ textAlign: "right", borderBottom: "none", fontWeight: 800, fontSize: "20px" }}>
                                                        {`${devCost.toLocaleString()}　`}
                                                    </td>
                                                </tr>
                                            )}
                                            {data.estItem.map((item, itemIndex) => (
                                                <tr key={itemIndex} className="tableTr">
                                                    <td className="tableRedPercentW" style={{ borderBottom: "none", borderTop: "none" }}></td>
                                                    <td className="tableWhiteItem" style={{ textAlign: "left", borderBottom: "none", borderTop: "none" }}>
                                                        {`　　- ${item.estPosition}`}
                                                    </td>
                                                    <td className="tableRedPercentW" style={{ borderBottom: "none", borderTop: "none" }}>
                                                        {item.total}
                                                    </td>
                                                    <td className="tableRedPercentW" style={{ borderBottom: "none", borderTop: "none" }}>
                                                        M/M
                                                    </td>
                                                    <td className="table4-3White" style={{ textAlign: "right", borderBottom: "none", borderTop: "none" }}>
                                                        {`${item.price.toLocaleString()}　`}
                                                    </td>
                                                    <td className="table4-3White" style={{ textAlign: "right", borderBottom: "none", borderTop: "none" }}>
                                                        {`${(item.total * item.price).toLocaleString()}　`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                <React.Fragment>
                                    {devVisible && (
                                        <tr className="tableTr">
                                            <td className="tableRedPercent" style={{ backgroundColor: "white", borderTop: "none", borderBottom: "none" }}></td>
                                            <td className="tableItem" style={{ backgroundColor: "white", borderTop: "none", borderBottom: "none" }}></td>
                                            <td className="tableRedPercent" style={{ backgroundColor: "white", borderTop: "none", borderBottom: "none" }}></td>
                                            <td className="tableRedPercent" style={{ backgroundColor: "white", borderTop: "none", borderBottom: "none" }}></td>
                                            <td className="table4-3" style={{ backgroundColor: "white", borderTop: "none", borderBottom: "none" }}></td>
                                            <td className="table4-3" style={{ backgroundColor: "white", borderTop: "none", borderBottom: "none" }}></td>
                                        </tr>
                                    )}
                                </React.Fragment>
                                {tableDatas.length > 0 && (
                                    <React.Fragment>
                                        {/* 추가되는 제경비 항목 */}

                                        {expensesVisible && (
                                            <tr className="tableTr">
                                                <td className="tableRedPercentW" style={{ borderTop: "none", borderBottom: "none" }}>
                                                    {devVisible && buyVisible ? 3 : devVisible || buyVisible ? 2 : 1}
                                                </td>
                                                <td className="tableWhiteItem" style={{ textAlign: "left", borderTop: "none", borderBottom: "none" }}>
                                                    　제경비
                                                </td>
                                                <td className="tableRedPercentW" style={{ borderTop: "none", borderBottom: "none" }}>
                                                    -
                                                </td>
                                                <td className="tableRedPercentW" style={{ borderTop: "none", borderBottom: "none" }}>
                                                    -
                                                </td>
                                                <td className="table4-3White" style={{ textAlign: "right", borderTop: "none", borderBottom: "none" }}>
                                                    <input
                                                        style={{ paddingRight: "15px" }}
                                                        className="titleInput2"
                                                        type="text"
                                                        value={tableData.length ? numberWithCommas(tableData[0].ctcExpenses) : ""}
                                                        placeholder="제경비를 입력해 주세요"
                                                        onChange={(e) => handleChange2(e, "ctcExpenses", 0)}
                                                    />
                                                </td>
                                                <td className="table4-3White" style={{ textAlign: "right", borderTop: "none", borderBottom: "none" }}>
                                                    {`${
                                                        tableData.length > 0 && tableData[0].ctcExpenses !== undefined
                                                            ? tableData[0].ctcExpenses.toLocaleString()
                                                            : ""
                                                    }　`}
                                                </td>
                                            </tr>
                                        )}
                                        {profitVisible && (
                                            <tr className="tableTr">
                                                <td className="tableRedPercentW">
                                                    {(() => {
                                                        const trueCount = [devVisible, buyVisible, expensesVisible].filter(Boolean).length;
                                                        switch (trueCount) {
                                                            case 3:
                                                                return 4;
                                                            case 2:
                                                                return 3;
                                                            case 1:
                                                                return 2;
                                                            default:
                                                                return 1;
                                                        }
                                                    })()}
                                                </td>
                                                <td className="tableWhiteItem" style={{ textAlign: "left" }}>
                                                    　기업이윤{" "}
                                                    {`${
                                                        tableData.length && tableData[0].slsmnEnterpriseProfit
                                                            ? tableData[0].slsmnEnterpriseProfit.toLocaleString()
                                                            : ""
                                                    }`}
                                                    (%)
                                                </td>
                                                <td className="tableRedPercentW">-</td>
                                                <td className="tableRedPercentW">-</td>
                                                <td className="table4-3White" style={{ textAlign: "right" }}>
                                                    -　
                                                </td>
                                                <td className="table4-3White" style={{ textAlign: "right" }}>
                                                    {`${Math.round(
                                                        ((buyTable[0]?.estAmount ? buyTable[0]?.estAmount : 0) + devCost) *
                                                            (tableData[0].slsmnEnterpriseProfit * 0.01)
                                                    ).toLocaleString()}　`}
                                                </td>
                                            </tr>
                                        )}
                                        {costVisible && (
                                            <tr className="tableTr">
                                                <td className="tableRedPercentW">
                                                    {(() => {
                                                        const trueCount = [devVisible, buyVisible, expensesVisible, profitVisible].filter(Boolean).length;
                                                        switch (trueCount) {
                                                            case 4:
                                                                return 5;
                                                            case 3:
                                                                return 4;
                                                            case 2:
                                                                return 3;
                                                            case 1:
                                                                return 2;
                                                            default:
                                                                return 1;
                                                        }
                                                    })()}
                                                </td>
                                                <td className="tableWhiteItem" style={{ textAlign: "left" }}>
                                                    　일반관리비{" "}
                                                    {`${tableData.length && tableData[0].slsmnAdmnsCost ? tableData[0].slsmnAdmnsCost.toLocaleString() : ""}`}
                                                    (%)
                                                </td>
                                                <td className="tableRedPercentW">-</td>
                                                <td className="tableRedPercentW">-</td>
                                                <td className="table4-3White" style={{ textAlign: "right" }}>
                                                    -　
                                                </td>
                                                <td className="table4-3White" style={{ textAlign: "right" }}>
                                                    {`${Math.round(
                                                        ((buyTable[0]?.estAmount ? buyTable[0]?.estAmount : 0) +
                                                            devCost +
                                                            ((buyTable[0]?.estAmount ? buyTable[0]?.estAmount : 0) + devCost) *
                                                                (tableData[0].slsmnEnterpriseProfit * 0.01)) *
                                                            (tableData[0]?.slsmnAdmnsCost * 0.01)
                                                    ).toLocaleString()}　`}
                                                </td>
                                            </tr>
                                        )}
                                        {negoVisible && (
                                            <tr className="tableTr negoTable">
                                                <td className="tableRedPercentW">
                                                    {(() => {
                                                        const trueCount = [devVisible, buyVisible, expensesVisible, profitVisible, costVisible].filter(
                                                            Boolean
                                                        ).length;
                                                        switch (trueCount) {
                                                            case 5:
                                                                return 6;
                                                            case 4:
                                                                return 5;
                                                            case 3:
                                                                return 4;
                                                            case 2:
                                                                return 3;
                                                            case 1:
                                                                return 2;
                                                            default:
                                                                return 1;
                                                        }
                                                    })()}
                                                </td>
                                                <td className="tableWhiteItem" style={{ textAlign: "left" }}>
                                                    　네고
                                                </td>
                                                <td className="tableRedPercentW">-</td>
                                                <td className="tableRedPercentW">-</td>
                                                <td className="table4-3White" style={{ textAlign: "right" }}>
                                                    -　
                                                </td>
                                                <td className="table4-3White" style={{ textAlign: "right" }}>
                                                    {`${tableData.length && tableData[0].slsmnNego ? tableData[0].slsmnNego.toLocaleString() : ""}　`}
                                                </td>
                                            </tr>
                                        )}
                                        {/* "네고 닫기" 버튼 */}
                                        <tr className="tableTr negoTable">
                                            <td
                                                className="tableRedPercent"
                                                style={{
                                                    backgroundColor: "white",
                                                    borderRight: "none",
                                                    width: "52px",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px solid black",
                                                }}></td>
                                            <td
                                                className="tableWhiteItem"
                                                style={{
                                                    textAlign: "center",
                                                    borderLeft: "none",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px solid black",
                                                }}>
                                                견적가 / 부가세 별도
                                            </td>
                                            <td
                                                className="tableRedPercent"
                                                style={{
                                                    backgroundColor: "white",
                                                    borderRight: "none",
                                                    width: "52px",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px solid black",
                                                }}></td>
                                            <td
                                                className="tableRedPercent"
                                                style={{
                                                    backgroundColor: "white",
                                                    borderRight: "none",
                                                    borderLeft: "none",
                                                    width: "52px",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px solid black",
                                                }}></td>
                                            <td
                                                className="table4-3White"
                                                style={{
                                                    textAlign: "center",
                                                    borderLeft: "none",
                                                    borderTop: "1px solid black",
                                                    borderBottom: "1px solid black",
                                                }}>
                                                {/*만단위 절사*/}
                                            </td>
                                            <td
                                                className="table4-3White"
                                                style={{ textAlign: "right", borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                                                <input
                                                    style={{ paddingRight: "15px", fontWeight: 800, fontSize: "20px" }}
                                                    className="titleInput2"
                                                    type="text"
                                                    value={`${etcCost ? etcCost.toLocaleString() : ""}`}
                                                    onChange={(e) => handleChange3(e)}
                                                />
                                            </td>
                                        </tr>
                                        <div style={{ display: "flex" }}>
                                            <div className="toggleBtn">
                                                <button id="devBtn" onClick={toggleDev}>
                                                    {devVisible ? "인건비 닫기" : "인건비 열기"}
                                                </button>
                                            </div>
                                            <div className="toggleBtn">
                                                <button id="buyBtn" onClick={toggleBuy}>
                                                    {buyVisible ? "자재비 닫기" : "자재비 열기"}
                                                </button>
                                            </div>
                                            <div className="toggleBtn">
                                                <button id="expensesBtn" onClick={toggleExpenses}>
                                                    {expensesVisible ? "제경비 닫기" : "제경비 열기"}
                                                </button>
                                            </div>
                                            <div className="toggleBtn">
                                                <button id="negoBtn" onClick={toggleNego}>
                                                    {negoVisible ? "네고 닫기" : "네고 열기"}
                                                </button>
                                            </div>
                                            <div className="toggleBtn">
                                                <button id="profitBtn" onClick={toggleProfit}>
                                                    {profitVisible ? "기업이윤 닫기" : "기업이윤 열기"}
                                                </button>
                                            </div>
                                            <div className="toggleBtn">
                                                <button id="costBtn" onClick={toggleCost}>
                                                    {costVisible ? "관리비 닫기" : "관리비 열기"}
                                                </button>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {typeof totalRows !== "undefined" && totalRows >= 10 && !displayNone && (
                        <div style={{ height: `${Math.max(200 - (totalRows - 10) * 20, 0)}px` }}></div>
                    )}

                    <h3 className="projectName">특이사항</h3>
                    <div className="etcBox">
                        <div className="etcItems">
                            <textarea
                                style={{ caretColor: "black", fontSize: "15px" }}
                                className="textareaStyle"
                                type="text"
                                value={tableData.length ? tableData[0].ctcDesc : ""}
                                onChange={(e) => handleChange(e, "ctcDesc", 0)}
                            />
                        </div>
                    </div>
                </body>
                {!displayNone && (
                    <button id="printButton" onClick={() => printFn()} style={{ position: "fixed", top: "10px", right: "10px" }}>
                        <FontAwesomeIcon icon={faPrint} style={{ color: "red" }} />
                        (저장)출력
                    </button>
                )}
            </div>
        </>
    );
};

export default LaborCostDoc;
