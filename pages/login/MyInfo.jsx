// SignUpForm.jsx

import React, { useEffect, useState } from "react";
import "./MyInfo.css";
import AddButton from "components/button/AddButton";
import BasicButton from "components/button/BasicButton";
import { axiosUpdate } from "api/axiosFetch";

const MyInfo = () => {
    const [formData, setFormData] = useState({
        empId: "",
        empNm: "",
        uniqId: "",
    });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter).data;
        setFormData({
            empId: data.id,
            empNm: data.name,
            uniqId: data.uniqId,
        });
    }, []);

    function getQueryParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultData = await axiosUpdate("/api/baseInfrm/member/employMember/edit.do", formData);
        if (resultData) {
            alert("값을 변경했습니다.");
        } else if (!resultData) {
            alert("수정 실패");
        }
    };

    const close = () => {
        window.close();
    };

    const changePassword = () => {
        setShowChangePassword(true);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === "newPassword") {
            setNewPassword(value.replace(/[ \t\n\r]+/g, ''));
        } else if (name === "confirmPassword") {
            setConfirmPassword(value.replace(/[ \t\n\r]+/g, ''));
        }
    };

    const handlePasswordSubmit = () => {
        // 비밀번호 일치 여부 확인
        const match = newPassword !== "" && newPassword === confirmPassword;
        setPasswordsMatch(match);

        if (match) {
            // 비밀번호 변경 로직 추가
            setFormData((prevData) => ({
                ...prevData,
                password: newPassword,
            }));
            setShowChangePassword(false);
            // 비밀번호 변경 후 newPassword와 confirmPassword 초기화
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    return (
        <div className="sign-up-form">
            <h3 style={{ textAlign: "center" }}>나의 정보</h3>
            <form onSubmit={handleSubmit}>
                <div className="content">
                    <label htmlFor="id">
                        <span className="cherry">* </span>
                        아이디:
                    </label>
                    <input type="text" id="id" name="empId" value={formData.empId} onChange={handleChange} required disabled/>

                    <label htmlFor="name">
                        <span className="cherry">* </span>
                        이름:
                    </label>
                    <input type="text" id="name" name="empNm" value={formData.empNm} onChange={handleChange} required/>
                    {!showChangePassword && (
                        <>
                            <label>비밀번호:</label>
                            <BasicButton label="비밀번호 변경" onClick={changePassword} />
                        </>
                    )}
                    {showChangePassword && (
                        <>
                            <label htmlFor="newPassword">
                                <span className="cherry">* </span>
                                새로운 비밀번호:
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="띄어쓰기는 입력되지 않습니다."
                            />

                            <label htmlFor="confirmPassword">
                                <span className="cherry">* </span>
                                비밀번호 확인:
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="띄어쓰기는 입력되지 않습니다."
                            />
                            {!passwordsMatch && (
                                <p className="cherry">비밀번호가 일치하지 않습니다.</p>
                            )}
                            <button className="btn back-cherry"  onClick={handlePasswordSubmit} style={{marginTop: 10}}>
                                비밀번호 일치
                            </button>
                        </>
                    )}
                </div>

                <div className="table-buttons mg-t-20">
                    <AddButton type="submit" label="수정"/>
                    <BasicButton label="닫기" onClick={close} />
                </div>
            </form>
        </div>
    );
};

export default MyInfo;
