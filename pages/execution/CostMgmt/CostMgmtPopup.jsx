import React, { useState, useRef, useEffect } from "react";
////import ReactDOM from "react-dom/client";
import "../../../css/componentCss/PersonnelPopup.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";

import CostMgmtUtilBtn from "./CostMgmtUtilBtn";
//import PopupTesting from "./PopupTesting";
//import PopupWindow from "./PopupTesting";

const CostMgmtPopup = () => {
    const dataTableRef3 = useRef(null); //dataTable 테이블 명시
    const dataTableRef = useRef(null); //dataTable 테이블 명시
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
    });

    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);
    const [isClicked3, setIsClicked3] = useState(false);
    const [isClicked4, setIsClicked4] = useState(false);
    const [isClicked5, setIsClicked5] = useState(false);

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

    const [tableRows, setTableRows] = useState(initialTableRows);

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
    //const handleClick = () => {
    //    setIsClicked((prevState) => !prevState);
    //};
    //const handleClick2 = () => {
    //    setIsClicked2((prevState) => !prevState);
    //};
    //const handleClick3 = () => {
    //    setIsClicked3((prevState) => !prevState);
    //};
    //const handleClick4 = () => {
    //    setIsClicked4((prevState) => !prevState);
    //};
    //const handleClick5 = () => {
    //    setIsClicked5((prevState) => !prevState);
    //};

    //const openPopup = (item) => {
    //    const windowWidth = 1300;
    //    const windowHeight = 1000;
    //    const left = window.screen.width / 2 - windowWidth / 2;
    //    const top = window.screen.height / 2 - windowHeight / 2;

    //    const popupWindow = window.open(
    //        "",
    //        "_blank",
    //        `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
    //    );

    //    const content = (
    //        <html>
    //            <head>
    //                <title>Data Details</title>
    //                <link
    //                    rel="stylesheet"
    //                    href="../sysadmin/sysadminCss/TableTestPopup.css"
    //                />
    //            </head>
    //            <body>{/*<PopupTesting />*/}</body>
    //        </html>
    //    );

    //    popupWindow.document.open();
    //    popupWindow.document.write(ReactDOM.renderToStaticMarkup(content));
    //    popupWindow.document.close();
    //};

    //const openPopup = () => {
    //    PopupWindow(); // 새 창에 팝업 컴포넌트를 렌더링합니다.
    //};

    return (
        <div
            style={{
                backgroundColor: "white",
            }}>
            {/*<button onClick={openPopup}>팝업열기</button>*/}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
                </thead>
                {/*<tbody>
                    {data.map((item) => (
                        <tr key={item.id} onClick={() => openPopup(item)}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                        </tr>
                    ))}
                </tbody>*/}
            </table>
            <div>
                <div style={{ display: "flex", justifyContent: "right" }}>
                    <button>결제선</button>
                    <button>결제요청</button>
                    <button>임시저장</button>
                    <button>취소</button>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                        marginBottom: "50px",
                        marginTop: "20px",
                    }}>
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}>
                        <h1 style={{ margin: 0 }}>경비 계획</h1>
                    </div>

                    <div
                        className="k1"
                        style={{
                            display: "flex",
                            marginLeft: "auto",
                        }}>
                        <div
                            style={{
                                writingMode: "vertical-rl",
                                backgroundColor: "#e3ecf8",
                                border: "1px solid gray",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            }}>
                            <h3
                                style={{
                                    transform: "translateX(-10%)",
                                }}>
                                발신부서
                            </h3>
                        </div>
                        <div
                            style={{
                                width: "100px",
                            }}>
                            <div
                                style={{
                                    backgroundColor: "#e3ecf8",
                                    border: "1px solid gray",
                                    height: "20%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                팀원
                            </div>
                            <div
                                style={{
                                    border: "1px solid gray",
                                    height: "80%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                유지수
                            </div>
                        </div>
                        <div
                            style={{
                                width: "100px",
                            }}>
                            <div
                                style={{
                                    backgroundColor: "#e3ecf8",
                                    border: "1px solid gray",
                                    height: "20%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                PM
                            </div>
                            <div
                                style={{
                                    border: "1px solid gray",
                                    height: "80%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                손영훈
                            </div>
                        </div>
                    </div>
                </div>
                <div className="TableBucket">
                    <table className="tableMain">
                        <tbody className="tableBody">
                            <tr className="tableTr">
                                <td className="table2-1">프로젝트명</td>
                                <td className="table2-2">
                                    <select name="" id="">
                                        <option value="">
                                            ----------------------- 선택
                                            -----------------------
                                        </option>
                                        <option value="">
                                            삼성전자 천안 C3 전력 FMCS 구축
                                        </option>
                                        <option value="">
                                            엘지전자 평택 C7 전력 FMCS 설계
                                        </option>
                                    </select>
                                </td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table2-1">작성일</td>
                                <td className="table4-2">2023.07.04</td>
                                <td className="table2-1">프로젝트코드</td>
                                <td className="table4-2"></td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table2-1">작성자</td>
                                <td className="table4-2">유지수 팀원</td>
                                <td className="table2-1">작성부서</td>
                                <td className="table4-2">
                                    <select name="" id="">
                                        <option value="">
                                            ----------------------- 선택
                                            -----------------------
                                        </option>
                                        <option value="">PS팀</option>
                                        <option value="">PA팀</option>
                                    </select>
                                </td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table2-1">참조자</td>
                                <td className="table4-2">
                                    <select name="" id="">
                                        <option value="">
                                            ----------------------- 선택
                                            -----------------------
                                        </option>
                                        <option value="">유지수</option>
                                        <option value="">송경석</option>
                                    </select>
                                </td>
                                <td className="table2-1">수신처</td>
                                <td className="table4-2">
                                    <select name="" id="">
                                        <option value="">
                                            ----------------------- 선택
                                            -----------------------
                                        </option>
                                        <option value="">김유진</option>
                                        <option value="">양회빈</option>
                                    </select>
                                </td>
                            </tr>
                            <tr className="tableTr tableTr2">
                                <td className="table2-1 table2-1-2">
                                    작성가이드
                                </td>
                                <td className="table2-2">
                                    셀렉트 박스에서 선택을 해주세요
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/*<table className="tableMain">
                        <tbody className="tableBody">
                            <tr className="tableTr">
                                <td className="table8-1">수주부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">매출부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">영업대표</td>
                                <td className="table8-2">이수형 부장</td>
                                <td className="table8-1">담장자</td>
                                <td className="table8-2">손영훈 부장</td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table8-1">매출부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">시작일</td>
                                <td className="table8-2">2022/10/04</td>
                                <td className="table8-1">종료일</td>
                                <td className="table8-2">2022/12/30</td>
                                <td className="table8-1">상태</td>
                                <td className="table8-2">
                                    <div className="working">사업진행중</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>*/}
                    {/*<div className="tableMain titleMain">
                        <div className="tableBody title">
                            <div className="tableTr bucket">
                                <i className="fa fa-list-ul" />
                                <span className="titleName">인건비</span>
                            </div>
                            <button
                                className={`arrowBtn ${
                                    isClicked ? "clicked" : ""
                                }`}
                                onClick={handleClick}
                            >
                                <i className="fa fa-arrow-down" />
                            </button>
                        </div>
                    </div>*/}
                    <div style={{ marginRight: "4.5%" }}>
                        <CostMgmtUtilBtn />
                    </div>

                    <div id="content">
                        <header>
                            <span className="widget-icon">
                                <i className="fa fa-list-ul" />
                            </span>
                            <h2>경비 계획</h2>
                            <span className="spanCss">경비 계획</span>
                        </header>
                        <div className="table-responsive">
                            <div>
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
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "center",
                                    }}>
                                    <button
                                        style={{
                                            width: "100%",
                                            margin: "10px",
                                        }}
                                        className="btn btn-primary tdBtn"
                                        onClick={handleAddRow}>
                                        추가
                                    </button>
                                </div>
                                <table className="tableMain2">
                                    <tbody className="tableBody2">
                                        <tr className="tableTrTotal">
                                            <td className="table2-1">
                                                총 합계
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
                </div>
            </div>
        </div>
    );
};

export default CostMgmtPopup;
