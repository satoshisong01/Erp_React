import React, { useState, useEffect, useRef } from "react";
import "../../../css/componentCss/CodeTableSearchBar.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function SalesCostTableSearchBar({
    searchBtn,
    onSearch,
    onSearchLv,
    onOption,
    refresh,
    urlName,
}) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const inputRef = useRef(null);
    const inputRef2 = useRef(null);

    const [formattedDate, setFormattedDate] = useState("");
    const [formattedDate2, setFormattedDate2] = useState("");
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [isCalendarVisible2, setCalendarVisible2] = useState(false);

    const handleInputClick = () => {
        setCalendarVisible(true);
    };

    const handleInputClick2 = () => {
        setCalendarVisible2(true);
    };

    const handleOutsideClick = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setCalendarVisible(false);
        }
    };

    const handleOutsideClick2 = (event) => {
        if (inputRef2.current && !inputRef2.current.contains(event.target)) {
            setCalendarVisible2(false);
        }
    };

    const handleDateClick = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}${month}${day}`;

        setSelectedDate(date);
        setFormattedDate(formatted);
        setCalendarVisible(false);
    };

    const handleDateClick2 = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}${month}${day}`;

        setSelectedDate2(date);
        setFormattedDate2(formatted);
        setCalendarVisible2(false);
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick2);
        return () => {
            document.removeEventListener("click", handleOutsideClick2);
        };
    }, []);

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
                    <div className="boxDates">
                        <div className="box2 box2-1">
                            <label
                                htmlFor="searchKeyword"
                                className="box_search">
                                프로젝트명
                            </label>
                            <input
                                type="text"
                                name="searchKeyword"
                                id="searchKeyword"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <div className="box3">
                            <div className="box3-1">
                                <label
                                    htmlFor="searchKeyword"
                                    className="box_search">
                                    기간검색
                                </label>
                                <select id="searchKeyword">
                                    <option>시작일</option>
                                </select>
                            </div>
                            <div className="box3-0">
                                <div className="box3-1 boxDate">
                                    <input
                                        type="text"
                                        id="searchKeyword"
                                        value={formattedDate}
                                        onClick={handleInputClick}
                                        readOnly
                                        ref={inputRef}
                                    />
                                    {isCalendarVisible && (
                                        <div className="boxCalendar">
                                            <Calendar
                                                onClickDay={handleDateClick}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="box3-1">~</div>
                                <div className="box3-1 boxDate">
                                    <input
                                        type="text"
                                        id="searchKeyword"
                                        value={formattedDate2}
                                        onClick={handleInputClick2}
                                        readOnly
                                        ref={inputRef2}
                                    />
                                    {isCalendarVisible2 && (
                                        <div className="boxCalendar">
                                            <Calendar
                                                onClickDay={handleDateClick2}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="boxDates">
                        <div className="box2 box2-1">
                            <label
                                htmlFor="searchKeyword"
                                className="box_search">
                                &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;비고
                            </label>
                            <input
                                type="text"
                                name="searchKeyword"
                                id="searchKeyword"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <div className="box3">
                            <div className="box3-1"></div>
                            <div className="box3-0">
                                <div className="box3-1"></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
