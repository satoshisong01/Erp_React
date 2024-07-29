import React, { useEffect, useRef, useState } from "react";
import "../../components/modal/ModalCss.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import MakeField from "utils/MakeField";

/* 모달 레이아웃 */
export default function ModalLayout(props) {
    const { width, height } = props;
    const [data, setData] = useState({});
    const bodyRef = useRef(null);

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const resultData = (value) => {
        setData(value)
    }

    return (
        <article className="me-modal">
            <div className="me-modal-container" style={{ width, height }}>
                <div className="me-modal-inner">
                    {/* <div className="me-modal-header">
                        <h4 className="header-title">{title}</h4>
                        <div className="header-close" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} className="button" size="lg" />
                        </div>
                    </div> */}
{/* 
                    <form className="me-modal-body" ref={bodyRef} style={{ overflowY: "auto" }}>
                        {list &&
                            list.map((column, index) => (
                                <div className="body-row" key={index}>
                                    <MakeField list={column.items} resultData={resultData} />
                                </div>
                            ))}
                    </form> */}

                    {/* <div className="me-modal-footer mg-b-20">
                        <div className="table-buttons" style={{ justifyContent: "center" }}>
                            <button className="table-btn table-btn-default" data-dismiss="modal" style={{ width: "100%" }} onClick={() => onClose()}>
                                취소
                            </button>
                            {
                                title.includes("추가") ? (
                                    <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onAdd}>
                                        추가
                                    </button>
                                ) : (
                                    <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onAdd}>
                                        수정
                                    </button>
                                )
                            }
                        </div>
                    </div> */}
                </div>
            </div>
        </article>
    );
}