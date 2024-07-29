import React, { useEffect, useState } from "react";
import "../../components/modal/ModalSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function DataPutModalRow({
    onClose,
    updateData,
    thisData,
    handleChangeCost,
}) {
    const changeData = [
        {
            gupDesc: "기준명",
            gupId: "단가ID",
            gupPrice: "단가",
            guppCode: "직급코드",
            guppId: "직급ID",
            guppName: "직급",
        },
    ];

    const [data, setData] = useState({});
    const [errorMessages, setErrorMessages] = useState({}); // 각 필드에 대한 에러 메시지 상태 추가

    useEffect(() => {
        console.log(thisData, "받아온 하나의데이터");
        console.log(data, "변경되는데이터 하나의데이터");
    }, []);

    useEffect(() => {
        // thisData가 비어 있지 않은 경우
        if (thisData && thisData.length > 0) {
            // 첫 번째 요소를 초기 상태로 사용합니다.
            setData(thisData[0]);
        }
    }, [thisData]);

    const inputChange = (e) => {
        const { name, value } = e.target;

        // 데이터 객체의 복사본을 생성합니다.
        const newData = { ...data };

        // 'name' 속성을 기반으로 특정 속성을 업데이트합니다.
        newData[name] = value;

        // 수정된 객체로 상태를 업데이트합니다.
        setData(newData);

        setErrorMessages((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));

        // handleChangeCost 함수를 사용하여 newData를 업데이트합니다.
        handleChangeCost(newData);
    };

    const handleSaveChanges = () => {
        // 필수값이 비어있는지 확인
        const isGupDescEmpty = !data["gupDesc"];
        const isGupPriceEmpty = !data["gupPrice"];

        // 에러 메시지 상태를 업데이트합니다.
        setErrorMessages((prevErrors) => ({
            ...prevErrors,
            gupDesc: isGupDescEmpty,
            gupPrice: isGupPriceEmpty,
        }));
        if (!isGupDescEmpty && !isGupPriceEmpty) {
            updateData(data);
            onClose();
        }
    };

    console.log(thisData, "받아온 하나의데이터");
    console.log(data, "변경된 데이터");

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
                                        {Object.entries(item).map(
                                            ([key, value]) => (
                                                <div
                                                    className="postBox"
                                                    key={key}>
                                                    <div className="inputBox">
                                                        <label className="postLabel">
                                                            {[
                                                                "gupDesc",
                                                                "gupPrice",
                                                            ].includes(key) && (
                                                                <span className="redStar">
                                                                    *
                                                                </span>
                                                            )}
                                                            {value}:
                                                        </label>
                                                        <input
                                                            placeholder={value}
                                                            className="postInput"
                                                            type="text"
                                                            name={key}
                                                            value={data[key]}
                                                            onChange={
                                                                inputChange
                                                            }
                                                            disabled={
                                                                key !==
                                                                    "gupDesc" &&
                                                                key !==
                                                                    "gupPrice"
                                                            }
                                                        />
                                                    </div>
                                                    {[
                                                        "gupDesc",
                                                        "gupPrice",
                                                    ].includes(key) &&
                                                        errorMessages[key] && (
                                                            <span className="error-message text-error">
                                                                필수값이
                                                                입력되지
                                                                않았습니다.
                                                            </span>
                                                        )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal"
                                    onClick={onClose}>
                                    취소
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary modal-btn-close"
                                    id="modalSubmitBtn"
                                    onClick={handleSaveChanges}>
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
