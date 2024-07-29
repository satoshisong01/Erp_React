import React, { useState, useEffect, useRef, useContext } from "react";
import "./PopUp.css";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import DetailDoc from "./DetailDoc";

/* 구매전체내역 */
const OrderSummaryDoc = ({ displayNone }) => {
    const [tableData, setTableData] = useState([]);
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);
    const [printBtn, setPrintBtn] = useState(false);

    const pdfContentRef = useRef(null);

    //pdf다운로드(라이브러리)
    const generatePDF = () => {
        const input = pdfContentRef.current;
        let element = document.getElementById("element-to-print");
        if (input) {
            const options = {
                filename: "견적구매비_요약.pdf", // 출력 파일 이름
                jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
            };

            html2pdf().from(element).set(options).save();

            html2pdf(input, options).save();
        }
    };

    const printFn = () => {
        setPrintBtn(true); // printBtn 상태를 true로 변경
        alert("출력합니다");
        setTimeout(() => {
            // titleInput 클래스명을 가진 input 요소들의 border 값을 변경
            const inputs = document.querySelectorAll(".titleInput");
            inputs.forEach((input) => {
                input.style.border = "none";
            });
            const printButton = document.getElementById("printButton");
            printButton.style.display = "none"; // 프린트 버튼 숨기기
            window.print();
            setPrintBtn(false); // 출력이 끝나면 printBtn 상태를 다시 false로 변경
        }, 1000); // 2초 후에 실행
    };

    const Columns = [
        { header: "Item", col: "pgNm" },
        { header: "Modal", col: "pdiNum" },
        { header: "Description", col: "pdiStnd" },
        { header: "Q'ty", col: "estBuyQunty", className: "text-center" },
        { header: "ConsumerPrice", col: "estConsumerUnitPrice", className: "text-right" },
        { header: "ConsumerAmount", col: "estConsumerAmount", className: "text-right" },
        { header: "UnitPrice", col: "estUnitPrice", className: "text-right" },
        { header: "Amount", col: "estAmount", className: "text-right" },
        { header: "Dc", col: "estDc", className: "text-right" },
        { header: "Remarks", col: "estBuyDesc" },
    ];

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

    console.log(tableData, "tableData");

    useEffect(() => {
        // URL에서 "data" 파라미터 읽기
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter);
        console.log(data, "3333");
        const { label } = data;
        setTitle(label);
        const updatedTableData = data.tableData2.map((rowData) => {
            let amount = 0;
            let estDesc = "";
            amount = rowData.price;
            estDesc = rowData.estDesc ? rowData.estDesc : "";
            console.log(rowData, "???");
            return { ...rowData, amount, estDesc };
        });

        setTableData(updatedTableData);
    }, []);

    useEffect(() => {
        findMaxCount(tableData);
    }, [tableData]);

    //숫자반환
    function findMaxCount(data) {
        let maxCount = 0;

        // Iterate over each array in the data
        for (let i = 0; i < data.length; i++) {
            const currentArray = data[i];
            let count = 0;

            // Iterate over the properties of the current array
            for (let j = 1; j <= 24; j++) {
                const propName = `estMm${j}`;

                // Check if the property exists and has a non-null value
                if (currentArray[propName] !== null && currentArray[propName] !== 0) {
                    count++;
                }
            }

            // Update maxCount if the current count is greater
            if (count > maxCount) {
                maxCount = count;
            }
        }

        console.log(maxCount, "?");
        setCount(maxCount);
        return maxCount;
    }
    return (
        <div className="precost-container">
            <div className="precost-title" style={{ margin: "auto", marginBottom: "20px", fontSize: "25px", textAlign: "center" }}>
                구매전체내역
            </div>
            <div style={{ display: "flex", margin: "10px" }} ref={pdfContentRef}>
                <div className="flex-column mg-t-20 mg-b-20">
                    <table id="example" className="display">
                        <thead>
                            <tr>
                                <th colSpan={2} style={{ textAlign: "center", width: "150px" }}>
                                    Item
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "150px" }}>
                                    Description
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "40px" }}>
                                    Q'ty
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "60px" }}>
                                    ConsumerPrice
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "90px" }}>
                                    ConsumerAmount
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    UnitPrice
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    Amount
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    D/C(%)
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    Remarks (Maker)
                                </th>
                            </tr>
                            {/*<tr>
                                {Columns.map((column, index) => {
                                    if (
                                        column.col === "pgNm" ||
                                        //column.col === "pdiNum" ||
                                        //column.col === "pdiStnd" ||
                                        //column.col === "estBuyQunty" ||
                                        //column.col === "amount" ||
                                        column.col === "estBuyDesc"
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <th key={index} className={column.className} style={{ textAlign: "center" }}>
                                            {column.header}
                                        </th>
                                    );
                                })}
                            </tr>*/}
                        </thead>
                        <tbody>
                            {tableData.map((rowData, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Columns.map((column, colIndex) => {
                                        const cellValue = rowData[column.col];
                                        const formattedValue = typeof cellValue === "number" ? cellValue.toLocaleString() : cellValue;
                                        // column.className이 있으면 사용하고, 없으면 빈 문자열을 사용
                                        const cellClass = column.className || "";
                                        return (
                                            <td key={colIndex} className={cellClass}>
                                                {formattedValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}

                            <tr style={{ backgroundColor: "rgb(239,239,239)" }}>
                                <td colSpan={2} style={{ textAlign: "center", fontWeight: "800" }}>
                                    H/W 총계
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "right", fontWeight: "800" }}>
                                    {tableData[0]?.estConsumerAmount ? tableData[0]?.estConsumerAmount.toLocaleString() : ""}
                                </td>
                                <td></td>
                                <td style={{ textAlign: "right", fontWeight: "800" }}>
                                    {tableData[0]?.estAmount ? tableData[0]?.estAmount.toLocaleString() : ""}
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/*<div style={{ marginBottom: printBtn ? "1000px" : "0px" }}></div>
            {printBtn && (
                <div className="precost-title" style={{ margin: "auto", marginBottom: "20px", fontSize: "25px", textAlign: "center" }}>
                    {title}
                </div>
            )}
            <DetailDoc />*/}
            {!displayNone && (
                <button id="printButton" onClick={() => printFn()} style={{ position: "fixed", top: "10px", right: "10px" }}>
                    <FontAwesomeIcon icon={faPrint} style={{ color: "red" }} />
                    (저장)출력
                </button>
            )}
        </div>
    );
};

export default OrderSummaryDoc;
