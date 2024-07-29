import { axiosFetch, axiosFileUpload } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ onFileSelect }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const { fileName } = useContext(PageContext);

    //useEffect(() => {
    //    fetchAllData();
    //}, []);

    const onDrop = useCallback(
        (acceptedFiles) => {
            console.log("Accepted Files:", acceptedFiles);

            if (onFileSelect && acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles); //부모로 콜백
                setUploadedFiles(acceptedFiles);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "*/*",
        onDrop,
    });
    //const fetchAllData = async () => {
    //    const url = `/file/totalListAll.do`;
    //    const resultData = await axiosFetch(url, { useAt: "Y" });
    //    if (resultData) {
    //        //console.log(resultData, "데이터나오나");
    //    } else if (!resultData) {
    //        console.log("에러코드나오나");
    //    }
    //};

    const showDefaultMessage = uploadedFiles.length === 0;

    return (
        <>
            <div {...getRootProps()} style={dropzoneStyles(isDragActive)}>
                <input {...getInputProps()} />
                {isDragActive ? <p>파일을 놓아주세요!</p> : null}
                {showDefaultMessage && !isDragActive && <p>파일을 끌어서 놓거나 클릭하여 업로드하세요.</p>}
                {uploadedFiles &&
                    uploadedFiles.map((item) => (
                        <p key={item.name}>
                            업로드된 파일: <span style={{ backgroundColor: "yellow" }}>{item.name}</span>
                        </p>
                    ))}
            </div>
            <div>
                {fileName &&
                    fileName.map((item) => (
                        <p>
                            업로드 된 파일: <span>{item}</span>
                        </p>
                    ))}
            </div>
        </>
    );
};

const dropzoneStyles = (isDragActive) => ({
    width: "100%",
    height: "200px",
    border: `2px dashed ${isDragActive ? "green" : "#ddd"}`,
    backgroundColor: `${isDragActive ? "pink" : "#fff"}`,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
});

export default FileUpload;
