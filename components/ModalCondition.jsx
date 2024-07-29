import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import MakeItemField from "utils/MakeItemField";
import RefreshButton from "./button/RefreshButton";

/* 모달 안에서의 검색 */
export default function ModalCondition({ conditionList, onSearch, refresh }) {
    const [searchData, setSearchData] = useState({});

    /* 검색 이벤트 */
    const searchClick = () => {
        Object.keys(searchData).forEach((key) => {
            if (searchData[key] === "") { 
                delete searchData[key]; //빈값 제외
            }
        });
        console.log("searchData:", searchData);
        onSearch && onSearch(searchData);
    };

    const onChange = (value) => {
        setSearchData((prevData) => {
            return { ...prevData, ...value };
        });
    };

    return (
        <>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%", margin: 0}}>
                <tbody>
                    {conditionList.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ border: "1px solid #dddddd" }} >
                        <td style={{ width: "35%", padding: "5px", textAlign: "center", fontWeight: "bold", backgroundColor: "#f2f2f2"}}>
                        {row.title}
                    </td>
                        <td style={{ padding: "5px", textAlign: "center" }}>
                            <MakeItemField item={row} resultData={onChange}/>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className="mg-t-10 mg-b-15" style={{display: 'flex', gap: 10, justifyContent: "space-between"}}>
                <button type="button" className="table-btn back-lightgreen" onClick={searchClick} style={{width: '100%'}}>검색</button>
                <RefreshButton onClick={() => refresh()} style={{width: '10%'}} color="back-lightgreen"/>
            </div>
        </>
    );
}
