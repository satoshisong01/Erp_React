import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faFileLines, faXmark } from "@fortawesome/free-solid-svg-icons";
import { axiosDelete, axiosDownLoad, axiosFileAddUpload, axiosFileUpload } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import FileUpload from "./FileUpload";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 파일업로드 모달 */
export default function FileModal(props) {
    const { width, height, isOpen, title, onClose, tableFileInfo } = props;
    const { setModalPageName, setIsModalTable, setFilePageName, setFileInfo, fileInfo } = useContext(PageContext);
    const [uploadFileData, setUploadFileData] = useState([]);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setFilePageName("첨부파일팝업");
            setIsModalTable(true);
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

    /* 업로드된 파일 저장 */
    const onFileSelect = (acceptedFiles) => {
        console.log("업로드파일:", acceptedFiles);
        setUploadFileData(acceptedFiles);
    };

    /* 확인 시, 파일 서버에 저장 */
    const onClickSubmit = async () => {
        console.log("tableFileInfo:", tableFileInfo);
        if (tableFileInfo && tableFileInfo !== undefined) { //기존부모에 새로운 자식 추가
            try {
                // console.log("💜 uploadFileData:", uploadFileData, "tableFileInfo.parentId:", tableFileInfo.parentId);
                // const result = await axiosFileAddUpload(`/file/upload.do`, uploadFileData, tableFileInfo.parentId);
                const result = await axiosFileAddUpload(`/file/upload.do`, uploadFileData, tableFileInfo.parentId);
                if (result) {
                    console.log("💜 새로운자식추가:", result);
                    // console.log("0.파일이 저장된 정보:", result);
                    const children = result.map(item => ({
                        originalFileNm: item.originalFileNm,
                        fileId: item.fileId
                    }))
                    // setFileInfo(prev => ({ //전역변수 저장
                    //     parentId: result[0].atchFileId,
                    //     childFile: {...prev.childFile, ...children},
                    //     fileLength: result.length
                    // }))
                    setFileInfo(result[0].atchFileId); //임시
                } else {
                    console.error("File upload failed.");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
            setUploadFileData([]); //초기화
            onClose();
        } else { // 최초 저장
            try {
                const result = await axiosFileUpload(`/file/upload.do`, uploadFileData);
                if (result) {
                    console.log("💜 최초저장:", result);
                    const children = result.map(item => ({
                        originalFileNm: item.originalFileNm,
                        fileId: item.fileId
                    }))
                    setFileInfo(result[0].atchFileId);//임시
                    // setFileInfo({ //전역변수 저장
                    //     parentId: result[0].atchFileId,
                    //     childFile: children,
                    //     fileLength: result.length
                    // })
                } else {
                    console.error("File upload failed.");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
            setUploadFileData([]); //초기화
            onClose();
        }
    };

    useEffect(() => {
        console.log("💜 전역변수 저장: ", fileInfo);
    }, [fileInfo])

    /* 파일업로드 */
    const clickDownLoad = async (row) => {
        try {
            const result = await axiosDownLoad(`/file/download.do`, { fileId: row.fileId });
            if (result) {
                alert(`${row.originalFileNm}파일이 다운로드 되었습니다`);
            }
        } catch (error) {
            console.error("Error");
        }
    };

    /* 파일삭제 */
    const clickDelete = async (row) => {
        try {
            const result = await axiosDelete(`/file/removeCompletely.do`, { fileId: row.fileId });
            console.log("💜 파일삭제:", result);
            if (result) {
                alert(`${row.originalFileNm}파일이 삭제 되었습니다`);
            }
        } catch (error) {
            console.error("Error");
        }
    };

    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            style={{ content: { width, height } }}
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
                                {/* 파일 업로드 */}
                                <FileUpload onFileSelect={onFileSelect} />
                            </div>
                            <div>
                                {tableFileInfo?.childFile?.map((row, index) => (
                                    <div style={{ display: "flex" }}>
                                        <button
                                            className="fileBtn"
                                            onClick={() => {
                                                clickDownLoad(row);
                                            }}
                                            key={index}>
                                            <FontAwesomeIcon icon={faFileLines} style={{ fontSize: "23px", marginRight: "20px" }} />
                                            {row.originalFileNm}
                                        </button>
                                        <button
                                            className="xBtn"
                                            onClick={() => {
                                                clickDelete(row);
                                            }}
                                            key={index}>
                                            <FontAwesomeIcon icon={faXmark} style={{ fontSize: "23px" }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="me-modal-footer mg-t-10 mg-b-20">
                            <div className="table-buttons" style={{ justifyContent: "center" }}>
                                <button className="table-btn table-btn-default" style={{ width: "100%" }} onClick={onClose}>
                                    취소
                                </button>
                                <button
                                    className="table-btn table-btn-primary"
                                    style={{ width: "100%" }}
                                    onClick={() => {
                                        onClickSubmit();
                                    }}>
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
