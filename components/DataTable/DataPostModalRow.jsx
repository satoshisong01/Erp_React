import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "../../components/modal/ModalSearch.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
//import { v4 as uuidv4 } from "uuid";
//import axios from "axios";

export default function DataPostModalRow({
    refresh,
    postData,
    onClose,
    saveList,
    errorOn,
    fetchAllData,
    handleSendLoading,
}) {
    const [data, setData] = useState({ gupPrice: "0", guppId: "1" });
    const [errorMessages, setErrorMessages] = useState({});
    const [errorOnState, setErrorOnState] = useState(false);

    const changeData = [
        {
            label: "기준명",
            name: "gupDesc",
        },
        {
            label: "단가ID",
            name: "gupId",
        },
        {
            label: "단가타입",
            name: "gupType",
        },
    ];
    const inputChange = (e) => {
        const { name, value } = e.target;

        if (name === "gupType" && (value === "P" || value === "G")) {
            setData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name !== "gupType") {
            if (name === "gupId" && value.length > 10) {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    [name]: true,
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    [name]: false,
                }));
            }
        }

        setErrorMessages((prevErrors) => ({
            ...prevErrors,
            [name]: false, // 입력값이 변경되면 해당 필드의 에러 메시지를 숨김
        }));
    };

    useEffect(() => {
        setErrorOnState(errorOn); // Update errorOnState when errorOn changes
    }, [errorOn]);

    // 데이터 추가 버튼을 눌렀을 때 실행되는 함수
    const onAdd = async (e) => {
        e.preventDefault();

        const isGupDescEmpty = !data["gupDesc"];
        const isGupIdEmpty = !data["gupId"];
        const isGupTypeValid =
            data["gupType"] === "P" || data["gupType"] === "G";

        setErrorMessages({
            gupDesc: isGupDescEmpty,
            gupId: isGupIdEmpty,
            gupType: !isGupTypeValid,
        });

        if (!isGupDescEmpty && !isGupIdEmpty && isGupTypeValid) {
            postData(data);
            setErrorOnState(false);
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
                                <h4 className="modal-title">프로젝트 목록</h4>
                            </div>
                            <div
                                className="product-modal-close-btn"
                                onClick={onClose}>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="xBtn"
                                />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct">
                                {changeData.map((item, index) => (
                                    <div className="postBox" key={index}>
                                        <div className="inputBox">
                                            <label className="postLabel">
                                                {
                                                    <span className="redStar">
                                                        *
                                                    </span>
                                                }
                                                {item.label}:
                                            </label>
                                            {item.name === "gupType" ? (
                                                <select
                                                    className="postInput"
                                                    name={item.name}
                                                    value={data[item.name]}
                                                    onChange={inputChange}>
                                                    <option value="">
                                                        인건비 또는 경비 중
                                                        하나를 선택하세요
                                                    </option>
                                                    <option value="P">
                                                        인건비
                                                    </option>
                                                    <option value="G">
                                                        경비
                                                    </option>
                                                </select>
                                            ) : (
                                                <input
                                                    placeholder={item.label}
                                                    className="postInput"
                                                    type="text"
                                                    name={item.name}
                                                    value={data[item.name]}
                                                    onChange={inputChange}
                                                />
                                            )}
                                        </div>
                                        {errorMessages[item.name] && (
                                            <span className="error-message text-error">
                                                {item.name === "gupType"
                                                    ? "인건비 또는 경비 중 하나를 선택하세요."
                                                    : "필수값이 입력되지 않았습니다."}
                                            </span>
                                        )}
                                        {item.name === "gupId" &&
                                            errorOnState === true && (
                                                <span className="error-message text-error">
                                                    중복값이 입력되었습니다.
                                                </span>
                                            )}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal"
                                    onClick={() => {
                                        fetchAllData();
                                        onClose();
                                        handleSendLoading(true);
                                    }}>
                                    취소
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary modal-btn-close"
                                    id="modalSubmitBtn"
                                    onClick={onAdd}>
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
