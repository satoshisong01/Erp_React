import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import * as EgovNet from 'api/egovFetch';

import URL from "constants/url";
import CODE from "constants/code";
import ReferenceInfo from "components/DataTable/function/ReferenceInfo";

function EgovLoginContent(props) {
    const navigate = useNavigate();
    const location = useLocation();
    console.log("EgovLoginContent [location] : ", location);

    const [userInfo, setUserInfo] = useState({ id: "", pw: "default" });
    const [loginVO, setLoginVO] = useState({});
    const [saveIDFlag, setSaveIDFlag] = useState(false); //true면 체크박스에 체크됨
    const checkRef = useRef(); //id 저장?

    const KEY_ID = "KEY_ID";
    const KEY_SAVE_ID_FLAG = "KEY_SAVE_ID_FLAG";

    const handleSaveIDFlag = () => {
        //아이디저장 함수
        localStorage.setItem(KEY_SAVE_ID_FLAG, !saveIDFlag);
        setSaveIDFlag(!saveIDFlag);
    };

    let idFlag;
    try {
        idFlag = JSON.parse(localStorage.getItem(KEY_SAVE_ID_FLAG));
    } catch (err) {
        idFlag = null;
    }

    useEffect(() => {
        //저장된 아이디 있는지 판단
        if (idFlag === null) {
            setSaveIDFlag(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            idFlag = false;
        }
        if (idFlag !== null) setSaveIDFlag(idFlag);
        if (idFlag === false) {
            localStorage.setItem(KEY_ID, "");
            checkRef.current.className = "f_chk";
        } else {
            checkRef.current.className = "f_chk on";
        }
        let data = localStorage.getItem(KEY_ID);
        if (data !== null) setUserInfo({ ...userInfo, id: data });
    }, [idFlag]);

    const submitFormHandler = (e) => {
        //로그인
        e.preventDefault();

        console.log("EgovLoginContent submitFormHandler()");

        const loginUrl = "/api/actionLoginJWT.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userInfo),
        };

        //EgovNet.requestFetch 였었는데 requestOptions 추가되니까 error 떠서 그냥 fetch로 함.
        fetch(loginUrl, requestOptions)
            .then((res) => res.json())
            .then((resp) => {
                console.log("⭕ login 응답 : ", resp);
                let resultVO = resp.userInfo;
                let jToken = resp?.jToken;
                let uniqId = resp.userInfo.uniqId;
                let id = resp.userInfo.id;

                localStorage.setItem("jToken", jToken);
                localStorage.setItem("uniqId", uniqId);
                localStorage.setItem("id", id);

                if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                    setLoginVO(resultVO);
                    sessionStorage.setItem("loginUser", JSON.stringify(resultVO)); //resp에 없는데..
                    props.onChangeLogin(resultVO);
                    if (saveIDFlag) localStorage.setItem(KEY_ID, resultVO?.id);
                    navigate(URL.MAIN);
                    // PC와 Mobile 열린메뉴 닫기
                    document.querySelector(".all_menu.WEB").classList.add("closed");
                    // document.querySelector(".btnAllMenu").classList.remove("active");
                    // document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
                    // document.querySelector(".all_menu.Mobile").classList.add("closed");
                } else {
                    alert("로그인 실패");
                }
            })
            .catch((error) => {
                console.error("login error!", error);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            submitFormHandler(e);
        }
    };

    const handleIdChange = (e) => {
        const value = e.target.value.replace(/[ \t\n\r]+/g, ''); // 입력값에서 공백 제거
        console.log("아이디:", value);
        setUserInfo({ ...userInfo, id: value });
    };
    
    const handlePasswordChange = (e) => {
        const value = e.target.value.replace(/[ \t\n\r]+/g, ''); // 입력값에서 공백 제거
        console.log("패스워드:", value);
        setUserInfo({ ...userInfo, pw: value });
    };

    return (
        <div className="contents" id="contents">
            {/* <!-- 본문 --> */}
            <div className="Plogin mg-t-20">
                <h1>로그인</h1>
                {/* <p className="txt">
                    전자정부표준프레임워크 경량환경 홈페이지 로그인 페이지입니다.
                    <br />
                    로그인을 하시면 모든 서비스를 제한없이 이용하실 수 있습니다.
                </p> */}

                <div className="login_box" style={{ backgroundColor: "white" }}>
                    <form name="" method="" action="">
                        <fieldset>
                            <legend>로그인</legend>
                            <span className="group">
                                <input
                                    type="text"
                                    name=""
                                    title="아이디"
                                    placeholder="아이디"
                                    value={userInfo?.id}
                                    onChange={handleIdChange}
                                    onKeyDown={handleKeyPress}
                                />
                                <input
                                    type="password"
                                    name=""
                                    title="비밀번호"
                                    placeholder="비밀번호"
                                    onChange={handlePasswordChange}
                                    onKeyDown={handleKeyPress}
                                />
                            </span>
                            <div className="chk">
                                <label className="f_chk" htmlFor="saveid" ref={checkRef}>
                                    <input type="checkbox" name="" id="saveid" onChange={handleSaveIDFlag} checked={saveIDFlag} /> <em>ID저장</em>
                                </label>
                            </div>
                            <button type="button" onClick={submitFormHandler}>
                                <span>LOGIN</span>
                            </button>
                        </fieldset>
                    </form>
                </div>

                <ul className="list">
                    <li>비밀번호는 6~12자의 영문 대/소문자, 숫자, 특수문자를 혼합해서 사용하실 수 있습니다.</li>
                    <li>쉬운 비밀번호나 자주 쓰는 사이트의 비밀번호가 같을 경우, 도용되기 쉬우므로 주기적으로 변경하셔서 사용하는 것이 좋습니다.</li>
                </ul>
            </div>
            {/* <!--// 본문 --> */}
        </div>
    );
}

export default EgovLoginContent;
