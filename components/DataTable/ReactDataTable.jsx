import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect, useFilters, useBlockLayout, useResizeColumns } from "react-table";
import { PageContext } from "components/PageProvider";
import DeleteModal from "components/modal/DeleteModal";
import "react-datepicker/dist/react-datepicker.css";
import ModalPagePgNm from "components/modal/ModalPagePgNm";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
import ProductGroupModal from "components/modal/ProductGroupModal";
import EmployerInfoModal from "components/modal/EmployerInfoModal";
import BasicInput from "components/input/BasicInput";
import AddModModal from "components/modal/AddModModal";
const ReactDataTable = (props) => {
    const {
        columns, //컬럼
        suffixUrl, //url-삭제예정
        customDatas, //부모에서 주는 데이터 -> inisitalDatas 변수명변경
        defaultPageSize, //페이지네이션
        viewPageName, //테이블이름 -> tableName 변수명변경
        customDatasRefresh, //리프레시-삭제예정
        returnList, //부모로 데이터배열 리턴-> returnList 변수명변경
        returnSelect, //부모로 row 리턴 -> returnSelect 변수명변경
        returnSelectRows, //부모로 선택한 row 배열 리턴
        hideCheckBox, //체크박스 상태 플래그
        editing, //테이블 에디트 상태 플래그
        perSent, //단위 -> unit 변수명변경
        saveIdNm, //이건뭐죠? 부모로 배열 리턴이면 returnList 사용하세요!
        condition, //poiId와 같은 조회에 필요한 조건
        viewLoadDatas, //불러오기 view데이터
        modColumns, //팝업수정 목록
        addColumns, //팝업추가 목록
        deleteInfo, //팝업삭제 정보
        isPageNation,
        isSpecialRow, //마지막 행에 CSS 추가
        isPageNationCombo, //페이지네이션 콤보박스
        realTime, //부모로 실시간 데이터 전달
        isSingleSelect, //단일 체크박스 선택 여부
        copiedDatas, //복제할 데이터
        isCopied, //복제 데이터가 있는지
    } = props;
    const {
        nameOfButton,
        setNameOfButton,
        searchData,
        setSearchData,
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setLengthSelectRow,
        setModalLengthSelectRow,
        isModalTable,
        newRowData,
        currentPageName,
        modalPageName,
        isCancelTable,
        setIsCancelTable,
        isOpenModalPgNm,
        setIsOpenModalPgNm,
        projectPgNm,
        setProjectPgNm,
        unitPriceList,
        emUserInfo,
        setEmUserInfo,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [openModalMod, setOpenModalMod] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModalDel, setOpenModalDel] = useState(false);
    const [deleteList, setDeleteList] = useState([]); //delete modal에 띄어줄 목록
    const [current, setCurrent] = useState({ ...viewPageName }); //==viewPageName
    const [selectRow, setSelectRow] = useState({}); //마지막으로 선택한 row
    const [rowIndex, setRowIndex] = useState(0);

    const [isOpenModalProductGroup, setIsOpenModalProductGroup] = useState(false); //품목그룹목록
    const [isOpenModalEmployerInfo, setIsOpenModalEmployerInfo] = useState(false); //업무회원목록
    const [colName, setColName] = useState("");
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    const handleDateClick = (date, colName, index) => {
        const updatedTableData = [...tableData];

        if (current.id === "labor" && colName === "pmpMonth") {
            //영업인건비 연월 중복방지
            const isDuplicate = updatedTableData.some((item) => item.pmpMonth !== "" && item.pmpMonth?.substring(0, 7) === date.substring(0, 7));

            if (isDuplicate) {
                alert("해당 연월은 이미 존재합니다.");
            } else {
                updatedTableData[index][colName] = date;
            }
        } else {
            updatedTableData[index][colName] = date;
        }
        setTableData(updatedTableData);
    };

    const [isEditing, setIsEditing] = useState(false);

    //------------------------------------------------ 달력부분
    const calendarRef = useRef(null);

    useEffect(() => {
        // console.log("🎈tableData:", tableData);
        if (isCurrentPage() && tableData && tableData.length > 0 && realTime) {
            realTime(tableData);
        }
    }, [tableData]);

    //취소시에 오리지널 테이블로 돌아감
    useEffect(() => {
        if (isCancelTable === true) setTableData(originTableData);
        setIsCancelTable(false); //초기화
    }, [isCancelTable]);

    useEffect(() => {
        if (suffixUrl) {
            fetchAllData(condition);
        }
        setCurrent({ ...viewPageName }); //현재페이지

        // 문서의 다른 부분을 클릭했을 때 창을 닫기 위한 이벤트 핸들러 추가
        const handleDocumentClick = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                // 달력 요소 밖을 클릭한 경우
                const updatedTableData = tableData.map((item) => ({ ...item, calendarVisible: false }));
                setTableData(updatedTableData);
            }
        };

        // 이벤트 핸들러 등록
        document.addEventListener("mousedown", handleDocumentClick);

        return () => {
            // 컴포넌트 언마운트 시에 이벤트 핸들러 제거
            document.removeEventListener("mousedown", handleDocumentClick);
            toggleAllRowsSelected(false);
            setSelectRow(0);
            setModalLengthSelectRow(0);
            setTableData([]);
            setOriginTableData([]);
        };
    }, []);

    //------------------------------------------------

    useEffect(() => {
        if(isCopied) {
            // console.log("1. 복제 TRUE - custom:", customDatas, "copied", copiedDatas);
            // const copied = initializeTableData(copiedDatas, columns);
            // const custom = initializeTableData(customDatas, columns);
            // setOriginTableData(JSON.parse(JSON.stringify(custom))); //저장할 테이블
            // setTableData(JSON.parse(JSON.stringify(copied))); //복제할 테이블
            setOriginTableData(JSON.parse(JSON.stringify(customDatas))); //저장할 테이블
            setTableData(JSON.parse(JSON.stringify(copiedDatas))); //복제할 테이블
        } else {
            // console.log("2. 복제 FALSE - custom:", customDatas, "copied", copiedDatas);
            // const custom = initializeTableData(customDatas, columns);
            // setOriginTableData(JSON.parse(JSON.stringify(custom))); //원본 데이터
            // setTableData(JSON.parse(JSON.stringify(custom))); //수정 데이터
            setOriginTableData(JSON.parse(JSON.stringify(customDatas))); //원본 데이터
            setTableData(JSON.parse(JSON.stringify(customDatas))); //수정 데이터
        }
        setIsLoading(false);
    }, [isCopied, customDatas, copiedDatas]);

    /* columns에는 있지만 넣어줄 데이터가 없을 때 초기값 설정 */
    // const initializeTableData = (datas, cols) => {
    //     console.log("cols:", cols);
    //     if (datas && datas.length > 0) {
    //         const updatedData = datas.map((dataItem) => {
    //             const newData = { ...dataItem };
    //             cols.forEach((column) => {
    //                 if (!newData.hasOwnProperty(column.col)) {
    //                     newData[column.col] = ""; // 해당 변수가 없으면 빈 값으로 초기화
    //                 }
    //                 if (column.type === "select") {
    //                     console.log("셀렉트>>>>>>>>>>>>>>>>>>>>>", column.col);
    //                     console.log("셀렉트>>>>>>>>>>>>>>>>>>>>>", column.options[0].value);
    //                     newData[column.col] = column.options[0].value; // 옵션의 첫 번째 값으로 초기화
    //                 }
    //             });
    //             return newData;
    //         });
    //         return updatedData;
    //     }
    //     return [];
    // };

    /* tab에서 컴포넌트 화면 변경 시 초기화  */
    useEffect(() => {
        if (currentPageName.id !== prevCurrentPageName.id || innerPageName.id !== prevInnerPageName.id) {
            // 현재 페이지와 이전 페이지가 같지 않다면
            toggleAllRowsSelected(false);
        }
        // 현재 보는 페이지(current)가 클릭한 페이지와 같은게 없다면 return
        if ((current.id !== currentPageName.id && current.id !== innerPageName.id) || (current.name !== modalPageName && current.id !== innerPageName.id)) {
            return;
        }
    }, [current, currentPageName, innerPageName, modalPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        if (isCurrentPage()) {
            setIsEditing(editing !== undefined ? editing : isEditing); //테이블 상태 //inner tab일 때 테이블 조작
            //inner tab에서 저장을 눌렀을 때
            if (nameOfButton === "save") {
                returnList && returnList(originTableData, tableData);
            } else if (nameOfButton === "load" && viewLoadDatas) {
                setTableData([...viewLoadDatas]);
            } else if (nameOfButton === "refresh") {
                refreshClick();
            } else if (nameOfButton === "delete") {
                deleteClick();
            } else if (nameOfButton === "add") {
                addClick();
            } else if (nameOfButton === "modify") {
                modifyClick();
            } else if (nameOfButton === "search") {
                searchClick();
            } else if (nameOfButton === "deleteRow") {
                onDeleteRow();
            } else if (nameOfButton === "addRow") {
                onAddRow();
            }
            setNameOfButton(""); //초기화
        }
    }, [innerPageName, editing, nameOfButton, currentPageName]);

    useEffect(() => {
        if (isCurrentPage()) {
            //업무회원
            if (Object.keys(emUserInfo).length > 0) {
                const updatedTableData = [...tableData];
                updatedTableData[rowIndex] = {
                    ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
                    ...emUserInfo,
                    esntlId: emUserInfo.uniqId,
                };
                setTableData(updatedTableData);
                setEmUserInfo({});
            }
        }
    }, [emUserInfo]);

    const columnsConfig = useMemo(
        //컬럼 초기 상태
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
                require: column.require,
                textAlign: column.textAlign,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (current.name === "수주등록관리") {
            if (newRowData && Object.keys(newRowData).length !== 0) {
                addClick(newRowData);
            }
            console.log(newRowData, "이거왜 계속댐");
        }
    }, [newRowData]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async (condition) => {
        if (!suffixUrl) {
            return;
        }
        const url = `/api${suffixUrl}/totalListAll.do`;
        const resultData = await axiosFetch(url, { useAt: "Y", ...condition });
        if (resultData) {
            setTableData([...resultData]);
        } else if (!resultData) {
            setTableData(Array(defaultPageSize || 10).fill({})); // 빈 배열 추가
        }
        setIsLoading(false);
    };

    /* 데이터 수정 */
    const modifyClick = async (updatedData) => {
        console.log(updatedData, "updatedData");
        if (!updatedData) {
            setOpenModalMod(true);
        } else {
            // 수정데이터가 있다면
            const url = `/api${suffixUrl}/edit.do`;
            const requestData = { ...updatedData, lockAt: "Y", useAt: "Y" };
            const resultData = await axiosUpdate(url, requestData);
            console.log(resultData, "resultData");
            if (resultData) {
                alert("값을 변경했습니다💚💚");
                if (customDatas) {
                    customDatasRefresh(); //부모로 반환
                } else {
                    fetchAllData(condition);
                }
            } else if (!resultData) {
                alert("modify error: table");
            }
            setOpenModalMod(false);
        }
    };

    /* 데이터 삭제 */
    const deleteClick = async (btnLabel) => {
        if (!suffixUrl) return;
        if (!btnLabel) {
            // 최초, 파라미터가 없을 때
            if (selectedFlatRows && selectedFlatRows.length > 0) {
                const deleteNms = selectedFlatRows && selectedFlatRows.map((row) => row.values[deleteInfo.name]);
                setDeleteList(deleteNms);
                setOpenModalDel(true);
            }
        } else if (btnLabel === "영구삭제") {
            const deleteIds = selectedFlatRows && selectedFlatRows.map((row) => row.values[deleteInfo.id]);
            const url = `/api${suffixUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, deleteIds);
            if (resultData) {
                if (customDatas) {
                    customDatasRefresh(); //부모로 반환
                } else {
                    fetchAllData(condition);
                }
                alert("삭제되었습니다🧹🧹");
            } else if (!resultData) {
                alert("delete error: table");
            }
        }
    };

    /* 새로고침 */

    const refreshClick = () => {
        fetchAllData(condition);
    };

    /* 데이터 추가 */
    const addClick = async (addData) => {
        setOpenModalAdd(false);
        if (!suffixUrl) return;
        if (addData && typeof addData === "object" && !Array.isArray(addData)) {
            const url = `/api${suffixUrl}/add.do`;
            const dataToSend = {
                ...addData,
                lockAt: "Y",
                useAt: "Y",
                deleteAt: "N",
                poiId: condition.poiId || "",
                // typeCode: "MM",
                // modeCode: "BUDGET",
                // poiDesc: addData.poiDesc || condition.poiVersion,
            };

            const resultData = await axiosPost(url, dataToSend);
            if (!resultData) {
                alert("add error: table");
            } else if (resultData) {
                fetchAllData(condition);
                alert("✅추가 완료");
            }
            setOpenModalAdd(false);
        } else if (!addData) {
            //파라미터로 넘어온 데이터가 없다면, 팝업으로 추가
            setOpenModalAdd(true);
        }
    };

    /* 데이터 검색 */
    const searchClick = async () => {
        if (!suffixUrl) return;
        if (searchData) {
            const url = `/api${suffixUrl}/totalListAll.do`;
            const requestData = {
                useAt: searchData.radioOption,
                searchKeyword: searchData.searchKeyword,
                searchCondition: searchData.searchCondition,
            };

            const resultData = await axiosScan(url, requestData);

            setSearchData({}); //초기화
        }
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
        selectedFlatRows, // 선택된 행 데이터
        toggleAllRowsSelected, // 전체선택 on off
        toggleRowSelected,
    } = useTable(
        {
            columns: columnsConfig,
            data: tableData,
            initialState: { pageIndex: 0, pageSize: isPageNation ? defaultPageSize || 10 : (tableData && tableData.length) || 200 }, // 초기값
        },
        useFilters,
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
                                          onClick={(e) => checkBoxClick(e, row)}
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

    const prevPoiIdArray = useRef([]);
    const prevPoiNmArray = useRef([]);

    // 배열 비교 함수
    function arraysAreEqual(arr1, arr2) {
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    }

    const checkBoxClick = (e, row) => {
        e.stopPropagation();
        const values = row.values;
        const id = row.id;
        setSelectRow(values);
        returnSelect && returnSelect(values);
        if (isSingleSelect) {
            //단일 선택 시
            toggleAllRowsSelected(false, false);
            toggleRowSelected(id, true); //다시선택
        }
    };

    useEffect(() => {
        // console.log("modal:", modalPageName, "current:", current.name);
        if (isCurrentPage()) {
            const selects = selectedFlatRows.map((row) => row.values);
            returnSelectRows && returnSelectRows(selects); //부모로 모든 선택 데이터 리턴

            if (isModalTable) {
                //모달화면일때
                setModalLengthSelectRow(selectedFlatRows.length);
            } else if (!isModalTable) {
                //모달아닐때
                setLengthSelectRow(selectedFlatRows.length);
            }

            if (saveIdNm) {
                const poiIdArray = selectedFlatRows.map((item) => item.values.poiId);
                const poiNmArray = selectedFlatRows.map((item) => item.values.poiNm);

                // 이전 값과 현재 값이 다를 때만 saveIdNm 함수 호출
                if (!arraysAreEqual(prevPoiIdArray.current, poiIdArray) || !arraysAreEqual(prevPoiNmArray.current, poiNmArray)) {
                    saveIdNm(poiIdArray, poiNmArray);
                }
                // 이전 값 갱신
                prevPoiIdArray.current = poiIdArray;
                prevPoiNmArray.current = poiNmArray;
            }
        }
    }, [selectedFlatRows]);

    //품목그룹 선택
    const setValueData = (rowIndex) => {
        setRowIndex(rowIndex);
        setIsOpenModalProductGroup(true);
    };

    useEffect(() => {
        if (isCurrentPage() && Object.keys(projectPgNm).length > 0) {
            setValueDataPgInfo(rowIndex, projectPgNm);
            setProjectPgNm({});
        }
    }, [projectPgNm]);

    const setValueDataPgInfo = (rowIndex, pgInfo) => {
        const updatedTableData = [...tableData];

        updatedTableData[rowIndex] = {
            ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
            ...pgInfo,
        };

        setTableData(updatedTableData);
        setProjectPgNm({});
    };

    const loadOnAddRow = (viewLoadDatas) => {
        setTableData(() => {
            return [...viewLoadDatas];
        });
    };

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        if(isCurrentPage) {
            const newRow = {};
            columnsConfig.forEach((column) => {
                if (column.accessor === "poiId") {
                    newRow[column.accessor] = condition.poiId || ""; // poiId를 항상 SLSP로 설정
                } else if (column.accessor === "typeCode") {
                    newRow[column.accessor] = "MM"; // poiId를 항상 SLSP로 설정
                } else if (column.accessor === "modeCode") {
                    newRow[column.accessor] = "BUDGET"; // poiId를 항상 SLSP로 설정
                } else if (column.accessor === "esntlId") {
                    newRow[column.accessor] = ""; // poiId를 항상 SLSP로 설정
                } else {
                    newRow[column.accessor] = null; // 다른 열은 초기화
                }
                if (column.type === "select") {
                    newRow[column.accessor] = column.options[0].value; //콤보박스 초기화
                }
            });
    
            setTableData((prevData) => {
                const newData = [...prevData, { ...newRow }];
                return newData;
            });
        }
    };

    /* 데이터 테이블 UI에서 ROW 삭제 */
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

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    };

    const handleChange = (e, row, accessor) => {
        const { value } = e.target;
        const index = row.index;
        const updatedTableData = [...tableData];
        updatedTableData[row.index][accessor] = value;

        if (innerPageName.id === "labor") {
            //영업인건비
            if (row.original.pecUnitPrice && row.original.pecMm) {
                const price = row.original.pecUnitPrice * row.original.pecMm;
                updatedTableData[index]["price"] = price;
            }
        } else if (innerPageName.id === "LaborCostMgmtPlan" || innerPageName.id === "LaborCostMgmtExe") {
            if (unitPriceList && unitPriceList.length > 0 && row.original.pecPosition && row.original.pecMm) {
                //기준년도 추가시에 gupDesc값을 기준년도 값으로 바꿔줘야함
                const unit = unitPriceList.find((unit) => row.original.pecPosition === unit.guppName && unit.gupDesc === new Date().getFullYear());
                const price = unit && unit.gupPrice !== undefined && unit.gupPrice !== null ? row.original.pecMm * unit.gupPrice : 0; // 적절한 기본값 사용
                updatedTableData[index]["price"] = price || 0;
                updatedTableData[index]["positionPrice"] = (unit && unit.gupPrice) || 0;
            }
        }

        setTableData(updatedTableData);
    };

    const division = (value1, value2) => {
        if (!value1 || !value2) {
            return 0;
        }
        return Math.round(value1 / value2);
    };

    const changeEmployerInfo = (colName, rowIndex) => {
        setRowIndex(rowIndex);
        setColName(colName);
        setIsOpenModalEmployerInfo(true);
    };

    const isCurrentPage = () => {
        return (
            current.id !== "" &&
            current.id !== undefined &&
            (current.id === currentPageName.id || current.id === innerPageName.id || current.name === modalPageName)
        );
    };

    const visibleColumnCount = headerGroups[0].headers.filter((column) => !column.notView).length;

    const cellWidthCount = columns.filter((column) => column.cellWidth).length; //컬럼 width있는 객체 갯수
    let colWidth = 35 / cellWidthCount; //35픽셀 나누기

    const totalWidth = columns.reduce((acc, column) => {
        if (column.cellWidth) {
            return acc + Number(column.cellWidth) + colWidth;
        } else {
            return acc;
        }
    }, 0);

    const tdStyle =
        current.id === "결재선팝업"
            ? {
                  textAlign: "center",
                  fontSize: "15px",
                  height: "80px",
                  border: 0,
                  width: `${totalWidth}px`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0,
              }
            : {
                  textAlign: "center",
                  fontSize: "15px",
                  height: "80px",
                  border: 0,
              };

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
        <>
            {isLoading ? (
                // 로딩 화면을 보여줄 JSX
                <div className="Loading">
                    <div className="spinner"></div>
                    <div> Loading... </div>
                </div>
            ) : (
                <div>
                    {isPageNationCombo && (
                        <div className="flex-between mg-b-10">
                            <div className="page-size" style={{ width: 80 }}>
                                {/* <span className="table-title mg-r-10">데이터 수</span> */}
                                <select className="select" id={uuidv4()} value={pageSize} onChange={(e) => pageSizeChange(e.target.value)}>
                                    {pageSizeOptions.map((size, index) => (
                                        <option key={size + index} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <div className={isPageNation ? "x-scroll" : "table-scroll"}>
                        <table {...getTableProps()} className="table-custom table-styled" style={{ tableLayout: "auto" }}>
                            {/* <table {...getTableProps()} className="table-custom table-styled" > */}
                            <thead>
                                {headerGroups.map((headerGroup, headerGroupIndex) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column, columnIndex) => {
                                            if (column.notView) {
                                                // notView가 true인 경우, 헤더 셀을 출력하지 않음
                                                return null;
                                            }
                                            return (
                                                <th
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                    id={`header-${column.id}`}
                                                    className={columnIndex === 0 ? "first-column" : ""}>
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
                                        const isLastRow = row.index === page.length - 1;
                                        return (
                                            <tr {...row.getRowProps()} className={isSpecialRow && isLastRow ? "special-row" : ""}>
                                                {row.cells.map((cell, cellIndex) => {
                                                    if (cell.column.notView) {
                                                        // notView가 true인 경우, 셀을 출력하지 않음
                                                        return null;
                                                    }

                                                    return (
                                                        <td {...cell.getCellProps()} className={textAlignStyle(cell.column)} id="otherCol">
                                                            {cell.column.id === "selection" ? (
                                                                cell.render("Cell")
                                                            ) : isEditing ? (
                                                                cell.column.type === "input" ? (
                                                                    <input
                                                                        key={cell.column.id + row.index}
                                                                        type="text"
                                                                        value={
                                                                            tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                                ? tableData[row.index][cell.column.id]
                                                                                : cell.value || ""
                                                                        }
                                                                        name={cell.column.id}
                                                                        autoComplete="off"
                                                                        onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                    />
                                                                ) : cell.column.type === "datePicker" ? (
                                                                    <div className="box3-1 boxDate">
                                                                        <MonthPicker
                                                                            name={cell.column.id}
                                                                            value={tableData[row.index]?.[cell.column.id]?.substring(0, 7) || ""}
                                                                            onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                                            autoComplete="off"
                                                                        />
                                                                    </div>
                                                                ) : cell.column.type === "employerInfo" ? (
                                                                    <BasicInput
                                                                        item={cell.column}
                                                                        onClick={() => changeEmployerInfo(cell.column.id, rowIndex)}
                                                                        value={tableData[row.index][cell.column.id] ?? ""}
                                                                        autoComplete="off"
                                                                        readOnly
                                                                    />
                                                                ) : cell.column.type === "dayPicker" ? (
                                                                    <DayPicker
                                                                        name={cell.column.id}
                                                                        autoComplete="off"
                                                                        value={tableData[row.index][cell.column.id] ? tableData[row.index][cell.column.id] : ""}
                                                                        onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                                    />
                                                                ) : cell.column.type === "productGroup" ? (
                                                                    <div>
                                                                        <input
                                                                            className="buttonSelect"
                                                                            id={cell.column.id}
                                                                            name={cell.column.col}
                                                                            key={cell.column.id + row.index}
                                                                            onClick={() => setValueData(rowIndex)}
                                                                            type="text"
                                                                            placeholder={`품목그룹명을 선택해 주세요.`}
                                                                            value={tableData[rowIndex].pgNm || ""}
                                                                            onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                            readOnly
                                                                            autoComplete="off"
                                                                        />
                                                                    </div>
                                                                ) : cell.column.type === "monthPicker" ? (
                                                                    <div className="box3-1 boxDate">
                                                                        <MonthPicker
                                                                            name={cell.column.id}
                                                                            autoComplete="off"
                                                                            value={
                                                                                tableData[row.index][cell.column.id]
                                                                                    ? tableData[row.index][cell.column.id].substring(0, 7)
                                                                                    : ""
                                                                            }
                                                                            onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                                        />
                                                                    </div>
                                                                ) : cell.column.type === "select" ? (
                                                                    <select
                                                                        key={cell.column.id + row.index}
                                                                        name={cell.column.id}
                                                                        autoComplete="off"
                                                                        defaultValue={tableData[row.index][cell.column.id] || ""}
                                                                        onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                    >
                                                                        {cell.column.options.map((option, index) => (
                                                                            <option key={cell.column.id + index} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                ) : typeof cell.value === "number" ? (
                                                                    cell.value && cell.value.toLocaleString()
                                                                ) : (
                                                                    cell.render("Cell")
                                                                )
                                                            ) : cell.column.Header === "연월" && cell.value ? (
                                                                cell.value.substring(0, 7)
                                                            ) : cell.column.id.includes("cbPer") ? (
                                                                <div>
                                                                    {cell.render("Cell")}
                                                                    {perSent}
                                                                </div>
                                                            ) : typeof cell.value === "number" ? (
                                                                cell.value && cell.value.toLocaleString()
                                                            ) : cell.column.id === "sgnDesc" ? (
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: tableData[cell.row.index]?.[cell.column.id] || "",
                                                                    }}></div>
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
                                        <td colSpan={visibleColumnCount + 1} style={tdStyle} className="back-lightgray">
                                            조회된 데이터가 없습니다.
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                    {isPageNation && (
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
                    )}

                    {Object.keys(selectRow).length > 0 && openModalMod && (
                        <AddModModal
                            list={modColumns}
                            initialData={[selectRow]}
                            resultData={modifyClick}
                            onClose={() => setOpenModalMod(false)}
                            title={current.name + " 수정"}
                        />
                    )}
                    {openModalAdd && (
                        <AddModModal list={addColumns} resultData={addClick} onClose={() => setOpenModalAdd(false)} title={current.name + " 추가"} />
                    )}
                    <DeleteModal initialData={deleteList} resultData={deleteClick} onClose={() => setOpenModalDel(false)} isOpen={openModalDel} />
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
                        colName={colName}
                    />
                    {isOpenModalPgNm && <ModalPagePgNm rowIndex={rowIndex} onClose={() => setIsOpenModalPgNm(false)} />}
                </div>
            )}
        </>
    );
};

export default ReactDataTable;
