import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect, useBlockLayout, useResizeColumns } from "react-table";
import { PageContext } from "components/PageProvider";
import ModalPageCompany from "components/modal/ModalPageCompany";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한국어 로케일 설정
import ModalPagePgNm from "components/modal/ModalPagePgNm";
import CompanyModal from "components/modal/CompanyModal";
import ProductInfoModal from "components/modal/ProductInfoModal";
import ProductGroupModal from "components/modal/ProductGroupModal";
import EmployerInfoModal from "components/modal/EmployerInfoModal";
import Number from "components/input/Number";

const ReactDataTableSaleCost = (props) => {
    const {
        columns,
        customDatas,
        defaultPageSize,
        tableRef,
        viewPageName,
        customDatasRefresh,
        editing,
        hideCheckBox,
        returnSelect,
        returnSelectRows,
        condition,
        isPageNation,
        copiedDatas, //복제할 데이터
        isCopied, //복제 데이터가 있는지
    } = props;
    const {
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setCurrentTable,
        setLengthSelectRow,
        newRowData,
        currentPageName,
        setModalLengthSelectRow,
        isModalTable,
        nameOfButton,
        setNameOfButton,
        modalPageName,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(viewPageName); //==viewPageName
    const [rowIndex, setRowIndex] = useState(0);
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false); //거래처정보목록
    const [isOpenModalProductInfo, setIsOpenModalProductInfo] = useState(false); //품목정보목록
    const [isOpenModalProductGroup, setIsOpenModalProductGroup] = useState(false); //품목그룹목록
    const [isOpenModalEmployerInfo, setIsOpenModalEmployerInfo] = useState(false); //업무회원목록

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        setCurrent(viewPageName);
        if (tableRef) {
            setCurrentTable(tableRef);
        }
    }, []);

    const isCurrentPage = () => {
        return (
            current.id !== "" &&
            current.id !== undefined &&
            (current.id === currentPageName.id || current.id === innerPageName.id || current.name === modalPageName)
        );
    };

    useEffect(() => {
        if(isCopied) {
            // console.log("1. 복제 TRUE - custom:", customDatas, "copied", copiedDatas);
            const copied = initializeTableData(copiedDatas, columns);
            const custom = initializeTableData(customDatas, columns);
            setOriginTableData(custom); //저장할 테이블
            setTableData(copied?.length > 0 ? copied : []); //복제할 테이블
        } else {
            // console.log("2. 복제 FALSE - custom:", customDatas, "copied", copiedDatas);
            const custom = initializeTableData(customDatas, columns);
            const copyCustom = JSON.parse(JSON.stringify(custom)); //깊은 복사
            setOriginTableData(custom); //원본 데이터
            setTableData(copyCustom); //수정 데이터
        }
    }, [isCopied, customDatas, copiedDatas]);

    /* columns에는 있지만 넣어줄 데이터가 없을 때 초기값 설정 */
    const initializeTableData = (datas, cols) => {
        if (datas && datas.length > 0) {
            const updatedData = datas.map((dataItem) => {
                const newData = { ...dataItem };
                cols.forEach((column) => {
                    if (!newData.hasOwnProperty(column.col)) {
                        newData[column.col] = ""; // 해당 변수가 없으면 빈 값으로 초기화
                    }
                    if (column.type === "select") {
                        newData[column.col] = column.options[0].value; // 옵션의 첫 번째 값으로 초기화
                    }
                });
                return newData;
            });
            return updatedData;
        }
        return [];
    };

    /* tab에서 컴포넌트 화면 변경 시 초기화  */
    useEffect(() => {
        if (currentPageName.id !== prevCurrentPageName.id || innerPageName.id !== prevInnerPageName.id) {
            // 현재 페이지와 이전 페이지가 같지 않다면
            toggleAllRowsSelected(false);
        }
        // 현재 보는 페이지(current)가 클릭한 페이지와 같은게 없다면 return
        if (current.id !== currentPageName.id && current.id !== innerPageName.id) {
            return;
        }
    }, [currentPageName, innerPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        // console.log("영업관리비 current:", current.name, "inner:", innerPageName.name, "current:",currentPageName.name);
        if (isCurrentPage()) {
            setIsEditing(editing !== undefined ? editing : isEditing); //테이블 상태 //inner tab일 때 테이블 조작
            if (nameOfButton === "save") {
                compareData(originTableData, tableData);
            } else if (nameOfButton === "deleteRow") {
                onDeleteRow();
            } else if (nameOfButton === "addRow") {
                onAddRow();
            }
            setNameOfButton(""); //초기화
        }
    }, [innerPageName, editing, nameOfButton]);

    /* table의 button 클릭 시 해당하는 함수 실행 */

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
                require: column.require,
                textAlign: column.textAlign,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (newRowData && Object.keys(newRowData).length !== 0) {
            console.log("❗❗❗❗❗ newRowData");
            onAddRow(newRowData);
            //GeneralExpensesOnAddRow(newRowData);
            //companyOnAddRow(newRowData);
        }
    }, [newRowData]);

    /* 로우 클릭 */
    const onCLickRow = (row) => {
        toggleRowSelected(row.id);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize },
        gotoPage,
        setPageSize,
        selectedFlatRows, // 선택된 행 데이터
        toggleRowSelected, // 선택된 체크 박스
        toggleAllRowsSelected, // 전체선택 on off
    } = useTable(
        {
            columns: columnsConfig,
            data: tableData,
            initialState: { pageIndex: 0, pageSize: isPageNation ? defaultPageSize || 10 : (tableData && tableData.length) || 200 }, // 초기값
        },
        useSortBy,
        usePagination,
        useRowSelect,
        useBlockLayout,
        useResizeColumns,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                ...(hideCheckBox !== undefined && hideCheckBox
                    ? []
                    : [
                          {
                              id: "selection",
                              Header: ({ getToggleAllPageRowsSelectedProps }) => (
                                  <div>
                                      <input
                                          id={uuidv4()}
                                          type="checkbox"
                                          {...getToggleAllPageRowsSelectedProps()}
                                          className="table-checkbox"
                                          indeterminate="false"
                                      />
                                  </div>
                              ),
                              Cell: ({ row }) => (
                                  <div>
                                      <input
                                          id={uuidv4()}
                                          type="checkbox"
                                          {...row.getToggleRowSelectedProps()}
                                          className="table-checkbox"
                                          indeterminate="false"
                                          onClick={(e) => e.stopPropagation()}
                                      />
                                  </div>
                              ),
                              width: 35,
                          },
                      ]),
                ...columns,
            ]);
        }
    );

    /* table button 활성화 on off */
    useEffect(() => {
        if (isCurrentPage()) {
            if (isModalTable) {
                //모달화면일때
                setModalLengthSelectRow(selectedFlatRows.length);
                if (selectedFlatRows.length > 0) {
                    const selects = selectedFlatRows.map((row) => row.values);
                    returnSelectRows && returnSelectRows(selects);
                    returnSelect && returnSelect(selectedFlatRows[selectedFlatRows.length - 1].values);
                }
            } else if (!isModalTable) {
                if (selectedFlatRows.length > 0) {
                    const selects = selectedFlatRows.map((row) => row.values);
                    returnSelectRows && returnSelectRows(selects);
                    returnSelect && returnSelect(selectedFlatRows[selectedFlatRows.length - 1].values);
                }
                setLengthSelectRow(selectedFlatRows.length);
            }
        }
    }, [selectedFlatRows]);

    const onChangeInput = (e, preRow) => {
        const { name, value } = e.target;
        const newTableData = tableData.map((rowData, rowIndex) => {
            if (rowIndex === preRow.index) {
                return { ...rowData, [name]: value };
            }
            return rowData;
        });
        setTableData(newTableData);
        // setChangeTable(newTableData);
    };

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = condition.poiId || ""; // poiId를 항상 선택한놈으로 설정
            } else if (column.accessor === "versionId") {
                newRow[column.accessor] = condition.versionId; //
            } else if (column.accessor === "esntlId") {
                //임시 업무회원 삭제해야함
                newRow[column.accessor] = ""; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "pjbgTypeCode") {
                newRow[column.accessor] = "EXPNS01"; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "useAt") {
                newRow[column.accessor] = "Y"; // useAt 항상 "Y"로 설정
            } else if (column.accessor === "deleteAt") {
                newRow[column.accessor] = "N"; // deleteAt 항상 "N"로 설정
            } else {
                newRow[column.accessor] = null; // 다른 열은 초기화
            }
        });

        setTableData((prevData) => {
            const newData = [...prevData, { ...newRow }];
            console.log(newData, "데이터 리턴");
            return newData;
        });
    };

    const onDeleteRow = () => {
        if (!selectedFlatRows || selectedFlatRows.length === 0) {
            return;
        }
        const values = selectedFlatRows.map((item) => item.index);
        setTableData((prevTableData) => {
            const updateTableData = prevTableData.filter((_, index) => !values.includes(index));
            return [...updateTableData];
        });
    };

    const addItem = async (addData) => {
        console.log(addData, "영업관리비 추가!!");
        const url = `/api/baseInfrm/product/slsmnExpns/addList.do`;
        const resultData = await axiosPost(url, addData);
        if (resultData) {
            setRemind(remind+1);
        }
    };

    const updateItem = async (toUpdate, type) => {
        const url = `/api/baseInfrm/product/slsmnExpns/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData) {
            setRemind(remind+1);
            if(type) {
                setRemind(2);
            }
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/baseInfrm/product/slsmnExpns/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        if (resultData) {
            setRemind(remind+1);
        }
    };

    //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
    const updateDataInOrigin = (originData, updatedData) => {
        // 복제하여 새로운 배열 생성
        const updatedArray = [...originData];
        // updatedData의 길이만큼 반복하여 originData 갱신
        for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
            const updatedItem = updatedData[i];
            updatedArray[i] = { ...updatedItem, slsmnExpnsId: updatedArray[i].slsmnExpnsId };
        }
        return updatedArray;
    };

    const [remind, setRemind] = useState(0);

    useEffect(() => {
        if(remind >= 2) {
            setRemind(0);
            alert("저장 완료");
            customDatasRefresh && customDatasRefresh();
            setOriginTableData([]);
        }
    }, [remind])

    const compareData = (originData, updatedData) => {
        setRemind(0);
        const filterData = updatedData.filter((data) => data.poiId); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateItem(firstRowUpdate); //수정

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].slsmnExpnsId);
                delListTest.push(originData[i]);
            }
            deleteItem(delList); //삭제

        } else if (originDataLength === updatedDataLength) {
            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateItem(firstRowUpdate, "same"); //수정
        } else if (originDataLength < updatedDataLength) {
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            const firstRowUpdate = updateDataInOrigin(originData, updateList);
            updateItem(firstRowUpdate); //수정

            const addList = [];
            for (let i = originDataLength; i < updatedDataLength; i++) {
                addList.push(filterData[i]);
            }
            addItem(addList); //추가
        }
    };

    //-------총합 나타내기--------
    //------------------------------- 초기값과 비교하는 코드
    const visibleColumnCount = headerGroups[0].headers.filter((column) => !column.notView).length;

    const textAlignStyle = (column) => {
        switch (column.textAlign) {
            case "left":
                return "txt-left";
            case "right":
                return "txt-right";
            default:
                return "txt-center";
        }
    };

    return (
        <div className={isPageNation ? "x-scroll" : "table-scroll"}>
            <table {...getTableProps()} className="table-styled" ref={tableRef} style={{ tableLayout: "auto", marginBottom: 20 }}>
                <thead>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, columnIndex) => {
                                if (column.notView) {
                                    // notView가 true인 경우, 헤더 셀을 출력하지 않음
                                    return null;
                                }

                                return (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className={columnIndex === 0 ? "first-column" : ""}>
                                        {column.render("Header")}
                                        <div {...column.getResizerProps()} className={`resizer ${column.isResizing ? "isResizing" : ""}`} />
                                        <span style={{ color: "red", margin: 0 }}>{column.require === true ? "*" : ""}</span>
                                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                {tableData.length > 0 ? (
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, rowIndex) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} onClick={(e) => onCLickRow(row)}>
                                    {row.cells.map((cell, cellIndex) => {
                                        if (cell.column.notView) {
                                            // notView가 true인 경우, 셀을 출력하지 않음
                                            return null;
                                        }
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className={textAlignStyle(cell.column)}
                                                // className={cellIndex === 0 ? "first-column" : "other-column"} id="otherCol"
                                            >
                                                {cell.column.id === "selection" ? (
                                                    cell.render("Cell")
                                                ) : isEditing ? (
                                                    cell.column.type === "input" ? (
                                                        <input
                                                            type="text"
                                                            value={
                                                                tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                    ? tableData[row.index][cell.column.id] || cell.value
                                                                    : cell.value || ""
                                                            }
                                                            name={cell.column.id}
                                                            onChange={(e) => onChangeInput(e, row)}
                                                        />
                                                    ) : cell.column.type === "number" ? (
                                                        <Number
                                                            value={tableData[row.index]?.[cell.column.id] || ""}
                                                            onChange={(value) => onChangeInput({ target: { value: value, name: cell.column.id } }, row)}
                                                            style={{ textAlign: cell.column.textAlign || "left" }}
                                                        />
                                                    ) : (
                                                        cell.render("Cell")
                                                    )
                                                ) : cell.column.Header === "연월" && cell.value ? (
                                                    cell.value.substring(0, 7)
                                                ) : (
                                                    cell.render("Cell") || ""
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                ) : (
                    <tbody>
                        <tr>
                            <td colSpan={visibleColumnCount + 1} style={{ textAlign: "center", fontSize: "15px", height: "80px" }} className="back-lightgray">
                                조회된 데이터가 없습니다.
                            </td>
                        </tr>
                    </tbody>
                )}
            </table>

            <CompanyModal width={600} height={720} title="거래처 목록" isOpen={isOpenModalCompany} onClose={() => setIsOpenModalCompany(false)} />
            <ProductInfoModal width={600} height={770} title="품목정보 목록" isOpen={isOpenModalProductInfo} onClose={() => setIsOpenModalProductInfo(false)} />
            <ProductGroupModal
                width={600}
                height={720}
                title="품목그룹 목록"
                isOpen={isOpenModalProductGroup}
                onClose={() => setIsOpenModalProductGroup(false)}
            />
            <EmployerInfoModal
                width={600}
                height={770}
                title="업무회원 목록"
                isOpen={isOpenModalEmployerInfo}
                onClose={() => setIsOpenModalEmployerInfo(false)}
            />
        </div>
    );
};

export default ReactDataTableSaleCost;
