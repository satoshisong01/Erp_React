import React from "react";

export default function BasicDataTable({ columns, data, datatableRef, tableSize, subtitle }) {
    const tableContainerStyle = {
        ...tableSize,
        overflowY: "auto", // 내용이 넘칠 때 세로 스크롤 생성
    };

    const theadStyle = {
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        zIndex: 1,
    };

    return (
        <div className="basic-table">
            <div className="table-sub">{subtitle}</div>
            <div style={tableContainerStyle}>
                <table className="table-content" ref={datatableRef}>
                    <thead style={theadStyle}>
                        <tr className="table-row table-header">
                            {columns.map((column, index) => (
                                <th key={index} className={column.className}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="flex-column">
                        {data.map((rowData, rowIndex) => (
                            <tr key={rowIndex} className="table-row">
                                {rowData.data.map((cellData, colIndex) => (
                                    <td key={colIndex} className={`${columns[colIndex].className} ${rowData.className[colIndex]}`} style={{ height: 25 }}>
                                        {typeof cellData === "number" ? cellData.toLocaleString() : cellData}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
