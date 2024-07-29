import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";

/** 기준정보관리-원가기준관리-사전원가지표 */
function CostIndex() {
    const [tableData, setTableData] = useState([]);
    const costIndexMgmtTable = useRef(null);
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    const { setNameOfButton, innerPageName, setInnerPageName } = useContext(PageContext);

    const columns = [
        { header: "기준연도", type: "input", col: "cbMonth", cellWidth: "200" },
        { header: "분류코드", col: "cbTypeCode", cellWidth: "200" },
        { header: "간접원가", type: "input", col: "cbPer1", cellWidth: "200" },
        { header: "판매비", type: "input", col: "cbPer2", cellWidth: "190" },
        { header: "사내본사비", type: "input", col: "cbPer3", cellWidth: "190" },
        { header: "일반관리비", type: "input", col: "cbPer4", cellWidth: "190" },
        { header: "영업외수지", type: "input", col: "cbPer5", cellWidth: "190" },
    ];

    useEffect(() => {
        setInnerPageName("사전원가지표");
        fetchAllData();
        fetchData();
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/product/costBase/totalListAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "이게원본데이터");
        setTableData(reorganizeData(resultData));
        setIsLoading(false);
    };

    const roleMapping = {
        간접원가: 1,
        판매비: 2,
        사내본사비: 3,
        일반관리비: 4,
        영업외수지: 5,
    };

    useEffect(() => {
        console.log(tableData, "tableData");
    }, [tableData]);

    const [costIndex, setCostIndex] = useState([]); //사전원가지표

    console.log(costIndex, "costIndex");

    const fetchData = async () => {
        try {
            if (innerPageName === "사전원가지표") {
                const datas = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 조회관리
                setCostIndex(datas);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.cbTypeCode); //cbTypeCode 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, cbId: updatedArray[i].cbId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateList(firstRowUpdate);

            const toDelete = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                toDelete.push(originData[i].cbId);
            }
            deleteList(toDelete);
        } else if (originDataLength === updatedDataLength) {
            updateList(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            updateList(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const addType = { pecTypeCode: "MM" };
                const addMode = { pecSlsExcCode: "PEXC" };
                let addExCode = { pecModeCode: "PDVSN01" };
                if (innerPageName === "인건비 수주관리") {
                    addExCode = { pecModeCode: "PDVSN01" };
                } else if (innerPageName === "인건비 예산관리") {
                    addExCode = { pecModeCode: "PDVSN02" };
                } else if (innerPageName === "인건비 실행관리") {
                    addExCode = { pecModeCode: "PDVSN03" };
                }
                toAdds.push({ ...filterData[i], ...addType, ...addMode, ...addExCode });
            }
            addList(toAdds);
        }
    };

    const addList = async (addNewData) => {
        console.log("❗addList:", addNewData);
        const url = `/api/baseInfrm/product/costBase/addArrayList.do`;
        const resultData = await axiosPost(url, addNewData);
        refresh();
    };

    const updateList = async (toUpdate) => {
        console.log("❗updateList:", toUpdate);
        const updatedFilterData = toUpdate.map((data) => ({
            ...data,
            useAt: "Y",
            deleteAt: "N",
        }));
        const url = `/api/baseInfrm/product/costBase/editList.do`;
        const resultData = await axiosUpdate(url, updatedFilterData);
        console.log(resultData, "결과값");
        refresh();
    };

    const deleteList = async (removeItem) => {
        console.log("❗deleteList:", removeItem);
        const url = `/api/baseInfrm/product/costBase/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        refresh();
    };

    const refresh = () => {
        fetchData();
    };

    //const uniqueBaseNames = [...new Set(tableData.map((item) => item.cbTypeCode))];
    //console.log(uniqueBaseNames, "uniqueBaseNames");

    //const changeFormatData = (data) => {
    //    const formattedData = {};

    //    data.forEach((item) => {
    //        const { cbTypeCode, cbName, cbPer } = item;

    //        // 해당 분류에 대한 객체가 없으면 생성
    //        if (!formattedData[cbTypeCode]) {
    //            formattedData[cbTypeCode] = {};
    //        }

    //        // 해당 분류, 원가명에 대한 값 설정
    //        formattedData[cbTypeCode][cbName] = cbPer;
    //    });

    //    // 분류와 열 헤더를 포함한 결과 데이터
    //    const resultData = Object.entries(formattedData).map(([cbTypeCode, cbName, cbPer, rowData]) => {
    //        return {
    //            cbTypeCode,
    //            cbName,
    //            cbPer,
    //            ...rowData,
    //        };
    //    });

    //    console.log(resultData); // 포맷된 데이터 확인
    //    return resultData;
    //};

    //const reorganizeData = (data) => {
    //    // reduce 함수를 사용하여 데이터 배열을 순회하면서 재구성된 결과를 구축합니다.
    //    return data.reduce((acc, item, index) => {
    //        // 현재 아이템에서 속성들을 비구조화하여 가져옵니다.
    //        const { cbMonth, cbName, cbTypeCode, cbId, cbPer } = item;

    //        // gupBaseDate 배열에서 연도를 추출합니다.
    //        const name = cbName;

    //        // 찾은 데이터의 인덱스
    //        // cbName 기반으로 누적 배열에서 그룹의 인덱스를 찾습니다.
    //        const foundIndex = acc.findIndex((group) => group && group.cbName === cbName);
    //        const roleKey = `cbPer${roleMapping[cbName]}`;

    //        // 해당하는 그룹이 없을 경우 새로운 그룹 생성
    //        // 동일한 cbName를 가진 그룹이 존재하는지 확인합니다.
    //        if (foundIndex === -1) {
    //            // 그룹이 존재하지 않으면 새로운 그룹을 생성하고 누적 배열에 추가합니다.
    //            acc.push({ cbTypeCode, cbMonth, cbName, name, [roleKey]: Number(cbPer), cbId: [cbId] });
    //        } else {
    //            // 그룹이 이미 존재하면 데이터를 기존 그룹에 추가합니다.
    //            acc[foundIndex][`cbPer${roleMapping[cbName]}`] = Number(cbPer);
    //            //항상 배열로 쓰이고 낮은순서로 저장됨
    //            acc[foundIndex].cbId = [...acc[foundIndex].cbId, ...(Array.isArray(cbId) ? cbId : [cbId])].sort((a, b) => a - b);
    //        }

    //        return acc;
    //    }, []);
    //};

    const reorganizeData = (data) => {
        return data.reduce((acc, item) => {
            const { cbMonth, cbTypeCode, cbName, cbId, cbPer } = item;

            const foundIndex = acc.findIndex((group) => group && group.cbMonth === cbMonth && group.cbTypeCode === cbTypeCode);

            if (foundIndex === -1) {
                acc.push({ cbId: [cbId], cbMonth, cbTypeCode, [`cbPer${roleMapping[cbName]}`]: Number(cbPer) });
            } else {
                acc[foundIndex].cbId = [...acc[foundIndex].cbId, ...(Array.isArray(cbId) ? cbId : [cbId])];
                acc[foundIndex][`cbPer${roleMapping[cbName]}`] = (acc[foundIndex][`cbPer${roleMapping[cbName]}`] || 0) + Number(cbPer);
            }

            return acc;
        }, []);
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
                    <Location pathList={locationPath.CostIndex} />
                    <ReactDataTable
                        columns={columns}
                        customDatas={tableData}
                        sendToParentCostIndex={compareData}
                        //suffixUrl="/baseInfrm/product/costBase"
                        tableRef={costIndexMgmtTable}
                        viewPageName={{ name: "사전원가지표", id: "CostIndex" }}
                        perSent=" %"
                    />
                </div>
            )}
        </>
    );
}

export default CostIndex;
