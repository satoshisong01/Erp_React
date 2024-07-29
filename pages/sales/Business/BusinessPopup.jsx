import React, { useState, useRef, useEffect } from "react";
//import ReactDOM from "react-dom/client";
import "../../../css/componentCss/PersonnelPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";

import BusinessUtilBtn from "./BusinessUtilBtn";
//import PopupTesting from "./PopupTesting";
//import PopupWindow from "./PopupTesting";

//const InputCell = ({ value, onChange }) => (
//    <td className="tbodyTd">
//        <input type="text" value={value} onChange={onChange} />
//    </td>
//);

//const Row = ({ row, id, fields, onCellChange }) => (
//    <tr className="tableTr3">
//        <td className="tbodyTd">
//            <div className="inputTh">
//                <input type="checkbox" />
//            </div>
//        </td>
//        {fields.map((field) => (
//            <InputCell
//                key={field}
//                value={row[field]}
//                onChange={(e) => onCellChange(e, id, field)}
//            />
//        ))}
//    </tr>
//);

const BusinessPopup = () => {
    const dataTableRef3 = useRef(null); //dataTable 테이블 명시
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const dataTableRef4 = useRef(null); //dataTable 테이블 명시
    const dataTableRef5 = useRef(null); //dataTable 테이블 명시
    const dataTableRef2 = useRef(null); //dataTable 테이블 명시
    const [data, setData] = useState([
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Bob", age: 35 },
    ]);

    useEffect(() => {
        if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
            $(dataTableRef.current).DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable(dataTableRef2.current)) {
            $(dataTableRef2.current).DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable(dataTableRef3.current)) {
            $(dataTableRef3.current).DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable(dataTableRef4.current)) {
            $(dataTableRef4.current).DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable(dataTableRef5.current)) {
            $(dataTableRef5.current).DataTable().destroy();
        }
        $(dataTableRef.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
        $(dataTableRef2.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
        $(dataTableRef3.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
        $(dataTableRef4.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
        $(dataTableRef5.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
        $(dataTableRef2.current).DataTable().destroy();
        $(dataTableRef2.current).DataTable({
            paging: true,
            ordering: true,
            lengthMenu: [10, 15, 30, 50, 100],
            autoWidth: true,
        });
    });

    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);
    const [isClicked3, setIsClicked3] = useState(false);
    const [isClicked4, setIsClicked4] = useState(false);
    const [isClicked5, setIsClicked5] = useState(false);
    const [isClicked6, setIsClicked6] = useState(false);
    const [isClicked7, setIsClicked7] = useState(false);

    const [selectedData, setSelectedData] = useState([]); //체크된 데이터
    const [check, setCheck] = useState(false); //체크 확인
    const [searchedData, setSearchedData] = useState([]);

    const initialTableRows = [
        {
            id: 1,
            품목그룹명: "PANEL",
            연월: "2023/05",
            M_M계: "333",
            인건비계: "1515", // 임시로 데이터를 넣어주세요
            임원: "3", // 임시로 데이터를 넣어주세요
            특급기술사: "1", // 임시로 데이터를 넣어주세요
            고급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기술사: "2", // 임시로 데이터를 넣어주세요
            초급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기능사: "2", // 임시로 데이터를 넣어주세요
            고급기능사: "1", // 임시로 데이터를 넣어주세요
            부장: "99", // 임시로 데이터를 넣어주세요
            차장: "20", // 임시로 데이터를 넣어주세요
            과장: "15", // 임시로 데이터를 넣어주세요
            대리: "12", // 임시로 데이터를 넣어주세요
            주임: "10", // 임시로 데이터를 넣어주세요
            사원: "22", // 임시로 데이터를 넣어주세요
        },
        {
            id: 2,
            품목그룹명: "개별외주비",
            연월: "2023/05",
            M_M계: "444", // 임시로 데이터를 넣어주세요
            인건비계: "8989", // 임시로 데이터를 넣어주세요
            임원: "3", // 임시로 데이터를 넣어주세요
            특급기술사: "1", // 임시로 데이터를 넣어주세요
            고급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기술사: "2", // 임시로 데이터를 넣어주세요
            초급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기능사: "2", // 임시로 데이터를 넣어주세요
            고급기능사: "1", // 임시로 데이터를 넣어주세요
            부장: "99", // 임시로 데이터를 넣어주세요
            차장: "20", // 임시로 데이터를 넣어주세요
            과장: "15", // 임시로 데이터를 넣어주세요
            대리: "12", // 임시로 데이터를 넣어주세요
            주임: "10", // 임시로 데이터를 넣어주세요
            사원: "22", // 임시로 데이터를 넣어주세요
            // 나머지 데이터들도 추가하세요...
        },
    ];

    const dummyDataTableRows = [
        {
            id: 1,
            그룹품목명: "판넬",
            품명: "2023/05",
            규격: "22",
            수량: "3", // 임시로 데이터를 넣어주세요
            단가: "50원", // 임시로 데이터를 넣어주세요
            금액: "100원", // 임시로 데이터를 넣어주세요
            구매예상일: "크리스마스", // 임시로 데이터를 넣어주세요
            비고: "비어있슴다", // 임시로 데이터를 넣어주세요
        },
    ];

    const [tableRows, setTableRows] = useState(initialTableRows);

    const [tableRunRows, setTableRunRows] = useState(initialTableRows);

    const [dataTableRows, setDataTableRows] = useState(dummyDataTableRows);

    //useEffect(() => {
    //    // dataTableRows 상태가 변경될 때마다 실행되는 코드
    //    // 컴포넌트가 다시 렌더링됩니다.
    //}, [dataTableRows]);

    //체크된 아이템의 uniqId 숫자만 저장
    const changeInt = selectedData.map((item) => item.uniqId);

    //const keys = data.length > 0 ? Object.keys(data[0]) : [];

    // 전체 선택/해제 핸들러
    const handleClick = (e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setCheck(true);
            setSelectedData(searchedData); // 모든 데이터를 선택된 데이터로 설정
        } else {
            setCheck(false);
            setSelectedData([]); // 선택된 데이터 초기화
        }
    };

    // 개별 아이템 체크 핸들러
    const handleItemCheck = (item, e) => {
        const isChecked = e.target.checked;

        setSelectedData((prevSelectedData) => {
            if (isChecked) {
                // 이미 선택된 데이터인지 확인 후 중복 추가 방지
                if (
                    !prevSelectedData.find(
                        (selectedItem) => selectedItem.uniqId === item.uniqId
                    )
                ) {
                    const sortedData = [...prevSelectedData, item].sort(
                        (a, b) => {
                            // uniqId 속성을 기준으로 데이터 정렬
                            if (a.uniqId < b.uniqId) {
                                return -1;
                            }
                            if (a.uniqId > b.uniqId) {
                                return 1;
                            }
                            return 0;
                        }
                    );
                    return sortedData;
                }
            } else {
                return prevSelectedData.filter(
                    (selectedItem) => selectedItem.uniqId !== item.uniqId
                );
            }
            return prevSelectedData; // 체크가 풀리지 않았거나 중복 데이터인 경우 이전 상태 그대로 반환
        });
    };

    // "추가" 버튼을 클릭했을 때 실행될 함수
    const handleAddRow = () => {
        // 새로운 행을 만들고, 현재의 tableRows 상태에 추가합니다.
        const newRow = {
            id: tableRows.length + 1,
            품목그룹명: "", // 여기에 새로운 열의 초기 값들을 지정하세요...
            연월: "", // 예시로 빈 문자열로 초기화 했습니다.
            M_M계: "", // 다른 속성들도 추가하세요...
            인건비계: "", // 임시로 데이터를 넣어주세요
            임원: "", // 임시로 데이터를 넣어주세요
            특급기술사: "", // 임시로 데이터를 넣어주세요
            고급기술사: "", // 임시로 데이터를 넣어주세요
            중급기술사: "", // 임시로 데이터를 넣어주세요
            초급기술사: "", // 임시로 데이터를 넣어주세요
            중급기능사: "", // 임시로 데이터를 넣어주세요
            고급기능사: "", // 임시로 데이터를 넣어주세요
            부장: "", // 임시로 데이터를 넣어주세요
            차장: "", // 임시로 데이터를 넣어주세요
            과장: "", // 임시로 데이터를 넣어주세요
            대리: "", // 임시로 데이터를 넣어주세요
            주임: "", // 임시로 데이터를 넣어주세요
            사원: "", // 임시로 데이터를 넣어주세요
        };
        setTableRows([...tableRows, newRow]);
    };

    const handleAddRunRow = () => {
        // 새로운 행을 만들고, 현재의 tableRows 상태에 추가합니다.
        const newRow = {
            id: tableRunRows.length + 1,
            품목그룹명: "", // 여기에 새로운 열의 초기 값들을 지정하세요...
            연월: "", // 예시로 빈 문자열로 초기화 했습니다.
            M_M계: "", // 다른 속성들도 추가하세요...
            인건비계: "", // 임시로 데이터를 넣어주세요
            임원: "", // 임시로 데이터를 넣어주세요
            특급기술사: "", // 임시로 데이터를 넣어주세요
            고급기술사: "", // 임시로 데이터를 넣어주세요
            중급기술사: "", // 임시로 데이터를 넣어주세요
            초급기술사: "", // 임시로 데이터를 넣어주세요
            중급기능사: "", // 임시로 데이터를 넣어주세요
            고급기능사: "", // 임시로 데이터를 넣어주세요
            부장: "", // 임시로 데이터를 넣어주세요
            차장: "", // 임시로 데이터를 넣어주세요
            과장: "", // 임시로 데이터를 넣어주세요
            대리: "", // 임시로 데이터를 넣어주세요
            주임: "", // 임시로 데이터를 넣어주세요
            사원: "", // 임시로 데이터를 넣어주세요
        };
        setTableRunRows([...tableRunRows, newRow]);
    };

    const handleDataTableAddRunRow = () => {
        // 새로운 행을 만들고, 현재의 tableRows 상태에 추가합니다.
        const newRow = {
            id: dataTableRows.length + 1,
            그룹품목명: "",
            품명: "",
            규격: "",
            수량: "", // 임시로 데이터를 넣어주세요
            단가: "", // 임시로 데이터를 넣어주세요
            금액: "", // 임시로 데이터를 넣어주세요
            구매예상일: "", // 임시로 데이터를 넣어주세요
            비고: "", // 임시로 데이터를 넣어주세요
        };
        setDataTableRows([...dataTableRows, newRow]);
    };

    const cellFields = [
        "연월",
        "M_M계",
        "인건비계",
        "임원",
        "특급기술사",
        "고급기술사",
        "중급기술사",
        "초급기술사",
        "중급기능사",
        "고급기능사",
        "부장",
        "차장",
        "과장",
        "대리",
        "주임",
        "사원",
    ];

    const dataTableCellFields = [
        "품명",
        "규격",
        "수량",
        "단가",
        "금액",
        "구매예상일",
        "비고",
    ];

    const handleClick1 = () => {
        setIsClicked(!isClicked);
    };
    const handleClick2 = () => {
        setIsClicked2(!isClicked2);
    };
    const handleClick3 = () => {
        setIsClicked3(!isClicked3);
    };
    const handleClick4 = () => {
        setIsClicked4(!isClicked4);
    };
    const handleClick5 = () => {
        setIsClicked5(!isClicked5);
    };
    const handleClick6 = () => {
        setIsClicked6(!isClicked6);
    };
    const handleClick7 = () => {
        setIsClicked7(!isClicked7);
    };

    //파일업로드

    const [dragging, setDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const newFiles = [...e.dataTransfer.files];
        setFiles(newFiles);
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (e) => {
        const newFiles = [...e.target.files];
        setFiles(newFiles);
    };

    const handleCellChange = (e, id, field) => {
        const { value } = e.target;
        const updatedRows = tableRunRows.map((row) => {
            if (row.id === id) {
                return {
                    ...row,
                    [field]: value,
                };
            }
            return row;
        });
        setTableRunRows(updatedRows);
    };

    const handleDataTableCellChange = (e, id, field) => {
        e.stopPropagation();
        const { value } = e.target;
        console.log(e.target.value);
        const updatedRows = dataTableRows.map((row) => {
            if (row.id === id) {
                return {
                    ...row,
                    [field]: value,
                };
            }
            return row;
        });
        setDataTableRows(updatedRows);
    };

    //useEffect(() => {
    //    console.log(dataTableRows, "추가되고있나");
    //}, [dataTableRows]);

    return (
        <div className="popUpHomeBody">
            <div>
                <div className="TableBucket">
                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">인건비 영업 계획</span>
                            <button
                                className="arrowBtnStyle"
                                onClick={handleClick1}>
                                <FontAwesomeIcon
                                    className={`arrowBtn ${
                                        isClicked ? "" : "clicked"
                                    }`}
                                    icon={faArrowUp}
                                />
                            </button>
                        </header>
                        <div
                            className={`table-responsive fold ${
                                isClicked ? "clicked" : ""
                            }`}>
                            <div
                                className={`hideDiv ${
                                    isClicked ? "" : "clicked"
                                }`}>
                                <div>
                                    <BusinessUtilBtn title={"plan"} />
                                </div>
                                <table className="popUpFirstTable" border="1">
                                    <thead>
                                        <tr className="tableTr3">
                                            <th
                                                className="thTitle1"
                                                rowSpan={"2"}>
                                                <div className="inputTh">
                                                    <input
                                                        type="checkbox"
                                                        checked={check}
                                                        onChange={(e) =>
                                                            handleClick(e)
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th
                                                className="thTitle1"
                                                rowSpan={"2"}>
                                                품목그룹명
                                            </th>
                                            <th
                                                className="thTitle1"
                                                rowSpan={"2"}>
                                                연월
                                            </th>
                                            <th
                                                className="thTitle1"
                                                rowSpan={"2"}>
                                                M/M계
                                            </th>
                                            <th
                                                className="thTitle1"
                                                rowSpan={"2"}>
                                                인건비계
                                            </th>
                                            <th
                                                className="thTitle1"
                                                colSpan={"7"}>
                                                일반
                                            </th>
                                            <th
                                                className="thTitle1"
                                                colSpan={"6"}>
                                                프로젝트팀원
                                            </th>
                                        </tr>
                                        <tr className="tableTr3">
                                            <th className="thTitle2">임원</th>
                                            <th className="thTitle2">
                                                특급기술사
                                            </th>
                                            <th className="thTitle2">
                                                고급기술사
                                            </th>
                                            <th className="thTitle2">
                                                중급기술사
                                            </th>
                                            <th className="thTitle2">
                                                초급기술사
                                            </th>
                                            <th className="thTitle2">
                                                중급기능사
                                            </th>
                                            <th className="thTitle2">
                                                고급기능사
                                            </th>
                                            <th className="thTitle2">부장</th>
                                            <th className="thTitle2">차장</th>
                                            <th className="thTitle2">과장</th>
                                            <th className="thTitle2">대리</th>
                                            <th className="thTitle2">주임</th>
                                            <th className="thTitle2">사원</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* tableRows 상태로부터 테이블 행을 렌더링합니다. */}
                                        {tableRunRows.map((row) => (
                                            <tr
                                                className="tableTr3"
                                                key={row.id}>
                                                {/* 테이블 셀들의 값들을 적절하게 지정하세요 */}
                                                <td className="tbodyTd">
                                                    <div className="inputTh">
                                                        <input type="checkbox" />
                                                    </div>
                                                </td>
                                                <td className="tbodyTd">
                                                    <select className="tbodyTdSelect">
                                                        {tableRunRows.map(
                                                            (row) => (
                                                                <option
                                                                    key={row.id}
                                                                    value={
                                                                        row.품목그룹명
                                                                    }>
                                                                    {
                                                                        row.품목그룹명
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>
                                                {cellFields.map((field) => (
                                                    <td
                                                        key={field}
                                                        className="tbodyTd">
                                                        <input
                                                            type="text"
                                                            value={row[field]}
                                                            onChange={(e) =>
                                                                handleCellChange(
                                                                    e,
                                                                    row.id,
                                                                    field
                                                                )
                                                            }></input>
                                                    </td>
                                                ))}
                                                {/* 다른 셀들도 추가하세요 */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="buttonParent">
                                <button
                                    className="btn btn-primary tdBtn PopUpAddBtn"
                                    onClick={handleAddRunRow}>
                                    추가
                                </button>
                            </div>
                            <table className="tableMain2">
                                <tbody className="tableBody2">
                                    <tr className="tableTrTotal">
                                        <td className="totalSum">
                                            인건비&nbsp;합계
                                        </td>
                                        <td className="totalCount">
                                            1,100,000₩
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">
                                구매(재료비) 영업 계획
                            </span>
                            <button
                                className="arrowBtnStyle"
                                onClick={handleClick2}>
                                <FontAwesomeIcon
                                    className={`arrowBtn ${
                                        isClicked2 ? "" : "clicked"
                                    }`}
                                    icon={faArrowUp}
                                />
                            </button>
                        </header>
                        <div
                            className={`table-responsive fold2 ${
                                isClicked2 ? "clicked" : ""
                            }`}>
                            <div
                                className={`hideDiv2 ${
                                    isClicked2 ? "" : "clicked"
                                }`}>
                                <div>
                                    <BusinessUtilBtn title={"plan"} />
                                </div>
                                <table ref={dataTableRef2} border="1">
                                    <thead>
                                        <tr className="tableTr3">
                                            <th className="tableHeaderTh">
                                                <input
                                                    type="checkbox"
                                                    checked={check}
                                                    onChange={(e) =>
                                                        handleClick(e)
                                                    }
                                                />
                                            </th>
                                            <th className="thTitle1">
                                                그룹품목명
                                            </th>
                                            <th className="thTitle1">품명</th>
                                            <th className="thTitle1">규격</th>
                                            <th className="thTitle1">수량</th>
                                            <th className="thTitle1">단가</th>
                                            <th className="thTitle1">금액</th>
                                            <th className="thTitle1">
                                                구매예상일
                                            </th>
                                            <th className="thTitle1">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataTableRows.map((row) => (
                                            <tr
                                                className="tableTr3"
                                                key={row.id}>
                                                <td className="tbodyTd">
                                                    <div className="inputTh">
                                                        <input type="checkbox" />
                                                    </div>
                                                </td>
                                                <td className="tbodyTd">
                                                    <select className="tbodyTdSelect">
                                                        {dataTableRows.map(
                                                            (r) => (
                                                                <option
                                                                    key={r.id}
                                                                    value={
                                                                        r.그룹품목명
                                                                    }>
                                                                    {
                                                                        r.그룹품목명
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>
                                                {dataTableCellFields.map(
                                                    (field) => (
                                                        <td
                                                            key={field}
                                                            className="tbodyTd">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    row[field]
                                                                }
                                                                onChange={(e) =>
                                                                    handleDataTableCellChange(
                                                                        e,
                                                                        row.id,
                                                                        field
                                                                    )
                                                                }></input>
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="buttonParent">
                                    <button
                                        className="btn btn-primary tdBtn PopUpAddBtn"
                                        onClick={handleDataTableAddRunRow}>
                                        추가
                                    </button>
                                </div>
                                <table className="tableMain2">
                                    <tbody className="tableBody2">
                                        <tr className="tableTrTotal">
                                            <td className="totalSum">
                                                구매&nbsp;(재료비)&nbsp;합계
                                            </td>
                                            <td className="totalCount">
                                                1,100,000₩
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">경비 영업 계획</span>
                            <button
                                className="arrowBtnStyle"
                                onClick={handleClick3}>
                                <FontAwesomeIcon
                                    className={`arrowBtn ${
                                        isClicked3 ? "" : "clicked"
                                    }`}
                                    icon={faArrowUp}
                                />
                            </button>
                        </header>
                        <div
                            className={`table-responsive fold3 ${
                                isClicked3 ? "clicked" : ""
                            }`}>
                            <div
                                className={`hideDiv3 ${
                                    isClicked3 ? "" : "clicked"
                                }`}>
                                <div>
                                    <BusinessUtilBtn title={"plan"} />
                                </div>
                                <table ref={dataTableRef} border="1">
                                    <thead>
                                        <tr className="tableTr3">
                                            <th className="tableHeaderTh">
                                                <input
                                                    type="checkbox"
                                                    checked={check}
                                                    onChange={(e) =>
                                                        handleClick(e)
                                                    }
                                                />
                                            </th>
                                            <th className="thTitle1">월</th>
                                            <th className="thTitle1">교통비</th>
                                            <th className="thTitle1">숙박비</th>
                                            <th className="thTitle1">
                                                일비/파견비
                                            </th>
                                            <th className="thTitle1">식비</th>
                                            <th className="thTitle1">
                                                자재/소모품외
                                            </th>
                                            <th className="thTitle1">합계</th>
                                            <th className="thTitle1">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="tableTr3">
                                            <td className="tbodyTd">
                                                <div className="inputTh">
                                                    <input type="checkbox" />
                                                </div>
                                            </td>
                                            <td>9월</td>
                                            <td>PLC PANEL</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>800,000</td>
                                            <td></td>
                                        </tr>
                                        <tr className="tableTr3">
                                            <td className="tbodyTd">
                                                <div className="inputTh">
                                                    <input type="checkbox" />
                                                </div>
                                            </td>
                                            <td>10월</td>
                                            <td>PLC PANEL</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>300,000</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="buttonParent">
                                    <button
                                        className="btn btn-primary tdBtn PopUpAddBtn"
                                        onClick={handleAddRow}>
                                        추가
                                    </button>
                                </div>
                                <table className="tableMain2">
                                    <tbody className="tableBody2">
                                        <tr className="tableTrTotal">
                                            <td className="totalSum">
                                                경비&nbsp;합계
                                            </td>
                                            <td className="totalCount">
                                                334,000₩
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">기업 이윤 계획</span>
                            <button
                                className="arrowBtnStyle"
                                onClick={handleClick4}>
                                <FontAwesomeIcon
                                    className={`arrowBtn ${
                                        isClicked4 ? "" : "clicked"
                                    }`}
                                    icon={faArrowUp}
                                />
                            </button>
                        </header>
                        <div
                            className={`table-responsive fold4 ${
                                isClicked4 ? "clicked" : ""
                            }`}>
                            <div
                                className={`hideDiv4 ${
                                    isClicked4 ? "" : "clicked"
                                }`}>
                                <div>
                                    <BusinessUtilBtn title={"plan"} />
                                </div>
                                <table ref={dataTableRef3} border="1">
                                    <thead>
                                        <tr className="tableTr3">
                                            <th className="tableHeaderTh">
                                                <div className="inputTh">
                                                    <input
                                                        type="checkbox"
                                                        checked={check}
                                                        onChange={(e) =>
                                                            handleClick(e)
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="thTitle1">금액</th>
                                            <th className="thTitle1">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="tableTr3">
                                            <td className="tbodyTd">
                                                <div className="inputTh">
                                                    <input type="checkbox" />
                                                </div>
                                            </td>
                                            <td>100,000</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="buttonParent">
                                    <button
                                        className="btn btn-primary tdBtn PopUpAddBtn"
                                        onClick={handleAddRow}>
                                        추가
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">일반 관리비 계획</span>
                            <button
                                className="arrowBtnStyle"
                                onClick={handleClick5}>
                                <FontAwesomeIcon
                                    className={`arrowBtn ${
                                        isClicked5 ? "" : "clicked"
                                    }`}
                                    icon={faArrowUp}
                                />
                            </button>
                        </header>
                        <div
                            className={`table-responsive fold5 ${
                                isClicked5 ? "clicked" : ""
                            }`}>
                            <div
                                className={`hideDiv5 ${
                                    isClicked5 ? "" : "clicked"
                                }`}>
                                <div>
                                    <BusinessUtilBtn title={"plan"} />
                                </div>
                                <table ref={dataTableRef4} border="1">
                                    <thead>
                                        <tr className="tableTr3">
                                            <th className="tableHeaderTh">
                                                <div className="inputTh">
                                                    <input
                                                        type="checkbox"
                                                        checked={check}
                                                        onChange={(e) =>
                                                            handleClick(e)
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="thTitle1">금액</th>
                                            <th className="thTitle1">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="tableTr3">
                                            <td className="tbodyTd">
                                                <div className="inputTh">
                                                    <input type="checkbox" />
                                                </div>
                                            </td>
                                            <td>100,000</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="buttonParent">
                                    <button
                                        className="btn btn-primary tdBtn PopUpAddBtn"
                                        onClick={handleAddRow}>
                                        추가
                                    </button>
                                </div>
                                <table className="tableMain2">
                                    <tbody className="tableBody2">
                                        <tr className="tableTrTotal">
                                            <td className="totalSum">판관비</td>
                                            <td className="totalCount">
                                                334,000₩
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">NEGO 계획</span>
                            <button
                                className="arrowBtnStyle"
                                onClick={handleClick6}>
                                <FontAwesomeIcon
                                    className={`arrowBtn ${
                                        isClicked6 ? "" : "clicked"
                                    }`}
                                    icon={faArrowUp}
                                />
                            </button>
                        </header>
                        <div
                            className={`table-responsive fold6 ${
                                isClicked6 ? "clicked" : ""
                            }`}>
                            <div
                                className={`hideDiv6 ${
                                    isClicked6 ? "" : "clicked"
                                }`}>
                                <div>
                                    <BusinessUtilBtn title={"plan"} />
                                </div>
                                <table ref={dataTableRef5} border="1">
                                    <thead>
                                        <tr className="tableTr3">
                                            <th className="tableHeaderTh">
                                                <div className="inputTh">
                                                    <input
                                                        type="checkbox"
                                                        checked={check}
                                                        onChange={(e) =>
                                                            handleClick(e)
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="thTitle1">금액</th>
                                            <th className="thTitle1">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="tableTr3">
                                            <td className="tbodyTd">
                                                <div className="inputTh">
                                                    <input type="checkbox" />
                                                </div>
                                            </td>
                                            <td>100,000</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="buttonParent">
                                    <button
                                        className="btn btn-primary tdBtn PopUpAddBtn"
                                        onClick={handleAddRow}>
                                        추가
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">비고</span>
                            <button
                                className="arrowBtnStyle"
                                onClick={handleClick7}>
                                <FontAwesomeIcon
                                    className={`arrowBtn ${
                                        isClicked7 ? "" : "clicked"
                                    }`}
                                    icon={faArrowUp}
                                />
                            </button>
                        </header>
                        <div
                            className={`table-responsive fold7 ${
                                isClicked7 ? "clicked" : ""
                            }`}>
                            <div
                                className={`hideDiv7 ${
                                    isClicked7 ? "" : "clicked"
                                }`}>
                                <textarea
                                    className="textAreaWidth"
                                    placeholder="내용을 입력하세요."></textarea>
                            </div>
                        </div>
                    </div>

                    <div id="content">
                        <header className="headerH2">
                            <span className="spanCss">파일 업로드</span>
                        </header>
                        <div className="table-responsive">
                            <div
                                onClick={handleBrowseClick}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                style={{
                                    backgroundColor: dragging
                                        ? "beige"
                                        : "#ffffff",
                                    cursor: "pointer",
                                }}
                                className={`hideDiv8 ${
                                    isClicked ? "" : "clicked"
                                }`}
                                border="1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileInputChange}
                                    multiple
                                />
                                {files.length > 0 ? (
                                    <div className="div5Span">
                                        {files.map((file, index) => (
                                            <div key={index}>{file.name}</div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="div5Span">
                                        파일을 드래그 앤 드롭하거나 클릭하여
                                        파일을 선택하세요.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPopup;
