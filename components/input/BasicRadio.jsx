import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* radio 기본 CSS */
export default function BasicRadio({ item, onChange, onClick, value, readOnly, disabled }) {
    const radioList = item.option && item.option.length > 0 ? item.option : [];
    
    // useEffect(() => {
    //     console.log("❤️BasicRadio - radioList: ", radioList);
    // }, [radioList])
    
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <>
            {radioList.map((op) => (
                <input
                    key={uuidv4()} // 각 요소에 고유한 키 추가
                    id={uuidv4()}
                    className="basic-input"
                    type="radio"
                    // name={op.label || ""}
                    // checked={selectedOption === value}
                    onChange={onChange && ((e) => onChange(e))}
                    // disabled={disabled || false}
                />
            ))}
        </>
    );
}
