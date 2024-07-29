import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";

/** 실행관리-사전원가초안 */
function DraftQuotation() {
    const laborColumns = [
        // 인건비
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
            type: "button",
            options: [],
        },
        { header: "연월", col: "poiNm", cellWidth: "10%", type: "input" },
        { header: "M/M계", col: "poiCode", cellWidth: "10%", type: "input" },
        { header: "인건비계", col: "poiBeginDt999", cellWidth: "10%", type: "input" },
        { header: "특급기술사", col: "poiBeginDt1", cellWidth: "10%", type: "input" },
        { header: "고급기술사", col: "poiBeginDt2", cellWidth: "10%", type: "input" },
        { header: "중급기술사", col: "poiBeginDt3", cellWidth: "10%", type: "input" },
        { header: "초급기술사", col: "poiBeginDt4", cellWidth: "10%", type: "input" },
        { header: "중급기술사", col: "poiBeginDt5", cellWidth: "10%", type: "input" },
        { header: "고급기능사", col: "poiBeginDt6", cellWidth: "10%", type: "input" },
    ];
    const expensesColumns = [
        // 경비
        { header: "경비목록", col: "poiTitle", cellWidth: "25%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
        { header: "금액", col: "poiTitle3", cellWidth: "25%", type: "input" },
    ];
    const purchaseColumns = [
        // 구매비
        { header: "품목그룹명", col: "poiTitle", cellWidth: "20%", type: "input" },
        { header: "품명", col: "poiTitle1", cellWidth: "20%", type: "input" },
        { header: "규격", col: "poiTitle2", cellWidth: "20%", type: "input" },
        { header: "수량", col: "poiTitle3", cellWidth: "10%", type: "input" },
        { header: "단위", col: "poiTitle4", cellWidth: "10%", type: "input" },
        { header: "소비자\n단가", col: "poiTitle5", cellWidth: "14%", type: "input" },
        { header: "소비자\n금액", col: "poiTitle6", cellWidth: "14%", type: "input" },
        { header: "단가", col: "poiTitle7", cellWidth: "10%", type: "input" },
        { header: "금액", col: "poiTitle8", cellWidth: "10%", type: "input" },
        { header: "제조사", col: "poiTitle9", cellWidth: "12%", type: "input" },
        { header: "금액", col: "poiTitle11", cellWidth: "10%", type: "input" },
        { header: "제조사", col: "poiTitle12", cellWidth: "12%", type: "input" },
        { header: "비고", col: "poiTitle13", cellWidth: "20%", type: "input" },
        { header: "원단가", col: "poiTitle111", cellWidth: "12%", type: "input" },
        { header: "원가", col: "poiTitle15", cellWidth: "10%", type: "input" },
        { header: "이익금", col: "poiTitle16", cellWidth: "12%", type: "input" },
        { header: "이익률", col: "poiTitle17", cellWidth: "12%", type: "input" },
        { header: "기준\n이익률", col: "poiTitle88", cellWidth: "15%", type: "input" },
        { header: "소비자가\n산출률", col: "poiTitle99", cellWidth: "15%", type: "input" },
    ];
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo } = useContext(PageContext);

    const [currentTask, setCurrentTask] = useState("인건비");
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)

    useEffect(() => {
        return () => {
            setProjectInfo({});
        };
    }, []);

    const executionMgmtTable1 = useRef(null);
    const executionMgmtTable2 = useRef(null);
    const executionMgmtTable3 = useRef(null);
    const executionMgmtTable4 = useRef(null);
    const executionMgmtTable5 = useRef(null);
    const executionMgmtTable6 = useRef(null);

    const groupedData = {}; //인건비 바꿔서 넣어줄 빈 객체

    const changePrmnPlanData = (data) => {
        // 포지션에 대한 고정된 번호를 매핑하는 객체 생성
        const positionMapping = {
            임원: 1,
            특급기술사: 2,
            고급기술사: 3,
            중급기술사: 4,
            초급기술사: 5,
            고급기능사: 6,
            중급기능사: 7,
            초급기능사: 8,
            부장: 9,
            차장: 10,
            과장: 11,
            대리: 12,
            주임: 13,
            사원: 14,
        };

        data.forEach((item) => {
            const key = `${item.pgNm}-${item.pmpMonth[0]}-${item.pmpMonth[1]}`;
            if (!groupedData[key]) {
                groupedData[key] = {
                    pgNm: item.pgNm,
                    pmpMonth: `${item.pmpMonth[0]}-${item.pmpMonth[1]}`,
                    total: 0,
                };
            }

            // 포지션에 해당하는 번호를 가져오고, 해당 위치에 pmpmmNum을 저장
            const positionNumber = positionMapping[item.pmpmmPositionCode];
            if (positionNumber) {
                const pmpmmNumKey = `pmpmmNum${positionNumber}`;
                groupedData[key][pmpmmNumKey] = item.pmpmmNum;
                groupedData[key].total += item.pmpmmNum;
            }
        });

        // groupedData 객체를 배열로 변환
        const transformedData = Object.values(groupedData);
        setPrmnPlanDatas(transformedData);
        console.log(transformedData, "변환되고나서의 값을보여줌");
    };

    const changeTabs = (task) => {
        setCurrentTask(task);
        if (task !== currentTask) {
            //자신 일때 수정 창으로 변동 되지 않기 위한 조건
            setIsSaveFormTable(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentTask === "인건비") {
                    const data = await fetchAllData("/cost/costPrmnPlan"); // 인건비
                    console.log(data, "불러온 인건비의 값은?");
                    changePrmnPlanData(data);
                } else if (currentTask === "경비") {
                    const data = await fetchAllData("/cost/costPjbudget/type"); // 경비
                    setPjbudgetDatas(data);
                    //.map((item) => ({
                    //    ...item,
                    //    pjbgTypeCode: changepjbudgetData(
                    //        //영업 slsp만 추출
                    //        item.pjbgTypeCode,
                    //        expensesColumns[0].options
                    //    ),
                    //}))
                } else if (currentTask === "구매(재료비)") {
                    const data = await fetchAllData("/cost/costPdOrdr"); // 구매(재료비)
                    setPdOrdrDatas(data);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [projectInfo.poiId, currentTask]);

    const fetchAllData = async (tableUrl) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        let requestData = { poiId: projectInfo.poiId };
        if (tableUrl === "/cost/costPdOrdr") {
            //requestData 값 담기
            requestData = { poiId: projectInfo.poiId, useAt: "Y" };
        } else {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "EXDR",
                useAt: "Y",
            };
        }

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            return resultData;
        } else {
            return Array(5).fill({}); // 빈 배열 보내주기
        }
    };

    console.log(prmnPlanDatas, "인건비");
    console.log(pjbudgetDatas, "경비");
    console.log(pdOrdrDatas, "구매(재료비");

    return (
        <>
            <Location pathList={locationPath.DraftQuotation} />
            <div className="common_board_style mini_board_2">
                <ul className="tab">
                    <li onClick={() => changeTabs("인건비")}>
                        <a href="#인건비" className="on">
                            인건비
                        </a>
                    </li>
                    <li onClick={() => changeTabs("경비")}>
                        <a href="#경비">경비</a>
                    </li>
                    <li onClick={() => changeTabs("구매(재료비)")}>
                        <a href="#구매(재료비)">구매(재료비)</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ApprovalForm title={currentTask + " 초안 등록"}>
                            <h2 className="blind">인건비</h2>
                            <ul>
                                <ReactDataTable
                                    columns={laborColumns}
                                    flag={currentTask === "인건비" && isSaveFormTable}
                                    testTask={true}
                                    tableRef={executionMgmtTable1}
                                    customDatas={prmnPlanDatas}
                                />
                            </ul>
                        </ApprovalForm>
                    </div>
                    <div className="second">
                        <ApprovalForm title={currentTask + " 초안 등록"}>
                            <h2 className="blind">경비</h2>
                            <ul>
                                <ReactDataTable
                                    columns={expensesColumns}
                                    flag={currentTask === "경비" && isSaveFormTable}
                                    tableRef={executionMgmtTable2}
                                    customDatas={pjbudgetDatas}
                                />
                            </ul>
                        </ApprovalForm>
                    </div>
                    <div className="third">
                        <ApprovalForm title={currentTask + " 초안 등록"}>
                            <h2 className="blind">구매(재료비)</h2>
                            <ul>
                                <ReactDataTable
                                    columns={purchaseColumns}
                                    flag={currentTask === "구매(재료비)" && isSaveFormTable}
                                    tableRef={executionMgmtTable3}
                                    customDatas={pdOrdrDatas}
                                />
                            </ul>
                        </ApprovalForm>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DraftQuotation;
