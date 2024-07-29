import React, { useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import XLSX from "xlsx-js-style";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../../../css/componentCss/CodeUtilBtn.css";
import axios from "axios";
import AuthorModalPagePost from "./AuthorModalPagePost";

export default function AuthorUtilBtn({
    initialData,
    refresh,
    changeInt,
    selectedData,
    urlName,
    headers,
}) {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [Author, setAuthor] = useState(1); //키 값 넘버자동 1씩추가
    const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창

    console.log(urlName);

    //버튼 활성화 (코드관리에서는 엑셀버튼은 비활성화)
    const showExcelBtn =
        urlName === "author" ||
        urlName === "groupCode" ||
        urlName === "detailCode"
            ? true
            : false;
    const showCopyBtn = true;
    const showPrintBtn = true;
    const showDeleteBtn = true;
    const showAddBtn = true;

    //setData(initialData);
    //console.log(initialData);

    //setSelectedData(selectedData2);

    //const changeInt = selectedData.map((item) => item.clCode); //체크된 데이터 배열로 담아서 저장
    //console.log(changeInt);

    //------------------------------- Excel 파일 다운로드 --------------------------------------

    // STEP 1: 새로운 workbook을 만든다
    const wb = XLSX.utils.book_new();

    // STEP 2: 데이터 rows에 대한 value와 style을 지정해준다.
    const header =
        selectedData.length > 0
            ? [
                  { v: "코드", t: "s" },
                  { v: "코드명", t: "s" },
                  { v: "코드 설명", t: "s" },
                  { v: "작성자", t: "s" },
                  { v: "작성일", t: "s" },
                  { v: "수정자", t: "s" },
                  { v: "수정일", t: "s" },
              ].map((column) => ({
                  ...column,
                  s: {
                      font: { sz: "15" },
                      border: {
                          top: { color: { rgb: "000000" } },
                          bottom: { color: { rgb: "000000" } },
                          left: { color: { rgb: "000000" } },
                          right: { color: { rgb: "000000" } },
                      },
                  },
              }))
            : [];

    // STEP 3: 바디 생성
    const body = selectedData.map((item) =>
        [
            { v: item.clCode, t: "s" },
            { v: item.clCodeNm, t: "s" },
            { v: item.clCodeDc, t: "s" },
            { v: item.createIdBy, t: "s" },
            { v: item.createDate, t: "s" },
            { v: item.lastModifiedIdBy, t: "s" },
            { v: item.lastModifyDate, t: "s" },
        ].map((cell) => ({
            ...cell,
            s: { font: { color: { rgb: "188038" } } },
        }))
    );

    // STEP 3: header와 body로 worksheet를 생성한다.
    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);

    // 열의 너비를 조정
    const columnWidths = header.map((col) => ({ wch: 30 }));
    ws["!cols"] = columnWidths;

    // worksheet를 workbook에 추가한다.
    XLSX.utils.book_append_sheet(wb, ws, "readme demo");

    //------------------------------- Excel 파일 다운로드 --------------------------------------

    //----------------------------------- Copy 버튼  -------------------------------------------

    const tableCopyBtn = (urlName) => {
        let headers;
        let fields;

        if (urlName === "Author") {
            headers = [
                "코드",
                "코드명",
                "코드 설명",
                "작성자",
                "작성일",
                "수정자",
                "수정일",
            ];
            fields = [
                "clCode",
                "clCodeNm",
                "clCodeDc",
                "createIdBy",
                "createDate",
                "lastModifiedIdBy",
                "lastModifyDate",
            ];
        } else if (urlName === "groupCode") {
            headers = [
                "코드명",
                "그룹코드",
                "그룹코드명",
                "그룹코드설명",
                "작성자",
                "작성일",
                "수정자",
                "수정일",
            ];
            fields = [
                "clCodeNm",
                "codeId",
                "codeIdNm",
                "codeIdDc",
                "createIdBy",
                "createDate",
                "lastModifiedIdBy",
                "lastModifyDate",
            ];
        } else if (urlName === "detailCode") {
            headers = [
                "그룹코드",
                "그룹코드명",
                "상세코드",
                "상세코드명",
                "상세코드설명",
                "작성자",
                "작성일",
                "수정자",
                "수정일",
            ];
            fields = [
                "codeId",
                "codeIdNm",
                "code",
                "codeNm",
                "codeDc",
                "createIdBy",
                "createDate",
                "lastModifiedIdBy",
                "lastModifyDate",
            ];
        } else {
            console.log("유효하지 않은 urlName입니다.");
            return;
        }

        const headersString = headers.join("\t");
        const dataString = `${headersString}\n${initialData
            .map((item) => fields.map((field) => item[field]).join("\t"))
            .join("\n")}`;

        navigator.clipboard.writeText(dataString);
        alert("테이블이 복사되었습니다!");
    };

    //----------------------------------- Copy 버튼  -------------------------------------------

    //---------------------------------- Print 버튼  -------------------------------------------

    const handlePrint = () => {
        const table = $(dataTableRef.current).DataTable();
        table.rows().data().toArray();

        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(`
        <html>
          <head>
            <title>Print Table</title>
            <style>
              /* 원하는 스타일을 지정하세요 */
            </style>
          </head>
          <body>
            <table>
              <thead>
                <tr>
                  안녕하세요
                </tr>
              </thead>
              <tbody>
                <td>
                  안녕
                </td>
              </tbody>
            </table>
          </body>
        </html>
      `);
        printWindow.document.close();
        printWindow.print();
    };

    //---------------------------------- Print 버튼  -------------------------------------------
    //----------------------------------- 삭제 버튼  -------------------------------------------

    const handleDelete = async () => {
        try {
            const options = {
                headers: headers,
                data: changeInt,
            };
            const response = await axios.delete(
                `http://192.168.0.113:8080/api/system/code/${urlName}/removeAll.do`,
                options
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            refresh();
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
            alert("데이터가 삭제 되었습니다!");
        }
    };

    //----------------------------------- 삭제 버튼  -------------------------------------------

    //---------------------------------- 모달창 수정  ------------------------------------------

    const handleModalPostClick = (e) => {
        console.log(e);
        //console.log(item);
        //setModalItem(item);
        setAuthor(Author + 1);
        setPostModalOpen(true);
    };

    //---------------------------------- 모달창 수정  ------------------------------------------

    return (
        <div>
            {/*<div className="tableBtn">
                <button
                    className="btn btn-primary"
                    id="utilBtn"
                    onClick={() => {
                        // STEP 4: Write Excel file to browser (Specify the file name in the second argument)
                        XLSX.writeFile(wb, "table-demo.xlsx");
                    }}
                >
                    <img className="btnImg" src={excelImg} />
                    CSV
                </button>
                <CopyToClipboard text={urlName} onCopy={tableCopyBtn}>
                    <button id="utilBtn" className="btn btn-primary">
                        <img className="btnImg" src={copyImg} />
                        Copy
                    </button>
                </CopyToClipboard>
                <button
                    id="utilBtn"
                    className="btn btn-primary"
                    onClick={handlePrint}
                >
                    <img className="btnImg" src={printImg} />
                    Print
                </button>
                <button
                    id="utilBtn"
                    className="btn btn-primary"
                    onClick={handleDelete}
                >
                    <img className="btnImg" src={deleteImg} />
                    삭제
                </button>
                <button
                    className="btn btn-primary"
                    id="utilBtn"
                    onClick={(e) => handleModalPostClick(e)}
                >
                    <img className="btnImg" src={plusImg} />
                    추가
                </button>
            </div>*/}
            <div className="tableBtn">
                {showExcelBtn && (
                    <button
                        className="btn btn-primary csvIcon"
                        id="utilBtn"
                        onClick={() => {
                            // STEP 4: Write Excel file to browser (Specify the file name in the second argument)
                            XLSX.writeFile(wb, "table-demo.xlsx");
                        }}>
                        <i className="fa fa-file-excel-o utilIcon" />
                        CSV
                    </button>
                )}
                {showCopyBtn && (
                    <CopyToClipboard text={urlName} onCopy={tableCopyBtn}>
                        <button
                            id="utilBtn"
                            className="btn btn-primary copyIcon">
                            <i className="fa fa-copy utilIcon" />
                            Copy
                        </button>
                    </CopyToClipboard>
                )}
                {showPrintBtn && (
                    <button
                        id="utilBtn"
                        className="btn btn-primary printIcon"
                        onClick={handlePrint}>
                        <i className="fa fa-print utilIcon" />
                        Print
                    </button>
                )}
                {showDeleteBtn && (
                    <button
                        id="utilBtn"
                        className="btn btn-primary delIcon"
                        onClick={handleDelete}>
                        <i className="fa fa-trash-o utilIcon" />
                        삭제
                    </button>
                )}
                {showAddBtn && (
                    <button
                        className="btn btn-primary addIcon"
                        id="utilBtn"
                        onClick={(e) => handleModalPostClick(e)}>
                        <i className="fa fa-plus utilIcon" />
                        추가
                    </button>
                )}
            </div>

            {postModalOpen && (
                <AuthorModalPagePost
                    onClose={() => {
                        setPostModalOpen(false);
                    }}
                    refresh={refresh}
                    countAuthor={Author}
                    urlName={urlName}
                    headers={headers}
                />
            )}
        </div>
    );
}
