import React, { useState, useEffect, useRef, useContext, version } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import meccaImg from "../EstimateMgmt/img/meccaImg.png";
import sign from "../EstimateMgmt/img/CEOsign.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { buyIngInfoCalculation } from "components/DataTable/function/ReplaceDataFormat";
import "./PopUp.css";

/* 갑지 */
const DetailDoc = ({ displayNone }) => {
    /* ⭐ 데이터 없을 시 초기화 필요 */
    const [title, setTitle] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [tableDatas, setTableDatas] = useState([]);
    const [totalConsumerAmount, setTotalConsumerAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [negoVisible, setNegoVisible] = useState(true);

    let baseRows = 1 + (negoVisible ? 4 : 3) + 1;

    // tableDatas 배열을 이용한 row 수 계산
    let dataRows = tableDatas.reduce((acc, data) => {
        // 각 data 항목에 대한 기본 row(1) + data.estItem 배열의 길이
        return acc + 1 + data.estItem.length;
    }, 0);
    let totalRows = baseRows + dataRows;

    const [tableData2, setTableData2] = useState([]);

    useEffect(() => {
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter);
        //setTableDatas(restructureData(data.tableData));
        const { poiId, versionId } = data;
        console.log(poiId, versionId, "이거안받?");
        if (poiId && versionId) {
            fetchAllData(poiId, versionId);
        }
    }, []);

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

    // 모든 consumerAmount의 합을 구하는 함수
    function calAmount(data) {
        let totalAmount = 0;
        let totalConsumerAmount = 0;
        data.forEach((item) => {
            item.estItem.forEach((est) => {
                totalAmount += est.amount || 0;
                totalConsumerAmount += est.consumerAmount || 0;
            });
        });
        return { totalAmount, totalConsumerAmount };
    }

    const fetchAllData = async (poiId, versionId) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", {
            poiId: poiId,
            versionId: versionId,
        });
        //if (resultData && resultData.length > 0) {
        console.log(resultData, "????");
        const calData = buyIngInfoCalculation(resultData);
        const { totalAmount, totalConsumerAmount } = calAmount(restructureData(calData));
        setTotalConsumerAmount(totalConsumerAmount);
        setTotalAmount(totalAmount);
        setTableData2(restructureData(calData));

        //const groupedData = calData.reduce((result, current) => {
        //    const existingGroup = result.find((group) => group.pdiSeller === current.pdiSeller && group.pgNm === current.pgNm); //제조사, 품목그룹
        //    if (existingGroup) {
        //        existingGroup.estimatedCost += current.estimatedCost; //원가
        //        existingGroup.consumerAmount += current.consumerAmount; //소비자금액
        //        existingGroup.planAmount += current.planAmount; //공급금액
        //        existingGroup.byQunty += current.byQunty; //수량
        //    } else {
        //        result.push({ ...current });
        //    }
        //    return result;
        //}, []);
        //}
    };

    useEffect(() => {
        console.log(tableData2, "ddd");
    }, [tableData2]);

    const printFn = () => {
        // titleInput 클래스명을 가진 input 요소들의 border 값을 변경
        const inputs = document.querySelectorAll(".titleInput");
        inputs.forEach((input) => {
            input.style.border = "none";
        });
        const printButton = document.getElementById("printButton");
        const negoBtn = document.getElementById("negoBtn");
        const profitBtn = document.getElementById("profitBtn");
        const costBtn = document.getElementById("costBtn");

        if (negoBtn) negoBtn.style.display = "none";
        if (profitBtn) profitBtn.style.display = "none";
        if (costBtn) costBtn.style.display = "none";

        if (printButton) printButton.style.display = "none";
        window.print();
        if (negoBtn) negoBtn.style.display = "block";
        if (profitBtn) profitBtn.style.display = "block";
        if (costBtn) costBtn.style.display = "block";
        if (printButton) printButton.style.display = "block";
    };

    useEffect(() => {
        const printButton = document.getElementById("printButton");
        const negoBtn = document.getElementById("negoBtn");
        const profitBtn = document.getElementById("profitBtn");
        const costBtn = document.getElementById("costBtn");
        if (negoBtn) negoBtn.style.display = "block";
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
            if (negoBtn) negoBtn.style.display = "block";
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

        // 데이터를 순회하면서 pgNm을 기준으로 객체들을 그룹화
        const groupedData = {};
        data.forEach((item) => {
            if (!groupedData[item.pgNm]) {
                groupedData[item.pgNm] = [];
            }
            groupedData[item.pgNm].push(item);
        });

        // 그룹화된 데이터를 원하는 형태로 재구성
        for (const pgNm in groupedData) {
            const estItem = groupedData[pgNm].map((item) => ({
                consumerPrice: item.byConsumerUnitPrice,
                pdiNum: item.pdiNum,
                consumerAmount: item.byConsumerUnitPrice * item.byQunty,
                unitPrice: item.unitPrice,
                byQunty: item.byQunty,
                byDesc: item.byDesc,
                amount: item.unitPrice * item.byQunty,
                maker: item.pdiUnit,
                pdiMenufut_name: item.pdiMenufut_name,
                remarks: item.pdiUnit,
                unit: item.unit,
            }));

            result.push({
                pgNm: pgNm,
                estItem: estItem,
            });
        }

        return result;
    }

    return (
        <>
            <div className="precost-container">
                <div className="precost-title" style={{ margin: "auto", marginBottom: "20px", fontSize: "25px", textAlign: "center" }}>
                    구매상세내역
                </div>
                <div style={{ display: "flex", margin: "10px" }}>
                    <div className="flex-column mg-t-20 mg-b-20">
                        <table id="example" className="display">
                            <thead>
                                <tr>
                                    <th colSpan={1} style={{ textAlign: "center", width: "30px" }}>
                                        no
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "160px" }}>
                                        Item Name
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "200px" }}>
                                        Description
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "30px" }}>
                                        Q'ty
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "30px" }}>
                                        Unit
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                        Consumer Price
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "120px" }}>
                                        Consumer Amount
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                        Unit Price
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "120px" }}>
                                        Amount
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                        Maker
                                    </th>
                                    <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData2?.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <tr key={index}>
                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                            <td>{data.pgNm}</td>
                                            <td></td>
                                            <td style={{ textAlign: "center" }}>1</td>
                                            <td style={{ textAlign: "center" }}>Lot</td>
                                            <td style={{ textAlign: "right" }}></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td style={{ textAlign: "right" }}></td>
                                        </tr>
                                        {(data?.estItem || []).map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                <td style={{ textAlign: "center" }}>
                                                    {index + 1}-{itemIndex + 1}
                                                </td>
                                                <td style={{ textAlign: "left" }}>{item.pdiNum}</td>
                                                <td>{item.byDesc}</td>
                                                <td style={{ textAlign: "center" }}>{item.byQunty}</td>
                                                <td style={{ textAlign: "center" }}>{item.unit ? item.unit.toLocaleString() : ""}</td>
                                                <td style={{ textAlign: "right" }}>{item.consumerPrice ? item.consumerPrice.toLocaleString() : ""}</td>
                                                <td style={{ textAlign: "right" }}>{item.consumerAmount ? item.consumerAmount.toLocaleString() : ""}</td>
                                                <td style={{ textAlign: "right" }}>{item.unitPrice ? item.unitPrice.toLocaleString() : ""}</td>
                                                <td style={{ textAlign: "right" }}>{item.amount ? item.amount.toLocaleString() : ""}</td>
                                                <td>{item.pdiMenufut_name}</td>
                                                <td style={{ textAlign: "right" }}></td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {tableData2.length > 0 && (
                                    <React.Fragment>
                                        <tr>
                                            <th colSpan={5} style={{ textAlign: "center", width: "10px", fontWeight: "900" }}>
                                                총계
                                            </th>
                                            <th colSpan={1} style={{ textAlign: "center", width: "90px" }}></th>
                                            <th colSpan={1} style={{ textAlign: "right", width: "70px", fontWeight: "900" }}>
                                                {totalConsumerAmount ? totalConsumerAmount.toLocaleString() : ""}
                                            </th>
                                            <th colSpan={1} style={{ textAlign: "center", width: "70px" }}></th>
                                            <th colSpan={1} style={{ textAlign: "right", width: "70px", fontWeight: "900" }}>
                                                {totalAmount ? totalAmount.toLocaleString() : ""}
                                            </th>
                                            <th colSpan={1} style={{ textAlign: "center", width: "70px" }}></th>
                                            <th colSpan={1} style={{ textAlign: "center", width: "70px" }}></th>
                                        </tr>
                                    </React.Fragment>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {typeof totalRows !== "undefined" && totalRows >= 10 && <div style={{ height: `${Math.max(200 - (totalRows - 10) * 20, 0)}px` }}></div>}
                {/*<h3 className="projectName">특이사항</h3>
                    <div className="etcBox">
                        <div className="etcItems">
                            <textarea
                                style={{ caretColor: " gray", fontSize: "15px" }}
                                className="textareaStyle"
                                type="text"
                                value={tableData.length ? tableData[0].ctcDesc : ""}
                                onChange={(e) => handleChange(e, "ctcDesc", 0)}
                            />
                        </div>
                    </div>*/}
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

export default DetailDoc;
