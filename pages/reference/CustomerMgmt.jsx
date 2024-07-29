import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";
import DeleteModal from "components/modal/DeleteModal";
import ModButton from "components/button/ModButton";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { columns } from "constants/columns";
import AddModModal from "components/modal/AddModModal";

/** 기준정보관리-거래처관리-고객사 */
function CustomerMgmt() {
    const { setNameOfButton, currentPageName } = useContext(PageContext);
    const itemDetailMgmtTable = useRef(null);
    const [returnKeyWord, setReturnKeyWord] = useState("");
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)
    const [tableData, setTableData] = useState([]);

    const columnsTable = [
        {
            header: "거래처ID",
            col: "cltId",
            cellWidth: "0",
            modify: true,
            add: true,
            notView: true,
        },
        {
            header: "거래처명",
            col: "cltNm",
            cellWidth: "150",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "대표자",
            col: "cltOwnrnm",
            cellWidth: "100",
            modify: true,
            add: true,
        },
        {
            header: "거래처타입",
            col: "cltType",
            cellWidth: "0",
            enable: false,
            itemType: ["거래처타입을 선택해 주세요", "고객사", "협력사"],
            itemTypeSymbol: ["", "C", "P"],
            modify: true,
            add: true,
            require: true,
            notView: true,
        },
        {
            header: "업태",
            col: "cltBusstype",
            cellWidth: "200",
            modify: true,
            add: true,
            textAlign: "left",
        },
        {
            header: "사업자번호",
            col: "cltBussnum",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        {
            header: "법인번호",
            col: "cltCprtnum",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        // {
        //     header: "우편번호",
        //     col: "cltZip",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        {
            header: "주소",
            col: "cltAddr",
            cellWidth: "300",
            modify: true,
            add: true,
            textAlign: "left",
        },
        // {
        //     header: "상세주소",
        //     col: "cltDetailAddr",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        {
            header: "회사번호",
            col: "cltTelno",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        {
            header: "FAX번호",
            col: "cltFaxnum",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        {
            header: "이메일",
            col: "cltEmail",
            cellWidth: "200",
            modify: true,
            add: true,
            textAlign: "left",
        },
        // {
        //     header: "계산서 담당자",
        //     col: "cltTaxBillManagerNm",
        //     cellWidth: "100",
        //     modify: true,
        //     add: true,
        // },
        // {
        //     header: "계산서 담당자 번호",
        //     col: "cltTaxBillManagerTelno",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        // {
        //     header: "계산서 담당자 이메일",
        //     col: "cltTaxBillManagerEmail",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        // {
        //     header: "설립일자",
        //     col: "setUpDate",
        //     cellWidth: "100",
        //     modify: true,
        //     add: true,
        //     require: true,
        // },
        {
            header: "기업회원ID",
            col: "esntlId",
            cellWidth: "100",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명2",
            col: "pgNm2",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명3",
            col: "pgNm3",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명4",
            col: "pgNm4",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명5",
            col: "pgNm5",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },

        {
            header: "품목ID",
            col: "pdiId",
            cellWidth: "0",
            enable: false,
            modify: false,
            add: true,
            selectOption: true,
            notView: true,
            listItem: "pdiId",
            addListURL: "/baseInfrm/product/productInfo",
        },
        {
            header: "비고",
            col: "cltDesc",
            cellWidth: "200",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
    ];

    const conditionList = [
        {
            title: "거래처명",
            colName: "cltNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "대표자",
            colName: "cltOwnrnm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "주소",
            colName: "cltAddr", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    useEffect(() => {
        fetchAllData();
    }, [currentPageName]);

    const refresh = () => {
        fetchAllData();
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/client/client/type/c/totalListAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData);
        setTableData(resultData);
        setIsLoading(false);
    };

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
        const url = `/api/baseInfrm/client/client/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
        };
        const resultData = await axiosPost(url, dataToSend);
        console.log(resultData);
        if (resultData) {
            alert("추가되었습니다");
            refresh();
        } else {
            alert("error!");
        }
    };

    const modifyToServer = async (updatedData) => {
        console.log("💜 modifyToServer:", updatedData);
        if (updatedData.length === 0) {
            alert("수정할 항목을 선택하세요.");
            return;
        }

        const url = `/api/baseInfrm/client/client/edit.do`;
        const updated = { ...updatedData, lockAt: "Y", useAt: "Y" };
        console.log(updated, "수정");
        const resultData = await axiosUpdate(url, updated);
        console.log(resultData);
        if (resultData) {
            alert("수정되었습니다");
            refresh();
        } else {
            alert("error!!수정");
        }
    };

    const deleteToServer = async (value) => {
        if (value === "임시삭제") {
            /* 임시삭제 코드 구현 */
        } else if (value === "영구삭제") {
            const poiNms = selectedRows.map((row) => row.cltId);
            const url = `/api/baseInfrm/client/client/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const returnData = (row) => {
        console.log(row);
        setDeleteNames([row.cltNm]);
        if (row.cltId && selectedRows.cltId !== row.cltId) {
            setSelectedRows([row]);
            console.log(row);
        }
    };

    return (
        <>
            {isLoading ? (
                // 로딩 화면을 보여줄 JSX
                <div className="Loading">
                    <div className="spinner"></div>
                    <div> Loading... </div>
                </div>
            ) : (
                <div>
                    <Location pathList={locationPath.CustomerMgmt} />
                    <SearchList conditionList={conditionList} onSearch={handleReturn} />
                    <div className="table-buttons">
                        <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                        <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                        <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                        <RefreshButton onClick={() => setNameOfButton("refresh")} />
                    </div>
                    <ReactDataTable
                        returnKeyWord={returnKeyWord}
                        columns={columnsTable}
                        customDatas={tableData}
                        returnSelect={returnData}
                        suffixUrl="/baseInfrm/client/client/type/c"
                        tableRef={itemDetailMgmtTable}
                        viewPageName={{ name: "고객사", id: "CustomerMgmt" }}
                        isPageNation={true}
                        isPageNationCombo={true}
                        defaultPageSize={20}
                    />
                    {isOpenAdd && (
                        <AddModModal
                            width={500}
                            height={420}
                            list={columns.reference.Customer}
                            resultData={addToServer}
                            onClose={() => setIsOpenAdd(false)}
                            title="고객사 추가"
                        />
                    )}
                    {isOpenMod && (
                        <AddModModal
                            width={500}
                            height={420}
                            list={columns.reference.Customer}
                            initialData={selectedRows}
                            resultData={modifyToServer}
                            onClose={() => setIsOpenMod(false)}
                            title="고객사 수정"
                        />
                    )}
                    {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
                </div>
            )}
        </>
    );
}
export default CustomerMgmt;
