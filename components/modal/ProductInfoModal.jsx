import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import ModalSearchList from "components/ModalCondition";
import { PageContext } from "components/PageProvider";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 품목상세정보 목록 모달 */
export default function ProductInfoModal(props) {
    const { width, height, isOpen, title, onClose } = props;
    const { setModalPageName, setIsModalTable, setPdiNmList, pdiNmList, projectPdiNm, setProjectPdiNm } = useContext(PageContext);

    const [productInfoList, setProductInfoList] = useState([]);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            getProductInfoList();
            setModalPageName("품목정보팝업");
            setIsModalTable(true);
            setPdiNmList([]); //초기화
            setProjectPdiNm({}); //초기화
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    const getProductInfoList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/productInfo/totalListAll.do", requestData || {});
        setProductInfoList(resultData);
    };

    const columns = [
        { header: "품목아이디", col: "pdiId", notView: true },
        { header: "품명", col: "pdiNm", cellWidth: "180", type: "buttonPdiNm" },
        { header: "모델명", col: "pdiNum", cellWidth: "180" },
        { header: "품목그룹명", col: "pgNm", cellWidth: "120" },
        { header: "규격", col: "pdiStnd", cellWidth: "180" },
        { header: "단위", col: "pdiUnit", notView: true },
        { header: "제조사아이디", col: "pdiMenufut", notView: true },
        { header: "판매사아이디", col: "pdiSeller", notView: true },
        { header: "제조사", col: "pdiMenufut_name", cellWidth: "120" },
        { header: "판매사", col: "pdiSeller_name", cellWidth: "120" },
        { header: "단가", col: "pupUnitPrice", cellWidth: "100" },
    ];

    const conditionList = [
        { title: "품명", col: "pdiNm", type: "input" },
        { title: "모델명", col: "pdiNum", type: "input" },
        { title: "픔목그룹명", col: "pgNm", type: "input" },
        { title: "제조사", col: "pdiMenufut_name", type: "input" },
        { title: "판매사", col: "pdiSeller_name", type: "input" },
        { title: "규격", col: "pdiStnd", type: "input" },
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

    const onSearch = (value) => {
        getProductInfoList(value);
    };

    const onClick = () => {
        if (selectedRows && selectedRows.length === 1) {
            //객체로 저장
            setProjectPdiNm(selectedRows[0]);
        } else if (selectedRows && selectedRows.length > 1) {
            setPdiNmList([...selectedRows]);
        }
        onClose();
    };

    let selectedRows = [];

    const returnSelectRows = (rows) => {
        const newArr = rows.filter((row) => !selectedRows.some((pre) => pre.pdiId === row.pdiId));
        selectedRows.push(...newArr);
    };

    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            style={{ content: { width, height } }}>
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
                            <div className="body-area" style={{ gap: 0 }}>
                                <ModalSearchList conditionList={conditionList} onSearch={onSearch} refresh={() => getProductInfoList()} />
                                <ReactDataTable
                                    columns={columns}
                                    customDatas={productInfoList}
                                    returnSelectRows={(rows) => returnSelectRows(rows)}
                                    viewPageName={{ name: "품목정보팝업", id: "품목정보팝업" }}
                                    isPageNationCombo={true}
                                    isPageNation={true}
                                />
                            </div>
                        </div>

                        <div className="me-modal-footer mg-t-10 mg-b-20">
                            <div className="table-buttons" style={{ justifyContent: "center" }}>
                                <button className="table-btn table-btn-default" style={{ width: "100%" }} onClick={onClose}>
                                    취소
                                </button>
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
