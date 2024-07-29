import React, { useEffect, useState } from "react";

/* 숫자 입력시 컴마 표현 */
export default function Number({ onChange, value, style }) {
    /*
     *  부모 예시
     *  <FormattedInput value={value} onChange={inputChange} />
     */

    const [viewValue, setViewValue] = useState("");

    useEffect(() => {
        const stringValue = String(value);
        const formattedValue = stringValue.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setViewValue(formattedValue); // 콤마로 표시되는 값
    }, [value]);

    const inputChange = (e) => {
        const { value } = e.target;
        const stringValue = String(value);
        const formattedValue = stringValue.replace(/,/g, ""); // 콤마를 제거한 숫자 값
        onChange(formattedValue);
    };

    return (
        <div className="formatted-input">
            <input
                autoComplete="off"
                type="text"
                value={value} // 실제 입력된 숫자 값을 표시
                onChange={() => {}} // 입력된 값이 변경되지 않도록 빈 함수를 사용
                style={{ display: "none" }} // 화면 숨김
            />
            <input
                autoComplete="off"
                type="text"
                value={viewValue} // 콤마로 표시되는 값
                onChange={inputChange} // 부모 컴포넌트로 전달
                style={style}
            />
        </div>
    );
}
