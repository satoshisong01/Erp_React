import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";

const Table = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize },
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        setPageSize,
        pageCount,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );

    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];

    return (
        <div>
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps({
                                        onClick: () => {
                                            column.toggleSortBy(); // 정렬 토글 함수 호출
                                        },
                                        title: "Click to toggle sorting",
                                    })}>
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    처음
                </button>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}>
                    이전
                </button>
                <span>
                    페이지 {pageIndex + 1} / {pageOptions.length}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    다음
                </button>
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}>
                    마지막
                </button>
            </div>
            <div className="page-size">
                페이지 크기:
                <select
                    value={pageSize}
                    onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setPageSize(newSize); // 페이지 크기 변경
                        gotoPage(0); // 첫 페이지로 이동
                    }}>
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const App = () => {
    const columns = [
        {
            Header: "Name",
            accessor: "name",
            sortType: "alphanumeric",
        },
        {
            Header: "Age",
            accessor: "age",
            sortType: "alphanumeric",
        },
        {
            Header: "Country",
            accessor: "country",
            sortType: "alphanumeric",
        },
    ];

    const data = [
        // Generate 50 dummy data entries
        ...Array(50)
            .fill()
            .map((_, index) => ({
                name: `Person ${index + 1}`,
                age: Math.floor(Math.random() * 50) + 20,
                country: ["USA", "Canada", "UK"][Math.floor(Math.random() * 3)],
            })),
    ];

    return (
        <div className="App">
            <h1>Table Example</h1>
            <Table columns={columns} data={data} />
        </div>
    );
};

export default App;
