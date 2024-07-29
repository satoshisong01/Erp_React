import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { PageContext } from "components/PageProvider";
import BasicInput from "components/input/BasicInput";
import CompanyModal from "./CompanyModal";
import ProductGroupModal from "./ProductGroupModal";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 구매 검색 모달 */
export default function SearchModal(props) {
    const { width, height, isOpen, title, onClose, returnData } = props;
    const { setModalPageName, setIsModalTable, companyInfo, setCompanyInfo, projectPgNm, setProjectPgNm } = useContext(PageContext);
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false); //거래처목록
    const [isOpenModalProductGroup, setIsOpenModalProductGroup] = useState(false); //품목그룹목록
    const [errorList, setErrorList] = useState({}); // 필수값 에러 메시지
    const bodyRef = useRef(null);
    const [data, setData] = useState({});

    useEffect(() => {
        if (isOpen) {
            setModalPageName("구매검색팝업");
            setIsModalTable(true);
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
            setData({})
        };
    }, [isOpen]);

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
        // 품목그룹
        if (Object.keys(projectPgNm).length > 0) {
            setData((prevData) => {
                return { ...prevData, ...projectPgNm };
            });
            setProjectPgNm({});
        }
    }, [projectPgNm]);

    const conditionList = [
        { items: [{ header: "판매사", col: "pdiSeller", type: "company" }] },
        { items: [{ header: "제조사", col: "pdiMenufut", type: "company" }] },
        // { items: [{ header: "회사명", col: "cltNm", type: "company" }] },
        { items: [{ header: "픔목그룹명", col: "pgNm", type: "productGroup" }] },
    ];

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const searchClick = () => {
        Object.keys(data).forEach((key) => {
            if (data[key] === "") {
                delete data[key]; //빈값 제외
            }
        });
        console.log("11111111111111111:", data);
        returnData && returnData(data);
        onClose();
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

    const [colName, setColName] = useState({});

    const openCompanyModal = (id, name) => {
        setIsOpenModalCompany(true);
        setColName({id, name});
    }

    const renderField = (item, index, data) => (
        <div className="row-group" key={index}>
            <div className="left">
                {item.require && <span className="burgundy">*</span>}
                <span>{item.header}</span>
            </div>
            <div className="right">
                {item.type === "input" ? (
                    <BasicInput item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
                ) : item.type === "radio" ? (
                    item.option &&
                    item.option.length > 0 && (
                        <div className="radio-container" style={{margin: "0 auto"}}>
                            {item.option.map((op, idx) => (
                                <div key={idx} className="radio-group">
                                    <input type="radio" name={item.col} value={op.value} checked={data?.[item.col] === op.value} onChange={inputChange} />
                                    <label htmlFor={op.value}>{op.label}</label>
                                </div>
                            ))}
                        </div>
                    )
                ) : item.type === "company" ? (
                    <BasicInput
                        item={item}
                        onClick={() => {
                            openCompanyModal(item.col, item.col+"_name")
                        }}
                        value={data?.[item.col+"_name"] ?? ""}
                        readOnly
                    />
                ) : item.type === "productGroup" ? (
                        <BasicInput
                            item={item}
                            onClick={() => {
                                setIsOpenModalProductGroup(true);
                            }}
                            value={data?.[item.col] ?? ""}
                            readOnly
                        />
                ) : null}
                {errorList[item.col] && <span className="error">* 필수값을 입력하세요.</span>}
            </div>
        </div>
    );

    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            style={{ content: { width, height } }}
        >
            <div className="me-modal">
                <div className="me-modal-container" style={{ width, height }}>
                    <div className="me-modal-inner">
                        <div className="me-modal-header">
                            <h4 className="header-title">{title}</h4>
                            <div className="header-close" onClick={onClose}>
                                <FontAwesomeIcon icon={faTimes} className="button" size="lg" />
                            </div>
                        </div>

                        <div className="me-modal-body" ref={bodyRef}>
                            <div className="body-area" style={{ gap: 10 }}>
                                {/* <div className="flex-container"> */}
                                {conditionList &&
                                    conditionList.map((column, index) => (
                                        <div className="body-row" key={index} style={{textAlign: "left"}}>
                                            {column.items.map((item, itemIndex) => renderField(item, itemIndex, data))}
                                        </div>
                                    ))}
                                {/* </div> */}
                            </div>
                        </div>

                        <div className="me-modal-footer mg-t-10 mg-b-20">
                            <div className="table-buttons" style={{ justifyContent: "center" }}>
                                <button className="table-btn back-white" onClick={onClose} style={{ width: "100%" }}>
                                    취소
                                </button>
                                <button className="table-btn search-btn" onClick={searchClick} style={{ width: "100%" }}>
                                    검색
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CompanyModal
                width={500}
                height={550}
                title="거래처 목록"
                isOpen={isOpenModalCompany}
                onClose={() => setIsOpenModalCompany(false)}
                colName={colName}
            />
            <ProductGroupModal
                width={600}
                height={720}
                title="품목그룹 목록"
                isOpen={isOpenModalProductGroup}
                onClose={() => setIsOpenModalProductGroup(false)}
            />
        </Modal>
    );
}
