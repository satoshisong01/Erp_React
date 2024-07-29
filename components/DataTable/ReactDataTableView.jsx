import React, { useContext, useEffect, useMemo, useState } from "react";
import { axiosFetch } from "api/axiosFetch";
import { useTable, usePagination, useSortBy } from "react-table";
import { PageContext } from "components/PageProvider";
import { v4 as uuidv4 } from "uuid";

const ReactDataTableView = (props) => {
    const { columns, suffixUrl, customDatas, defaultPageSize, tableRef, viewPageName, customerList, sendPoiId, returnList, returnSelect } = props;
    const { prevCurrentPageName, innerPageName, prevInnerPageName, setCurrentTable, currentPageName, projectInfo, setProjectInfo } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [current, setCurrent] = useState("");
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    useEffect(() => {
        if (suffixUrl) {
            fetchAllData();
        }
        if (tableRef) {
            setCurrentTable(tableRef);
        }
        setCurrent(viewPageName);
    }, []);

    useEffect(() => {
        if (customDatas) {
            setTableData(customDatas);
        }
    }, [customDatas]);

    useEffect(() => {
        setSelectedRowIndex(-1); // 초기화 선택된 행이 없도록 설정
    }, [currentPageName, innerPageName]);

    const columnsConfig = useMemo(
        () =>
            columns.map((column) => ({
                Header: column.header,
                accessor: column.col,
                sortable: true,
                width: column.cellWidth,
                type: column.type,
                options: column.options,
                notView: column.notView,
                disabled: column.disabled,
            })),
        [columns]
    );

    const fetchAllData = async () => {
        if (!suffixUrl) return;
        const url = `/api${suffixUrl}/listAll.do`;
        const resultData = await axiosFetch(url, { useAt: "Y" });
        if (resultData) {
            setTableData([...resultData]);
        } else {
            setTableData(Array(defaultPageSize || 10).fill({}));
        }
    };

    const onRowClick = (rowIndex) => {
        const dataIndex = pageIndex * pageSize + rowIndex;
        const clickedPoiId = tableData[dataIndex]?.poiId;
        setProjectInfo((prev) => ({ ...prev, poiId: clickedPoiId }));
        sendPoiId && sendPoiId(clickedPoiId);
        setSelectedRowIndex(rowIndex);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize },
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        setPageSize,
        pageCount,
    } = useTable(
        {
            columns: columnsConfig,
            data: tableData,
            initialState: { pageIndex: 0, pageSize: defaultPageSize || 10 },
        },
        useSortBy,
        usePagination
    );

    const pageSizeChange = (value) => {
        setPageSize(Number(value));
        gotoPage(0);
    };

    return (
        <>
            {/* <div className="flex-between">
                <div className="page-size">
                    <span className="mg-r-10">페이지 크기 :</span>
                    <select className="select" id={uuidv4()} value={pageSize} onChange={(e) => pageSizeChange(e.target.value)}>
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div> */}

            <table {...getTableProps()} className="table-styled" ref={tableRef}>
                <thead>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, columnIndex) => {
                                if (column.notView) {
                                    return null;
                                }

                                return (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={columnIndex === 0 ? "first-column" : ""}
                                        style={{ width: column.width }}>
                                        {column.render("Header")}
                                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                {tableData.length <= 0 && (
                    <div>
                        <div style={{ fontSize: 15 }}>데이터가 없습니다. <br/> 데이터를 입력해 주세요.</div>
                    </div>
                )}
                <tbody {...getTableBodyProps()}>
                    {page.map((row, rowIndex) => {
                        prepareRow(row);
                        const isRowSelected = rowIndex === selectedRowIndex;
                        return (
                            <tr
                                {...row.getRowProps()}
                                onDoubleClick={() => sendPoiId && onRowClick(rowIndex)} // onClick 핸들러 변경
                                style={{
                                    color: isRowSelected ? "#0465BE" : "inherit",
                                    fontSize: isRowSelected ? "14px" : "inherit",
                                    fontWeight: isRowSelected ? "bold" : "inherit",
                                    backgroundColor: isRowSelected ? "rgba(4, 101, 190, 0.1)" : "inherit", // 배경색 변경
                                }}>
                                {row.cells.map((cell, cellIndex) => {
                                    if (cell.column.notView) {
                                        return null;
                                    }

                                    return (
                                        <td {...cell.getCellProps()} className={cellIndex === 0 ? "first-column" : "other-column"} id="otherCol">
                                            {cell.column.Header === "연월" && cell.value ? cell.value.substring(0, 7) : cell.render("Cell") || ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="me-pagenation">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {" "}
                    처음{" "}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {" "}
                    이전{" "}
                </button>
                <span>
                    {" "}
                    페이지 {pageIndex + 1} / {pageOptions && pageOptions.length}{" "}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {" "}
                    다음{" "}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {" "}
                    마지막{" "}
                </button>
            </div>
        </>
    );
};

export default ReactDataTableView;
