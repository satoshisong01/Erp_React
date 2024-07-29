import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/* 데이터 테이블 검색 */
export default function SearchListpgNm({ conditionList, onSearch }) {
    const [fieldList, setFieldList] = useState([]);
    const [searchData, setSearchData] = useState({});
    const [radioOption, setRadioOption] = useState("Y");

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedDate2, setFormattedDate2] = useState("");
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [isCalendarVisible2, setCalendarVisible2] = useState(false);

    const inputRef = useRef(null);
    const inputRef2 = useRef(null);

    //--------------------------------------------

    const handleInputClick = () => {
        setCalendarVisible(true);
    };

    const handleInputClick2 = () => {
        setCalendarVisible2(true);
    };

    const handleDateChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;

        return formatted;
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setFormattedDate(handleDateChange(date));
        setCalendarVisible(false);
    };

    const handleDateClick2 = (date) => {
        setSelectedDate2(date);
        setFormattedDate2(handleDateChange(date));
        setCalendarVisible2(false);
    };

    const handleOutsideClick = (event) => {
        if (
            inputRef.current &&
            !inputRef.current.contains(event.target) &&
            !event.target.classList.contains("react-calendar") &&
            !event.target.closest(".boxCalendar")
        ) {
            setCalendarVisible(false);
        }
    };

    const handleOutsideClick2 = (event) => {
        if (
            inputRef2.current &&
            !inputRef2.current.contains(event.target) &&
            !event.target.classList.contains("react-calendar") &&
            !event.target.closest(".boxCalendar")
        ) {
            setCalendarVisible2(false);
        }
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

    //---------------------------------------------

    useEffect(() => {
        setFieldList(conditionList);
    }, [conditionList]);

    /* radio click */
    const radioClick = (value) => {
        setRadioOption(value);
    };

    /* 초기화구현 */
    const resetClick = () => {
        setSearchData({});
        setFormattedDate("");
        setFormattedDate2("");
    };

    /* 검색 이벤트 */
    const searchClick = (e) => {
        const keyArr = Object.keys(searchData); //컬럼명
        let searchLevel = "1";

        console.log(keyArr, "키키값");
        console.log(fieldList, "나오는값을보자");
        console.log(searchData, "나오는값을보자");

        if (keyArr.length === 1) {
            const fieldName = keyArr[0];
            const field = fieldList.find((item) => item.colName === fieldName);
            if (field) {
                searchLevel = field.searchLevel;
            }
            console.log(field, "이거잘나옴?");
        }
        console.log(searchLevel);

        const dataToSend = {
            searchKeyword: formattedDate
                ? `${formattedDate} , ${formattedDate2}`
                : "",
            ...searchData,
            //createDate: formattedDate
            //? `${formattedDate} , ${formattedDate2}`
            //: "",
            searchCondition: 1,
            radioOption: radioOption,
        };
        console.log(dataToSend, "555555");
        onSearch(dataToSend);
    };

    /* 검색 데이터 */
    const onChange = (e) => {
        const { name, value } = e.target;
        setSearchData((prevData) => {
            const newData = { ...prevData, [name]: value };

            console.log(newData, "뉴데이터");
            // 빈 값을 가진 객체 제거
            Object.keys(newData).forEach((key) => {
                if (newData[key] === "") {
                    delete newData[key];
                }
            });

            return newData;
        });
    };

    /* 검색 화면구현 */
    const renderField = (param) => {
        if (param.type === "input") {
            return (
                <input
                    type="text"
                    name={param.colName}
                    value={searchData[param.colName] || ""}
                    onChange={onChange}
                    placeholder="검색할 품목그룹명을 입력해 주세요"
                    className="form-control flex-item"
                    style={{width:"300px"}}
                />
            );
        } else if (param.type === "select") {
            return (
                <select
                    name={param.colName}
                    value={searchData[param.colName] || ""}
                    onChange={onChange}
                    className="form-control flex-item"
                    key={searchData[param.colName]}>
                    <option value=""> 선택없음 </option>
                    {param.option.map((op) => (
                        <option key={op.value} value={op.value}>
                            {op.value}
                        </option>
                    ))}
                </select>
            );
        } else if (param.type === "datepicker") {
            return (
                <div className="box3-0">
                    <div className="box3-1 boxDate">
                        <input
                            className="form-control flex-item"
                            type="text"
                            id="searchKeyword"
                            value={formattedDate}
                            onClick={handleInputClick}
                            readOnly
                            ref={inputRef}
                            onChange={() => {
                                const formatted =
                                    handleDateChange(selectedDate);
                                setFormattedDate2(formatted);
                            }}
                        />
                        {isCalendarVisible && (
                            <div className="boxCalendar">
                                <Calendar onClickDay={handleDateClick} />
                            </div>
                        )}
                    </div>
                    <div className="box3-1 range">~</div>
                    <div className="box3-1 boxDate">
                        <input
                            className="form-control flex-item"
                            type="text"
                            id="searchKeyword"
                            value={formattedDate2}
                            onClick={handleInputClick2}
                            readOnly
                            ref={inputRef2}
                            onChange={() => {
                                const formatted =
                                    handleDateChange(selectedDate2);
                                setFormattedDate(formatted);
                            }}
                        />
                        {isCalendarVisible2 && (
                            <div className="boxCalendar">
                                <Calendar onClickDay={handleDateClick2} />
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
                {/*<div className="radio-group">
                    <input
                        type="radio"
                        value="Y"
                        checked={radioOption === "Y"}
                        onChange={() => {
                            radioClick("Y");
                        }}
                    />
                    <label>미삭제 항목</label>
                    <input
                        type="radio"
                        value="N"
                        checked={radioOption === "N"}
                        onChange={() => {
                            radioClick("N");
                        }}
                    />
                    <label>삭제 항목</label>
                </div>*/}
                <div style={{display:"flex", width:"100%",justifyContent:"space-between",marginTop:"10px"}}>
                    <div className="flex-container" style={{margin:"10px"}}>
                    {fieldList.map((param) => (
                        <div key={param.colName} className="flex-group mg-l-15">
                            <div className="flex-label">
                                <label>{param.title}</label>
                            </div>
                            <div
                            style={{display:"flex", alignItems:"center",justifyContent:"center"}}
                            className="flex-input">{renderField(param)}</div>
                        </div>
                    ))}
                </div>
                    <div>
                        <button
                            className="btn btn-primary clearIcon"
                            onClick={resetClick}>
                            초기화
                        </button>
                        <button
                            className="btn btn-primary searchIcon"
                            onClick={searchClick}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </div>
            
        </>
    );
}
