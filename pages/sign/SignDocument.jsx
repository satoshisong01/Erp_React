import ViewModal from "components/modal/ViewModal";
import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { columns } from "constants/columns";
import ViewButton from "components/button/ViewButton";
import URL from "constants/url";
import { axiosFetch, axiosUpdate } from "api/axiosFetch";
import SignStateLine from "components/SignStateLine";
import BasicButton from "components/button/BasicButton";
import { ChangePrmnPlanData, buyIngInfoCalculation } from "components/DataTable/function/ReplaceDataFormat";
import { PageContext } from "components/PageProvider";
import { ProcessResultDataRun } from "components/DataTable/function/ProcessResultData";
import PopupButton from "components/button/PopupButton";
import ModButton from "components/button/ModButton";

export default function SignDocument() {
    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const sessionUserUniqId = JSON.parse(sessionUser)?.uniqId;

    const [title, setTitle] = useState("");
    const [projectInfo, setProjectInfo] = useState({}); //프로젝트정보
    const [approvalData, setApprovalData] = useState([]); //승인자목록
    const [documentName, setDocumentName] = useState("사전원가서");
    // const [signData, setSignData] = useState({}); //요청자
    const { unitPriceListRenew } = useContext(PageContext);

    const [estimate, setEstimate] = useState([]);
    const [buyIngInfo, setBuyIngInfo] = useState([]);
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 영업인건비
    const [estimateBool, setestimateBool] = useState(false);
    const [buyView, setBuyView] = useState([]); // 영업구매비
    const [buyIngBool, setBuyIngBool] = useState(false);
    const [poiVersionId, setPoiVersion] = useState({});
    const [clickBtn, setClickBtn] = useState(true);

    const fetchAllData = async (poiVersionId) => {
        //const requestSearch = {
        //    poiId: poiVersionId.poiId,
        //    useAt: "Y",
        //};
        //인건비
        const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", poiVersionId || {});
        const viewResult = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", { poiId: poiVersionId.poiId }); //계획조회
        if (viewResult && viewResult.length > 0) {
            const changeData = ChangePrmnPlanData(viewResult);
            changeData.forEach((Item) => {
                const yearFromPmpMonth = Item.pmpMonth.slice(0, 4);
                const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === yearFromPmpMonth);
                if (matchingAItem) {
                    let totalPrice = 0;
                    for (let i = 1; i <= 14; i++) {
                        const gupPriceKey = `gupPrice${i}`;
                        const pmpmmPositionCodeKey = `pmpmmPositionCode${i}`;
                        if (matchingAItem[gupPriceKey]) {
                            totalPrice += matchingAItem[gupPriceKey] * Item[pmpmmPositionCodeKey];
                        }
                    }
                    Item.totalPrice = totalPrice;
                }
            });
            setBudgetMgmtView(changeData);
        }

        setEstimate([]);
        setestimateBool(false);
        if (resultData.length !== 0) {
            const result = ProcessResultDataRun(resultData, poiVersionId);
            setEstimate(result);
            setestimateBool(true);
        } else {
            //alert("데이터가 없습니다.\n데이터를 입력해 주세요.");
        }

        //구매비
        const viewResult2 = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", poiVersionId);
        if (viewResult2 && viewResult2.length > 0) {
            const calData = buyIngInfoCalculation(viewResult2);
            setBuyView(calData);
        }

        setBuyIngInfo([]);
        setBuyIngBool(false);
        const resultData2 = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", poiVersionId || {});

        if (resultData2.length !== 0) {
            const updatedData = { ...resultData2[0] }; // 첫 번째 객체만 수정한다고 가정합니다.
            // estBuyQunty 값 변경
            updatedData.estBuyQunty = 1;

            // 수정된 데이터를 새 배열에 저장
            const updatedArray = [...resultData2];
            updatedArray[0] = updatedData;

            // 상태 업데이트
            setBuyIngInfo(updatedArray);
            setBuyIngBool(true);
        } else {
            alert("데이터가 없습니다.\n데이터를 입력해 주세요.");
        }
    };

    function getQueryParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    const [openUrl, setOpenUrl] = useState("");

    useEffect(() => {
        // URL에서 "data" 파라미터 읽기
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter); //프로젝트정보있음
        setProjectInfo({ ...data });
        fetchAllData({ poiId: data.poiId, versionId: data.versionId });

        if (data.sgnType === "견적품의서") {
            setTitle("견적서 승인 요청서");
            setDocumentName("견적원가서");
            setOpenUrl(URL.PreCostDoc);
        } else if (data.sgnType === "수주보고서") {
            setTitle("수주/계약 보고서");
            setDocumentName("수주원가서");
            setDocumentName("수주원가서");
            setOpenUrl(URL.PreCostDoc);
        } else if (data.sgnType === "완료보고서") {
            setTitle("완료보고서");
            setDocumentName("사후정산서");
            setOpenUrl(URL.PostCostsDoc);
        }
        getData({ sgnId: data.sgnId });
        const timer = setTimeout(() => {
            setClickBtn(false);
        }, 3800);

        // 컴포넌트가 언마운트될 때 타이머를 정리
        return () => clearTimeout(timer);
    }, []);

    const [isMyTurn, setIsMyTurn] = useState(false);
    const [isCancel, setIsCancel] = useState(false);

    /* 결재상태정보 */
    const getData = async (requestData) => {
        const signResultData = await axiosFetch("/api/system/sign/totalListAll.do", requestData || {});
        let signInfo = {};
        if (signResultData) {
            signInfo = {
                sgnId: signResultData[0]?.sgnId,
                sgnSenderNm: signResultData[0]?.sgnSenderNm, //발신자이름
                sgnSenderPosNm: signResultData[0]?.sgnSenderPosNm, //기안자직급
                sgnSenderGroupNm: signResultData[0]?.sgnSenderGroupNm, //기안자부서
                sgnSigndate: signResultData[0]?.sgnSigndate, //기안일
                sgnReceiverId: signResultData[0]?.sgnReceiverId, //수신자
                sgnDesc: signResultData[0]?.sgnDesc, //비고
            };
            setProjectInfo((prev) => ({
                ...prev,
                ...signInfo, //프로젝트 정보에 비고추가
            }));

            if (signInfo.sgnSenderNm === sessionUserName) {
                //요청자와 로그인유저가 같으면
                setIsCancel(true); //회수가능
            }
        }

        const stateResultData = await axiosFetch("/api/system/signState/totalListAll.do", requestData || {});
        if (stateResultData) {
            const arr = stateResultData.map((item) => ({
                sttId: item.sttId, //결재ID
                sttApproverId: item.sttApproverId, //승인자ID
                sttApproverNm: item.sttApproverNm, //승인자명
                sttApproverPosNm: item.sttApproverPosNm, //직급
                sttApproverGroupNm: item.sttApproverGroupNm, //부서
                sttApproverAt: item.sttApproverAt, //승인자상태
                sttResult: item.sttResult, //결재결과
                sttComent: item.sttComent, //코멘트
                sttPaymentDate: item.sttPaymentDate, //결재일 (오타 수정)
            }));

            if (signInfo) {
                const changeSign = [
                    {
                        sttApproverNm: signInfo.sgnSenderNm,
                        sttApproverPosNm: signInfo.sgnSenderPosNm,
                        sttApproverAt: "요청",
                        sttApproverGroupNm: signInfo.sgnSenderGroupNm,
                        sttPaymentDate: signInfo.sgnSigndate,
                        sgnDesc: signInfo.sgnDesc,
                    },
                ];
                const merge = [...changeSign, ...arr];
                setApprovalData(merge);
                const myData = stateResultData.find((item) => item.sttApproverAt === "진행" && item.sttApproverId === sessionUserUniqId);
                myData ? setIsMyTurn(true) : setIsMyTurn(false);
            }
        }
    };

    const projectColumns = [
        { header: "프로젝트명", name: "poiNm", colValue: 3, colspan: 2, style: { textAlign: "left" } },
        { header: "사전원가 버전", name: "versionNum", colValue: 3, colspan: 2, style: { textAlign: "left" } },

        { header: "기안일자", name: "sgnSigndate", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "기안자", name: "sgnSenderNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "기안부서", name: "sgnSenderGroupNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },

        { header: "고객사", name: "cltNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "영업대표", name: "poiSalmanagerId", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "담당자", name: "poiManagerId", colValue: 2, colspan: 1, style: { textAlign: "center" } },

        { header: "납기시작일", name: "poiDueBeginDt", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "납기종료일", name: "poiDueEndDt", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "계약금(천원)", name: "salesTotal", colValue: 2, colspan: 1, style: { textAlign: "center" } },
    ];

    const signStateColumns = [
        //승인자목록
        { header: "진행상태", name: "sttApproverAt", style: { width: "10%", textAlign: "center" } },
        { header: "결재결과", name: "sttResult", style: { width: "10%", textAlign: "center" } },
        { header: "결재자", name: "sttApproverNm", style: { width: "10%", textAlign: "center" } },
        { header: "부서", name: "sttApproverGroupNm", style: { width: "10%", textAlign: "center" } },
        { header: "직급", name: "sttApproverPosNm", style: { width: "10%", textAlign: "center" } },
        { header: "결재일시", name: "sttPaymentDate", style: { width: "15%", textAlign: "center" } },
        { header: "코멘트", name: "sttComent", style: { width: "30%", textAlign: "left" } },
    ];

    /* 프로젝트 DOM 구성 */
    function generateProjectTable(columns, data) {
        const tableRows = [];
        let currentRow = [];
        let currentColValueSum = 0;

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            currentRow.push(<th key={uuidv4()}>{column.header}</th>);

            if (column.colspan) {
                currentRow.push(
                    <td key={uuidv4()} colSpan={column.colspan} style={{ textAlign: column.style.textAlign }}>
                        {column.name !== "salesTotal" ? data[column.name] : data[column.name]}
                    </td>
                );
            }

            currentColValueSum += column.colValue;

            if (currentColValueSum === 6 || i === columns.length - 1) {
                tableRows.push(<tr key={uuidv4()}>{currentRow}</tr>);
                currentRow = [];
                currentColValueSum = 0;
            }
        }

        tableRows.push(
            <tr key={uuidv4()} style={{ textAlign: "left" }}>
                <td colSpan="6" dangerouslySetInnerHTML={{ __html: data.sgnDesc || "비고 없음" }} />
            </tr>
        );

        return (
            <table className="table-styled" style={{ border: "solid 1px #ddd", margin: "auto" }}>
                <tbody>{tableRows}</tbody>
            </table>
        );
    }

    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [isOpenView, setIsOpenView] = useState(false);

    /* 결재의견 DOM 구성 */
    function generateApprovalTable(columns, data) {
        const newArray = data.slice(1); // 또는 const newArray = [...array.slice(1)];
        return (
            <table className="table-styled" style={{ border: "solid 1px #ddd", margin: "auto" }}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} style={column.style}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {newArray.map((row, index) => (
                        <tr key={index}>
                            {columns.map((column, columnIndex) => (
                                <td key={columnIndex} style={column.style}>
                                    {row[column.name]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const closePopup = () => {
        window.close(); //현재창닫기
    };

    const openPopup = () => {
        if (!projectInfo.versionId) {
            alert("삭제된 버전이거나 또는 통신오류 입니다. ");
            return;
        } else {
            const url = `${openUrl}?data=${encodeURIComponent(JSON.stringify(projectInfo))}`;
            const width = 1400;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
            window.open(url, "signWindow", windowFeatures);
        }
    };

    // const openPopup = async () => {
    //     try {
    //         const versionExists = await isVersion();
    //         if (versionExists) {
    //             const url = `${openUrl}?data=${encodeURIComponent(JSON.stringify(projectInfo))}`;
    //             const width = 1400;
    //             const height = 700;
    //             const left = window.screen.width / 2 - width / 2;
    //             const top = window.screen.height / 2 - height / 2;
    //             const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
    //             window.open(url, "signWindow", windowFeatures);
    //         } else {
    //             alert("삭제된 버전이거나 또는 통신오류 입니다. ");
    //         }
    //     } catch (error) {
    //         console.error("버전 확인 중 오류가 발생했습니다:", error);
    //     }
    // };

    // const isVersion = async () => {
    //     try {
    //         const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", { poiId: projectInfo.poiId } || {});
    //         const flag = resultData.find(item => item.versionId === projectInfo.versionId);
    //         return !!flag;
    //     } catch (error) {
    //         console.error("버전 확인 중 오류가 발생했습니다:", error);
    //         return false;
    //     }
    // };

    const openPopup2 = () => {
        if (!projectInfo.versionId) {
            alert("삭제된 버전이거나 또는 통신오류 입니다. ");
            return;
        } else {
            const url = `${URL.TotalDoc}?data=${encodeURIComponent(
                JSON.stringify({
                    label: "견적서",
                    poiId: projectInfo.poiId,
                    versionId: projectInfo.versionId,
                    tableData: estimate,
                    tableData2: buyIngInfo,
                })
            )}`;
            const width = 1400;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
            window.open(url, "estimateWindow", windowFeatures);
        }
    };

    const approvalToServer = async (value) => {
        const sameInfo = approvalData.find((app) => app.sttApproverId === sessionUserUniqId); //승인자목록==로그인유저

        const requestData = {
            sttResult: value.sttResult,
            sttComent: value.sttComent,
            sttId: sameInfo.sttId,
        };

        const resultData = await axiosUpdate("/api/system/signState/edit.do", requestData || {});
        if (resultData) {
            alert("완료되었습니다.");
            closePopup();
        } else {
            closePopup();
            return alert("error");
        }
    };

    const cancel = async () => {
        const willApprove = window.confirm("결재를 회수 하시겠습니까?");
        if (willApprove) {
            if (projectInfo?.sgnId) {
                const requestData = {
                    sgnId: projectInfo.sgnId,
                    sgnAt: "회수",
                };
                const resultData = await axiosUpdate("/api/system/sign/edit.do", requestData || {});
                if (resultData) {
                    alert("회수완료");
                    closePopup();
                }
            }
        }
    };

    return (
        <>
            <div style={{ width: "90%", margin: "auto" }}>
                <div className="table-buttons mg-t-10 mg-b-10">
                    {isCancel && <BasicButton label="회수" onClick={cancel} />}
                    <BasicButton label={documentName} onClick={openPopup} />
                    <PopupButton
                        onClick={openPopup2}
                        clickBtn={clickBtn}
                        targetUrl={URL.TotalDoc}
                        data={{
                            label: "견적서",
                            poiId: projectInfo.poiId,
                            versionId: projectInfo.versionId,
                            tableData: estimate,
                            tableData2: buyIngInfo,
                        }}
                    />
                    {isMyTurn && <ViewButton label={"결재"} onClick={() => setIsOpenView(true)} />}
                </div>
                <div style={{ textAlign: "center", marginBottom: "-65px" }}>
                    <h3>{title}</h3>
                </div>
                <SignStateLine signStateData={approvalData}>
                    <div style={{ textAlign: "center" }}>{generateProjectTable(projectColumns, projectInfo)}</div>

                    <br />
                    <br />

                    <div style={{ marginBottom: 10 }}>
                        <h4>결재의견</h4>
                    </div>
                    <div style={{ textAlign: "center" }} className="mg-b-30">
                        {generateApprovalTable(signStateColumns, approvalData)}
                    </div>
                </SignStateLine>
            </div>
            {isOpenView && (
                <ViewModal
                    width={500}
                    height={250}
                    list={columns.approval.views}
                    initialData={selectedRows}
                    resultData={approvalToServer}
                    onClose={() => setIsOpenView(false)}
                    title="결재처리"
                />
            )}
        </>
    );
}
