import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "react-calendar/dist/Calendar.css";
import MakeItemField from "utils/MakeItemField";
import BasicButton from "./button/BasicButton";
import HideCard from "./HideCard";

/* 데이터 테이블 검색 */
export default function SearchList({ conditionList, onSearch }) {
    const [searchData, setSearchData] = useState({});
    const [initialData, setInitialData] = useState({});


    //상태 첫번째 값을 검색어에 넣어주는 함수
    function extractOptionValue(data) {
        for (const item of data) {
            if (item.option) {
                const firstValue = item.option[0].value;
                return { col: item.col, value: firstValue };
            }
        }
        return null;
    }
    const optionData = extractOptionValue(conditionList);
    useEffect(() => {
        if (optionData) {
            setSearchData({ [optionData.col]: optionData.value });
        }
    }, []);

    /* 검색 이벤트 */
    const searchClick = () => {
        Object.keys(searchData).forEach((key) => {
            if (searchData[key] === "") {
                delete searchData[key]; //빈값 제외
            }
        });
        onSearch && onSearch(searchData);
        // setInitialData({}); //초기화
    };

    /* 검색 데이터 */
    const onChange = (value) => {
        setSearchData((prevData) => {
            return { ...prevData, ...value };
        });
    };

    return (
        <>
            <HideCard title="검색 조건" color="back-lightgreen" className="mg-b-40" style={{ position: "relative", zIndex: "999" }}>
                <div className="flex-container">
                    {conditionList.map((param, idx) => (
                        <div key={idx} className="flex-group mg-b-10">
                            <div className="flex-label">
                                <label>{param.title}</label>
                            </div>
                            <div className="flex-input">
                                <MakeItemField item={param} resultData={onChange} initialData={initialData}/>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "right" }}>
                    <button className="table-btn search-btn" onClick={searchClick}>
                        검색
                    </button>
                </div>
            </HideCard>
        </>
    );
}
