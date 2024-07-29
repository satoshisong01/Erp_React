import React, { useState } from "react";
import "../../../../css/componentCss/CodeTableSearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function ProductPriceTableSearchBar({
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
                                검색어
                            </label>
                            <input
                                type="text"
                                name="searchKeyword"
                                id="searchKeyword"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <div className="box2">
                            <label
                                htmlFor="searchCondition"
                                className="box_search">
                                검색조건
                            </label>
                            {urlName === "productInfo" && (
                                <select
                                    id="searchCondition"
                                    name="searchCondition"
                                    className="form-control"
                                    onChange={(e) =>
                                        setInputLv(e.target.value)
                                    }>
                                    <option value="0">전체</option>
                                    <option value="1">분류코드</option>
                                    <option value="2">분류코드명</option>
                                    <option value="3">분류코드 설명</option>
                                </select>
                            )}
                            {urlName === "groupCode" && (
                                <select
                                    id="searchCondition"
                                    name="searchCondition"
                                    className="form-control"
                                    onChange={(e) =>
                                        setInputLv(e.target.value)
                                    }>
                                    <option value="0">전체</option>
                                    <option value="1">그룹코드</option>
                                    <option value="2">그룹코드명</option>
                                    <option value="3">그룹코드 설명</option>
                                </select>
                            )}
                            {urlName === "detailCode" && (
                                <select
                                    id="searchCondition"
                                    name="searchCondition"
                                    className="form-control"
                                    onChange={(e) =>
                                        setInputLv(e.target.value)
                                    }>
                                    <option value="0">전체</option>
                                    <option value="1">상세코드</option>
                                    <option value="2">상세코드명</option>
                                    <option value="3">상세코드 설명</option>
                                </select>
                            )}
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
                                        삭제된 항목
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
                                        삭제되지 않은 항목
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
