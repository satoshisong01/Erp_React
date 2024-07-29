import React, { useContext, useEffect, useState } from "react";
import "../../components/modal/ModalSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PageContext } from "components/PageProvider";

export default function DataPutModal({ onClose, initialData, columns, updateData }) {
    const initializeState = () => {
        const initialState = columns.reduce((acc, curr) => {
            acc[curr.col] = "";
            return acc;
        }, {});
        setData(initialState);
    };

    const [data, setData] = useState(initialData);
    const [errorMessages, setErrorMessages] = useState({}); // 각 필드에 대한 에러 메시지 상태 추가

    useEffect(() => {
        initializeState(); // 빈값으로 초기화
        setData(initialData || {}); // 초기화 후 값 삽입
    }, [initialData]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));

        // 에러 메시지 상태 업데이트
        setErrorMessages((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));
    };

    const handleSaveChanges = () => {
        // 필수값이 비어있는지 확인
        const requiredColumns = columns.filter((column) => column.require);
        const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);

        if (hasEmptyRequiredFields) {
            // 필수값 에러 메시지 상태 업데이트
            setErrorMessages((prevErrors) => {
                const newErrors = { ...prevErrors };
                requiredColumns.forEach((column) => {
                    if (!data[column.col]) {
                        newErrors[column.col] = true;
                    }
                });
                return newErrors;
            });
        } else {
            updateData(data);
            onClose();
        }
    };

    return (
        <div className="modal-dialog demo-modal">
            <div className="modal-content">
                <article className="product-modal">
                    <div className="product-modal-bg"></div>

                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div className="modal-header">
                                <h4 className="modal-title">데이터 수정</h4>
                            </div>
                            <div className="product-modal-close-btn" onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} className="xBtn" />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct">
                                {columns.map((column, index) => {
                                    if (column.modify) {
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
                                                                <option key={op.value} value={op.label}>
                                                                    {op.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : column.type === "buttonCompany" ? (
                                                        <div>
                                                            <input
                                                                className="buttonSelect"
                                                                id={column.col + index}
                                                                name={column.col}
                                                                // onClick={() => setIsOpenModalCompany(index)}
                                                                type="text"
                                                                placeholder={`거래처명을 선택해 주세요.`}
                                                                value={data[column.col] || ""}
                                                                // onChange={(e) => handleChange(e, column)}
                                                                readOnly
                                                            />
                                                        </div>
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
                                                    ): (
                                                        <input
                                                            placeholder={column.header}
                                                            className="postInput"
                                                            type="text"
                                                            name={column.col}
                                                            value={data[column.col] || ""}
                                                            //value={getNestedData(data, column.col) || ""}
                                                            onChange={inputChange}
                                                            disabled={column.enable === false}
                                                        />
                                                    )}
                                                </div>
                                                {errorMessages[column.col] && <span className="error-message text-error"> 필수값이 입력되지 않았습니다.</span>}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={onClose}>
                                    취소
                                </button>
                                <button type="button" className="btn btn-primary modal-btn-close" id="modalSubmitBtn" onClick={handleSaveChanges}>
                                    수정
                                </button>
                            </div>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    );
}
