import React, { useState } from "react";
import "../../../../css/componentCss/CodeTableSearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function DetailCodeTableSearchBar({
    onSearch,
    onSearchLv,
    onOption,
    refresh,
    urlName,
    searchBtn,
}) {
    const [inputValue, setInputValue] = useState("");
    const [inputLv, setInputLv] = useState("0");
    const [option, setOption] = useState("option2");

    //검색 인풋값 핸들러
    const handleSearchClick = () => {
        onSearch(inputValue);
    };

    //검색 레벨 핸들러
    const handleLvClick = () => {
        onSearchLv(inputLv);
    };

    //옵션 변경 시 핸들러
    const handleOption = () => {
        onOption(option);
    };

    //데이터 검색
    const handleSearch = (e) => {
        e.preventDefault();
        searchBtn();
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
                                onClick={() => {
                                    handleSearchClick();
                                    handleLvClick();
                                    handleOption();
                                }}
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
                                상세코드
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
                                상세코드명
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
                                작성자
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
                                수정자
                            </label>
                            <input
                                type="text"
                                name="searchKeyword"
                                id="searchKeyword"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="box">
                        <div className="box1">
                            <label
                                htmlFor="searchKeyword"
                                className="box_search">
                                정&emsp;&emsp;렬
                            </label>
                            <select id="searchKeyword">
                                <option>정렬</option>
                            </select>
                        </div>
                        <div className="box1" />
                        <div className="box1" />
                        <div className="box1" />
                    </div>
                </form>
            </div>
        </div>
    );
}
