import React, { useEffect, useState } from "react";
import Modal from "react-modal";

export default function DeleteModal({ initialData, resultData, onClose, isOpen }) {
    const [modalData, setModalData] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setModalData(initialData);
        }
    }, [initialData]);

    const onConfirm = (value) => {
        resultData(value);
        onClose();
    };

    const toggleCheckbox = () => {
        setIsChecked((prevChecked) => !prevChecked);
    };

    return (
        <Modal appElement={document.getElementById("root")} isOpen={isOpen} onRequestClose={onClose} style={{ overflow: "visible" }}>
            <div className="flex-column">
                <div className="">
                    <p style={{ fontSize: "17px", fontWeight: 500 }}>삭제 하시겠습니까? 총 {modalData ? modalData.length : 0}개의 데이터</p>
                    <p className="mg-t-10 scrollable">{modalData.join(", ")}</p>
                </div>
                <div style={{ display: "flex", textAlign: "center", alignItems: "center" }}>
                    <input type="checkbox" id="exampleCheckbox" checked={isChecked} onChange={toggleCheckbox} className="checkbox" />
                    <label htmlFor="exampleCheckbox" style={{ fontSize: "14px" }} className="cherry mg-l-10">
                        영구삭제
                    </label>
                    {isChecked && <p className="cherry mg-l-10"> * 영구삭제가 맞는지 다시 확인해주세요.</p>}
                </div>
                <div className="flex-between">
                    {!isChecked ? (
                        <button type="button" onClick={() => onConfirm("임시삭제")} className="btn btn-primary btn-block">
                            임시삭제
                        </button>
                    ) : (
                        <button type="button" onClick={() => onConfirm("영구삭제")} className="btn  btn-primary back-cherry btn-block">
                            영구삭제
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onConfirm("취소")}
                        className="btn btn-primary btn-block"
                        style={{ color: "black", backgroundColor: "#f0f0f0", borderColor: "gray" }}>
                        취소
                    </button>
                </div>
            </div>
        </Modal>
    );
}
