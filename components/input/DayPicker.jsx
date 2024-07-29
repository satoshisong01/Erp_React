import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";

export default function DayPicker({ name, value, onClick }) {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const datePickerRef = useRef(null);
    const calendarRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (event.target.classList.contains("react-calendar") && !datePickerRef.current.contains(event.target)) {
            setIsCalendarVisible(false);
        }
    };

    const handleEscPress = (event) => {
        if (event.keyCode === 27) {
            setIsCalendarVisible(false);
        }
    };

    useEffect(() => {
        // 다른 곳 클릭 시 닫음
        document.addEventListener("click", handleOutsideClick);
        document.addEventListener("keydown", handleEscPress);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("keydown", handleEscPress);
        };
    }, []);

    const onClickDay = (data) => {
        onClick(formatChange(data));
        setIsCalendarVisible(false);
    };

    const formatChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;
        return formatted;
    };

    return (
        <div ref={datePickerRef}>
            <input
                autoComplete="off"
                id={uuidv4()}
                type="text"
                name={name}
                value={value || ""}
                onClick={() => setIsCalendarVisible(true)}
                readOnly
                className="basic-input"
            />

            {isCalendarVisible && (
                <div ref={calendarRef} id={uuidv4()}>
                    <Calendar onClickDay={(data) => onClickDay(data)} />
                </div>
            )}
        </div>
    );
}
