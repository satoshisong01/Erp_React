import React, { useContext, useEffect, useRef, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageContext } from "components/PageProvider";
import SearchListCompany from "components/SearchListCompany";

export default function ModalPageCompany({ rowIndex, returnInfo, closeLocal }) {
    const { companyList, setCompanyInfo, setIsOpenModalCompany, setReturnKeyWord } = useContext(PageContext);
    //const [savePgNm, setSavePgNm] = useState("");

    useEffect(() => {
        setReturnKeyWord("");
    }, []);

    const conditionList = [
        {
            title: "협력사",
            colName: "cltNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "5",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    function handleItemClick(item) {
        returnInfo && returnInfo({ cltNm: item.cltNm, cltId: item.cltId })
        setCompanyInfo({ cltNm: item.cltNm, cltId: item.cltId });
        setIsOpenModalCompany(false);
    }

    const handleClose = () => {
        setReturnKeyWord("");
        setIsOpenModalCompany(false);
    };

    return (
        <>
            <div className="modal-dialog demo-modal" style={{ margin: "0", zIndex: "9999" }}>
                <div className="modal-content">
                    <article className="product-modal">
                        <div className="product-modal-inner">
                            {/*<button
                        style={{textAlign:"right"}}
                        onClick={() => handleClose()}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>*/}
                            <SearchListCompany conditionList={conditionList} onSearch={handleReturn} />
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
                                {/*<div style={{display:"flex",alignItems:"center"}}>
                                <span className="redStar" style={{marginLeft:"10px"}}>*</span>
                                <span style={{fontWeight:"700"}}>품목그룹명</span>
                                <input
                                style={{marginLeft:"8px",width:"300px"}}
                                    className="form-control flex-item"
                                    type="text"
                                    placeholder="추가할 품목그룹명을 입력해 주세요"
                                    onChange={inputChange}
                                />
                            </div>*/}
                                {/*<button
                                type="button"
                                className="btn btn-primary modal-btn-close"
                                id="modalSubmitBtn"
                                onClick={onAdd}
                            >추가</button>*/}
                            </div>
                            {/*<div className="product-modal-header">
                            <div className="modal-header">
                                <span className="modal-title">
                                </span>
                            </div>
                        </div>*/}
                            <div className="modalBody">
                                <div className="modalContent">
                                    {companyList.map((item, index) => (
                                        <div className="listItems" key={index} onClick={() => handleItemClick(item)}>
                                            <p className="listItem">{item.cltNm}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <form className="product-modal-body">
                                <div className="submitProduct">
                                    <div className="modal-footer flex-between">
                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={() => closeLocal()}>
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
