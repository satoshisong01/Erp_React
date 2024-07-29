import React, { useState } from "react";
import "../PersonalInfo/PersonalInfoUi.css";

export default function PersonalInfoUi() {
    const [registrationNumber, setRegistrationNumber] = useState(""); //주민등록번호
    const [birthDate, setBirthDate] = useState(""); //생년월일
    const [maritalStatus, setMaritalStatus] = useState("미혼"); //결혼유무
    const [nationality, setNationality] = useState("내국인");

    //주민등록번호 입력값 받아오기
    const handleChange = (event) => {
        const { value } = event.target;
        setRegistrationNumber(value);

        if (value.length === 13) {
            const year = value.substr(0, 2);
            const month = value.substr(2, 2);
            const day = value.substr(4, 2);
            setBirthDate(`19${year}.${month}.${day}`);
        } else {
            setBirthDate("");
        }
    };

    //주민번호 13자리 검증
    const handleConfirmationClick = () => {
        if (registrationNumber.length !== 13) {
            alert("주민등록번호를 다시 입력해주세요.");
            setRegistrationNumber("");
        } else {
            alert("주민등록번호가 확인되었습니다.");
            alert(registrationNumber);
        }
    };

    //뒷자리 마킹
    const getMaskedRegistrationNumber = () => {
        const firstDigit = registrationNumber.substr(7, 1);
        const maskedDigits = registrationNumber.substr(8).replace(/\d/g, "*");
        return `${registrationNumber.substr(
            0,
            7
        )}${firstDigit}-${maskedDigits}`;
    };

    //결혼유무 체크
    const handleMaritalStatusChange = (event) => {
        setMaritalStatus(event.target.value);
    };

    //내외국인 체크
    const handleNationalityChange = (event) => {
        setNationality(event.target.value);
    };

    return (
        <div>
            <div>사진</div>
            <div>
                큰정보박스
                <div>
                    왼쪽정보박스
                    <div>
                        <span>사원번호</span>
                        <input type="text" value={"230411"} />
                    </div>
                    <div>
                        <span>영문성명</span>
                        <input type="text" value={"Lee Joobeen"} />
                    </div>
                    <div>
                        <span>주민등록번호</span>
                        <label htmlFor="registrationNumber">
                            주민등록번호:
                            <input
                                type="text"
                                id="registrationNumber"
                                value={getMaskedRegistrationNumber()}
                                onChange={handleChange}
                            />
                        </label>
                        <button onClick={handleConfirmationClick}>
                            확인/수정
                        </button>
                    </div>
                    <div>
                        <span>생년월일</span>
                        <label htmlFor="birthDate">
                            생년월일:
                            <input
                                type="text"
                                id="birthDate"
                                value={birthDate}
                                readOnly
                            />
                        </label>
                    </div>
                    <div>
                        <span>결혼유무</span>
                        <label>
                            <input
                                type="radio"
                                value="기혼"
                                checked={maritalStatus === "기혼"}
                                onChange={handleMaritalStatusChange}
                            />
                            기혼
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="미혼"
                                checked={maritalStatus === "미혼"}
                                onChange={handleMaritalStatusChange}
                            />
                            미혼
                        </label>
                    </div>
                    <div>
                        <span className="required">*</span>
                        <span>내외국인</span>
                        <label>
                            <input
                                type="radio"
                                value="내국인"
                                checked={nationality === "내국인"}
                                onChange={handleNationalityChange}
                            />
                            내국인
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="외국인"
                                checked={nationality === "외국인"}
                                onChange={handleNationalityChange}
                            />
                            외국인
                        </label>
                    </div>
                </div>
                <div>오른쪽정보박스</div>
            </div>
        </div>
    );
}
