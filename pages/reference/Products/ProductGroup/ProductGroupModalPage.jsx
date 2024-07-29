import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import $ from "jquery";
import "../../../../components/modal/ModalSearch.css";
import axios from "axios";
//import Header from "./Header";

export default function ProductGroupModalPage({
    onClose,
    clickData,
    refresh,
    urlName,
    headers,
}) {
    //const [data] = useState(getData());
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [data, setData] = useState({
        clCode: "",
        clCodeNm: "",
        clCodeDc: "",
        createIdBy: "",
        createDate: "",
        lastModifiedIdBy: "",
        lastModifyDate: "",
    });

    console.log(data, "기본으로 받은값");

    useEffect(() => {
        setData(clickData);
    }, [clickData]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log(data, "변경후값");
    };

    const onModify = async (e) => {
        e.preventDefault();

        try {
            const options = { headers: headers };

            const response = await axios.put(
                //`http://192.168.0.113:8080/api/bsinMngmn/product/${urlName}/edit.do`,
                `http://localhost:8080/api/bsinMngmn/product/${urlName}/edit.do`,
                data,
                options
            );
            console.log(response, "보낸값?");
            refresh();
        } catch (error) {
            console.log(error, "수정 에러입니다");
        } finally {
            alert("수정 되었습니다");
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
        }
    };

    return (
        <div
            className="modal-dialog demo-modal"
            style={{ margin: "0", zIndex: "9999" }}>
            <div className="modal-content" style={{ border: "0" }}>
                <article className="product-modal">
                    <div className="product-modal-bg"></div>

                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div
                                className="modal-header"
                                style={{ border: "none" }}>
                                <h4 className="modal-title">프로젝트 목록</h4>
                            </div>
                            <div
                                className="product-modal-close-btn"
                                onClick={onClose}>
                                <i
                                    style={{
                                        fontSize: "2rem",
                                        //padding: "0.5rem",
                                        color: "#CCCCCC",
                                        borderRadius: "15%",
                                    }}
                                    className="fa fa-times"
                                />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <div
                                className="submitProduct"
                                style={{ marginTop: "30px" }}>
                                {urlName === "productGroup" && (
                                    <>
                                        분류코드ID:
                                        <input
                                            type="text"
                                            name="clCode"
                                            value={data.clCode}
                                            onChange={inputChange}
                                        />
                                        분류코드명:
                                        <input
                                            type="text"
                                            name="clCodeNm"
                                            value={data.clCodeNm}
                                            onChange={inputChange}
                                        />
                                        분류코드 설명 :
                                        <input
                                            type="text"
                                            name="clCodeDc"
                                            value={data.clCodeDc}
                                            onChange={inputChange}
                                        />
                                    </>
                                )}
                                {urlName === "groupCode" && (
                                    <>
                                        분류코드명:
                                        <input
                                            type="text"
                                            name="clCodeNm"
                                            value={data.clCodeNm}
                                            onChange={inputChange}
                                        />
                                        그룹코드:
                                        <input
                                            type="text"
                                            name="codeId"
                                            value={data.codeId}
                                            onChange={inputChange}
                                        />
                                        그룹코드명:
                                        <input
                                            type="text"
                                            name="codeIdNm"
                                            value={data.codeIdNm}
                                            onChange={inputChange}
                                        />
                                        그룹코드설명:
                                        <input
                                            type="text"
                                            name="codeIdDc"
                                            value={data.codeIdDc}
                                            onChange={inputChange}
                                        />
                                    </>
                                )}
                                {urlName === "detailCode" && (
                                    <>
                                        그룹코드
                                        <input
                                            type="text"
                                            name="codeId"
                                            value={data.codeId}
                                            onChange={inputChange}
                                        />
                                        상세코드ID:
                                        <input
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            onChange={inputChange}
                                        />
                                        상세코드명:
                                        <input
                                            type="text"
                                            name="codeNm"
                                            value={data.codeNm}
                                            onChange={inputChange}
                                        />
                                        상세코드설명:
                                        <input
                                            type="text"
                                            name="codeDc"
                                            value={data.codeDc}
                                            onChange={inputChange}
                                        />
                                    </>
                                )}
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={onClose}>
                                        Close
                                    </button>
                                    <button
                                        style={{
                                            margin: "0",
                                            marginLeft: "10px",
                                        }}
                                        type="button"
                                        className="btn btn-primary modal-btn-close"
                                        onClick={onModify}>
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    );
}
