import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";

const ReactDataTableRowEdit = ({ columns }) => {
    const [tableData, setTableData] = useState([]); // 초기에 빈 배열로 시작
    const [selectDatas, setSelectDatas] = useState([]); // 선택된 데이터 배열
    const data = useMemo(() => tableData, [tableData]);

    // 초기 데이터 설정
    useEffect(() => {
        setTableData([
            { poiNm: "Value 1", poiCode: "option1", poiBeginDt: "Value 3" },
            { poiNm: "Value A", poiCode: "optionC", poiBeginDt: "Value B" },
        ]);
    }, []);

    useEffect(() => {
        console.log("1.테이블데이터: ", tableData);
    }, [tableData]);

    useEffect(() => {
        console.log("2.셀렉트데이터: ", selectDatas);
    }, [selectDatas]);

    /* 임시저장 */
    const saveDraft = () => {};

    const columnsConfig = useMemo(
        () => [
            {
                id: "selection",
                Header: ({ getToggleAllPageRowsSelectedProps }) => (
                    <div>
                        <input
                            type="checkbox"
                            {...getToggleAllPageRowsSelectedProps()}
                            className="table-checkbox"
                            indeterminate="false"
                            onClick={onSelectAll}
                        />
                    </div>
                ),
                Cell: ({ row }) => (
                    <div>
                        <input
                            type="checkbox"
                            {...row.getToggleRowSelectedProps()}
                            className="table-checkbox"
                            indeterminate="false"
                            onClick={(e) => onSelectRow(e, row)}
                        />
                    </div>
                ),
                width: 35,
            },
            ...columns.map((column) => ({
                Header: column.header,
                accessor: column.col,
                sortable: true,
                width: column.cellWidth,
                type: column.type,
                options: column.options,
            })),
        ],
        [columns]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state: { pageIndex },
        page,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        setPage,
    } = useTable(
        {
            columns: columnsConfig,
            data,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination,
        useRowSelect
    );

    const testClick = (value) => {
        console.log("⭕ value: ", value);
    };

    const onChange = (e, preRow, column) => {
        const newValue = e.target.value;
        const newTableData = tableData.map((rowData) => {
            if (rowData === preRow.original) {
                return { ...rowData, [column.id]: newValue };
            }
            return rowData;
        });
        setTableData(newTableData);
    };

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columns.forEach((column) => {
            newRow[column.col] = ""; //초기화
        });

        setTableData((prevData) => [...prevData, newRow]);
    };

    /* 전체 선택 시 selectDatas에 저장 또는 삭제 */
    const onSelectAll = (e) => {
        const isSelected = e.target.checked;

        if (isSelected && tableData) {
            setTableData((resultData) => {
                setSelectDatas(resultData);
                return resultData;
            });
        } else {
            setSelectDatas([]);
        }
    };

    /* 선택된 행 selectDatas에 저장 또는 삭제 */
    const onSelectRow = (e, row) => {
        const data = row.original;
        const isSelected = e.target.checked;

        if (isSelected) {
            if (!selectDatas.includes(data)) {
                setSelectDatas((prevSelectDatas) => [...prevSelectDatas, data]);
            }
        } else {
            setSelectDatas((prevSelectDatas) => prevSelectDatas.filter((item) => item !== data));
        }
    };

    const onDeleteRow = (row) => {
        const rowToDelete = row.original;

        setTableData((prevData) => prevData.filter((rowData) => rowData !== rowToDelete));
        setSelectDatas((prevSelectDatas) => prevSelectDatas.filter((data) => data !== rowToDelete));

        setPage(0);
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={onAddRow}>
                Add Row
            </button>
            <table {...getTableProps()} className="table table-bordered table-styled" id="dataTableReactTable">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="tableHeaderTh" style={{ width: column.width }}>
                                    <div className="icon-container">
                                        <span>{column.render("Header")}</span>
                                        <span className="sort-icon">{column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                {tableData.length <= 0 && (
                    <div style={{ display: "flex", width: "1200px", margin: "auto", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 15 }}>데이터가 없습니다. <br/> 데이터를 입력해 주세요.</div>
                    </div>
                )}
                <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr key={index} {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    const { column } = cell;
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.column.id === "selection"
                                                ? cell.render("Cell")
                                                : cell.column.type === "input" && (
                                                      <input type="text" defaultValue={cell.value} onChange={(e) => onChange(e, row, column)} />
                                                  )}
                                            {column.type === "select" && column.options ? (
                                                <select value={cell.value} onChange={(e) => onChange(e, row, column)}>
                                                    {cell.column.options.map((option) => (
                                                        <option key={option.value} defaultValue={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : null}
                                        </td>
                                    );
                                })}
                                <td>
                                    <button className="btnR btn-primary redDelete" onClick={() => onDeleteRow(row)}>
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    ◀
                </button>
                <span>
                    Page <strong>{pageIndex + 1}</strong>
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    ▶
                </button>
            </div>
        </div>
    );
};

export default ReactDataTableRowEdit;
