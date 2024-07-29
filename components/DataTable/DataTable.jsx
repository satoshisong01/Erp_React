import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import $ from "jquery";
import "../../css/componentCss/Code.css";
import DataPutModal from "./DataPutModal";
import DataTableButton from "components/button/DataTableButton";
import DataPostModal from "./DataPostModal";

const DataTable = (props) => {
    const { returnKeyWord, columns, suffixUrl, addBtn, customerList, dataTest } = props;

    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창 true, false
    const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창
    const [isCheck, setIsCheck] = useState(false); //체크된 데이터 확인
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터 저장
    const [tableData, setTableData] = useState([]); //데이터 저장
    const [testtest, setTestTest] = useState([]);
    const dataTableRef = useRef(null); //dataTable Ref 지정

    const [errorOn, setErrorOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false); //로딩화면(true 일때 로딩화면)
    //const [uniqueValues, setUniqueValues] = useState([]); //추출한 col값 저장
    const addData = columns[columns.length - 1].listItem;
    const addListURL = columns[columns.length - 1].addListURL;

    const [saveList, setSaveList] = useState([]);
    const [currentPages, setCurrentPages] = useState(1);

    const [pageLength, setPageLength] = useState(10);

    //useEffect(() => {
    //    $(dataTableRef.current).DataTable().destroy();
    //    console.log("⭕ check box select: ", selectedData);
    //    console.log("범인찾기");
    //}, [selectedData]);

    const removeInt = columns[0].col;

    const changeInt = selectedData.map((item) => item[removeInt]);

    //setChangeInt(selectedData.map((item) => item[removeInt]));

    useEffect(() => {
        $(dataTableRef.current).DataTable().destroy();
        fetchAllData(); /* 맨 처음 전체 데이터 불러오기 */
    }, [currentPages]);

    useEffect(() => {
        setTestTest(dataTest);
    }, [dataTest]);

    // 페이지 변경 함수
    const changePage = (newPage) => {
        setCurrentPages(newPage);
    };

    console.log(tableData, "********************");

    //const handleErrorCtrl = (value) => {
    //    setErrorOn(value);
    //    console.log(value, "에러온오프값");
    //    console.log(errorOn, "받은 에러값");
    //};

    const handleSendLoading = (value) => {
        setIsLoading(value);
    };

    useEffect(() => {
        const updateColumnWidth = () => {
            if (dataTableRef.current) {
                /* 컬럼의 너비를 동적으로 설정 */
                const thElements = dataTableRef.current.querySelectorAll("th:not(.tableHeaderTh)");
                const elementsLength = Math.min(thElements.length, columns.length);
                for (let i = 0; i < elementsLength; i++) {
                    thElements[i].style.width = columns[i].cellWidth;
                }
            }
        };
        updateColumnWidth();
    }, [columns]);

    const selectAllData = (e) => {
        const checked = e.target.checked;
        setIsCheck(checked);

        if (checked) {
            // 현재 페이지에 표시되는 항목만 선택
            const currentPageItems = tableData.slice((currentPages - 1) * pageLength, currentPages * pageLength);
            setSelectedData([...currentPageItems]);
        } else {
            setSelectedData([]);
        }
    };

    const ItemCheckboxClick = (item, e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedData((prevSelectedData) => [...prevSelectedData, item]);
        } else {
            setSelectedData((prevSelectedData) => prevSelectedData.filter((data) => data[columns[0].col] !== item[columns[0].col]));
        }
    };

    /* column click */
    //const onClick = (e, item) => {
    //    console.log("⭕ click item: ", item);
    //};

    /* 서버에서 전체 데이터 가져오기 */
    const fetchAllData = async () => {
        //setTableData(dummyData);
        //setIsLoading(true); // 로딩 화면 활성화
        try {
            if (suffixUrl === "") return;

            const url = `/api${suffixUrl}/totalListAll.do`;

            const requestData = { lockAt: "Y" };

            const resultData = await axiosFetch(url, requestData);
            console.log(resultData, "불러온값");
            if (resultData) {
                $(dataTableRef.current).DataTable().destroy();
                setTableData(resultData);
            }
            setIsLoading(false); // 로딩 화면 비활성화
        } catch {
            $(dataTableRef.current).DataTable().destroy();
        } finally {
            $(dataTableRef.current).DataTable().destroy();
        }
    };

    /* 데이터 업데이트 */
    const updateData = async (updatedData) => {
        console.log(updatedData, "수정된값");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/edit.do`;
        const requestData = { ...updatedData, lockAt: "Y", useAt: "Y" };

        // API 호출 등의 로직 실행
        const resultData = await axiosUpdate(url, requestData);

        //테이블 데이터 업데이트
        const updatedTableData = tableData.map((item) => (item[columns[0].col] === updatedData[columns[0].col] ? updatedData : item));
        console.log(updatedTableData, "이거머지");
        setTableData(updatedTableData);
        console.log(tableData, "바뀌고 난값");
        if (resultData) {
            //fetchAllData();
            alert("값을 변경했습니다💚💚");
        }
    };

    /* 데이터 삭제 */
    const deleteData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/removeAll.do`;
        const resultData = await axiosDelete(url, {
            data: changeInt,
        });

        if (resultData) {
            setSelectedData([]);
            fetchAllData();
            alert("삭제되었습니다🧹🧹");
        }
    };

    /* 데이터 추가하기 */
    const postData = async (postData) => {
        setIsLoading(true); // 로딩 화면 활성화

        // 필수 필드가 비어있는지 확인
        const requiredFields = columns.filter((col) => col.require);
        const emptyRequiredFields = requiredFields.filter((col) => !postData[col.col]);

        if (emptyRequiredFields.length > 0) {
            setIsLoading(false); // 로딩 화면 비활성화
            return;
        }

        console.log(postData, "받아온데이터");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/add.do`;
        const requestData = { ...postData, lockAt: "Y", userAt: "Y" };

        try {
            // API 호출 등의 로직 실행
            const resultData = await axiosPost(url, requestData);
            console.log(resultData, "결과값");

            if (resultData) {
                fetchAllData();
                alert("추가 되었습니다!✅✅✅✅");
                setPostModalOpen(false);
            }
        } catch (error) {
            //setPostModalOpen(true);
            //setErrorOn(true);
            setErrorOn(true);
            console.log("에러받았다(에러시) 3번");
        } finally {
            setIsLoading(false); // 로딩 화면 비활성화
        }
    };

    /* 데이터 검색하기 */
    const searchData = async (returnKeyWord) => {
        console.log(returnKeyWord, "받아온데이터");
        if (suffixUrl === "") return;
        let url = ``;
        if (customerList) {
            url = `/api${suffixUrl}/${customerList}/totalListAll.do`;
        } else {
            url = `/api${suffixUrl}/totaltotalListAll.do`;
        }
        //const url = `/api${suffixUrl}/${currentPage}/totaltotalListAll.do`;
        const requestData = {
            useAt: returnKeyWord.radioOption,
            searchCondition: returnKeyWord.searchCondition,
            searchKeyword: "",
            ...returnKeyWord,
        };
        console.log(requestData, "여기까지찍히나?");
        // API 호출 등의 로직 실행
        try {
            const resultData = await axiosScan(url, requestData);
            console.log(resultData, "결과값을 봐야지");
            setTableData(resultData);
        } catch (error) {
            alert("날짜를 모두 입력해주세요");
            fetchAllData();
        }
    };

    useEffect(() => {
        if (returnKeyWord) {
            $(dataTableRef.current).DataTable().destroy();
            searchData(returnKeyWord);
        }
    }, [returnKeyWord]);

    useEffect(() => {
        if (tableData.length > 0) {
            if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }
            $(dataTableRef.current).DataTable({
                paging: true,
                ordering: true,
                pageLength: pageLength,
                lengthMenu: [5, 10, 15, 30, 50, 100],
                autoWidth: true,
                initComplete: function () {
                    // lengthMenu에서 숫자를 선택하면 해당 숫자를 pageLength에 할당
                    $(this.api().table().container())
                        .find(".dataTables_length select")
                        .on("change", function () {
                            const selectedLength = parseInt($(this).val(), 10);
                            setPageLength(selectedLength);
                        });
                    $(this.api().table().container())
                        .find(".paginate_button")
                        .on("click", function () {
                            const newPage = parseInt($(this).attr("data-dt-idx"), 10);
                            changePage(newPage + 1);
                        });
                },
            });
        }
    }, [tableData, pageLength]);

    const handleModalClick = (e, item) => {
        setModalItem({ original: item });
        setModalOpen(true);
    };

    const deleteClick = () => {
        console.log("삭제버튼 클릭");
        deleteData();
    };

    const addClick = async () => {
        console.log("1번");
        setIsLoading(true); // 로딩 화면 활성화
        setErrorOn(false);
        //이전테이블에서 join된값을 불러오는 기능
        if (addData) {
            let url = `/api${addListURL}/totalListAll.do`;
            let requestData = { lockAt: "Y" };

            let resultData = await axiosFetch(url, requestData);
            console.log(resultData, "추가버튼시 값을불러와야함");

            console.log(addData);

            let clCodeValues = resultData.map((item) => item[addData]);
            setSaveList(clCodeValues);

            console.log(saveList, "값이안들어가?");
            setPostModalOpen(true);
        }
        setPostModalOpen(true);
        setIsLoading(false); // 로딩 화면 활성화
    };

    const excelClick = () => {};

    const copyClick = async () => {
        const headers = columns.map((item) => item.header);
        const fields = columns.map((item) => item.col);

        console.log(headers, "헤더");
        console.log(fields, "필드");

        const headersString = headers.join("\t\t");
        const dataString = `${headersString}\n${selectedData.map((item) => fields.map((field) => item[field]).join("\t")).join("\n")}`;

        try {
            await navigator.clipboard.writeText(dataString);
            alert("테이블이 복사되었습니다!");
        } catch (error) {
            console.error("클립보드 복사 중 에러 발생 writeText:", error);
            console.log("대체하는 복사기능 동작");
            // 복사 기능이 실패했을 때 대안으로 텍스트를 선택하여 복사할 수 있는 방법을 제시합니다.
            const textarea = document.createElement("textarea");
            textarea.value = dataString;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "absolute";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("테이블이 선택된 텍스트로 복사되었습니다. Ctrl+C 또는 Command+C를 눌러 복사하세요.");
        }
    };

    const printClick = () => {
        console.log("출력!");
    };
    useEffect(() => {
        if (returnKeyWord) {
            searchData(returnKeyWord);
        }
        // 검색 후 5초 뒤에 setIsLoading(false)로 변경
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => {
            // 컴포넌트가 unmount 될 때 타임아웃을 클리어하여 메모리 누수 방지
            clearTimeout(loadingTimeout);
        };
    }, [returnKeyWord]);

    return (
        <>
            <div className="buttonBody">
                <DataTableButton
                    deleteClick={deleteClick}
                    excelClick={excelClick}
                    copyClick={copyClick}
                    addClick={addClick}
                    printClick={printClick}
                    dataTableRef={dataTableRef}
                    fetchAllData={fetchAllData}
                    addBtn={addBtn}
                    columns={columns}
                    suffixUrl={suffixUrl}
                    selectedData={selectedData}
                />
            </div>
            {isLoading ? (
                // 로딩 화면을 보여줄 JSX
                <div className="Loading">
                    <div className="spinner"></div>
                    <div> Loading... </div>
                </div>
            ) : (
                // 데이터 테이블을 보여줄 JSX
                <div className="tableBody" id="print-content">
                    <div className="widget-body">
                        <>
                            <div className="tableBox">
                                <table ref={dataTableRef} className="table table-bordered" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th className="tableHeaderTh" id="checkBoxAll">
                                                <input id="thCheckBox" type="checkbox" checked={isCheck} onChange={selectAllData} />
                                            </th>
                                            {columns.map((column, index) => {
                                                if (column.notView) {
                                                    return null; // notView 값이 false인 컬럼의 제목은 출력하지 않음
                                                }
                                                return <th key={index}>{column.header}</th>;
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(testtest ? testtest : tableData).map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        id="checkBoxItem"
                                                        checked={selectedData.some((selectedItem) => selectedItem[columns[0].col] === item[columns[0].col])}
                                                        onChange={(e) => ItemCheckboxClick(item, e)}
                                                    />
                                                </td>
                                                {columns.map((column, colIndex) => {
                                                    if (column.notView) {
                                                        return null; // notView 값이 false인 컬럼은 출력하지 않음
                                                    }
                                                    const cellValue = item[column.col] || (item[column.col] === 0 ? "0" : "No data yet.");
                                                    let formattedValue;
                                                    if (typeof cellValue === "number") {
                                                        formattedValue = cellValue.toLocaleString();
                                                    } else if (column.col === "createDate") {
                                                        // 시, 분 나오는 부분 자르고 연도/월/일 까지만(공백기준 자르기)
                                                        const datePart = cellValue.split(" ")[0];
                                                        formattedValue = datePart;
                                                    } else if (column.col === "lastModifyDate") {
                                                        // 시, 분 나오는 부분 자르고 연도/월/일 까지만(공백기준 자르기)
                                                        const datePart = cellValue.split(" ")[0];
                                                        formattedValue = datePart;
                                                    } else {
                                                        formattedValue = cellValue;
                                                    }
                                                    return (
                                                        <td
                                                            className="tdStyle"
                                                            key={colIndex}
                                                            onDoubleClick={(e) => {
                                                                handleModalClick(e, item);
                                                            }}>
                                                            {formattedValue}
                                                            {/* 기존코드 {item[column.col]}*/}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    </div>
                    {modalOpen && (
                        <DataPutModal
                            onClose={() => {
                                setModalOpen(false);
                            }}
                            columns={columns}
                            initialData={modalItem}
                            updateData={updateData}
                        />
                    )}
                    {postModalOpen && (
                        <DataPostModal
                            postData={postData}
                            columns={columns}
                            saveList={saveList}
                            fetchAllData={fetchAllData}
                            errorOn={errorOn}
                            handleSendLoading={handleSendLoading}
                            onClose={() => {
                                setPostModalOpen(false);
                            }}
                            onOpen={() => {
                                setPostModalOpen(true);
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};
export default DataTable;
