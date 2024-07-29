import React, { useContext, useEffect, useRef, useState } from "react";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PageContext } from "components/PageProvider";
import BasicInput from "components/input/BasicInput";
import BasicTextarea from "components/input/BasicTextarea";
import Percentage from "components/input/Percentage";
import BasicSelect from "components/input/BasicSelect";
import Number from "components/input/Number";
import URL from "constants/url";
import AuthorGroupModal from "./AuthorGroupModal";
import ModButton from "components/button/ModButton";
/* 추가, 수정 모달 */
export default function ViewModal(props) {
    const { width, height, list, onClose, resultData, title, initialData } = props;
    const {
        companyInfo,
        projectPdiNm,
        projectPgNm,
        emUserInfo,
        setCompanyInfo,
        setProjectPdiNm,
        setProjectPgNm,
        setEmUserInfo,
        authorGroupInfo,
        setAuthorGroupInfo,
    } = useContext(PageContext);

    const [data, setData] = useState(initialData?.[0] || {});
    const bodyRef = useRef(null);
    const [errorList, setErrorList] = useState({}); // 필수값 에러 메시지
    const [isOpenModalGroup, setIsOpenModalGroup] = useState(false); //권한그룹

    const sessionUser = sessionStorage.getItem("loginUser");

    const onClickLink = (e) => {
        e.preventDefault(); // 기본 동작 방지
        if (initialData.sgnType === "사전원가서") {
            openPopup(URL.PreCostDoc, { ...initialData, label: "사전원가서", sessionUserInfo: JSON.parse(sessionUser) });
        } else if (initialData.sgnType === "수주보고서") {
            openPopup(URL.PreCostDoc, { ...initialData, label: "수주보고서", sessionUserInfo: JSON.parse(sessionUser) });
        } else if (initialData.sgnType === "실행예산서") {
            openPopup(URL.ExecutionCostsDoc, { ...initialData, label: "실행예산서", sessionUserInfo: JSON.parse(sessionUser) });
        } else if (initialData.sgnType === "사후정산서") {
            openPopup(URL.PostCostsDoc, { ...initialData, label: "사후정산서", sessionUserInfo: JSON.parse(sessionUser) });
        } else if (initialData.sgnType === "완료보고서") {
            openPopup(URL.PostCostsDoc, { ...initialData, label: "완료보고서", sessionUserInfo: JSON.parse(sessionUser) });
        }
    };

    const openPopup = (targetUrl, data) => {
        const url = `${targetUrl}?data=${encodeURIComponent(JSON.stringify(data))}`;
        const width = 1400;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
        window.open(url, "newWindow", windowFeatures);
    };

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    useEffect(() => {
        //거래처
        if (Object.keys(companyInfo).length > 0) {
            setData((prevData) => {
                return { ...prevData, ...companyInfo };
            });
            setCompanyInfo({});
        }
    }, [companyInfo]);

    useEffect(() => {
        //품목
        if (Object.keys(projectPdiNm).length > 0) {
            setData((prevData) => {
                return { ...prevData, ...projectPdiNm };
            });
            setProjectPdiNm({});
        }
    }, [projectPdiNm]);

    useEffect(() => {
        // 품목그룹
        if (Object.keys(projectPgNm).length > 0) {
            setData((prevData) => {
                return { ...prevData, ...projectPgNm };
            });
            setProjectPgNm({});
        }
    }, [projectPgNm]);

    useEffect(() => {
        //업무회원
        if (Object.keys(emUserInfo).length > 0) {
            setData((prevData) => {
                return { ...prevData, ...emUserInfo };
            });
            setEmUserInfo({});
        }
    }, [emUserInfo]);

    useEffect(() => {
        //권한그룹
        if (Object.keys(authorGroupInfo).length > 0) {
            setData((prevData) => {
                return { ...prevData, ...authorGroupInfo };
            });
            setAuthorGroupInfo({});
        }
    }, [authorGroupInfo]);

    // 데이터 추가 버튼을 눌렀을 때 실행되는 함수
    const onClick = async (e) => {
        e.preventDefault();
        // 필수 필드가 비어있는지 확인
        const requiredColumns = list ? list.flatMap((column) => column.items.filter((item) => item.require).map((item) => ({ ...item }))) : [];
        const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);

        if (hasEmptyRequiredFields) {
            setErrorList((prevErrors) => {
                const newErrors = { ...prevErrors };
                requiredColumns.forEach((column) => {
                    if (!data[column.col]) {
                        newErrors[column.col] = true;
                    }
                });
                return newErrors;
            });
        } else {
            const mergedData = { ...initialData, ...data };
            console.log(mergedData);
            resultData(mergedData); //데이터 부모로 전송
            onClose();
        }
    };

    const inputChange = (e, type) => {
        const { value, name } = e.target;
        setData((prevData) => {
            return { ...prevData, [name]: value };
        });

        // 에러 메시지 상태 업데이트
        setErrorList((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));
    };

    const renderField = (item, index, data) => (
        <div className="row-group" key={index}>
            <div className="left">
                {item.require && <span className="burgundy">*</span>}
                <span>{item.header}</span>
            </div>
            <div className="right">
                {item.type === "input" ? (
                    <BasicInput item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : item.type === "desc" ? (
                    <BasicTextarea item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : item.type === "percent" ? (
                    <Percentage item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : item.type === "number" ? (
                    <Number item={item} onChange={(e) => inputChange(e, "number")} value={data?.[item.col] ? data[item.col].toLocaleString() : ""} />
                ) : item.type === "select" ? (
                    <BasicSelect item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : item.type === "alink" ? (
                    <ModButton label={initialData.sgnType + "(클릭)"} onClick={onClickLink} report={true} />
                ) : item.type === "radio" ? (
                    item.option &&
                    item.option.length > 0 && (
                        <div className="radio-container">
                            {item.option.map((op, idx) => (
                                <div key={idx} className="radio-group">
                                    <input type="radio" name={item.col} value={op.value} checked={data?.[item.col] === op.value} onChange={inputChange} />
                                    <label htmlFor={op.value}>{op.label}</label>
                                </div>
                            ))}
                        </div>
                    )
                ) : null}
                {errorList[item.col] && <span className="error">* 필수값을 입력하세요.</span>}
            </div>
        </div>
    );

    return (
        <article className="me-modal">
            <div className="me-modal-container" style={{ width, height }}>
                <div className="me-modal-inner">
                    <div className="me-modal-header">
                        <h4 className="header-title">{title}</h4>
                        <div className="header-close" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} className="button" size="lg" />
                        </div>
                    </div>

                    <form className="me-modal-body" ref={bodyRef}>
                        <div className="body-area">
                            {list &&
                                list.map((column, index) => (
                                    <div className="body-row" key={index}>
                                        {column.items.map((item, itemIndex) => renderField(item, itemIndex, data))}
                                    </div>
                                ))}
                        </div>
                    </form>

                    <div className="me-modal-footer mg-b-20">
                        <div className="table-buttons" style={{ justifyContent: "center" }}>
                            <button className="table-btn table-btn-default" data-dismiss="modal" style={{ width: "100%" }} onClick={() => onClose()}>
                                취소
                            </button>
                            {title.includes("추가") ? (
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    추가
                                </button>
                            ) : (
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    결재
                                </button>
                            )}
                        </div>
                    </div>
                    <AuthorGroupModal width={600} height={500} title="권한그룹 목록" isOpen={isOpenModalGroup} onClose={() => setIsOpenModalGroup(false)} />
                </div>
            </div>
        </article>
    );
}
