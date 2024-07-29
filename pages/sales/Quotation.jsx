import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import HideCard from "components/HideCard";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { columns } from "constants/columns";
import SaveButton from "components/button/SaveButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import SearchModal from "components/modal/SearchModal";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";
import ApprovalLineModal from "components/modal/ApprovalLineModal";
import QuillEditor from "components/QuillEditor";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { ChangePrmnPlanData, buyIngInfoCalculation } from "components/DataTable/function/ReplaceDataFormat";
import { ProcessResultDataRun } from "../../components/DataTable/function/ProcessResultData";
import SignStateLine from "components/SignStateLine";
import ViewModal from "components/modal/ViewModal";

/** 영업관리-견적관리 */
function Quotation() {
    const { currentPageName, innerPageName, setPrevInnerPageName, setInnerPageName, setCurrentPageName, setNameOfButton, unitPriceListRenew } =
        useContext(PageContext);
    const [infoList, setInfoList] = useState([
        { name: "인건비", id: "estimateLabor" },
        { name: "구매비", id: "orderBuying" },
        { name: "품의서", id: "proposal" },
    ]);
    const [condition, setCondition] = useState({});
    //const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터

    const [estimate, setEstimate] = useState([]);
    const [buyIngInfo, setBuyIngInfo] = useState([]);
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 영업인건비
    const [buyView, setBuyView] = useState([]); // 영업구매비

    const [estimateBool, setestimateBool] = useState(false);
    const [buyIngBool, setBuyIngBool] = useState(false);
    const [detailBool, setDetailBool] = useState(false);

    //const [checkUpdate, setCheckUpdate] = useState(false);

    useEffect(() => {
        setInnerPageName({ name: "인건비", id: "estimateLabor" });
        setCurrentPageName({}); //inner와 pageName은 동시에 사용 X
        return () => {};
    }, []);

    useEffect(() => {
        if (currentPageName.id === "Quotation") {
            const activeTab = document.querySelector(".mini_board_3 .tab li a.on"); //마지막으로 활성화 된 탭
            if (activeTab) {
                const activeTabInfo = infoList.find((data) => data.name === activeTab.textContent.trim());
                setInnerPageName({ ...activeTabInfo });
                setCurrentPageName({});
            }
        }
    }, [currentPageName]);

    useEffect(() => {
        console.log(condition, "제발...");

        if (innerPageName.id === "proposal") {
            console.log("제발...");
            fetchAllData(condition);
        }
    }, [innerPageName, condition]);

    const columnlabor = [
        //인건비
        { header: "연월", col: "pmpMonth", cellWidth: "100", type: "datePicker" },
        { header: "M/M", col: "total", cellWidth: "80" },
        { header: "금액", col: "totalPrice", cellWidth: "174", type: "number" },
        { header: "임원", col: "pmpmmPositionCode1", notView: true },
        { header: "특급기술사", col: "pmpmmPositionCode2", notView: true },
        { header: "고급기술사", col: "pmpmmPositionCode3", notView: true },
        { header: "중급기술사", col: "pmpmmPositionCode4", notView: true },
        { header: "초급기술사", col: "pmpmmPositionCode5", notView: true },
        { header: "고급기능사", col: "pmpmmPositionCode6", notView: true },
        { header: "중급기능사", col: "pmpmmPositionCode7", notView: true },
        { header: "초급기능사", col: "pmpmmPositionCode8", notView: true },
        { header: "부장", col: "pmpmmPositionCode9", cellWidth: "170", type: "input" },
        { header: "차장", col: "pmpmmPositionCode10", cellWidth: "170", type: "input" },
        { header: "과장", col: "pmpmmPositionCode11", cellWidth: "170", type: "input" },
        { header: "대리", col: "pmpmmPositionCode12", cellWidth: "170", type: "input" },
        { header: "주임", col: "pmpmmPositionCode13", cellWidth: "170", type: "input" },
        { header: "사원", col: "pmpmmPositionCode14", cellWidth: "170", type: "input" },
    ];

    const changeTabs = (name, id) => {
        setInnerPageName((prev) => {
            setPrevInnerPageName({ ...prev });
            return { name, id };
        });
        setCurrentPageName({});
    };

    const isRefresh = () => {
        const willApprove = window.confirm("새로고침 하시겠습니까?");
        if (willApprove) {
            if (condition.poiId && condition.versionId) {
                fetchAllData(condition);
            } else {
                fetchAllData();
            }
        }
    };
    const refresh = () => {
        setRemind(0);
        setRemind2(0);
        if (condition.poiId && condition.versionId) {
            fetchAllData(condition);
        } else {
            fetchAllData();
        }
    };

    const fetchAllData = async (condition) => {
        if (innerPageName.id === "proposal") {
            //품의서
            const laborResult = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", condition || {}); //견적서용 인건비조회
            if (laborResult.length !== 0) {
                const result = ProcessResultDataRun(laborResult, condition);
                setEstimate(result);
                setestimateBool(true);
            }
            const buyResult = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", condition || {}); //견적서용 구매비조회
            if (buyResult.length !== 0) {
                const updatedData = { ...buyResult[0] }; // 첫 번째 객체만 수정한다고 가정합니다.
                updatedData.estBuyQunty = 1;
                const updatedArray = [...buyResult];
                updatedArray[0] = updatedData;
                setBuyIngInfo(updatedArray);
                setBuyIngBool(true);
            }
        } else if (innerPageName.id === "estimateLabor") {
            //인건비
            //인건비
            const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", condition || {});

            const viewResult = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", { poiId: condition?.poiId || "" }); //계획조회
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
                const result = ProcessResultDataRun(resultData, condition);
                setEstimate(result);
                setestimateBool(true);
                return { result: true, versionNum: condition?.versionNum };
            } else {
                return { result: false, versionNum: condition?.versionNum };
            }
        } else if (innerPageName.id === "orderBuying") {
            //구매비
            //구매비
            const viewResult = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", condition);
            if (viewResult && viewResult.length > 0) {
                const calData = buyIngInfoCalculation(viewResult);
                setBuyView(calData);
            }

            setBuyIngInfo([]);
            setBuyIngBool(false);
            const resultData = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", condition || {});

            if (resultData.length !== 0) {
                const updatedData = { ...resultData[0] }; // 첫 번째 객체만 수정한다고 가정합니다.
                // estBuyQunty 값 변경
                updatedData.estBuyQunty = 1;

                // 수정된 데이터를 새 배열에 저장
                const updatedArray = [...resultData];
                updatedArray[0] = updatedData;

                // 상태 업데이트
                setBuyIngInfo(updatedArray);
                setBuyIngBool(true);
                return { result: true, versionNum: condition.versionNum };
            } else {
                return { result: false, versionNum: condition.versionNum };
            }
        } else if (innerPageName.id === "proposal") {
            const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", condition || {});
        }
    };
    const fetchAllCopied = async (condition) => {
        if (innerPageName.id === "proposal" || innerPageName.id === "estimateLabor") {
            //인건비
            const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", condition || {});
            if (resultData.length !== 0) {
                const result = ProcessResultDataRun(resultData, condition);
                setCopiedLabor(result);
                return { result: true, versionNum: condition.versionNum };
            } else {
                return { result: false, versionNum: condition.versionNum };
            }
        } else if (innerPageName.id === "proposal" || innerPageName.id === "orderBuying") {
            //구매비
            const resultData = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", condition || {});
            if (resultData.length !== 0) {
                const updatedData = { ...resultData[0] }; // 첫 번째 객체만 수정한다고 가정합니다.
                // estBuyQunty 값 변경
                updatedData.estBuyQunty = 1;

                // 수정된 데이터를 새 배열에 저장
                const updatedArray = [...resultData];
                updatedArray[0] = updatedData;

                // 상태 업데이트
                setCopiedBuy(updatedArray);
                return { result: true, versionNum: condition.versionNum };
            } else {
                return { result: false, versionNum: condition.versionNum };
            }
        }
    };

    const returnList = (originTableData, tableData) => {
        if (innerPageName.id === "estimateLabor") {
            //인건비
            compareData(originTableData, tableData);
        } else if (innerPageName.id === "orderBuying") {
            //구매비
            if (tableData[0]?.estBuyId === null) {
                addItem2(tableData);
            } else {
                compareData2(originTableData, tableData);
            }
        }
    };

    //인건비
    const compareData = (originData, updatedData) => {
        setRemind(0);
        console.log(originData, updatedData, "originData, updatedData");
        const filterData = updatedData;

        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        console.log(originDataLength, "originDataLength");
        console.log(updatedDataLength, "updatedDataLength");

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, estIdList: updatedArray[i].estIdList };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateItem(firstRowUpdate); //수정

            const originAValues = originData.map((item) => item.estIdList); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            const flatArray = extraOriginData.flat(); //중첩배열 고르게만듦

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].estIdList);
                delListTest.push(originData[i]);
            }

            deleteItem(flatArray); //삭제
        } else if (originDataLength === updatedDataLength) {
            updateItem(filterData, "same"); //수정
        } else if (originDataLength < updatedDataLength) {
            console.log("여기타야함 추가");
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            updateItem(updateList); //수정
            const addLists = [];
            for (let i = originDataLength; i < updatedDataLength; i++) {
                const addList = { ...filterData[i] };
                addList.poiId = condition.poiId;
                addList.versionId = condition.versionId;
                addLists.push(addList);
            }
            addItem(addLists); //추가
        }
    };

    //구매비
    const compareData2 = (originData, updatedData) => {
        setRemind2(0);
        const filterData = updatedData;
        //const filterData = updatedData.filter((data) => data.pgId); //필수값 체크

        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, filterData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
                    const updatedItem = filterData[i];
                    updatedArray[i] = { ...updatedItem, estBuyId: updatedArray[i].estBuyId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateItem2(firstRowUpdate);

            const originAValues = originData.map((item) => item.estBuyId); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            deleteItem2(extraOriginData);
        } else if (originDataLength === updatedDataLength) {
            updateItem2(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                const temp = { ...filterData[i] };
                toUpdate.push(temp);
            }
            updateItem2(toUpdate);
            const addLists = [];

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const addList = { ...filterData[i] };
                addList.poiId = condition.poiId;
                addList.versionId = condition.versionId;
                addLists.push(addList);
            }
            addItem2(addLists); //추가
        }
    };

    const [remind, setRemind] = useState(0); //refresh 시점 알림
    const [remind2, setRemind2] = useState(0); //refresh 시점 알림

    const addItem2 = async (addData) => {
        const url = `api/estimate/buy/estCostBuy/addList.do`;
        const resultData = await axiosPost(url, addData);
        if (resultData) {
            setRemind2(2);
        }
    };

    const updateItem2 = async (toUpdate) => {
        const url = `/api/estimate/buy/estCostBuy/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData) {
            setRemind2(2);
        }
    };

    const deleteItem2 = async (removeItem) => {
        const url = `/api/estimate/buy/estCostBuy/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        if (resultData) {
            setRemind2(2);
        }
    };

    const addItem = async (addData) => {
        console.log(addData, "서버에 추가되는것것");
        const url = `/api/estimate/personnel/estimateCostMM/addArrayList.do`;
        const resultData = await axiosPost(url, addData);
        if (resultData) {
            setRemind(remind + 1);
        }
    };

    const updateItem = async (toUpdate, type) => {
        console.log(toUpdate, "수정하는값 보내기");
        const url = `/api/estimate/personnel/estimateCostMM/editArrayList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData) {
            setRemind(remind + 1);
            if (type) {
                setRemind(2);
            }
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/estimate/personnel/estimateCostMM/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        if (resultData) {
            setRemind(remind + 1);
        }
    };

    useEffect(() => {
        if (remind >= 2 || remind2 >= 2) {
            refresh();
        }
    }, [remind, remind2]);

    /* 품의서 */
    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const uniqId = JSON.parse(sessionUser)?.uniqId;
    const posNm = JSON.parse(sessionUser)?.posNm;

    const [isOpenModalApproval, setIsOpenModalApproval] = useState(false);
    const [approvalLine, setApprovalLine] = useState([]); //결재선
    const [isProgress, setIsProgress] = useState(true); //저장
    const [isSubmit, setIsSubmit] = useState(false); //결재요청
    const [content, setContent] = useState(""); //결재 비고내용
    const [title, setTitle] = useState("");

    // 입력창에 변화가 있을 때마다 호출될 함수입니다.
    const handleChange = (event) => {
        setTitle(event.target.value);
    };
    const writing = () => {
        if (!isProgress) {
            setIsProgress(true); //내용 변경 중
            fetchAllData(condition);
        }
    };

    const [copiedLabor, setCopiedLabor] = useState([]); //복제 인건비
    const [copiedBuy, setCopiedBuy] = useState([]); //복제 구매비
    const [isCopied, setIsCopied] = useState(false);

    /* 견적품의서 프로젝트 정보 */
    const returnData = async (value, type) => {
        if (type === "결재선") {
            const updated = [{ uniqId: uniqId, empNm: sessionUserName, posNm }, ...value.approvalLine];
            setApprovalLine(updated);
        } else if (type === "비고") {
            setContent(value);
        } else if (type === "제목") {
            setTitle(value);
        } else if (type === "조회") {
            setIsProgress(false); //내용저장(진행) 완료

            if (!value.view.poiId || (!value.view.versionId && !value.save.poiId) || !value.save.versionId) {
                return;
            }
            setCondition({ ...value.save });

            if (innerPageName.name !== "품의서") {
                if (value.view.versionId === value.save.versionId) {
                    setIsCopied(false);
                    const fetchResult = await fetchAllData({ ...value.save });
                    if (fetchResult.result) {
                        alert(fetchResult.versionNum + " 데이터를 가져옵니다.");
                    } else {
                        alert(fetchResult.versionNum + " 데이터가 없습니다.");
                    }
                } else if (value.view.versionId !== value.save.versionId) {
                    //복제 할때
                    setIsCopied(true);
                    await fetchAllData({ ...value.save });
                    const copiedResult = await fetchAllCopied({ ...value.view });
                    if (copiedResult.result) {
                        //복제 데이터가 있을 때
                        alert(copiedResult.versionNum + " 데이터를 가져옵니다.");
                    } else {
                        alert(copiedResult.versionNum + " 데이터가 없습니다.");
                    }
                }
            }
        }
    };

    const closePopup = () => {
        window.close(); //현재창닫기
    };

    const submit = async (inputComment) => {
        const list = approvalLine.slice(1); //첫번째는 요청자라 제외

        if (!condition || !condition.poiId) {
            alert("프로젝트를 선택하세요.");
            setIsSubmit(false);
            return;
        }
        if (!condition || !condition.versionId) {
            alert("버전을 선택하세요.");
            setIsSubmit(false);
            return;
        }
        if (!list || list.length === 0) {
            alert("결재선을 선택하세요.");
            setIsSubmit(false);
            return;
        }

        const dataTosend = {
            poiId: condition.poiId,
            versionId: condition.versionId,
            sgnDesc: content,
            sgnComment: inputComment.sttComent,
            sgnTitle: title,
            sgnType: "견적품의서",
            sttApproverList: list,
        };

        const resultData = await axiosPost("/api/system/signState/add.do", dataTosend);
        if (resultData) {
            alert("요청 완료되었습니다.");
            closePopup();
            setIsProgress(true); //결재요청 버튼 비활성화
            setApprovalLine([]);
        }
        setIsSubmit(false);
    };

    const approvalToServer = async (value) => {
        await submit(value); // submit 함수 호출 및 value 전달
        setIsSubmit(false); // isSubmit 상태를 다시 false로 설정
    };

    return (
        <>
            <Location pathList={locationPath.Quotation} />
            <div className="common_board_style mini_board_3">
                <ul className="tab">
                    <li onClick={() => changeTabs("인건비", "estimateLabor")}>
                        <a href="#인건비" className="on">
                            인건비
                        </a>
                    </li>
                    <li onClick={() => changeTabs("구매비", "orderBuying")}>
                        <a href="#구매비">구매비</a>
                    </li>
                    <li onClick={() => changeTabs("품의서", "proposal")}>
                        <a href="#품의서">품의서</a>
                    </li>
                </ul>
                <div className="list">
                    <div className="first">
                        <ul>
                            <ApprovalFormSal returnData={(value) => returnData(value, "조회")} viewPageName={{ name: "인건비", id: "estimateLabor" }} />
                            <HideCard title="계획 조회" color="back-lightblue" className="mg-b-40">
                                <ReactDataTable columns={columnlabor} customDatas={budgetMgmtView} defaultPageSize={5} hideCheckBox={true} />
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <PopupButton
                                        clickBtn={estimateBool}
                                        targetUrl={URL.LaborCostDoc}
                                        data={{ label: "갑 지", poiId: condition.poiId, versionId: condition.versionId, tableData: estimate }}
                                    />
                                    <PopupButton
                                        clickBtn={estimateBool}
                                        targetUrl={URL.LaborSummaryDoc}
                                        data={{ label: "상세내역", poiId: condition.poiId, versionId: condition.versionId, tableData: estimate }}
                                    />
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={isRefresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimateLabor}
                                    returnList={returnList}
                                    customDatas={estimate}
                                    viewPageName={{ name: "인건비", id: "estimateLabor" }}
                                    returnSelectRows={(data) => {
                                        setSelectedRows(data);
                                    }}
                                    customDatasRefresh={refresh}
                                    copiedDatas={copiedLabor}
                                    isCopied={isCopied}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal returnData={(value) => returnData(value, "조회")} viewPageName={{ name: "구매비", id: "orderBuying" }} />
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <PopupButton
                                        clickBtn={estimateBool}
                                        targetUrl={URL.LaborCostDoc}
                                        data={{ label: "갑 지", poiId: condition.poiId, versionId: condition.versionId, tableData: estimate }}
                                    />
                                    <PopupButton
                                        clickBtn={buyIngBool}
                                        targetUrl={URL.OrderSummaryDoc}
                                        data={{ label: "상세내역", poiId: condition.poiId, versionId: condition.versionId, tableData2: buyIngInfo }}
                                    />
                                    <PopupButton
                                        clickBtn={buyIngBool}
                                        targetUrl={URL.DetailDoc}
                                        data={{ label: "주요내역", poiId: condition.poiId, versionId: condition.versionId, tableData: buyIngInfo }}
                                    />
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={isRefresh} />
                                </div>
                                <ReactDataTablePdorder
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimatePurchase}
                                    customDatas={buyIngInfo}
                                    returnList={returnList}
                                    viewPageName={{ name: "구매비", id: "orderBuying" }}
                                    returnSelectRows={(data) => {
                                        setSelectedRows(data);
                                    }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                    copiedDatas={copiedBuy}
                                    isCopied={isCopied}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <div className="form-buttons mg-b-20" style={{ maxWidth: 1400 }}>
                                <PopupButton
                                    clickBtn={isProgress}
                                    targetUrl={URL.TotalDoc}
                                    data={{
                                        label: "견적서",
                                        poiId: condition.poiId,
                                        versionId: condition.versionId,
                                        tableData: estimate,
                                        tableData2: buyIngInfo,
                                    }}
                                />
                                <PopupButton clickBtn={isProgress} targetUrl={URL.PreCostDoc} data={{ label: "견적원가서", type: "document", ...condition }} />
                                <AddButton label="결재선" onClick={() => setIsOpenModalApproval(true)} />
                                <AddButton label="결재요청" onClick={() => setIsSubmit(true)} disabled={isProgress} />
                            </div>
                            <SignStateLine signStateData={approvalLine} />
                            <div style={{ marginTop: "-55px", marginBottom: 55 }}>
                                <h2>견적서 승인 요청서</h2>
                            </div>
                            <ApprovalFormSal returnData={(value) => returnData(value, "조회")} viewPageName={{ name: "품의서", id: "proposal" }} />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <input
                                    type="text"
                                    value={title}
                                    returnData={(value) => returnData(value, "제목")}
                                    onChange={handleChange}
                                    placeholder="제목을 입력하세요."
                                    className="basic-input mg-b-10"
                                    style={{ borderRadius: 0, height: "45px", padding: "7px" }}
                                />
                            </div>
                            <QuillEditor isProgress={isProgress} returnData={(value) => returnData(value, "비고")} writing={writing} />
                            <ApprovalLineModal
                                width={670}
                                height={500}
                                title="결재선"
                                type="견적품의서"
                                isOpen={isOpenModalApproval}
                                onClose={() => setIsOpenModalApproval(false)}
                                returnData={(value) => returnData(value, "결재선")}
                            />
                        </ul>
                    </div>
                </div>
            </div>
            <SearchModal returnData={(condition) => fetchAllData(condition)} onClose={() => setIsOpenSearch(false)} isOpen={isOpenSearch} />
            {isSubmit && (
                <ViewModal
                    width={500}
                    height={220}
                    list={columns.approval.comment}
                    resultData={approvalToServer}
                    title="결재처리"
                    onClose={() => setIsSubmit(false)}
                />
            )}
            {/*</div>
            )}*/}
        </>
    );
}

export default Quotation;
