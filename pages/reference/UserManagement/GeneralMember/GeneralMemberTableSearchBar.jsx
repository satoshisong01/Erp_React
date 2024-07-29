import React, { useState } from "react";
import "../../../../css/componentCss/CodeTableSearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function GeneralMemberTableSearchBar({
    searchBtn,
    onSearch,
    onSearchLv,
    onOption,
    refresh,
    urlName,
}) {
    const [inputValue, setInputValue] = useState("");
    const [inputLv, setInputLv] = useState("0");
    const [option, setOption] = useState("option2");

    const condition = [
        { text: '삭제 항목', type: 'input' }
]

    const searchBtnClick = () => {
        onSearch(inputValue); //검색 인풋값 핸들러
        onSearchLv(inputLv); //검색 레벨 핸들러
        onOption(option); //옵션 변경 시 핸들러
    }

    //데이터 검색
    const handleSearch = (e) => {
        e.preventDefault();
        searchBtn(); //부모의 handleSearchData() 발생 - 데이터 통신
    };

    // 초기화 버튼 클릭 시 핸들러 함수
    const handleResetClick = (e) => {
        e.preventDefault();
        setInputValue("");
        setInputLv("0");
        setOption("option2");
    };

    //const handleRefresh = () => {
    //    window.location.reload();
    //};

    return (
        <div style={{ height: "50px" }}>
            <div className="searchMain">
                <form name="searchForm" id="searchForm" onSubmit={handleSearch}>
                    <div className="topMenuBtn">
                        <div className="box">
                            <div className="radioBtn">
                                <label className="radioLabel">
                                    <input
                                        className="inputRadio"
                                        type="radio"
                                        value="option1"
                                        checked={option === "option1"}
                                        onChange={(e) =>
                                            setOption(e.target.value)
                                        }
                                    />
                                    삭제 항목
                                </label>
                                <label className="radioLabel">
                                    <input
                                        className="inputRadio"
                                        type="radio"
                                        value="option2"
                                        checked={option === "option2"}
                                        onChange={(e) =>
                                            setOption(e.target.value)
                                        }
                                    />
                                    미삭제 항목
                                </label>
                            </div>
                        </div>


                        <div className="buttonTool">
                            <button
                                className="btn btn-primary refreshIcon"
                                onClick={refresh}>
                                <FontAwesomeIcon icon={faArrowRotateRight} />
                            </button>
                            <button
                                className="btn btn-primary clearIcon"
                                onClick={handleResetClick}>
                                초기화
                            </button>
                            <button
                                onClick={searchBtnClick}
                                type="submit"
                                className="btn btn-primary searchIcon">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        </div>
                    </div>


                    {/*<div className="searchLine" />*/}
                    <div className="box">
                        <div className="box1">
                            <label
                                htmlFor="searchKeyword"
                                className="box_search">
                                ID
                            </label>
                            <input
                                type="text"
                                name="searchKeyword"
                                id="searchKeyword"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <div className="box1">
                            <label
                                htmlFor="searchKeyword"
                                className="box_search">
                                이름
                            </label>
                            <input
                                type="text"
                                name="searchKeyword"
                                id="searchKeyword"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <div className="box1">
                            <label
                                htmlFor="searchKeyword"
                                className="box_search">
                                권한
                            </label>
                            <input
                                type="text"
                                name="searchKeyword"
                                id="searchKeyword"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <div className="box1"></div>
                    </div>
                </form>
            </div>
        </div>
    );
}
