import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한국어 로케일 설정
import { v4 as uuidv4 } from "uuid";

export default function MonthPicker({ name, value, onClick }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        //다른 곳 클릭 시 닫음
        const handleOutsideClick = (event) => {
            const datePickerContainer = document.querySelector(".react-datepicker__container");
            if (datePickerContainer && !datePickerContainer.contains(event.target)) {
                setIsVisible(true);
            }
        };

        const handleKeyPress = (event) => {
            if (event.keyCode === 27) {
                setIsVisible(true);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    const dateChange = (data) => {
        onClick(formatChange(data));
        setIsVisible(true);
    };

    const formatChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const formatted = `${year}-${month}`;
        return formatted;
    };

    return (
        <DatePicker
            autoComplete="off"
            id={uuidv4()}
            className="basic-input"
            name={name}
            value={value || ""}
            locale={ko}
            dateFormat="yyyy-MM"
            onClick={() => setIsVisible(false)}
            onChange={dateChange}
            showMonthYearPicker
            calendarVisible={isVisible}
        />
    );
}
