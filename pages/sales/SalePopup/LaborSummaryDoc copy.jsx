import React, { useState, useEffect, useRef, useContext } from "react";
import "./PopUp.css";
import html2pdf from "html2pdf.js";

/* 영업상세내역 */
const LaborSummaryDoc = () => {
    const [tableData, setTableData] = useState([]);
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);

    const pdfContentRef = useRef(null);

    const generatePDF = () => {
        const input = pdfContentRef.current;
        let element = document.getElementById("element-to-print");
        if (input) {
            const options = {
                filename: "견적인건비_요약.pdf", // 출력 파일 이름
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };

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
            for (let j = 1; j <= 24; j++) {
                const propName = `estMm${j}`;
                if (rowData[propName] !== null) {
                    total += rowData[propName];
                }
            }
            unitPrice = rowData.estUnitPrice;
            amount = rowData.price;
            console.log(rowData, "???");
            return { ...rowData, total, unitPrice, amount };
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

            // Iterate over the properties of the current array in reverse order
            for (let j = 24; j >= 1; j--) {
                const propName = `estMm${j}`;

                // Check if the property exists and has a non-null and non-zero value
                if (currentArray[propName] !== null && currentArray[propName] !== 0) {
                    count = 24 - j + 1; // Update count based on the position of the non-null and non-zero value
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
                                <th colSpan={2} rowSpan={2} style={{ textAlign: "center", width: "300px" }}>
                                    Description
                                </th>
                                <th colSpan={count} style={{ width: `${count * 50}px`, textAlign: "center" }}>
                                    M/M
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "150px" }}>
                                    Total
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "150px" }}>
                                    Unit Price
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "150px" }}>
                                    Amount
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "150px" }}>
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
                                        (column.col.startsWith("estMm") &&
                                            tableData.every((row) => {
                                                for (let j = 24; j >= 1; j--) {
                                                    const propName = `estMm${j}`;
                                                    if (row[propName] !== null && row[propName] !== 0) {
                                                        return j + 1 <= parseInt(column.col.slice(5));
                                                    }
                                                }
                                                return false;
                                            }))
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
                                        if (column.col.startsWith("estMm") && colIndex >= count + 2) {
                                            return null;
                                        }

                                        const shouldRender = (() => {
                                            if (column.col.startsWith("estMm")) {
                                                let foundTrue = false;
                                                // 역순으로 검사하여 처음으로 true를 찾으면 해당 번호까지만 값을 출력
                                                for (let j = 24; j >= 1; j--) {
                                                    const propName = `estMm${j}`;
                                                    if (rowData[propName] !== null && rowData[propName] !== 0) {
                                                        foundTrue = true;
                                                    }

                                                    if (foundTrue && j === parseInt(column.col.slice(5))) {
                                                        return true;
                                                    }
                                                }
                                                return false;
                                            } else {
                                                return rowData[column.col] !== null && rowData[column.col] !== 0;
                                            }
                                        })();

                                        return (
                                            <td key={colIndex} className={column.className}>
                                                {shouldRender ? rowData[column.col].toLocaleString() : null}
                                            </td>
                                        );
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
