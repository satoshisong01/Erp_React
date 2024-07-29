import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "../../components/modal/ModalSearch.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
//import { v4 as uuidv4 } from "uuid";
//import axios from "axios";

export default function DataPostModal2({ refresh, postData, columns, onClose, errorOn, fetchAllData, handleSendLoading, selectList }) {
    const [data, setData] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [errorOnState, setErrorOnState] = useState(false);

    useEffect(() => {
        const initialData = columns.reduce((acc, column) => {
            if (column.selectOption) {
                acc[column.col] = selectList ? selectList[0] : ""; // 첫 번째 값 선택
            } else {
                acc[column.col] = "";
            }
            return acc;
        }, {});

        setData(initialData);
    }, [columns, selectList]);

    useEffect(() => {
        setErrorOnState(errorOn); // Update errorOnState when errorOn changes
    }, [errorOn]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // console.log(errorOnState, "post에서 선언한 기본값 2번");
    // console.log(errorOn, "이값에 변화가있나");

    // 데이터 추가 버튼을 눌렀을 때 실행되는 함수
    const onAdd = async (e) => {
        e.preventDefault();

        // 필수 필드가 비어있는지 확인
        const requiredColumns = columns.filter((column) => column.require);
        const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);

        //const hasPrimaryKey = columns.some((column) => column.pk);

        console.log(data, "나오는데이터");
        if (hasEmptyRequiredFields) {
            setShowAlert(true); // 알림 메시지 표시
        } else {
            postData(data); // 데이터 추가 함수 호출
        }
        onClose();
    };

    return (
        <div className="modal-dialog demo-modal">
            <div className="modal-content">
                <article className="product-modal">
                    <div className="product-modal-bg"></div>

                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div className="modal-header">
                                <h4 className="modal-title">프로젝트 목록</h4>
                            </div>
                            <div className="product-modal-close-btn" onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} className="xBtn" />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct">
                                {columns.map((column, index) => {
                                    if (column.add) {
                                        return (
                                            <div className="postBox" key={index}>
                                                <div className="inputBox">
                                                    <label className="postLabel">
                                                        {column.require && <span className="redStar">*</span>}
                                                        {column.header}:
                                                    </label>
                                                    {column.type === "select" ? (
                                                        <select name={column.col} className="postInput" onChange={inputChange}>
                                                            {column.option.map((op) => (
                                                                <option key={op.value} value={op.value}>
                                                                    {op.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : column.lockAt ? (
                                                        <select name={column.col} className="postInput" onChange={inputChange}>
                                                            <option value="Y">Y</option>
                                                            <option value="N">N</option>
                                                        </select>
                                                    ) : column.itemType && Array.isArray(column.itemType) ? (
                                                        <select className="postInput" name={column.col} value={data[column.col] || ""} onChange={inputChange}>
                                                            <option value={""}>{column.itemType[0]}</option>
                                                            {column.itemType.map(
                                                                (item, index) =>
                                                                    index > 0 && (
                                                                        <option key={index} value={column.itemTypeSymbol[index]}>
                                                                            {item}
                                                                        </option>
                                                                    )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            placeholder={column.placeholder || column.header}
                                                            className="postInput"
                                                            type="text"
                                                            name={column.col}
                                                            value={data[column.col] || ""}
                                                            onChange={inputChange}
                                                        />
                                                    )}
                                                </div>
                                                {column.require && showAlert && !data[column.col] && (
                                                    <span className="error-message text-error">필수값이 비어있습니다.</span>
                                                )}
                                                {errorOnState && column.pk && <span className="error-message text-error">중복된 값입니다.</span>}
                                                {!errorOnState && column.pk && <span className="error-message text-error"> </span>}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal"
                                    onClick={() => {
                                        fetchAllData();
                                        onClose();
                                        //handleSendLoading(true);
                                    }}>
                                    취소
                                </button>
                                <button type="button" className="btn btn-primary modal-btn-close" id="modalSubmitBtn" onClick={onAdd}>
                                    추가
                                </button>
                            </div>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    );
}
