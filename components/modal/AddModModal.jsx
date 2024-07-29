import React, { useContext, useEffect, useRef, useState } from "react";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import MakeModalField from "utils/MakeModalField";
import { PageContext } from "components/PageProvider";
import ProjectModal from "./ProjectModal";
import CompanyModal from "./CompanyModal";
import ProductInfoModal from "./ProductInfoModal";
import ProductGroupModal from "./ProductGroupModal";
import EmployerInfoModal from "./EmployerInfoModal";
import BasicInput from "components/input/BasicInput";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
import YearPicker from "components/input/YearPicker";
import BasicTextarea from "components/input/BasicTextarea";
import Percentage from "components/input/Percentage";
import BasicSelect from "components/input/BasicSelect";
import Number from "components/input/Number";
import AuthorGroupModal from "./AuthorGroupModal";
/* 추가, 수정 모달 */
export default function AddModModal(props) {
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
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false); //거래처목록
    const [isOpenModalGroup, setIsOpenModalGroup] = useState(false); //권한그룹
    const [isOpenModalProject, setIsOpenModalProject] = useState(false); //프로젝트목록
    const [isOpenModalProductInfo, setIsOpenModalProductInfo] = useState(false); //품목정보목록
    const [isOpenModalProductGroup, setIsOpenModalProductGroup] = useState(false); //품목그룹목록
    const [isOpenModalEmployerInfo, setIsOpenModalEmployerInfo] = useState(false); //업무회원목록
    const [colName, setColName] = useState({ name: "", id: "" });
    const [dateValue, setDateValue] = useState("");

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
        console.log("data:", data);
    }, [data])


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
            console.log(data, "저장할 데이터");
            resultData(data); //데이터 부모로 전송
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

    const dateClick = (date, col) => {
        setData((prevData) => {
            // 빈 문자열로 컬럼 값을 업데이트
            return { ...prevData, [col]: date };
        });
    };

    const changeEmployerInfo = (id) => { //되고있어??
        setColName({id: id, name: ""});
        setIsOpenModalEmployerInfo(true);
    };

    const changeCompany = (id, name) => {
        //id=setver로 보내는값, name=테이블에띄어지는값
        console.log("컴패니>>>>>>>>>>>>>>>>>>>>>>", id, name);
        setColName({ id: id, name: name });
        setIsOpenModalCompany(true);
    };

    const changeGroup = (id, name) => {
        console.log(id, name, "후후");
        setColName({ id: id, name: name });
        setIsOpenModalProductGroup(true);
    };

    // x 버튼을 누를 때 처리
    const handleClearDate = (event, col) => {
        event.preventDefault(); // 기본 이벤트 막기
        dateClick("", col); // 날짜 클리어를 위해 빈 문자열 전달
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
                ) : item.type === "dayPicker" ? (
                    <div style={{ display: "flex" }}>
                        <DayPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
                        <button onClick={(event) => handleClearDate(event, item.col)}>x</button>
                    </div>
                ) : item.type === "monthPicker" ? (
                    <MonthPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
                ) : item.type === "yearPicker" ? (
                    <YearPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
                ) : item.type === "company" ? (
                    <>
                        <BasicInput
                            item={item}
                            onClick={() => {
                                changeCompany(item.col, `${item.col}_name`);
                            }}
                            // value={data?.[`${item.col}_name`] ? data[`${item.col}_name`] : data?.[item.col]}
                            value={data?.[`${item.col}_name`] ? data[`${item.col}_name`] : data?.[item.col]}
                            readOnly
                        />
                    </>
                ) : item.type === "group" ? (
                    <BasicInput
                        item={item}
                        onClick={() => {
                            setIsOpenModalGroup(true);
                        }}
                        value={data?.[item.col] ?? ""}
                        readOnly
                    />
                ) : item.type === "project" ? (
                    <BasicInput
                        item={item}
                        onClick={() => {
                            setIsOpenModalProject(true);
                        }}
                        value={data?.[item.col] ?? ""}
                        readOnly
                    />
                ) : item.type === "desc" ? (
                    <BasicTextarea item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : item.type === "percent" ? (
                    <Percentage item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : item.type === "number" ? (
                    <Number item={item} onChange={(e) => inputChange(e, "number")} value={data?.[item.col] ? data[item.col].toLocaleString() : ""} />
                ) : item.type === "select" ? (
                    <BasicSelect item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : // <BasicSelect item={item} onChange={inputChange} value={data?.[item.col] ? data?.[item.col] : item.option[0].value || ""} />
                item.type === "radio" ? (
                    item.option &&
                    item.option.length > 0 && (
                        <div className="radio-container">
                            {item.option.map((op) => (
                                <div key={index} className="radio-group">
                                    <input type="radio" name={item.col} value={op.value} checked={data?.[item.col] === op.value} onChange={inputChange} />
                                    <label htmlFor={op.value}>{op.label}</label>
                                </div>
                            ))}
                        </div>
                    )
                ) : item.type === "productInfo" ? (
                    <input
                        type="text"
                        className="basic-input"
                        name={data?.[item.col] || ""}
                        onClick={() => setIsOpenModalProductInfo(true)}
                        value={data?.[item.col] ? data[item.col] : ""}
                        placeholder="품명을 선택하세요."
                        readOnly
                        disabled={data?.[item.col].disabled}
                    />
                ) : item.type === "productGroup" ? (
                    <>
                        {/* <BasicInput item={item} onClick={() => setIsOpenModalProductGroup(true)} value={data?.[item.col] ?? ""} readOnly /> */}
                        <BasicInput item={item} onClick={() => changeGroup(item.col, `${item.col}_name`)} value={data?.[item.col] ?? ""} readOnly />
                    </>
                ) : item.type === "employerInfo" ? (
                    // <BasicInput item={item} onClick={() => setIsOpenModalEmployerInfo(true)} value={data?.[item.col] ?? ""} readOnly />
                    <BasicInput item={item} onClick={() => changeEmployerInfo(item.col)} value={data?.[item.col] ?? ""} readOnly />
                ) : null}
                {errorList[item.col] && <span className="error">* 필수값을 입력하세요.</span>}
            </div>
        </div>
    );

    const setProjectInfo = (value) => {
        if (value.poiId === "" || !value) return;
        setData((prevData) => {
            return { ...prevData, ...value };
        });
    };

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
                                    수정
                                </button>
                            )}
                        </div>
                    </div>

                    {isOpenModalProject && (
                        <ProjectModal width={550} height={770} title="프로젝트 목록" onClose={() => setIsOpenModalProject(false)} returnInfo={setProjectInfo} />
                    )}
                    <CompanyModal
                        width={700}
                        height={600}
                        title="거래처 목록"
                        isOpen={isOpenModalCompany}
                        onClose={() => setIsOpenModalCompany(false)}
                        colName={colName}
                    />
                    <ProductInfoModal
                        width={600}
                        height={770}
                        title="품목정보 목록"
                        isOpen={isOpenModalProductInfo}
                        onClose={() => setIsOpenModalProductInfo(false)}
                    />
                    <ProductGroupModal
                        width={600}
                        height={720}
                        title="품목그룹 목록"
                        isOpen={isOpenModalProductGroup}
                        onClose={() => setIsOpenModalProductGroup(false)}
                        colName={colName}
                    />
                    <EmployerInfoModal
                        width={600}
                        height={770}
                        title="업무회원 목록"
                        isOpen={isOpenModalEmployerInfo}
                        onClose={() => setIsOpenModalEmployerInfo(false)}
                        colName={colName}
                    />
                    <AuthorGroupModal width={600} height={500} title="권한그룹 목록" isOpen={isOpenModalGroup} onClose={() => setIsOpenModalGroup(false)} />
                </div>
            </div>
        </article>
    );
}
