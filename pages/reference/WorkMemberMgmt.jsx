import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { columns } from "constants/columns";
import HideCard from "components/HideCard";

/** 시스템관리-사용자관리-업무회원 */
function WorkMemberMgmt() {
    const { nameOfButton, setNameOfButton } = useContext(PageContext);
    const [condition, setCondition] = useState({})

    const onSearch = (condition) => {
        setCondition(condition);
        setNameOfButton("refresh");
    };

    useEffect(() => {
        setCondition({});
    }, [nameOfButton])

    return (
        <>
            <Location pathList={locationPath.WorkMemberMgmt} />
            <SearchList conditionList={columns.user.employCondition} onSearch={onSearch} />
            <HideCard title="프로젝트 목록" color="back-lightblue" className="mg-b-40">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                    <ModButton label={"수정"} onClick={() => setNameOfButton("modify")} />
                    <DelButton label={"삭제"} onClick={() => setNameOfButton("delete")} />
                    <RefreshButton onClick={() => setNameOfButton("refresh")} />
                </div>
                <ReactDataTable
                    suffixUrl="/baseInfrm/member/employMember"
                    columns={columns.user.employ}
                    modColumns={columns.user.mod}
                    addColumns={columns.user.add}
                    viewPageName={{ name: "업무회원", id: "WorkMemberMgmt" }}
                    deleteInfo={{ id: "uniqId", name: "empNm"}}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default WorkMemberMgmt;
