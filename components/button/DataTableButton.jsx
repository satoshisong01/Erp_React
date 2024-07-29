import ReSearchBtn from "components/DataTable/function/ReSearchBtn";
import React, { useEffect, useState } from "react";
import PopupButton from "./PopupButton";
import XLSX from "xlsx-js-style";
import URL from "constants/url";

export default function DataTableButton({
    excelClick,
    copyClick,
    printClick,
    deleteClick,
    addClick,
    dataTableRef,
    fetchAllData,
    addBtn,
    selectedData,
    columns,
}) {
    const buttons = [
        {
            id: "csvIcon",
            iconClass: "fa fa-file-excel-o utilIcon",
            label: "CSV",
            clickHandler: excelClick,
        },
        {
            id: "copyIcon",
            iconClass: "fa fa-copy utilIcon",
            label: "Copy",
            clickHandler: copyClick,
        },
        {
            id: "printIcon",
            iconClass: "fa fa-print utilIcon",
            label: "Print",
            clickHandler: printClick,
        },
        {
            id: "delIcon",
            iconClass: "fa fa-trash-o utilIcon",
            label: "삭제",
            clickHandler: deleteClick,
        },
        {
            id: "addIcon",
            iconClass: "fa fa-plus utilIcon",
            label: "추가",
            clickHandler: addClick,
        },
    ];

    // DataTableButton 컴포넌트 내의 handlePrint 함수 수정
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        const printContent = document
            .getElementById("print-content")
            .cloneNode(true);
        printWindow.document.open();
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Print</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                    }

                    #print-content {
                        max-width: 100%;
                        margin: 0 auto;
                        padding: 20px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: center;
                    }

                    th {
                        background-color: #f2f2f2;
                    }

                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    body {
                        zoom: 80%;
                        margin: 1cm;
                    }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
        </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    const excelAlert = () => {
        alert("Excel 파일로 다운로드가 되었습니다.");
    };

    const wb = XLSX.utils.book_new();

    const header = columns.map((column) => ({
        v: column.header, // 컬럼의 header 내용
        t: "s", // 데이터 타입 (s: string)
        s: {
            font: { sz: "15" },
            border: {
                top: { color: { rgb: "000000" } },
                bottom: { color: { rgb: "000000" } },
                left: { color: { rgb: "000000" } },
                right: { color: { rgb: "000000" } },
            },
        },
    }));

    const body = selectedData.map((item) =>
        columns.map((column) => ({
            v: item[column.col], // 컬럼에 해당하는 데이터 값
            t: "s", // 데이터 타입 (s: string)
            s: {
                font: { color: { rgb: "188038" } },
            },
        }))
    );

    // STEP 3: header와 body로 worksheet를 생성한다.

    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
    // 열의 너비를 조정
    const columnWidths = header.map((col) => ({ wch: 30 }));
    ws["!cols"] = columnWidths;

    // worksheet를 workbook에 추가한다.
    XLSX.utils.book_append_sheet(wb, ws, "readme demo");

    const buttonPropsMap = {
        costPage: {
            targetUrl: URL.EstimatePopupContainer,
            data: {
                btnName: "견적서",
                title: "견적서",
            },
        },
        calPage: {
            targetUrl: URL.CostStatement,
            data: {
                btnName: "사전원가서",
                title: "사전 원가 계산서",
            },
        },
        runCalPage: {
            targetUrl: URL.CostStatement,
            data: {
                btnName: "실행원가서",
                title: "실행 원가 계산서",
            },
        },
        //planPage: {
        //    targetUrl: URL.ApprovalContainer,
        //    data: {
        //        btnName: "수주계획",
        //        title: "사전 원가 계획",
        //    },
        //},
        runPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "실행계획",
                title: "사전 실행 계획",
            },
        },
        costPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "경비계획",
                title: "경비계획",
            },
        },
        runCostPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "경비실행",
                title: "경비실행",
            },
        },
        buyPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "구매계획",
                title: "구매계획",
            },
        },
        runBuyPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "구매실행",
                title: "구매실행",
            },
        },
    };

    useEffect(() => {
        buttons.forEach((button) => {
            if (typeof button.clickHandler === "function") {
                setShowButton(button.id, true);
            }
        });
    }, []);

    const setShowButton = (buttonId, value) => {
        setButtonState((prevState) => ({ ...prevState, [buttonId]: value }));
    };

    /* reduce: ({값}), {초기값} */
    const [buttonState, setButtonState] = useState(
        buttons.reduce((acc, button) => ({ ...acc, [button.id]: false }), {})
    );

    return (
        <div className="tableBtn">
            <ReSearchBtn
                dataTableRef={dataTableRef}
                fetchAllData={fetchAllData}
            />
            {addBtn.map((btn, index) => {
                const popupButtonProps = buttonPropsMap[btn];
                if (popupButtonProps) {
                    return <PopupButton key={index} {...popupButtonProps} />;
                }
                return null;
            })}
            {buttons.map(
                (button) =>
                    buttonState[button.id] && (
                        <button
                            key={button.id}
                            className={`btn btn-primary ${button.id}`}
                            id="utilBtn"
                            onClick={
                                button.id === "printIcon"
                                    ? handlePrint
                                    : button.id === "csvIcon"
                                    ? () => {
                                          XLSX.writeFile(wb, "table-demo.xlsx");
                                          excelAlert();
                                      }
                                    : button.clickHandler
                            }>
                            <i className={button.iconClass} />
                            {button.label}
                        </button>
                    )
            )}
        </div>
    );
}
