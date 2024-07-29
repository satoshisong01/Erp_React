import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch, axiosFileUpload } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import ModalSearchList from "components/ModalCondition";
import { PageContext } from "components/PageProvider";
import FileUpload from "./FileUpload";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 품목상세정보 목록 모달 */
export default function FileModal(props) {
    const { width, height, isOpen, title, onClose } = props;
    const { setModalPageName, setIsModalTable, setPdiNmList, pdiNmList, projectPdiNm, fileId, setFileId, fileName, setFileName, setProjectPdiNm } =
        useContext(PageContext);
    const [fileData, setFileData] = useState([]);

    const [productInfoList, setProductInfoList] = useState([]);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
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

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const onFileSelect = (acceptedFiles) => {
        setFileData(acceptedFiles);
    };

    let fileIdArray = [];
    let fileNameArray = [];

    const onClick = async () => {
        // 확인 버튼을 눌렀을 때에만 서버에 요청
        console.log(fileData, "배열로 들어와서 변경해줘야함");
        const url = `/file/upload.do`;
        try {
            const results = await Promise.all(fileData.map((file) => axiosFileUpload(url, file)));
            // results에는 각 파일에 대한 업로드 결과가 들어 있을 것입니다.

            fileIdArray = results.flatMap((innerArray) => innerArray.map((obj) => obj.fileId));
            fileNameArray = results.flatMap((innerArray) => innerArray.map((obj) => obj.originalFileNm));

            setFileId((prevFileId) => [...prevFileId, ...fileIdArray]);
            setFileName((prevFileName) => [...prevFileName, ...fileNameArray]);

            console.log("Files uploaded successfully:", results);
            console.log("FileId 추출한거:", fileIdArray, fileNameArray);
        } catch (error) {
            console.error("Error uploading files:", error);
        }
        onClose();
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
                                <FileUpload onFileSelect={onFileSelect} />
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
