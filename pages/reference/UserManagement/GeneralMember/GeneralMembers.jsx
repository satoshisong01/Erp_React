import React, { useEffect, useRef, useState } from "react";
import "../../../../css/ContentMain.css";
import { Tooltip } from "react-tooltip";
import MouseDc from "components/MouseDc";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import GeneralMemberModalPage from "./GeneralMemberModalPage";
import SearchList from "components/SearchList";
import DataTableButton from "components/button/DataTableButton";
import { axiosFetch } from "api/axiosFetch";

/* 일반회원관리 */
const GeneralMembers = () => {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창
    const [check, setCheck] = useState(false); //체크 확인
    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [searchedData, setSearchedData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (!isSearching && searchedData.length > 0) {
            if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
        }
    }, [searchedData, isSearching]);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const urlName = "generalMember";

    const headers = {
        Authorization: localStorage.jToken,
    };

    const conditionList = [
        {
            title: "분류코드",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "분류코드명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "분류코드설명",
            colName: "clCodeDc", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "이름",
            colName: "name",
            type: "select",
            option: [{ value: "다섯글자의옵션1" }, { value: "다섯글자의옵션2" }],
            searchLevel: "3",
        },
    ];

    //새로고침 클릭 핸들러
    const refreshClick = async () => {
        if (dataTableRef.current && $.fn.DataTable.isDataTable(dataTableRef.current)) {
            $(dataTableRef.current).DataTable().destroy();
        }
        setIsSearching(!isSearching); // 로딩 상태 활성화
        await fetchAllData(urlName);
    };

    const excelClick = () => {
        /* 엑셀기능구현 */
    };
    const copyClick = () => {
        /* 복사기능구현 */
    };
    const printClick = () => {
        /* 프린트기능구현 */
    };
    const deleteClick = () => {
        /* 삭제기능구현 */
    };
    const addClick = () => {
        /* 추가기능구현 */
    };

    const fetchAllData = async () => {
        const url = `http://192.168.0.113:8080/api/baseInfrm/member/generalMember/listAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);

        if (resultData) {
            setIsSearching(false);
            setSearchedData(resultData);
        } else {
            setIsSearching(true);
        }
    };

    //검색 키워드값, 검색 레벨, 라디오옵션
    const searchClick = async (dataToSend) => {
        const requestData = {
            searchKeyword: dataToSend.searchKeyword,
            searchCondition: dataToSend.searchCondition,
            useAt: dataToSend.radioOption,
        };
        console.log("⭕ 검색목록: ", requestData);

        const url = `/api/baseInfrm/member/generalMember/listAll.do`;
        const resultData = await axiosFetch(url, requestData);

        if (resultData) {
            setSearchedData(resultData);
        }
    };

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

    // 모달 클릭 핸들러(수정 모달창)
    const handleModalClick = (e, item) => {
        setModalItem(item);
        setModalOpen(true);
    };

    return (
        <>
            <div id="content">
                <div className="SearchDiv">
                    <SearchList onSearch={searchClick} refresh={refreshClick} conditionList={conditionList} />
                    <DataTableButton deleteClick={deleteClick} addClick={addClick} />
                </div>
                <div className="row">
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
                                                        "ID",
                                                        "이름",
                                                        "비밀번호",
                                                        "주소",
                                                        "전화번호",
                                                        "이메일",
                                                        "가입일",
                                                        //"권한",
                                                        "작성일",
                                                        "작성자",
                                                        "수정일",
                                                        "수정자",
                                                    ].map((item, index) => (
                                                        <th key={index}>{item}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {searchedData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedData.some((selectedItem) => selectedItem.uniqId === item.uniqId)}
                                                                onChange={(e) => handleItemCheck(item, e)}
                                                            />
                                                        </td>
                                                        {[
                                                            "mbId",
                                                            "mbNm",
                                                            "password",
                                                            "address",
                                                            "mbTelNm",
                                                            "mbEmAdr",
                                                            "sbsDt",
                                                            "createDate",
                                                            "createIdBy",
                                                            "lastModifyDate",
                                                            "lastModifiedUserName",
                                                        ].map((key) => (
                                                            <td
                                                                onMouseEnter={handleMouseEnter}
                                                                onMouseLeave={handleMouseLeave}
                                                                className="tableWidth
                                                                        tdStyle mouseText"
                                                                onDoubleClick={(e) => handleModalClick(e, item)}
                                                                key={key}>
                                                                <MouseDc showTooltip={showTooltip} />
                                                                <Tooltip />
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
                <div>{/*<UserManagementInfo detailData={detailData} />*/}</div>
            </div>

            {modalOpen && (
                <GeneralMemberModalPage
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

export default GeneralMembers;
