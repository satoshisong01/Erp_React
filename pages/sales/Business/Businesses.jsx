import React, { useEffect, useRef, useState } from "react";
import "../../../css/ContentMain.css";
import { Tooltip } from "react-tooltip";
import MouseDc from "components/MouseDc";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "../../../css/defaultSearchBar.css";
import "../../../css/componentCss/UserManage.css";
import axios from "axios";
import "../../../css/componentCss/PersonnelPopup.css";
import "../../../css/componentCss/Code.css";
import BusinessModalPage from "./BusinessModalPage";
import BusinessUtilBtn from "./BusinessUtilBtn";
import BusinessTableSearchBar from "./BusinessTableSearchBar";

const Businesses = () => {
    const dataTableRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [check, setCheck] = useState(false);
    const [modalItem, setModalItem] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchCondition, setSearchCondition] = useState("0");
    const [selectedOption, setSelectedOption] = useState("option2");
    const [showTooltip, setShowTooltip] = useState(false);
    const [isRowClick, setIsRowClick] = useState(false);
    const [projectList, setProjectList] = useState([
        {
            name: "PS 하부서편",
            code: "P001",
            startDate: "2022/10/24",
            currency: "원화",
            vendor: "SDS",
            contactPerson: "",
            orderAmount: "78,600,000",
            Invoice: "",
            status: "작성중",
            order: "FMCS 그룹",
            salesDepartment: "FMCS 그룹",
            salesAgent: "이수형 부장",
            pm: "손영훈 부장",
            year: "2022",
            endDate: "2022/12/30",
            margin: "20%",
        },
        {
            name: "드림클래스 2.0 후속과제 개발",
            code: "P002",
            startDate: "2023/01/05",
            currency: "원화",
            vendor: "미라콤",
            contactPerson: "손영훈 부장",
            orderAmount: "194,881,000",
            Invoice: "",
            status: "수주진행중",
            order: "PS팀",
            salesDepartment: "WEB 그룹",
            salesAgent: "이수형 부장",
            pm: "유승현 부장",
            year: "2023",
            endDate: "2023/6/12",
            margin: "20%",
        },
    ]);
    const [secondTableData, setSecondTableData] = useState({
        name: "",
        code: "",
        order: "",
        salesDepartment: "",
        salesAgent: "",
        pm: "",
        year: "",
        startDate: "",
        endDate: "",
    });

    const headers = {
        Authorization: localStorage.jToken,
    };

    const handleInputChange = (fieldName, value) => {
        setSelectedData((prevData) => {
            const newData = [...prevData];
            newData[fieldName] = value;
            return newData;
        });
    };

    const rowClick = (clickData) => {
        // ...
    };

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const urlName = "Businesses";

    const handleSearch = (value) => {
        setSearchKeyword(value);
    };

    const handleSearchLv = (value) => {
        setSearchCondition(value);
    };

    const handleOption = (value) => {
        setSelectedOption(value);
    };

    const handleRefreshClick = async () => {
        // ...
    };

    const fetchAllData = async () => {
        setSearchedData(projectList);
    };

    const handleSearchData = async () => {
        //검색
        // ...
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (!isSearching && searchedData.length > 0) {
            if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }
            initializeDataTable();
        }
    }, [searchedData, isSearching]);

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

    const handleModalClick = (e, item) => {
        // ...
    };

    const handleNewRowAdd = () => {
        const newRowData = { ...secondTableData };
        setSearchedData((prevData) => [...prevData, newRowData]); // 기존 데이터에 새로운 데이터 추가
        clearSecondTableData();

        // DataTable 초기화
        if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
            $(dataTableRef.current).DataTable().destroy();
            initializeDataTable();
        }
    };

    const clearSecondTableData = () => {
        setSecondTableData({
            name: "",
            code: "",
            order: "",
            salesDepartment: "",
            salesAgent: "",
            pm: "",
            year: "",
            startDate: "",
            endDate: "",
            margin: "",
        });
    };

    const initializeDataTable = () => {
        $(dataTableRef.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
    };

    const getStateElement = (stateTitle) => {
        if (stateTitle === "before") {
            return (
                <div className="stateName stateNameB">
                    <span className="dotPoint dotPointB">●</span>
                    <span className="stateNameTitle stateNameTitleB">시작 전</span>
                </div>
            );
        } else if (stateTitle === "working") {
            return (
                <div className="stateName stateNameW">
                    <span className="dotPoint dotPointW">●</span>
                    <span className="stateNameTitle stateNameTitleW">진행 중</span>
                </div>
            );
        } else if (stateTitle === "finished") {
            return (
                <div className="stateName stateNameF">
                    <span className="dotPoint dotPointF">●</span>
                    <span className="stateNameTitle stateNameTitleF">완료</span>
                </div>
            );
        } else {
            // 기본값이 필요하다면 이곳에 추가해주세요.
            return (
                <div className="stateName stateNameDefault">
                    <span className="dotPoint dotDefault">●</span>
                    <span className="stateNameTitle Default">기본 상태</span>
                </div>
            );
        }
    };

    const handleItemCheck = (item, e) => {
        const isChecked = e.target.checked;

        setSelectedData((prevSelectedData) => {
            if (isChecked) {
                // 이미 선택된 데이터인지 확인 후 중복 추가 방지
                if (!prevSelectedData.find((selectedItem) => selectedItem.uniqId === item.uniqId)) {
                    const sortedData = [...prevSelectedData, item].sort((a, b) => {
                        // uniqId 속성을 기준으로 데이터 정렬
                        if (a.uniqId < b.uniqId) {
                            return -1;
                        }
                        if (a.uniqId > b.uniqId) {
                            return 1;
                        }
                        return 0;
                    });
                    return sortedData;
                }
            } else {
                return prevSelectedData.filter((selectedItem) => selectedItem.uniqId !== item.uniqId);
            }
            return prevSelectedData; // 체크가 풀리지 않았거나 중복 데이터인 경우 이전 상태 그대로 반환
        });
    };

    return (
        <>
            <div className="SearchDiv">
                <BusinessTableSearchBar
                    onSearch={handleSearch}
                    onSearchLv={handleSearchLv}
                    onOption={handleOption}
                    refresh={handleRefreshClick}
                    urlName={urlName}
                    searchBtn={handleSearchData}
                />
            </div>
            <div className="TableBoxs">
                <div className="UserTable">
                    <div className="row">
                        <BusinessUtilBtn initialData={searchedData} refresh={fetchAllData} selectedData={selectedData} urlName={urlName} headers={headers} />
                        <div className="tableBody">
                            <div className="widget-body">
                                {isSearching && <div>Loading...</div>}
                                {!isSearching && (
                                    <>
                                        <div className="tableBox">
                                            <table ref={dataTableRef} className="table table-bordered" id="dataTable">
                                                <thead>
                                                    <tr>
                                                        <th className="tableHeaderTh">
                                                            <input type="checkbox" checked={check} onChange={(e) => handleClick(e)} />
                                                        </th>
                                                        {[
                                                            "프로젝트명",
                                                            "프로젝트코드",
                                                            "수주일",
                                                            "통화",
                                                            "거래처",
                                                            "담당자",
                                                            "납기일",
                                                            "수주금액",
                                                            "거래명세서",
                                                            "상태",
                                                        ].map((item, index) => (
                                                            <th key={index}>{item}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {searchedData.map((item, index) => (
                                                        <tr key={index} onClick={() => rowClick(item)}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedData.some((selectedItem) => selectedItem.uniqId === item.uniqId)}
                                                                    onChange={(e) => handleItemCheck(item, e)}
                                                                />
                                                            </td>
                                                            {[
                                                                "name",
                                                                "code",
                                                                "startDate",
                                                                "currency",
                                                                "vendor",
                                                                "contactPerson",
                                                                "endDate",
                                                                "orderAmount",
                                                                "Invoice",
                                                                "status",
                                                            ].map((key) => (
                                                                <td
                                                                    onMouseEnter={handleMouseEnter}
                                                                    onMouseLeave={handleMouseLeave}
                                                                    className="tableWidth
                                                                    tdStyle mouseText"
                                                                    onDoubleClick={(e) => handleModalClick(e, item)}
                                                                    key={key}>
                                                                    {item[key]}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={handleNewRowAdd}>신규 등록</button>
            <div className="table-Container">
                <table className="table-styled">
                    <tbody>
                        <tr>
                            <th>프로젝트 이름</th>
                            <td colSpan="3">
                                <input type="text" value={secondTableData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                            </td>
                            <th>프로젝트 코드</th>
                            <td colSpan="3">
                                <input type="text" value={secondTableData.code} onChange={(e) => handleInputChange("code", e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th>수주부서</th>
                            <td>
                                <input type="text" value={secondTableData.order} onChange={(e) => handleInputChange("order", e.target.value)} />
                            </td>
                            <th>매출부서</th>
                            <td>
                                <input
                                    type="text"
                                    value={secondTableData.salesDepartment}
                                    onChange={(e) => handleInputChange("salesDepartment", e.target.value)}
                                />
                            </td>
                            <th>영업대표</th>
                            <td>
                                <input type="text" value={secondTableData.salesAgent} onChange={(e) => handleInputChange("salesAgent", e.target.value)} />
                            </td>
                            <th>PM</th>
                            <td>
                                <input type="text" value={secondTableData.pm} onChange={(e) => handleInputChange("pm", e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th>연도</th>
                            <td>
                                <input type="text" value={secondTableData.year} onChange={(e) => handleInputChange("year", e.target.value)} />
                            </td>
                            <th>시작일</th>
                            <td>
                                <input type="text" value={secondTableData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} />
                            </td>
                            <th>종료일</th>
                            <td>
                                <input type="text" value={secondTableData.endtDate} onChange={(e) => handleInputChange("endtDate", e.target.value)} />
                            </td>
                            <th>상태</th>
                            <td>{getStateElement("working")}</td>
                        </tr>
                        <tr>
                            <th>기준 이익률</th>
                            <td>
                                <input type="text" value={secondTableData.margin} onChange={(e) => handleInputChange("margin", e.target.value)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <BusinessModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    refresh={fetchAllData}
                    clickData={modalItem}
                    urlName={urlName}
                    headers={headers}
                />
            )}
        </>
    );
};

export default Businesses;
