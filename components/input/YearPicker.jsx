import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한국어 로케일 설정
import { v4 as uuidv4 } from "uuid";

export default function YearPicker({ name, value, onClick }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
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
        const formatted = `${year}`; // String만 가능
        return formatted;
    };

    return (
        <DatePicker
            id={uuidv4()}
            className="basic-input"
            name={name}
            value={value || ""}
            locale={ko}
            dateFormat="yyyy"
            onClick={() => setIsVisible(false)}
            onChange={dateChange}
            showYearPicker
            calendarVisible={isVisible}
        />
    );
}
