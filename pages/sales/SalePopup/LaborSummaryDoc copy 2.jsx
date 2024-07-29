import React, { useState, useEffect, useRef, useContext } from "react";
import "./PopUp.css";
import html2pdf from "html2pdf.js";

/* 영업상세내역 */
const LaborSummaryDoc = () => {
    const [tableData, setTableData] = useState([]);
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);

    const pdfContentRef = useRef(null);

    const generatePDF2 = () => {
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

    const generatePDF = () => {
        const element = document.getElementById("element-to-print");
        const input = pdfContentRef.current;

        if (input) {
            // PDF 출력 옵션 설정
            const options = {
                filename: "견적인건비_요약.pdf", // 출력 파일 이름
                jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
            };

            // 전체 데이터를 몇 개의 행이 하나의 페이지에 들어갈지로 나누기
            const rowsPerPage = 1; // 한 페이지에 표시할 최대 행 수
            const totalPages = Math.ceil(tableData.length / rowsPerPage);

            // 각 페이지별로 PDF 생성
            for (let currentPage = 0; currentPage < totalPages; currentPage++) {
                // 현재 페이지에 표시할 데이터의 시작 인덱스 및 끝 인덱스 계산
                const startIdx = currentPage * rowsPerPage;
                const endIdx = startIdx + rowsPerPage;

                // 현재 페이지에 해당하는 데이터 슬라이싱
                const slicedData = tableData.slice(startIdx, endIdx);

                // 각 데이터 청크를 새로운 페이지로 설정하여 PDF 생성
                const pageOptions = { ...options, pagesplit: true };
                const pdfInstance = html2pdf().from(element).set(pageOptions);

                // 마지막 청크가 아니라면 새로운 페이지 추가
                if (currentPage !== totalPages - 1) {
                    pdfInstance.addPage();
                }

                // PDF 저장
                pdfInstance.save();
            }
            html2pdf().from(element).set(options).save();

            html2pdf(input, options).save();
        }
    };

    const Columns = [
        { header: "Description", col: "pgNm" },
        { header: "Position", col: "estPosition" },
        { header: "M", col: "estMm1" },
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
        { header: "Remarks", col: "estDesc" },
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

        console.log(maxCount);
        setCount(maxCount);
        return maxCount;
    }
    return (
        <div className="precost-container">
            <div className="precost-title" style={{ margin: "auto", marginBottom: "20px", fontSize: "25px", textAlign: "center" }}>
                {title}
            </div>
            <div style={{ display: "flex", margin: "10px" }} ref={pdfContentRef}>
                <div className="flex-column mg-t-20 mg-b-20">
                    <table id="example" className="display">
                        <thead>
                            <tr>
                                <th colSpan={2} rowSpan={2} style={{ textAlign: "center", width: "150px" }}>
                                    Description
                                </th>
                                <th colSpan={count} style={{ width: `${count * 40}px`, textAlign: "center" }}>
                                    M/M
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "40px" }}>
                                    Total
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "70px" }}>
                                    Unit Price
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "90px" }}>
                                    Amount
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "90px" }}>
                                    Remarks
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
                                        <th key={index} className={column.className} style={{ width: "50px" }}>
                                            {column.header}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((rowData, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Columns.map((column, colIndex) => {
                                        if (column.col.startsWith("estMm") && colIndex >= count + 30) {
                                            return null;
                                        }

                                        // Check if rowData[column.col] is not null and not 0 before rendering <td>
                                        if (rowData[column.col] !== null && rowData[column.col] !== 0) {
                                            return (
                                                <td key={colIndex} className={column.className}>
                                                    {rowData[column.col].toLocaleString()}
                                                </td>
                                            );
                                        } else {
                                            // If rowData[column.col] is null or 0, return null to skip rendering the <td> element
                                            return null;
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button onClick={generatePDF}>라이브러리PDF</button>
        </div>
    );
};

export default LaborSummaryDoc;
