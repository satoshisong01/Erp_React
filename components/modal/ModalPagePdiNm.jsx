import React, { useContext, useEffect, useRef, useState } from "react";
import { PageContext } from "components/PageProvider";

/* 품명 선택 */
export default function ModalPagePdiNm({ rowIndex }) {
    const { pdiNmList, setProjectPdiNm, setIsOpenModalPdiNm, setReturnKeyWordPdiNm } = useContext(PageContext);

    useEffect(() => {
        setReturnKeyWordPdiNm("");
    }, []);

    function handleItemClick(pdiNm, pgNm, pdiWght, pdiStnd, pdiMenufut, pdiId) {
        setProjectPdiNm({ pdiNm, pgNm, pdiWght, pdiStnd, pdiMenufut, pdiId });
        setIsOpenModalPdiNm(false);
    }

    const handleClose = () => {
        setReturnKeyWordPdiNm("");
        setIsOpenModalPdiNm(false);
    };

    return (
        <>
            <div className="modal-dialog demo-modal" style={{ margin: "0", zIndex: "9999" }}>
                <div className="modal-content">
                    <article className="product-modal">
                        <div className="product-modal-inner">
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
                                <h5 style={{ marginLeft: "35px", marginTop: "15px" }}>품명 선택</h5>
                            </div>
                            <div className="modalBody">
                                <div className="modalContent">
                                    {pdiNmList.map((item, index) => (
                                        <div
                                            className="listItems"
                                            key={index}
                                            onClick={() => handleItemClick(item.pdiNm, item.pgNm, item.pdiWght, item.pdiStnd, item.pdiMenufut, item.pdiId)}>
                                            <p className="listItem">{item.pdiNm}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <form className="product-modal-body">
                                <div className="submitProduct">
                                    <div className="modal-footer flex-between">
                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={() => handleClose()}>
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary" style={{ margin: "0" }}>
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
