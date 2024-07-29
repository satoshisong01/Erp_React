import React, { useContext, useEffect, useRef, useState } from "react";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch } from "api/axiosFetch";
import ModalCondition from "components/ModalCondition";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";

/* 프로젝트 목록 모달 */
export default function ProjectModal(props) {
    const { width, height, onClose, title, returnInfo } = props;
    const { setProjectInfo, setModalPageName, setIsModalTable } = useContext(PageContext);
    const [projectList, setProjectList] = useState([]);
    const [selectInfo, setSelectInfo] = useState({});
    const bodyRef = useRef(null);

    useEffect(() => {
        getProjectList();
        setModalPageName("프로젝트팝업");
        setIsModalTable(true);

        return () => {
            //초기화
            setIsModalTable(false);
            setModalPageName("");
        };
    }, []);

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const getProjectList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/pjOrdrInfo/totalListAll.do", requestData || {});
        setProjectList(resultData);
    };

    const columns = [
        { header: "프로젝트아이디", col: "poiId", notView: true },
        { header: "비고", col: "poiDesc", notView: true },
        { header: "최종수정일", col: "lastModifyDate", notView: true },
        { header: "기준연도", col: "poiMonth", notView: true },
        { header: "프로젝트명", col: "poiNm", cellWidth: "213" },
        { header: "계약일", col: "poiBeginDt", cellWidth: "100" },
        { header: "상태", col: "poiStatus", cellWidth: "100" },
        { header: "담당자", col: "poiManagerId", cellWidth: "100" },
        { header: "영업대표", col: "poiSalmanagerId", cellWidth: "100" },
    ];

    const conditionList = [
        { title: "프로젝트명", col: "poiNm", type: "input" },
        { title: "계약일", col: "poiBeginDt", type: "dayPicker", disabled: true },
        { title: "상태", col: "poiStatus", type: "input" },
    ];

    const onSearch = (value) => {
        getProjectList(value);
    };

    const onClick = (e) => {
        e.preventDefault();
        returnInfo({ ...selectInfo });
        setProjectInfo({}); //초기화
        onClose();
    };

    const returnSelect = (value) => {
        setSelectInfo((prev) => (prev.poiId !== value.poiId ? value : prev));
    };

    return (
        <article className="me-modal">
            <div className="me-modal-container" style={{ width, height }}>
                <div className="me-modal-inner">
                    <div className="me-modal-header">
                        <h4 className="header-title">{title}</h4>
                        <div className="header-close" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} className="button" size="lg" />
                        </div>
                    </div>

                    <div className="me-modal-body" ref={bodyRef}>
                        <div className="body-area" style={{ gap: 0 }}>
                            <ModalCondition conditionList={conditionList} onSearch={onSearch} refresh={() => getProjectList()} />
                            <ReactDataTable
                                columns={columns}
                                customDatas={projectList}
                                returnSelect={returnSelect}
                                viewPageName={{ name: "프로젝트팝업", id: "프로젝트팝업" }}
                                isPageNation={true}
                                isSingleSelect={true}
                                isPageNationCombo={true}
                            />
                        </div>
                    </div>

                    <div className="me-modal-footer mg-b-20">
                        <div className="table-buttons" style={{ justifyContent: "center" }}>
                            <button
                                type="button"
                                className="table-btn table-btn-default"
                                data-dismiss="modal"
                                style={{ width: "100%" }}
                                onClick={() => onClose()}>
                                취소
                            </button>
                            <button type="button" className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
