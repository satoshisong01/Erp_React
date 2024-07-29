import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill 스타일 시트 임포트
import "../css/custom-style.scss";
// import * as QuillTableUI from 'quill-table-ui'
import "quill-table-ui/dist/index.css"; // quill-table-ui의 스타일 시트 임포트
import Table from "quill-table-module"; // Quill Table 모듈 임포트
import Quill from "quill"; // Quill 라이브러리 임포트

Quill.register("modules/table", Table);

const QuillEditor = ({ isProgress, returnData, writing, readContent }) => {
    const defaultContent = `
            <p>✔️ 변경계약인 경우</p>
            <ul>
                <li>o 변경사유</li>
                <li>o 변경내용</li>
                <ul>
                    <li>- 기존금액 , 변경금액 , 차액( +,-)</li>
                    <li>- 기존납기, 변경 납기</li>
                    <li>- 기타 변경 내용을 기존과 신규내용을 비교 서술할 것</li>
                </ul>
            </ul>
            <p>✔️ 신규계약인 경우</p>
            <ul>
                <li>o 계약명(프로젝트명)/사이트</li>
                <li>o 수주금액/원가/이익율</li>
                <li>o 고객사 PM/담당자</li>
                <li>o 추진조직 : PM/PLC/HMI/지원/외주</li>
                <li>o 공사 개요</li>
                <li>o 공사 범위</li>
            <p>o 추진일정(납기)</p>
            <ul>
                <li>- 프로그램 개발</li>
                <li>- 단품구매/외주발주</li>
                <li>- 판넬제작</li>
                <li>- 사내테스트</li>
                <li>- 시운전</li>
            </ul>
        </ul>
    `;

    const [content, setContent] = useState(defaultContent);

    useEffect(() => {
        if (readContent) {
            setContent(readContent);
        }
    }, [readContent]);

    useEffect(() => {
        if (!isProgress) {
            returnData && returnData(content);
        }
        // else {
        //     setContent(defaultContent); //초기화
        // }
    }, [isProgress]);

    useEffect(() => {
        writing && writing(content);
    }, [content]);

    const contentChange = (value) => {
        //실시간
        setContent(value);
    };

    // Quill의 옵션 설정
    const quillOptions = {
        modules: {
            toolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ table: true }][
                    // ['link', 'image', 'video'],
                    "clean"
                ],
            ],
            // tableUI: true,
            // table: true,
            clipboard: {
                matchVisual: false,
            },
        },
        formats: [
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
            "table",
        ],
    };

    // const modules = {
    //     toolbar: [
    //       ["bold", "italic", "underline", "strike"],
    //       [{ list: "ordered" }, { list: "bullet" }],
    //       [{ table: true }],
    //       ["clean"],
    //     ],
    //   };

    //   const formats = [
    //     "bold",
    //     "italic",
    //     "underline",
    //     "strike",
    //     "list",
    //     "bullet",
    //     "table",
    //   ];

    return (
        <ReactQuill
            theme="snow"
            value={content}
            onChange={contentChange}
            modules={quillOptions.modules}
            formats={quillOptions.formats}
            // modules={modules}
            // formats={formats}
            style={{ height: "100%" }}
        />
    );
};

export default QuillEditor;
