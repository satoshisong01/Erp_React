import React, { useRef, useState } from "react";
import "../../../../components/modal/ModalSearch.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
//import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function DetailCodeModalPagePost({
    onClose,
    refresh,
    countDetailCode,
    urlName,
    headers,
    initialData,
}) {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [selectCodeId, setSelectCodeId] = useState("");
    const [data, setData] = useState({
        codeId: "",
        code: "",
        codeNm: "",
        codeDc: "",
        codeNum: "",
    });

    console.log(countDetailCode);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onAdd = async (e) => {
        e.preventDefault();

        const newData = {
            ...data,
            codeId: selectCodeId,
        };

        try {
            const options = {
                headers: headers,
            };
            const response = await axios.post(
                `http://192.168.0.113:8080/api/system/code/${urlName}/add.do`,
                newData,
                options
            );
            console.log(response, "추가한 값");
            refresh();
            onClose();
        } catch (error) {
            console.log(error, "추가 에러입니다");
        } finally {
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
            alert("추가 되었습니다");
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
                                <>
                                    그룹코드:
                                    <select
                                        name="codeId"
                                        onChange={(e) =>
                                            setSelectCodeId(e.target.value)
                                        }>
                                        <option>그룹코드를 정해주세요</option>
                                        {initialData.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.cmmnCode.codeId}>
                                                {item.cmmnCode.codeId}
                                            </option>
                                        ))}
                                    </select>
                                    상세코드:
                                    <input
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        onChange={inputChange}
                                    />
                                    상세코드 명:
                                    <input
                                        type="text"
                                        name="codeNm"
                                        value={data.codeNm}
                                        onChange={inputChange}
                                    />
                                    상세코드 설명:
                                    <input
                                        type="text"
                                        name="codeDc"
                                        value={data.codeDc}
                                        onChange={inputChange}
                                    />
                                    상세코드 번호:
                                    <input
                                        type="text"
                                        name="codeNum"
                                        value={data.codeNum}
                                        onChange={inputChange}
                                    />
                                </>

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
                                        onClick={onAdd}>
                                        ADD
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
