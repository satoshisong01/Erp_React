import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";

const App = () => {
    const [data, setData] = useState([]);
    const dataTableRef = useRef(null);

    const headers = {
        Authorization: localStorage.jToken,
    };

    const initializeDataTable = () => {
        if (!dataTableRef.current) {
            // DataTable 객체가 없을 때만 초기화
            dataTableRef.current = $("#dataTable").DataTable({
                data: data,
                columns: [{ title: "clCode" }, { title: "clCodeDc" }, { title: "clCodeNm" }],
            });
        }
    };

    const reloadTable = () => {
        const options = {
            headers: headers,
        };
        const requestData = {
            useAt: "Y",
        };

        axios
            .post("http://192.168.0.162:8888/api/system/code/clCode/listAll.do", requestData, options)
            .then((response) => {
                console.log(response);
                setData(response.data.result.resultData);

                if (dataTableRef.current) {
                    // DataTable의 clear, rows.add, draw 메소드를 사용하여 테이블 업데이트
                    dataTableRef.current.clear().rows.add(data).draw();
                }
            })
            .catch((error) => {
                console.error("Error loading data:", error);
            });
    };

    useEffect(() => {
        reloadTable();
    }, []);

    useEffect(() => {
        initializeDataTable();
    }, [data]);

    return (
        <div className="App">
            <button onClick={reloadTable}>Reload Table</button>
            <table id="dataTable" className="display">
                <thead>
                    <tr>
                        <th>clCode</th>
                        <th>clCodeDc</th>
                        <th>clCodeNm</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.clCode}</td>
                            <td>{item.clCodeDc}</td>
                            <td>{item.clCodeNm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
