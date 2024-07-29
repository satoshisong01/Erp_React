import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect, useBlockLayout, useResizeColumns } from "react-table";
import { PageContext } from "components/PageProvider";
import ModalPagePgNm from "components/modal/ModalPagePgNm";
import ModalPageCompany from "components/modal/ModalPageCompany";
import { v4 as uuidv4 } from "uuid";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
import ProductInfoModal from "components/modal/ProductInfoModal";
import FileModal from "components/modal/FileModal";
import Number from "components/input/Number";
import reportWebVitals from "reportWebVitals";

/* 구매 테이블 */
const ReactDataTablePdorder = (props) => {
    const {
        columns,
        customDatas,
        defaultPageSize,
        tableRef,
        viewPageName,
        customDatasRefresh,
        returnSelect,
        returnSelectRows,
        hideCheckBox,
        editing,
        returnList,
        viewLoadDatas,
        suffixUrl,
        condition, //poiId와 같은 조회에 필요한 조건
        isPageNation,
        copiedDatas, //복제할 데이터
        isCopied, //복제 데이터가 있는지
    } = props;
    const {
        pdiNmList,
        setPdiNmList,
        nameOfButton,
        setNameOfButton,
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
        projectPdiNm,
        setProjectPdiNm,
        setIsOpenModalCompany,
        isOpenModalCompany,
        fileInfo,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(viewPageName); //==viewPageName
    const [rowIndex, setRowIndex] = useState(0);
    const [isOpenModalProductInfo, setIsOpenModalProductInfo] = useState(false); //품목정보목록
    const [isOpenModalFile, setIsOpenModalFile] = useState(false); //첨부파일업로드
    const [tableFileInfo, setTableFileInfo] = useState("");

    //취소시에 오리지널 테이블로 돌아감
    useEffect(() => {
        if (isCancelTable === true) setTableData(originTableData);
        setIsCancelTable(false);
    }, [isCancelTable]);

    useEffect(() => {
        return () => { //초기화
            setTableData([]);
            setOriginTableData([]);
        };
    }, []);



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
        if ((current.id !== currentPageName.id && current.id !== innerPageName.id) || (current.name !== modalPageName && current.id !== innerPageName.id)) {
            return;
        }
    }, [current, currentPageName, innerPageName, modalPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        if (isCurrentPage()) {
            setIsEditing(editing !== undefined ? editing : isEditing); //테이블 상태 //inner tab일 때 테이블 조작

            if (nameOfButton === "save") {
                if (innerPageName.id === "orderBuying") {
                    //견적>구매비
                    returnList(originTableData, tableData);
                } else {
                    compareData(originTableData, tableData);
                }
            } else if (nameOfButton === "load" && viewLoadDatas) {
                setTableData(viewLoadDatas);
            } else if (nameOfButton === "deleteRow") {
                onDeleteRow();
            } else if (nameOfButton === "addRow") {
                onAddRow();
            }
            setNameOfButton(""); //초기화
        }
    }, [innerPageName, currentPageName, editing, nameOfButton]);

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
                require: column.require,
                textAlign: column.textAlign,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (isCurrentPage()) {
            if (newRowData && Object.keys(newRowData).length !== 0) {
                addList(newRowData);
            }
        }
    }, [newRowData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
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

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = condition.poiId || ""; // poiId를 항상 SLSP로 설정
            }
            if (column.type === "select") {
                newRow[column.accessor] = column.options[0].value; //콤보박스 초기화
            }
        });
        setTableData((prevData) => {
            const newData = [...prevData, { ...newRow }];
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

    const setValueCompany = (rowIndex) => {
        //setRowIndex()
        setIsOpenModalCompany(true);
        setRowIndex(rowIndex);
    };

    //선택된 항목 순서(인덱스)별

    useEffect(() => {
        if (isCurrentPage() && Object.keys(projectPdiNm).length > 0) {
            setValueDataPdiNm(rowIndex, projectPdiNm);
            setProjectPdiNm({});
        }
    }, [projectPdiNm]);

    useEffect(() => {
        if (isCurrentPage() && pdiNmList && pdiNmList.length > 0) {
            setTableData((prevTableData) => {
                const start = prevTableData.length - 1;
                const end = start + pdiNmList.length;
                const newTableData = [...prevTableData];

                for (let i = start, j = 0; i < end; i++, j++) {
                    newTableData[i] = { ...pdiNmList[j] };
                }

                return newTableData;
            });
            setPdiNmList([]);
        }
    }, [pdiNmList]);

    const goSetting = (rowIndex) => {
        setRowIndex(rowIndex);
    };

    const getFileData = (rowIndex) => {
        setRowIndex(rowIndex); //index저장
        setTableFileInfo(tableData[rowIndex].atchFileId);
        setIsOpenModalFile(true);
    };

    const setValueDataPdiNm = (rowIndex, selectedPdiNm) => {
        // 선택된 품명에 해당하는 데이터 찾기
        if (selectedPdiNm) {
            // 테이블 데이터를 복제
            const updatedTableData = [...tableData];

            console.log(updatedTableData);
            // 선택된 품명의 데이터로 해당 행(row)의 데이터 업데이트
            updatedTableData[rowIndex] = {
                ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
                ...selectedPdiNm, // projectPdiNm 객체의 데이터로 업데이트
                byUnitPrice: selectedPdiNm.pupUnitPrice, //품목단가
            };

            // 업데이트된 데이터로 tableData 업데이트
            setTableData(updatedTableData);
        } else {
            console.log(`선택된 품명(${selectedPdiNm})에 대한 데이터를 찾을 수 없습니다.`);
        }
        if (innerPageName.id === "orderBuying") {
            const updatedTableData = [...originTableData];
            updatedTableData[rowIndex] = {
                ...updatedTableData[rowIndex],
                estBuyId: tableData[0].estBuyId,
                pdiId: selectedPdiNm.pdiId,
                pdiNum: selectedPdiNm.pdiNum,
                pdiNm: selectedPdiNm.pdiNm,
                pgNm: selectedPdiNm.pgNm,
                pdiStnd: selectedPdiNm.pdiStnd,
            };
            setTableData(updatedTableData);
        }
    };

    useEffect(() => {
        if(fileInfo) {
            const updatedTableData = [...tableData];
            updatedTableData[rowIndex].atchFileId = fileInfo;
            setTableData(updatedTableData);
        }
    }, [fileInfo]);


    const handleChange = (e, row) => {
        const { value, name } = e.target;
        const index = row.index;
        const updatedTableData = [...tableData];
        updatedTableData[row.index][name] = value;

        //실행
        if (currentPageName.name === "구매(재료비)") {
            if (row.original.byUnitPrice && row.original.byQunty) {
                const price = row.original.byUnitPrice * row.original.byQunty;
                updatedTableData[index]["price"] = Math.round(price);
            }
        }

        //영업
        if (innerPageName.name === "구매(재료비)") {
            // 원단가, 기준이익율, 소비자가산출률, 수량
            if (name === "byQunty" || name === "byUnitPrice" || name === "byStandardMargin" || name === "byConsumerOutputRate") {
                if (row.original.byUnitPrice && row.original.byStandardMargin && row.original.byConsumerOutputRate && row.original.byQunty) {
                    // 1.원가 : 수량 * 원단가
                    const estimatedCost = row.original.byQunty * row.original.byUnitPrice;
                    // 2.공급단가 : 원가 / (1 - 이익율) -- 틀림!!!
                    // 2.공급단가 : 원단가 / (1 - 이익율)
                    const unitPrice = division(row.original.byUnitPrice, 100 - row.original.byStandardMargin) * 100;
                    // 3.공급금액 : 수량 * 공급단가
                    const planAmount = row.original.byQunty * unitPrice;
                    // 4.소비자단가 : 공급단가 / 소비자산출율
                    const byConsumerUnitPrice = division(unitPrice, row.original.byConsumerOutputRate);
                    // 5.소비자금액 : 수량 * 소비자단가
                    const consumerAmount = row.original.byQunty * byConsumerUnitPrice;
                    // 6.이익금 : 공급금액 - 원가
                    const plannedProfits = planAmount - estimatedCost;

                    updatedTableData[index]["estimatedCost"] = Math.round(estimatedCost / 10) * 10;
                    updatedTableData[index]["unitPrice"] = Math.round(unitPrice / 10) * 10;
                    updatedTableData[index]["planAmount"] = Math.round(planAmount / 10) * 10;
                    updatedTableData[index]["byConsumerUnitPrice"] = Math.round((byConsumerUnitPrice * 100) / 10) * 10;
                    updatedTableData[index]["consumerAmount"] = Math.round((consumerAmount * 100) / 10) * 10;
                    updatedTableData[index]["plannedProfits"] = Math.round(plannedProfits / 10) * 10;
                }
            }
            //공급단가 수정 시 - 이익률, 이익금, 공급금액, 소비자단가, 소비자금액, 소비자가산출률 변동
            else if (name === "unitPrice") {
                //공급단가
                const planAmount = row.original.byQunty * row.original.unitPrice; //공급금액
                // 이익금 : 공급금액 - 원가
                if (row.original.unitPrice && row.original.byUnitPrice) {
                    const byStandardMargin = row.original.unitPrice !== 0 ? 100 - Math.round(100 / (row.original.unitPrice / row.original.byUnitPrice)) : 0;
                    const plannedProfits = planAmount - row.original.estimatedCost;
                    const byConsumerUnitPrice = division(row.original.unitPrice, row.original.byConsumerOutputRate);
                    const consumerAmount = row.original.byQunty * byConsumerUnitPrice;
                    updatedTableData[index]["byStandardMargin"] = byStandardMargin; //이익률
                    updatedTableData[index]["plannedProfits"] = Math.round(plannedProfits / 10) * 10; //이익금
                    updatedTableData[index]["planAmount"] = Math.round(planAmount / 10) * 10; //공급금액
                    updatedTableData[index]["byConsumerUnitPrice"] = Math.round((byConsumerUnitPrice * 100) / 10) * 10; //소비자단가
                    updatedTableData[index]["consumerAmount"] = Math.round((consumerAmount * 100) / 10) * 10; //소비자금액
                }
            }
            //소비자단가 수정 시 - 소비자금액, 소비자가산출률, 이익금, 이익률 변동
            else if (name === "byConsumerUnitPrice") {
                //소비자단가
                const consumerAmount = row.original.byQunty * row.original.byConsumerUnitPrice; //소비자금액
                const planAmount = row.original.byQunty * row.original.unitPrice; //공급금액
                // 이익금 : 공급금액 - 원가
                const plannedProfits = planAmount - row.original.estimatedCost;
                if (row.original.unitPrice && row.original.byUnitPrice) {
                    //이익율
                    const byStandardMargin = row.original.unitPrice !== 0 ? 100 - Math.round(100 / (row.original.unitPrice / row.original.byUnitPrice)) : 0;
                    updatedTableData[index]["consumerAmount"] = Math.round(consumerAmount / 10) * 10; //소비자금액
                    // 소비자가산출률 = (공급단가/소비자단가) * 100
                    updatedTableData[index]["byConsumerOutputRate"] = Math.round((row.original.unitPrice / row.original.byConsumerUnitPrice) * 100); //소비자가산출률
                    updatedTableData[index]["plannedProfits"] = Math.round(plannedProfits / 10) * 10; //이익금
                    updatedTableData[index]["byStandardMargin"] = byStandardMargin; //이익률
                }
            }
        }
        setTableData(updatedTableData);
    };

    const handleDateClick = (date, colName, index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index][colName] = date;
        setTableData(updatedTableData);
    };

    const division = (value1, value2) => {
        if (!value1 || !value2) {
            return 0;
        }
        return value1 / value2;
    };

    const [remind, setRemind] = useState(0) //refresh 시점 알림

    useEffect(() => {
        if(remind >= 2) {
            setRemind(0);
            alert("저장 완료");
            customDatasRefresh && customDatasRefresh();
            setOriginTableData([]);
        }
    }, [remind])

    const addList = async (addNewData) => {
        if (!isCurrentPage() && !suffixUrl && !Array.isArray(addNewData)) return;
        if (!condition || condition.poiId === undefined) {
            return;
        }
        if (currentPageName.id === "PurchasingMgmtPlan") {
            //실행-계획구매
            //실행
            addNewData.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "BUDGET";
            });
        } else if (currentPageName.id === "PurchasingMgmtExe") {
            //실행-구매
            //실행
            addNewData.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "EXECUTE";
            });
        } else if (innerPageName.id === "buying") {
            //영업-구메
            //영업
            addNewData.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.versionId = condition.versionId;
            });
        }

        const url = `/api${suffixUrl}/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        if (resultData) {
            setRemind(remind+1);
        }
    };

    const updateList = async (toUpdate, type) => {
        if (!isCurrentPage() && !suffixUrl && !Array.isArray(toUpdate)) return;
        if (currentPageName.id === "PurchasingMgmtPlan") {
            //실행-계획구매
            toUpdate.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "BUDGET";
            });
        } else if (currentPageName.id === "PurchasingMgmtExe") {
            //실행-구매
            toUpdate.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "EXECUTE";
            });
        } else if (innerPageName.id === "buying") {
            //영업-구매
            toUpdate.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.versionId = condition.versionId;
            });
        }

        const url = `/api${suffixUrl}/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData) {
            setRemind(remind+1);
            if(type) {
                setRemind(2);
            }
        }
    };
    const deleteList = async (removeItem) => {
        if (!isCurrentPage() && !suffixUrl && !Array.isArray(removeItem)) return;
        if (suffixUrl === "/baseInfrm/product/receivingInfo") {
            const changeUrl = "/baseInfrm/product/buyIngInfoExe";
            const url = `/api${changeUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, removeItem);
            if (resultData) {
                setRemind(remind+1);
            }
        } else {
            const url = `/api${suffixUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, removeItem);
            if (resultData) {
                setRemind(remind+1);
            }
        }
    };

    //삭제ID중복제거
    function removeDuplicates(arr) {
        return arr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }

    const updateDataInOrigin = (originData, filterData) => {
        // 복제하여 새로운 배열 생성
        const updatedArray = [...originData];
        // updatedData의 길이만큼 반복하여 originData 갱신
        for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
            const updatedItem = filterData[i];
            updatedArray[i] = { ...updatedItem, byId: updatedArray[i].byId };
        }
        return updatedArray;
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수
    const compareData = (originData, updatedData) => {
        setRemind(0);
        if (originData?.length === 0 && updatedData?.length === 0) return;
        const filterData = updatedData.filter((data) => data.pdiId);
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateList(firstRowUpdate);

            const originAValues = originData.map((item) => item.byId); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            deleteList(removeDuplicates(extraOriginData));

        } else if (originDataLength === updatedDataLength) {
            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateList(firstRowUpdate, "same");
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const toUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                const temp = { ...filterData[i] };
                toUpdate.push(temp);
            }
            const firstRowUpdate = updateDataInOrigin(originData, toUpdate);
            updateList(firstRowUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const temp = { ...filterData[i] };
                toAdds.push(temp);
            }
            addList(toAdds);
        }
    };

    const isCurrentPage = () => {
        return (
            current.id !== "" &&
            current.id !== undefined &&
            (current.id === currentPageName.id || current.id === innerPageName.id || current.name === modalPageName)
        );
    };

    const visibleColumnCount = headerGroups[0].headers.filter((column) => !column.notView).length;

    const textAlignStyle = (column) => {
        switch (column.textAlign) {
            case "pdiNm":
                return "pdiNm";
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
                                    //console.log(columnIndex, "로그?");
                                    let className = "";
                                    if (columnIndex === 0) {
                                        className = "first-column";
                                    } else if (columnIndex === 5) {
                                        className = "pdiNm";
                                    }

                                    return (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className={className}>
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
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell, cellIndex) => {
                                            if (cell.column.notView) {
                                                return null;
                                            }

                                            return (
                                                <td
                                                    {...cell.getCellProps()}
                                                    className={textAlignStyle(cell.column)}
                                                    id="otherCol"
                                                    // onClick={(e) => onClickCell(e, cell)}
                                                >
                                                    {cell.column.id === "selection" ? (
                                                        cell.render("Cell")
                                                    ) : isEditing ? (
                                                        cell.column.valueFix === true ? (
                                                            <input
                                                                autoComplete="off"
                                                                type="text"
                                                                value={1}
                                                                name={cell.column.id}
                                                                //onChange={(e) => handleChange(e, row)}
                                                                //disabled={cell.column.disabled}
                                                                style={{ textAlign: cell.column.textAlign || "left" }}
                                                                readOnly
                                                            />
                                                        ) : cell.column.type === "input" ? (
                                                            <input
                                                                autoComplete="off"
                                                                type="text"
                                                                value={tableData[row.index]?.[cell.column.id] || cell.value || ""}
                                                                name={cell.column.id}
                                                                onChange={(e) => handleChange(e, row)}
                                                                disabled={cell.column.disabled}
                                                                style={{ textAlign: cell.column.textAlign || "left" }}
                                                            />
                                                        ) : cell.column.type === "select" ? (
                                                            <select
                                                                autoComplete="off"
                                                                name={cell.column.id}
                                                                value={tableData[row.index]?.[cell.column.id] || cell.column.options[row.index].value || ""}
                                                                onChange={(e) => handleChange(e, reportWebVitals)}>
                                                                {cell.column.options.map((option, index) => (
                                                                    <option key={index} value={option.value || ""}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : cell.column.type === "dayPicker" ? (
                                                            <DayPicker
                                                                name={cell.column.id}
                                                                value={tableData[row.index]?.[cell.column.id] || ""}
                                                                onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                            />
                                                        ) : cell.column.type === "monthPicker" ? (
                                                            <div className="box3-1 boxDate">
                                                                <MonthPicker
                                                                    name={cell.column.id}
                                                                    value={tableData[row.index]?.[cell.column.id].substring(0, 7) || ""}
                                                                    onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                                />
                                                            </div>
                                                        ) : cell.column.type === "productInfo" ? (
                                                            <div>
                                                                <input
                                                                    autoComplete="off"
                                                                    id={cell.column.id}
                                                                    name={cell.column.id}
                                                                    type="text"
                                                                    className="basic-input"
                                                                    onClick={() => {
                                                                        goSetting(row.index);
                                                                        setIsOpenModalProductInfo(true);
                                                                    }}
                                                                    placeholder="품명을 선택하세요."
                                                                    value={tableData[row.index]?.[cell.column.id] || ""}
                                                                    // onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        ) : cell.column.type === "file" ? (
                                                            <div>
                                                                <button
                                                                    style={{ width: "50px" }}
                                                                    id={cell.column.id}
                                                                    name={cell.column.id}
                                                                    className="basic-input"
                                                                    onClick={() => { getFileData(row.index) }}
                                                                >
                                                                    {tableData[row.index]?.atchFileId?.fileLength || "0"}
                                                                </button>
                                                            </div>
                                                        ) : cell.column.type === "company" ? (
                                                            <div>
                                                                <input
                                                                    autoComplete="off"
                                                                    className="buttonSelect"
                                                                    id={cell.column.id}
                                                                    name={cell.column.id}
                                                                    onClick={() => setValueCompany(row.index)}
                                                                    type="text"
                                                                    placeholder={`거래처명을 선택해 주세요.`}
                                                                    value={tableData[row.index]?.[cell.column.id] || ""}
                                                                    onChange={(e) => handleChange(e, row)}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        ) : cell.column.type === "number" ? (
                                                            <Number
                                                                value={tableData[row.index]?.[cell.column.id] || "0"}
                                                                onChange={(value) => handleChange({ target: { value: value, name: cell.column.id } }, row)}
                                                                style={{ textAlign: cell.column.textAlign || "left" }}
                                                            />
                                                        ) : typeof cell.value === "number" ? (
                                                            cell.value && cell.value.toLocaleString()
                                                        ) : (
                                                            cell.render("Cell")
                                                        )
                                                    ) : (
                                                        cell.render("Cell")
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
                                <td
                                    colSpan={visibleColumnCount + 1}
                                    style={{ textAlign: "center", fontSize: "15px", height: "43px" }}
                                    className="back-lightgray">
                                    조회된 데이터가 없습니다.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
            {isOpenModalPgNm && <ModalPagePgNm rowIndex={rowIndex} onClose={() => setIsOpenModalPgNm(false)} />}
            {isOpenModalCompany && <ModalPageCompany rowIndex={rowIndex} onClose={() => setIsOpenModalCompany(false)} />}
            <ProductInfoModal width={900} height={770} title="품목정보 목록" isOpen={isOpenModalProductInfo} onClose={() => setIsOpenModalProductInfo(false)} />
            <FileModal tableFileInfo={tableFileInfo} width={600} height={330} title="첨부파일" isOpen={isOpenModalFile} onClose={() => setIsOpenModalFile(false)} />
        </>
    );
};

export default ReactDataTablePdorder;
