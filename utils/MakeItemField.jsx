import React, { useContext, useEffect, useState } from "react";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
import YearPicker from "components/input/YearPicker";
import BasicInput from "components/input/BasicInput";
import BasicTextarea from "components/input/BasicTextarea";
import Percentage from "components/input/Percentage";
import BasicSelect from "components/input/BasicSelect";
import Number from "components/input/Number";
import { v4 as uuidv4 } from "uuid";
import CompanyModal from "components/modal/CompanyModal";
import ProjectModal from "components/modal/ProjectModal";
import { PageContext } from "components/PageProvider";
import ProductInfoModal from "components/modal/ProductInfoModal";
import ProductGroupModal from "components/modal/ProductGroupModal";
import EmployerInfoModal from "components/modal/EmployerInfoModal";


export default function MakeItemField({ item, resultData, initialData }) {
    const {
        // projectInfo,
        companyInfo,
        pdiNmList,
        projectPdiNm,
        projectPgNm,
        emUserInfo,
        setCompanyInfo,
        setPdiNmList,
        setProjectPdiNm,
        setProjectPgNm,
        setEmUserInfo,
    } = useContext(PageContext);
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false); //거래처목록
    const [isOpenModalProject, setIsOpenModalProject] = useState(false); //프로젝트목록
    const [isOpenModalProductInfo, setIsOpenModalProductInfo] = useState(false); //품목정보목록
    const [isOpenModalProductGroup, setIsOpenModalProductGroup] = useState(false); //품목그룹목록
    const [isOpenModalEmployerInfo, setIsOpenModalEmployerInfo] = useState(false); //업무회원목록
    const [data, setData] = useState({});
    const [colName, setColName] = useState("");
    
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        resultData && resultData(data);
    }, [data])

    useEffect(() => {
        //거래처
        if (Object.keys(companyInfo).length > 0) {
            setData((prevData) => {
                return { ...prevData, ...companyInfo };
            });
            setCompanyInfo({}); //초기화
        }
    }, [companyInfo]);

    // useEffect(() => { //프로젝트
    //     if(Object.values(projectInfo).length > 0) {
    //         setData((prevData) => {
    //             return { ...prevData, ...projectInfo };
    //         });
    //     }
    // }, [projectInfo])

    const setProjectInfo = (value) => {
        if(value.poiId === "" || !value) return;
        setData(prevData => {
            return { ...prevData, ...value};
        });
    }

    useEffect(() => {
        //품목
        if (Object.keys(projectPdiNm).length > 0) {
            setData(prevData => {
                return { ...prevData, ...projectPdiNm};
            });
            setProjectPdiNm({});
        }
    }, [projectPdiNm]);

    useEffect(() => {
        //품목리스트
        if( !pdiNmList || pdiNmList.length <= 0) return;
        setData((prevData) => {
            return { ...prevData, ...pdiNmList };
        });
        // setPdiNmList([]); //초기화
        // console.log("품목정보리스트 변경: ", pdiNmList);
    }, [pdiNmList]);

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
            setData(prevData => {
                return { ...prevData, ...emUserInfo};
            });
            setEmUserInfo({});
        }
    }, [emUserInfo]);
    
    const inputChange = (e) => {
        const { value, name } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const dateClick = (date, col) => {
        setData((prevData) => ({
            ...prevData,
            [col]: date,
        }));
    };

    const changeEmployerInfo = (colName) => {
        setIsOpenModalEmployerInfo(true);
        setColName(colName);
    }

    const renderField = (item) => (
            item.type === "input" ? (
                <BasicInput item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
            ) : item.type === "dayPicker" ? (
                <DayPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
            ) : item.type === "monthPicker" ? (
                <MonthPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
            ) : item.type === "yearPicker" ? (
                <YearPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
            ) : item.type === "company" ? (
                // <BasicInput item={item} onClick={() => setIsOpenModalCompany(true)} value={data?.[item.col] ?? ""} readOnly />
                <input
                    id={uuidv4()}
                    className="basic-input"
                    name={item.col || ""}
                    onClick={() => setIsOpenModalCompany(true)}
                    value={data?.[item.col] ?? ""}
                    readOnly
                />
            ) : item.type === "project" ? (
                // <BasicInput item={item} onClick={() => setIsOpenModalProject(true)} value={data?.[item.col] ?? ""} readOnly />
                <input
                    id={uuidv4()}
                    className="basic-input"
                    name={item.col || ""}
                    onClick={() => setIsOpenModalProject(true)}
                    value={data?.[item.col] ?? ""}
                    readOnly
                />
            ) : item.type === "desc" ? (
                <BasicTextarea item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
            ) : item.type === "percent" ? (
                <Percentage item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
            ) : item.type === "number" ? (
                <Number item={item} onChange={(e) => inputChange(e)} value={data?.[item.col] ? data[item.col].toLocaleString() : ""} disabled={item.disabled} />
            ) : item.type === "select" ? (
                <BasicSelect item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
            ) : item.type === "radio" ? (
                item.option && item.option.length > 0 && (
                    <div className="radio-container">
                        {item.option.map((op) => (
                            <div key={uuidv4()} className="radio-group">
                                <input
                                    type="radio"
                                    name={item.col}
                                    value={op.value}
                                    checked={data?.[item.col] === op.value}
                                    onChange={inputChange}
                                />
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
                    // disabled={disabled || false}
                />
            ) : item.type === "productGroup" ? (
                <BasicInput item={item} onClick={() => setIsOpenModalProductGroup(true)} value={data?.[item.col] ?? ""} readOnly />
            ) : item.type === "employerInfo" ? (
                <BasicInput item={item} onClick={() => changeEmployerInfo(item.col)} value={data?.[item.col] ?? ""} readOnly />
            ) : null
    );
    
    return (
        <>
            {renderField(item)}
            {isOpenModalProject && <ProjectModal width={550} height={770} title="프로젝트 목록" onClose={() => setIsOpenModalProject(false)} returnInfo={setProjectInfo} />}
            <CompanyModal width={500} height={550} title="거래처 목록" isOpen={isOpenModalCompany} onClose={() => setIsOpenModalCompany(false)} />
            <ProductInfoModal width={600} height={770} title="품목정보 목록" isOpen={isOpenModalProductInfo} onClose={() => setIsOpenModalProductInfo(false)} />
            <ProductGroupModal width={600} height={720} title="품목그룹 목록" isOpen={isOpenModalProductGroup} onClose={() => setIsOpenModalProductGroup(false)} />
            <EmployerInfoModal width={600} height={770} title="업무회원 목록" isOpen={isOpenModalEmployerInfo} onClose={() => setIsOpenModalEmployerInfo(false)}  colName={colName}/>
        </>
    );
}
