import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";
import DataTable from "components/DataTable/DataTable";

/** 시스템관리-코드관리-분류코드관리 */
function CategoryCode(props) {
    const propsCode = "품목그룹관리";

    const dataSet = [
        {
            title: "품목그룹관리",
            columns: [
                { header: "분류코드", col: "clCode" },
                { header: "분류코드명", col: "clCodeNm" },
                { header: "분류코드설명", col: "clCodeDc" },
                { header: "작성자", col: "createIdBy" },
                { header: "작성일", col: "createDate" },
                { header: "수정자", col: "lastModifiedIdBy" },
                { header: "수정일", col: "lastModifyDate" },
            ],
            suffixUrl: "/reference/item",
            currentPage: "clCode",
        },
        {
            title: "품목그룹관리",
            columns: [
                { header: "분류코드", col: "clCode" },
                { header: "분류코드명", col: "clCodeNm" },
                { header: "분류코드설명", col: "clCodeDc" },
                { header: "작성자", col: "createIdBy" },
                { header: "작성일", col: "createDate" },
                { header: "수정자", col: "lastModifiedIdBy" },
                { header: "수정일", col: "lastModifyDate" },
            ],
            suffixUrl: "/system/code",
            currentPage: "clCode",
        },
        {
            title: "품목상세관리",
            columns: [
                { header: "분류코드", col: "clCode" },
                { header: "분류코드명", col: "clCodeNm" },
                { header: "분류코드설명", col: "clCodeDc" },
                { header: "작성자", col: "createIdBy" },
                { header: "작성일", col: "createDate" },
                { header: "수정자", col: "lastModifiedIdBy" },
                { header: "수정일", col: "lastModifyDate" },
            ],
        },
    ];

    const columns = [
        { header: "분류코드", col: "clCode" },
        { header: "분류코드명", col: "clCodeNm" },
        { header: "분류코드설명", col: "clCodeDc" },
        { header: "작성자", col: "createIdBy" },
        { header: "작성일", col: "createDate" },
        { header: "수정자", col: "lastModifiedIdBy" },
        { header: "수정일", col: "lastModifyDate" },
    ];

    return (
        <>
            <div className="location">
                <ul>
                    <li>
                        <Link to="/" className="home">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to=""
                            onClick={(e) =>
                                store.dispatch(selectLnb("권한관리"))
                            }>
                            시스템관리
                        </Link>
                    </li>
                    <li>분류코드관리</li>
                </ul>
            </div>
            <DataTable
                columns={columns}
                //suffixUrl={data.suffixUrl}
                //currentPage={data.currentPage}
            />
        </>
    );
}

export default CategoryCode;
