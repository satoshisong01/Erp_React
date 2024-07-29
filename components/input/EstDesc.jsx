import React, { useEffect, useState } from "react";

export default function EstDesc({ onChange, value, style }) {
    const [viewValue, setViewValue] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [textareaValue, setTextareaValue] = useState("");
    const [prevValue, setPrevValue] = useState(""); // 이전 값 저장

    useEffect(() => {
        const stringValue = String(value);
        setViewValue(stringValue);
    }, [value]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                // ESC 키 코드는 27입니다.
                setShowPopup(false);
            }
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const inputChange = (e) => {
        const { value } = e.target;
        const stringValue = String(value);
        onChange(stringValue);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
        // 팝업이 열리면 현재 값을 textarea에 설정
        if (!showPopup) {
            // viewValue를 textareaValue로 변환 시, \n을 실제 줄바꿈으로 처리
            setTextareaValue(value.replace(/\\n/g, "\n"));
            setPrevValue(value); // 현재 값을 이전 값으로 저장
        }
    };

    const handleTextareaChange = (e) => {
        setTextareaValue(e.target.value);
    };

    const handleConfirm = () => {
        const formattedValue = textareaValue.replace(/\n/g, "\\n");
        setViewValue(formattedValue); // 확인 버튼 클릭 시 입력한 값 적용
        onChange(formattedValue);
        setShowPopup(false);
    };

    const handleCancel = () => {
        setTextareaValue(prevValue); // 취소 버튼 클릭 시 이전 값으로 복원
        setShowPopup(false);
    };

    return (
        <div className="formatted-input">
            <input autoComplete="off" type="text" value={value} onChange={inputChange} style={{ display: "none" }} />
            <input autoComplete="off" type="text" value={viewValue} onChange={inputChange} style={style} onClick={togglePopup} />
            {showPopup && (
                <div className="popup" style={{ position: "absolute", zIndex: "999", width: "500px", height: "300px", top: "30%", left: "35%" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <textarea value={textareaValue} onChange={handleTextareaChange} style={{ height: "275px", caretColor: "black" }} />
                        <div style={{ display: "flex" }}>
                            <button style={{ width: "100%", border: "solid 1px gray" }} onClick={handleConfirm}>
                                확인
                            </button>
                            <button style={{ width: "100%", border: "solid 1px gray" }} onClick={handleCancel}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
