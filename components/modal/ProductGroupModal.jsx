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

/* 품목그룹정보 목록 모달 */
export default function ProductGroupModal(props) {
    const { width, height, isOpen, title, onClose, colName } = props;
    const { setModalPageName, setIsModalTable, setProjectPgNm, setPgNmList, projectPgNm } = useContext(PageContext);

    const [productInfoList, setProductInfoList] = useState([]);
    const bodyRef = useRef(null);
    const [groupInfo, setGroupInfo] = useState({});

    useEffect(() => {
        if (isOpen) {
            getProductInfoList();
            setModalPageName("품목그룹팝업");
            setIsModalTable(true);
            setPgNmList([]); //초기화
            setProjectPgNm({}); //초기화
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    const getProductInfoList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/productGroup/totalListAll.do", requestData || {});
        setProductInfoList(resultData);
    };

    const columns = [
        { header: "품목그룹아이디", col: "pgId", notView: true },
        { header: "품목그룹명", col: "pgNm", cellWidth: "515" },
    ];

    const conditionList = [{ title: "픔목그룹명", col: "pgNm", type: "input" }];

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

    useEffect(() => {
        console.log(projectPgNm);
    }, [projectPgNm]);

    const onClick = () => {
        setProjectPgNm({
            ...groupInfo,
            [colName?.id || "pgNm"]: groupInfo.pgNm, //거래처의 경우 Id에 pgNm값을 받음
        });
        onClose();
    };

    const returnSelect = (value) => {
        setGroupInfo((prev) => (prev.pgId !== value.pgId ? value : prev));
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
                                    returnSelect={returnSelect}
                                    viewPageName={{ name: "품목그룹팝업", id: "품목그룹팝업" }}
                                    isSingleSelect={true}
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
