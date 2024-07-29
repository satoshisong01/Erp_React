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

/* 업무회원 목록 모달 */
export default function EmployerInfoModal(props) {
    const { width, height, isOpen, title, onClose, colName } = props;
    const { setModalPageName, setIsModalTable, setEmUserInfo } = useContext(PageContext);

    const [employerInfoList, setEmployerInfoList] = useState([]);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            getEmployerList();
            setModalPageName("회원목록팝업");
            setIsModalTable(true);
            setEmUserInfo({}); //초기화
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    const getEmployerList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/member/employMember/totalListAll.do", requestData || {});
        const modifiedResultData = resultData.map((item) => {
            return {
                ...item,
                uniqId: item.uniqId,
                [colName?.id || "empNm"]: item.empNm,
                posNm: item.posNm,
                orgNm: item.orgNm,
            };
        });
        setEmployerInfoList(modifiedResultData);
    };

    const columns = [
        { header: "고유아이디", col: "uniqId", notView: true },
        { header: "사용자명", col: colName?.id || "empNm", cellWidth: "180" },
        { header: "직급", col: "posNm", cellWidth: "180" },
        // { header: "부서", col: "orgNm", cellWidth: "150" },
        { header: "부서", col: "groupNm", cellWidth: "150" },
    ];

    const conditionList = [
        { title: "사용자명", col: colName?.id || "empNm", type: "input" },
        { title: "직급", col: "posNm", type: "input" },
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
        getEmployerList(value);
    };

    const onClick = () => {
        if (selectedRows && selectedRows.length === 1) {
            //객체로 저장
            setEmUserInfo(selectedRows[0]);
        }
        onClose();
    };

    let selectedRows = [];

    const returnSelectRows = (rows) => {
        const newArr = rows.filter((row) => !selectedRows.some((pre) => pre.uniqId === row.uniqId));
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
                                <ModalSearchList conditionList={conditionList} onSearch={onSearch} refresh={() => getEmployerList()} />
                                <ReactDataTable
                                    columns={columns}
                                    customDatas={employerInfoList}
                                    returnSelectRows={(rows) => returnSelectRows(rows)}
                                    viewPageName={{ name: "회원목록팝업", id: "회원목록팝업"}}
                                    isPageNation={true}
                                    isPageNationCombo={true}
                                    isSingleSelect={true}
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
