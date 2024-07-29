import React, { useState, useEffect, useRef, useContext } from "react";
import "./PopUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";

import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* 영업상세내역 */
const LaborSummaryDoc = ({ displayNone }) => {
    const [tableData, setTableData] = useState([]);
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);
    const [tableTotal, setTableTotal] = useState([]);

    const pdfContentRef = useRef(null);

    //const generatePDF = () => {
    //    const input = pdfContentRef.current;
    //    let element = document.getElementById("element-to-print");
    //    if (input) {
    //        const options = {
    //            filename: "견적인건비_요약.pdf", // 출력 파일 이름
    //            jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    //        };

    //        const pdfDoc = new jsPDF(options.jsPDF);

    //        // 페이지 1
    //        html2pdf(element).toPdf((pdf) => {
    //            pdfDoc.addPage();
    //            pdfDoc.addImage(pdf.output("datauristring"), 0, 0);
    //        });

    //        // 페이지 2
    //        let element2 = document.getElementById("element-to-print-page2");
    //        html2pdf(element2).toPdf((pdf2) => {
    //            pdfDoc.addPage();
    //            pdfDoc.addImage(pdf2.output("datauristring"), 0, 0);
    //        });

    //        // 최종적으로 저장
    //        pdfDoc.save("견적인건비_요약_2페이지.pdf");
    //    }
    //};

    //pdf다운로드(라이브러리)
    const generatePDF = () => {
        const input = pdfContentRef.current;
        let element = document.getElementById("element-to-print");
        if (input) {
            const options = {
                filename: "견적인건비_요약.pdf", // 출력 파일 이름
                jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
            };

            html2pdf().from(element).set(options).save();

            html2pdf(input, options).save();
        }
    };

    const printFn = () => {
        alert("출력합니다");

        const inputs = document.querySelectorAll(".titleInput");
        inputs.forEach((input) => {
            input.style.border = "none";
        });
        const printButton = document.getElementById("printButton");
        printButton.style.display = "none"; // 프린트 버튼 숨기기
        window.print();
    };

    const Columns = [
        { header: "Description", col: "pgNm" },
        { header: "Remarks", col: "estDesc" },
        { header: "Position", col: "estPosition" },
        { header: "M+0", col: "estMm1" },
        { header: "M+1", col: "estMm2" },
        { header: "M+2", col: "estMm3" },
        { header: "M+3", col: "estMm4" },
        { header: "M+4", col: "estMm5" },
        { header: "M+5", col: "estMm6" },
        { header: "M+6", col: "estMm7" },
        { header: "M+7", col: "estMm8" },
        { header: "M+8", col: "estMm9" },
        { header: "M+9", col: "estMm10" },
        { header: "M+10", col: "estMm11" },
        { header: "M+11", col: "estMm12" },
        { header: "M+12", col: "estMm13" },
        { header: "M+13", col: "estMm14" },
        { header: "M+14", col: "estMm15" },
        { header: "M+15", col: "estMm16" },
        { header: "M+16", col: "estMm17" },
        { header: "M+17", col: "estMm18" },
        { header: "M+18", col: "estMm19" },
        { header: "M+19", col: "estMm20" },
        { header: "M+20", col: "estMm21" },
        { header: "M+21", col: "estMm22" },
        { header: "M+22", col: "estMm23" },
        { header: "M+23", col: "estMm24" },
        { header: "Total", col: "total" },
        { header: "UnitPrice", col: "unitPrice" },
        { header: "Amount", col: "amount" },
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
        const { label } = data;
        setTitle(label);
        const updatedTableData = data.tableData.map((rowData) => {
            let total = 0;
            let unitPrice = 0;
            let amount = 0;
            let estDesc = "";
            for (let j = 1; j <= 24; j++) {
                const propName = `estMm${j}`;
                if (rowData[propName] !== null) {
                    total += rowData[propName];
                }
            }
            unitPrice = rowData.estUnitPrice;
            amount = rowData.price;
            estDesc = rowData.estDesc ? rowData.estDesc : "";
            console.log(rowData, "???");
            return { ...rowData, total, unitPrice, amount, estDesc };
        });

        setTableData(updatedTableData);
    }, []);

    const total = {};
    useEffect(() => {
        tableData.forEach((item) => {
            for (const key in item) {
                if (typeof item[key] === "number") {
                    // 이미 누적된 값이 있다면 더하고, 없다면 초기값으로 설정
                    total[key] = (total[key] || 0) + item[key];
                }
            }
        });

        const estMmKeys = Object.keys(total).filter((key) => key.startsWith("estMm") && key !== "estMm");
        const filledEstMmKeys = estMmKeys.filter((key) => total[key] !== null && total[key] !== 0);
        const numberOfFilledEstMm = filledEstMmKeys.length;
        console.log(numberOfFilledEstMm);
        console.log(total);
        setTableTotal(total);
        setCount(numberOfFilledEstMm);
    }, [tableData]);

    //숫자반환
    function findMaxCount(data) {
        console.log(data, "숫자반환 받아오는값");
        let maxCount = 0;

        // Iterate over each array in the data
        for (let i = 0; i < data.length; i++) {
            const currentArray = data[i];
            let count = 0;
            console.log(currentArray);
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

        console.log(maxCount);
        return maxCount;
    }

    const processRowSpanData = (tableData, columns) => {
        return tableData.map((row, rowIndex) => {
            const newRow = { ...row, _rowSpans: {} }; // 새로운 row 객체를 생성하고, 여기에 rowSpan 정보를 추가합니다.
            columns.forEach((column, colIndex) => {
                // 'pgNm' 열에만 이 로직을 적용합니다.
                if (column.col === "pgNm") {
                    // 첫 번째 행이거나 이전 행의 'pgNm' 값과 현재 행의 'pgNm' 값이 다른 경우
                    if (rowIndex === 0 || tableData[rowIndex - 1][column.col] !== row[column.col]) {
                        let rowSpan = 1;
                        for (let nextRowIdx = rowIndex + 1; nextRowIdx < tableData.length; nextRowIdx++) {
                            if (tableData[nextRowIdx][column.col] === row[column.col]) {
                                rowSpan++; // 다음 행의 'pgNm' 값이 현재 행의 'pgNm' 값과 동일한 경우, rowSpan을 증가시킵니다.
                            } else {
                                break; // 연속되지 않으면 중단합니다.
                            }
                        }
                        newRow._rowSpans[column.col] = rowSpan; // 'pgNm' 열의 rowSpan 값을 설정합니다.
                    } else {
                        newRow._rowSpans[column.col] = 0; // 이전 행의 'pgNm' 값과 동일한 경우, rowSpan을 0으로 설정하여 병합될 행을 표시합니다.
                    }
                } else if (column.col === "estDesc") {
                    // 'estDesc' 열의 rowSpan 값을 설정합니다.
                    if (rowIndex === 0 || tableData[rowIndex - 1]["pgNm"] !== row["pgNm"]) {
                        let rowSpan = 1;
                        let accumulatedValue = row[column.col]; // 누적값 초기화
                        for (let nextRowIdx = rowIndex + 1; nextRowIdx < tableData.length; nextRowIdx++) {
                            if (tableData[nextRowIdx]["pgNm"] === row["pgNm"]) {
                                rowSpan++; // 다음 행의 'pgNm' 값이 현재 행의 'pgNm' 값과 동일한 경우, rowSpan을 증가시킵니다.
                                accumulatedValue += "<br>" + tableData[nextRowIdx][column.col]; // 줄바꿈 추가하여 누적값 증가
                            } else {
                                break; // 연속되지 않으면 중단합니다.
                            }
                        }
                        newRow._rowSpans[column.col] = rowSpan; // 'estDesc' 열의 rowSpan 값을 설정합니다.
                        newRow[column.col] = accumulatedValue; // 누적값으로 열 값 설정
                    } else {
                        newRow._rowSpans[column.col] = 0; // 이전 행의 'pgNm' 값과 동일한 경우, rowSpan을 0으로 설정하여 병합될 행을 표시합니다.
                    }
                }
            });
            return newRow;
        });
    };

    const processedTableData = processRowSpanData(tableData, Columns);

    console.log(processedTableData, "변환?");

    return (
        <div className="precost-container">
            <div className="precost-title" style={{ margin: "auto", marginBottom: "20px", fontSize: "25px", textAlign: "center" }}>
                인건비전체내역
            </div>
            <div style={{ display: "flex", margin: "10px" }} ref={pdfContentRef}>
                <div className="flex-column mg-t-20 mg-b-20">
                    <table id="example" className="display">
                        <thead>
                            <tr>
                                <th colSpan={2} rowSpan={2} style={{ textAlign: "center", width: "250px", border: "solid 1px gray" }}>
                                    Description
                                </th>
                                <th colSpan={1} rowSpan={0} style={{ textAlign: "center", width: "20px", border: "solid 1px gray" }}>
                                    Position
                                </th>
                                <th colSpan={count} style={{ width: `${count * 35}px`, textAlign: "center", border: "solid 1px gray" }}>
                                    M/M
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "20px", border: "solid 1px gray" }}>
                                    Total
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "50px", border: "solid 1px gray" }}>
                                    Unit Price
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "80px", border: "solid 1px gray" }}>
                                    Amount
                                </th>
                            </tr>
                            <tr>
                                {Columns.map((column, index) => {
                                    if (
                                        column.col === "pgNm" ||
                                        column.col === "estPosition" ||
                                        column.col === "unitPrice" ||
                                        column.col === "amount" ||
                                        column.col === "estDesc" ||
                                        column.col === "total" ||
                                        (column.col.startsWith("estMm") && tableData.every((row) => row[column.col] === null || row[column.col] === 0))
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <th
                                            key={index}
                                            className={column.className}
                                            style={{
                                                textAlign: "center",
                                                border: "solid 1px gray",
                                                width: column.col === "estPosition" ? "40px" : column.width, // estPosition에 해당하는 열의 넓이를 40px로 설정
                                            }}>
                                            {column.header}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {processedTableData.map((rowData, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Columns.map((column, colIndex) => {
                                        if (rowData._rowSpans[column.col] === 0) return null; // rowSpan이 0인 경우, 즉 이전 행과 병합되어야 하는 경우 렌더링하지 않습니다.
                                        if (column.col.startsWith("estMm") && tableData.every((row) => row[column.col] === null || row[column.col] === 0)) {
                                            return null;
                                        }
                                        return (
                                            <td
                                                key={colIndex}
                                                rowSpan={rowData._rowSpans[column.col]} // 계산된 rowSpan 값 적용
                                                style={{
                                                    border: "solid 1px gray",
                                                    textAlign:
                                                        column.col === "estPosition" || column.col === "pgNm" || column.col === "estDesc" ? "left" : "right", // textAlign 조건 추가
                                                }}>
                                                {column.col === "estDesc" ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                rowData[column.col] !== null && rowData[column.col] !== 0
                                                                    ? rowData[column.col].replace(/\\n/g, "<br>")
                                                                    : null,
                                                        }}
                                                    />
                                                ) : rowData[column.col] !== null && rowData[column.col] !== 0 ? (
                                                    rowData[column.col].toLocaleString()
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}

                            <tr>
                                <th colSpan={2} style={{ textAlign: "center", width: "250px", border: "solid 1px gray" }}>
                                    TOTAL
                                </th>
                                <th colSpan={1} rowSpan={0} style={{ textAlign: "right", width: "20px", border: "solid 1px gray" }}></th>
                                {Object.entries(tableTotal).map(
                                    ([key, value]) =>
                                        key.startsWith("estMm") &&
                                        key !== "estMm" &&
                                        value !== 0 && (
                                            <th key={key} style={{ width: `${35}px`, textAlign: "right", border: "solid 1px gray" }}>
                                                {value}
                                            </th>
                                        )
                                )}
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "right", width: "20px", border: "solid 1px gray" }}>
                                    {tableTotal.total}
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "right", width: "50px", border: "solid 1px gray" }}></th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "right", width: "80px", border: "solid 1px gray" }}>
                                    {tableTotal["amount"] ? tableTotal["amount"].toLocaleString() : ""}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {!displayNone && (
                <button id="printButton" onClick={() => printFn()} style={{ position: "fixed", top: "10px", right: "10px" }}>
                    <FontAwesomeIcon icon={faPrint} style={{ color: "red" }} />
                    (저장)출력
                </button>
            )}
        </div>
    );
};

export default LaborSummaryDoc;
