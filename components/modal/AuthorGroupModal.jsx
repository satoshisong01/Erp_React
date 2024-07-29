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

/* 권한그룹(팀) 목록 모달 */
export default function AuthorGroupModal(props) {
    const { width, height, isOpen, title, onClose } = props;
    const { setAuthorGroupInfo, setModalPageName, setIsModalTable } = useContext(PageContext);

    const [groupList, setGroupList] = useState([]);
    const [selectInfo, setSelectInfo] = useState({});
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            getGroupList();
            setModalPageName("권한그룹팝업");
            setIsModalTable(true);
            setAuthorGroupInfo({}); //초기화
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    const getGroupList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/member/authorGroup/totalListAll.do", requestData || {});
        setGroupList(resultData);
    };

    const columns = [
        { header: "그룹아이디", col: "groupId", notView: true },
        { header: "그룹코드", col: "groupCode", notView: true },
        { header: "조직아이디", col: "orgId", notView: true },
        { header: "그룹명", col: "groupNm", cellWidth: "516" },
    ];

    const conditionList = [
        { title: "그룹이름", col: "groupNm", type: "input" },
    ];

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight + 10}px`;
        }
    }, [height]);

    const onSearch = (value) => {
        getGroupList(value);
    };

    const onClick = (e) => {
        e.preventDefault();
        setAuthorGroupInfo({ ...selectInfo });
        onClose();
    };

    const returnSelect = (value) => {
        setSelectInfo((prev) => (prev.groupId !== value.groupId ? value : prev));
    };

    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
        >
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
                                <ModalSearchList conditionList={conditionList} onSearch={onSearch} refresh={() => getGroupList()} />
                                <ReactDataTable columns={columns} customDatas={groupList} returnSelect={returnSelect} viewPageName={{ name: "권한그룹팝업", id: "권한그룹팝업" }} isPageNation={true}/>
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
