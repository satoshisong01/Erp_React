import React from "react";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
//import "datatables.net-dt/css/jquery.dataTables.css";
//import "datatables.net-dt/js/dataTables.dataTables";

const ReSearchBtn = ({
    //searchKeyword,
    //searchCondition,
    dataTableRef,
    fetchAllData,
}) => {
    const handleRefreshClick = async () => {
        //searchKeyword("");
        //searchCondition("");
        //if (
        //    dataTableRef.current &&
        //    $.fn.DataTable.isDataTable(dataTableRef.current)
        //) {
        //}
        //setIsSearching(!isSearching); // 로딩 상태 활성화
        $(dataTableRef.current).DataTable().destroy();

        await fetchAllData();
    };

    return (
        <button
            className="btn btn-primary refreshIcon"
            onClick={handleRefreshClick}>
            <FontAwesomeIcon icon={faArrowRotateRight} className="refreshI" />
        </button>
    );
};

export default ReSearchBtn;
