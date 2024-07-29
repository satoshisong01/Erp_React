import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { ChangePrmnPlanData, buyIngInfoCalculation, division, calculateTotalBuy, } from "components/DataTable/function/ReplaceDataFormat";
import RefreshButton from "components/button/RefreshButton";
import { columns } from "constants/columns";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import HideCard from "components/HideCard";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import AddModModal from "components/modal/AddModModal";
import SaveButton from "components/button/SaveButton";
import ReactDataTableDevCost from "components/DataTable/ReactDataTableDevCost";
import DeleteModal from "components/modal/DeleteModal";
import SearchList from "components/SearchList";
import ReactDataTableSaleCost from "components/DataTable/ReactDataTableSaleCost";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";
import BasicButton from "components/button/BasicButton";
import SearchModal from "components/modal/SearchModal";

/** 영업관리-계획관리 */
function OrderPlanMgmt() {
    const sessionUser = sessionStorage.getItem("loginUser");

    const {
        currentPageName,
        innerPageName,
        setPrevInnerPageName,
        setInnerPageName,
        setCurrentPageName,
        unitPriceListRenew,
        setNameOfButton,
    } = useContext(PageContext);
    const [searchDates, setSearchDates] = useState([]); // 원가
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [prmnCalDatas, setPrmnCalDatas] = useState([]); // 인건비합계
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pjbudgetCalDatas, setPjbudgetCalDatas] = useState([]); // 경비합계
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)
    const [pdOrdrCalDatas, setPdOrdrCalDatas] = useState([]); // 구매합계
    const [outsourcingDatas, setOutsourcingDatas] = useState([]); // 개발외주비
    const [outCalDatas, setOutCalDatas] = useState([]); // 개발외주비합계
    const [generalExpensesDatas, setGeneralExpensesDatas] = useState([]); // 영업관리비
    const [generalCalDatas, setGeneralCalDatas] = useState([]); // 영업관리비합계
    // const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 rows
    const [selectedRow, setSelectedRow] = useState([]); //그리드에서 선택된 단일행
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [condition, setCondition] = useState({}); //poiMonth:기준연도
    const [infoList, setInfoList] = useState([
        { name: "원가버전조회", id: "OrderPlanMgmt" },
        { name: "인건비", id: "labor" },
        { name: "구매(재료비)", id: "buying" },
        { name: "개발외주비", id: "outsourcing" },
        { name: "경비", id: "budget" },
        { name: "영업관리비", id: "general" },
    ]);

    useEffect(() => {
        setInnerPageName({ name: "원가버전조회", id: "OrderPlanMgmt" });
        setCurrentPageName({}); //inner와 pageName은 동시에 사용 X
        return () => {};
    }, []);

    useEffect(() => {
        if (currentPageName.id === "OrderPlanMgmt") {
            const activeTab = document.querySelector(".mini_board_1 .tab li a.on"); //마지막으로 활성화 된 탭
            if (activeTab) {
                const activeTabInfo = infoList.find((data) => data.name === activeTab.textContent);
                setInnerPageName({ ...activeTabInfo });
                setCurrentPageName({});
                // fetchAllData();
            }
        }
    }, [currentPageName]);

    useEffect(() => {
        // const infoIds = infoList.map(item => item.id);
        if (innerPageName.id === "OrderPlanMgmt") {
            setIsCopied(false);
            fetchAllData();
        }
        // else if(infoIds.includes(innerPageName.id)) {
        //     if(condition.poiId) {
        //         fetchAllData(condition);
        //     }
        // }
    }, [innerPageName]);

    const isRefresh = () => {
        const willApprove = window.confirm("새로고침 하시겠습니까?");
        if(willApprove) {
            setIsCopied(false);
            if (condition.poiId && condition.versionId) {
                fetchAllData(condition);
            } else {
                fetchAllData();
            }
        }
    };

    const refresh = () => {
        setIsCopied(false);
        setRemind(0);
        // setTimeout(() => {
            if (condition.poiId && condition.versionId) {
                fetchAllData(condition);
            } else {
                fetchAllData();
            }
        // }, 2000); // 2초 후에 실행
    };

    const returnList = (originTableData, tableData) => {
        compareData(originTableData, tableData);
    };

    const changeTabs = (name, id) => {
        setInnerPageName((prev) => {
            setPrevInnerPageName({ ...prev });
            return { name, id };
        });
        setCurrentPageName({});
    };

    const updateDataInOrigin = (originData, updatedData) => {
        const updatedArray = [];
        for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
            const updatedItem = updatedData[i];
            updatedArray[i] = { ...updatedItem, pmpMonth: originData[i].pmpMonth, pmpMonth2: updatedData[i].pmpMonth };
        }
        return updatedArray;
    };

    const addDayToPmpMonth = (data) => {
        data.forEach((item) => {
            const date = item.pmpMonth?.split('-'); // 비구조화 할당을 이용하여 연도와 월을 추출
            const date2 = item.pmpMonth2?.split('-'); // 비구조화 할당을 이용하여 연도와 월을 추출
            if (date) {
                item.pmpMonth = `${date[0]}-${date[1]}-01`;
            }
            if (date2) {
                item.pmpMonth2 = `${date2[0]}-${date2[1]}-01`;
            }
        });
    };

    const [remind, setRemind] = useState(0) //refresh 시점 알림
    //인건비용
    const compareData = (originData, updatedData) => {
        setRemind(0);
        if (originData?.length === 0 && updatedData?.length === 0) return;
        const filterData = updatedData.filter((data) => data.pmpMonth); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            upDateChange(firstRowUpdate);
            addDayToPmpMonth(firstRowUpdate);
            updateList(firstRowUpdate);

            const originAValues = originData.map((item) => item.pmpId);
            const extraOriginData = originAValues.slice(updatedDataLength);
            const combinedAValues = extraOriginData.reduce((acc, current) => acc.concat(current), []);

            deleteList(combinedAValues);

        } else if (originDataLength === updatedDataLength) {
            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            upDateChange(firstRowUpdate);
            addDayToPmpMonth(firstRowUpdate);
            updateList(firstRowUpdate, "same");
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            const firstRowUpdate = updateDataInOrigin(originData, addUpdate);
            upDateChange(firstRowUpdate);
            addDayToPmpMonth(firstRowUpdate);
            updateList(firstRowUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const toAdd = { ...filterData[i] };
                delete toAdd.total;
                delete toAdd.poiBeginDt1;
                toAdd.useAt = "Y";
                toAdd.deleteAt = "N";
                toAdd.poiId = condition.poiId;
                toAdd.versionId = condition.versionId;

                for (let j = 1; j <= 14; j++) {
                    if (toAdd[`pmpmmPositionCode${j}`] === null) {
                        toAdd[`pmpmmPositionCode${j}`] = 0;
                    }
                }

                toAdds.push(toAdd);
            }
            addDayToPmpMonth(toAdds);
            addList(toAdds);
        }
    };

    useEffect(() => {
        if(remind >= 2) {
            alert("저장 완료");
            refresh();
        }
    }, [remind])

    const addList = async (addNewData) => {
        if(!condition.poiId || !condition.versionId) {
            console.log("프로젝트 또는 버전 정보 ERROR");
            return;
        }
        if(addNewData?.length > 0) {
            addNewData.forEach((data) => {
                data.poiId = condition.poiId ;
                data.versionId = condition.versionId;
                // delete data.pmpId
                data.pmpId = null;
            });
            const resultData = await axiosPost(`/api/baseInfrm/product/prmnPlan/addList.do`, addNewData);
            if (resultData) {
                setRemind(remind+1);
            }
        }
    };
    const updateList = async (toUpdate, type) => {
        if(!condition.poiId || !condition.versionId) {
            return;
        }
        if(toUpdate?.length > 0) {
            toUpdate.forEach((data) => {
                data.poiId = condition.poiId;
                data.versionId = condition.versionId;
            });
            const updatedData = toUpdate.map((obj) => {
                const { pmpId, ...rest } = obj;
                return rest;
            });
    
            const resultData = await axiosUpdate(`/api/baseInfrm/product/prmnPlan/editArrayList.do`, updatedData);
            if (resultData) {
                setRemind(remind+1);
                if(type) {
                    setRemind(2);
                }
            }
        }
    };

    const deleteList = async (removeItem) => {
        if(!condition.poiId || !condition.versionId) {
            console.log("프로젝트 또는 버전 정보 ERROR");
            return;
        }
        if(removeItem?.length > 0) {
            const resultData = await axiosDelete(`/api/baseInfrm/product/prmnPlan/removeAll.do`, removeItem);
            if (resultData) {
                setRemind(remind+1);
            }
        }
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수
    //추가 함수
    const upDateChange = (data, originData) => {
        if (data && originData) {
            return;
        }
        for (let index = 0; index < data.length; index++) {
            const item = data[index];

            // null 값을 0으로 변경
            for (let i = 1; i <= 14; i++) {
                const key = `pmpmmPositionCode${i}`;
                if (item[key] === null) {
                    item[key] = 0;
                }
            }

            // useAt이 없다면 "Y"로 설정
            if (!item.hasOwnProperty("useAt")) {
                item.useAt = "Y";
            }

            if (!item.hasOwnProperty("poiId")) {
                // item.poiId = projectInfo.poiId;
            }

            // deleteAt이 없다면 "N"로 설정
            if (!item.hasOwnProperty("deleteAt")) {
                item.deleteAt = "N";
            }

            // pmpMonth2가 없다면 값을 pmpMonth에서 가져옴
            if (!item.hasOwnProperty("pmpMonth2")) {
                item.pmpMonth2 = item.pmpMonth;
                item.pmpMonth = originData && originData[index].pmpMonth;
            }
        }
    };

    const fetchVersion = async () => {
        const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", {
            searchCondition: "",
            searchKeyword: "",
        });
        setSearchDates(resultData);
    };

    const fetchAllData = async (requestData) => {
        if (innerPageName.name === "원가버전조회") {
            const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", {
                searchCondition: "",
                searchKeyword: "",
            });
            if (resultData && resultData.length > 0) {
                setSearchDates(resultData);
            } else {
                alert(requestData.versionNum+"의 데이터가 없습니다.");
                setSearchDates([]);
            }
        } else if (innerPageName.name === "인건비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                const changeData = ChangePrmnPlanData(resultData, condition.poiId);
                let total = 0,
                    mm1 = 0,
                    mm9 = 0,
                    mm10 = 0,
                    mm11 = 0,
                    mm12 = 0,
                    mm13 = 0,
                    mm14 = 0; //mm합
                const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === requestData.poiMonth);
                if (matchingAItem) {
                    changeData.forEach((Item) => {
                        mm1 += Item.pmpmmPositionCode1;
                        mm9 += Item.pmpmmPositionCode9;
                        mm10 += Item.pmpmmPositionCode10;
                        mm11 += Item.pmpmmPositionCode11;
                        mm12 += Item.pmpmmPositionCode12;
                        mm13 += Item.pmpmmPositionCode13;
                        mm14 += Item.pmpmmPositionCode14;
                    });
                    total = mm1 + mm9 + mm10 + mm11 + mm12 + mm13 + mm14;

                    setPrmnCalDatas([ //합계
                        {
                            type: "M/M",
                            total,
                            pmpmmPositionCode1Total: mm1,
                            pmpmmPositionCode9Total: mm9,
                            pmpmmPositionCode10Total: mm10,
                            pmpmmPositionCode11Total: mm11,
                            pmpmmPositionCode12Total: mm12,
                            pmpmmPositionCode13Total: mm13,
                            pmpmmPositionCode14Total: mm14,
                        },
                        {
                            type: "금액",
                            total:
                                mm1 * matchingAItem.gupPrice1 +
                                mm9 * matchingAItem.gupPrice9 +
                                mm10 * matchingAItem.gupPrice10 +
                                mm11 * matchingAItem.gupPrice11 +
                                mm12 * matchingAItem.gupPrice12 +
                                mm13 * matchingAItem.gupPrice13 +
                                mm14 * matchingAItem.gupPrice14,
                            pmpmmPositionCode1Total: mm1 * matchingAItem.gupPrice1,
                            pmpmmPositionCode9Total: mm9 * matchingAItem.gupPrice9,
                            pmpmmPositionCode10Total: mm10 * matchingAItem.gupPrice10,
                            pmpmmPositionCode11Total: mm11 * matchingAItem.gupPrice11,
                            pmpmmPositionCode12Total: mm12 * matchingAItem.gupPrice12,
                            pmpmmPositionCode13Total: mm13 * matchingAItem.gupPrice13,
                            pmpmmPositionCode14Total: mm14 * matchingAItem.gupPrice14,
                        },
                    ]);
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
                    setPrmnPlanDatas(changeData);
                } else {
                    alert("프로젝트 기준연도가 해당하는 급별단가가 없습니다.");
                }
                return { result: true, versionNum: requestData.versionNum }
            } else if (resultData.length === 0) {
                setPrmnPlanDatas([]);
                setPrmnCalDatas([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "경비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                setPjbudgetDatas(resultData);
                let pjbgPriceTotal = 0;
                resultData.forEach((data) => {
                    pjbgPriceTotal += data.pjbgPrice;
                });
                setPjbudgetCalDatas([{ pjbgPriceTotal }]);
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setPjbudgetDatas([]);
                setPjbudgetCalDatas([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "구매(재료비)") {
            const resultData = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                const calData = buyIngInfoCalculation(resultData);
                setPdOrdrDatas(calData);
                const calTotalData = calculateTotalBuy(calData);
                setPdOrdrCalDatas(calTotalData); //합계
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setPdOrdrDatas([]);
                setPdOrdrCalDatas([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "개발외주비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/devOutCost/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                resultData.forEach((data) => {
                    data.price = data.devOutMm * data.devOutPrice; // 계산된 값을 데이터에 추가
                });
                setOutsourcingDatas(resultData);

                const calTotal = resultData.reduce(
                    (total, data) => {
                        total.totalPrice += data.price;
                        return total;
                    },
                    { totalPrice: 0 }
                );

                setOutCalDatas([calTotal]);
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setOutsourcingDatas([]);
                setOutCalDatas([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "영업관리비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/slsmnExpns/totalListAll.do", requestData);
            const resultDataTotal = await axiosFetch("/api/cost/contract/totalQuotation.do", requestData);

            if (resultDataTotal) {
                let total = Math.round(resultDataTotal.legalTotalPrice / 10) * 10; // 판관비를 10의 자리까지 반올림
                let negoTotal = Math.round(resultDataTotal.slsmnNego / 10) * 10; // 네고를 10의 자리까지 반올림
                let companyMargin = Math.round(resultDataTotal.slsmnEnterpriseProfit / 10) * 10; // 기업이윤을 10의 자리까지 반올림
                let nomalCost = Math.round(resultDataTotal.slsmnAdmnsCost / 10) * 10; // 일반관리비를 10의 자리까지 반올림
                //let price = 15; //네고
                setGeneralCalDatas([{ total, negoTotal, companyMargin, nomalCost }]);
            } else {
                setGeneralCalDatas([]);
            }

            if (resultData && resultData.length > 0) {
                setGeneralExpensesDatas(resultData);
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setGeneralExpensesDatas([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        }
    };

    const [copiedLabor, setCopiedLabor] = useState([]); //복제 인건비
    const [copiedBuy, setCopiedBuy] = useState([]); //복제 구매비
    const [copiedOut, setCopiedOut] = useState([]); //복제 외주비
    const [copiedPjbudget, setCopiedPjbudget] = useState([]); //복제 경비
    const [copiedSales, setCopiedSales] = useState([]); //복제 영업관리비
    const [isCopied, setIsCopied] = useState(false);

    const fetchAllCopied = async (requestData) => {
        if (innerPageName.name === "인건비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                const changeData = ChangePrmnPlanData(resultData, condition.poiId);
                const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === requestData.poiMonth);
                if (matchingAItem) {
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
                    setCopiedLabor(changeData);
                }
                return { result: true, versionNum: requestData.versionNum }
            } else if (resultData.length === 0) {
                setCopiedLabor([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "경비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                setCopiedPjbudget(resultData);
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setCopiedPjbudget([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "구매(재료비)") {
            const resultData = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                const calData = buyIngInfoCalculation(resultData);
                setCopiedBuy(calData);
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setCopiedBuy([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "개발외주비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/devOutCost/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                resultData.forEach((data) => {
                    data.price = data.devOutMm * data.devOutPrice; // 계산된 값을 데이터에 추가
                });
                setCopiedOut(resultData);
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setCopiedOut([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        } else if (innerPageName.name === "영업관리비") {
            const resultData = await axiosFetch("/api/baseInfrm/product/slsmnExpns/totalListAll.do", requestData);
            if (resultData && resultData.length > 0) {
                setCopiedSales(resultData);
                return { result: true, versionNum: requestData.versionNum }
            } else {
                setCopiedSales([]);
                return { result: false, versionNum: requestData.versionNum }
            }
        }
    };

    const [isOpenAdd, setIsOpenAdd] = useState(false);

    const addVersionToServer = async (addData) => {
        const url = `/api/baseInfrm/product/versionControl/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
            //poiId: projectInfo.poiId,
        };

        const resultData = await axiosPost(url, dataToSend);
        if (resultData) {
            alert("추가되었습니다");
            fetchVersion();
        } else {
            alert("error!");
        }
    };

    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록

    useEffect(() => {
        if (innerPageName.name === "원가버전조회") {
            selectedRow && setDeleteNames([selectedRow.versionNum]);
        }
    }, [selectedRow, innerPageName]);

    const deleteToServer = async (value) => {
        if (value === "임시삭제") {
            /* 임시삭제 코드 구현 */
        } else if (value === "영구삭제") {
            const poiNms = selectedRow.versionId;
            const url = `/api/baseInfrm/product/versionControl/removeAll.do`;
            const resultData = await axiosDelete(url, [poiNms]);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                fetchVersion();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const modifyToServer = async (updatedData) => {
        if (updatedData.length === 0) {
            alert("수정할 항목을 선택하세요.");
            return;
        }
        let url = "";
        if (innerPageName.name === "원가버전조회") {
            url = `/api/baseInfrm/product/versionControl/edit.do`;
        } else {
            url = `/api/baseInfrm/product/pjOrdrInfo/edit.do`;
        }
        const resultData = await axiosUpdate(url, updatedData);
        if (resultData) {
            alert("수정되었습니다");
            fetchVersion();
        } else {
            alert("error!!");
        }
    };

    const getData = async (value) => {
        if (!value.view.poiId || !value.view.versionId && !value.save.poiId || !value.save.versionId) {
            return;
        }

        setCondition({ ...value.save });

        if (value.view.versionId === value.save.versionId) {
            setIsCopied(false);
            const fetchResult = await fetchAllData({ ...value.save });
            if(fetchResult.result) {
                alert(fetchResult.versionNum+" 데이터를 가져옵니다.")
            } else {
                alert(fetchResult.versionNum+" 데이터가 없습니다.")
            }
        } else if (value.view.versionId !== value.save.versionId) { //복제 할때
            setIsCopied(true);
            await fetchAllData({ ...value.save });
            const copiedResult = await fetchAllCopied({ ...value.view });
            if(copiedResult.result) { //복제 데이터가 있을 때
                alert(copiedResult.versionNum+" 데이터를 가져옵니다.");
            } else {
                alert(copiedResult.versionNum+" 데이터가 없습니다.")
            }
        }
    }

    const searchGetData = (request) => {
        setIsCopied(false);
        fetchAllData(request);
    }

    

    return (
        <>
            <div className="common_board_style mini_board_1">
                <ul className="tab">
                    <li
                        onClick={() => {
                            changeTabs("원가버전조회", "OrderPlanMgmt");
                        }}>
                        <a href="#원가버전조회" className="on">
                            원가버전조회
                        </a>
                    </li>
                    <li onClick={() => changeTabs("인건비", "labor")}>
                        <a href="#인건비">인건비</a>
                    </li>
                    <li onClick={() => changeTabs("구매(재료비)", "buying")}>
                        <a href="#구매(재료비)">구매(재료비)</a>
                    </li>
                    <li onClick={() => changeTabs("개발외주비", "outsourcing")}>
                        <a href="#개발외주비">개발외주비</a>
                    </li>
                    <li onClick={() => changeTabs("경비", "budget")}>
                        <a href="#경비">경비</a>
                    </li>
                    <li onClick={() => changeTabs("영업관리비", "general")}>
                        <a href="#영업관리비">영업관리비</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <SearchList conditionList={columns.orderPlanMgmt.versionCondition} onSearch={(value) => searchGetData(value)} />
                            <HideCard title="원가 버전 목록" color="back-lightblue" className="mg-b-40">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <PopupButton
                                        targetUrl={URL.PreCostDoc}
                                        data={{ label: "사전원가서", type: "document", ...selectedRow, sessionUserInfo: JSON.parse(sessionUser) }}
                                    />
                                    <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                                    <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                                    <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                                    <RefreshButton onClick={() => fetchAllData()} />
                                </div>
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.version}
                                    customDatas={searchDates}
                                    viewPageName={{ name: "원가버전조회", id: "OrderPlanMgmt" }}
                                    customDatasRefresh={refresh}
                                    returnSelect={(data) => setSelectedRow(data)}
                                    isPageNation={true}
                                    isSingleSelect={true}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal returnData={getData} viewPageName={{ name: "인건비", id: "labor" }}/>
                            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.laborCal}
                                    customDatas={prmnCalDatas}
                                    hideCheckBox={true}
                                    isPageNation={true}
                                    // viewPageName={{ name: "인건비", id: "labor" }}
                                />
                            </HideCard>
                            <HideCard title="등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={isRefresh} />
                                </div>
                                <ReactDataTable
                                    editing={true}
                                    columns={columns.orderPlanMgmt.labor}
                                    customDatas={prmnPlanDatas}
                                    returnList={returnList}
                                    viewPageName={{ name: "인건비", id: "labor" }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                    copiedDatas={copiedLabor}
                                    isCopied={isCopied}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalFormSal returnData={getData} viewPageName={{ name: "구매(재료비)", id: "buying" }}/>
                            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.purchaseCal}
                                    customDatas={pdOrdrCalDatas}
                                    hideCheckBox={true}
                                    isSpecialRow={true}
                                    // viewPageName={{ name: "구매(재료비)", id: "buying" }}
                                />
                            </HideCard>
                            <HideCard title="등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <BasicButton label="검색하기" onClick={() => setIsOpenSearch(true)} />
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={isRefresh} />
                                </div>
                                <ReactDataTablePdorder
                                    editing={true}
                                    columns={columns.orderPlanMgmt.purchase}
                                    customDatas={pdOrdrDatas}
                                    viewPageName={{ name: "구매(재료비)", id: "buying" }}
                                    suffixUrl="/baseInfrm/product/buyIngInfo"
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                    copiedDatas={copiedBuy}
                                    isCopied={isCopied}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="fourth">
                        <ul>
                            <ApprovalFormSal returnData={getData} viewPageName={{ name: "개발외주비", id: "outsourcing" }}/>
                            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.outCal}
                                    customDatas={outCalDatas}
                                    hideCheckBox={true}
                                    condition={condition}
                                    isPageNation={true}
                                    // viewPageName={{ name: "개발외주비", id: "outsourcing" }}
                                />
                            </HideCard>
                            <HideCard title="등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={isRefresh} />
                                </div>
                                <ReactDataTableDevCost
                                    editing={true}
                                    suffixUrl="/baseInfrm/product/devOutCost"
                                    columns={columns.orderPlanMgmt.outsourcing}
                                    customDatas={outsourcingDatas}
                                    viewPageName={{ name: "개발외주비", id: "outsourcing" }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                    copiedDatas={copiedOut}
                                    isCopied={isCopied}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="fifth">
                        <ul>
                            <ApprovalFormSal returnData={getData} viewPageName={{ name: "경비", id: "budget" }}/>
                            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.expensesCal}
                                    customDatas={pjbudgetCalDatas}
                                    hideCheckBox={true}
                                    isPageNation={true}
                                    // viewPageName={{ name: "경비", id: "budget" }}
                                />
                            </HideCard>
                            <HideCard title="등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={isRefresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    columns={columns.orderPlanMgmt.expenses}
                                    customDatas={pjbudgetDatas}
                                    viewPageName={{ name: "경비", id: "budget" }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                    copiedDatas={copiedPjbudget}
                                    isCopied={isCopied}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="sixth">
                        <ul>
                            <ApprovalFormSal returnData={getData} viewPageName={{ name: "영업관리비", id: "general" }}/>
                            <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.generalCal}
                                    customDatas={generalCalDatas}
                                    hideCheckBox={true}
                                    condition={condition}
                                    isPageNation={true}
                                    // viewPageName={{ name: "영업관리비", id: "general" }}
                                />
                            </HideCard>
                            <HideCard title="등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={isRefresh} />
                                </div>
                                <ReactDataTableSaleCost
                                    editing={true}
                                    columns={columns.orderPlanMgmt.generalExpenses}
                                    suffixUrl="/baseInfrm/product/pjbudget"
                                    customDatas={generalExpensesDatas}
                                    viewPageName={{ name: "영업관리비", id: "general" }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                    copiedDatas={copiedSales}
                                    isCopied={isCopied}
                                />
                            </HideCard>
                        </ul>
                    </div>
                </div>
            </div>
            {isOpenAdd && (
                <AddModModal
                    width={500}
                    height={300}
                    list={columns.orderPlanMgmt.versionAdd}
                    resultData={addVersionToServer}
                    onClose={() => setIsOpenAdd(false)}
                    title="버전 추가"
                />
            )}
            {isOpenMod && (
                <AddModModal
                    width={500}
                    height={200}
                    list={columns.orderPlanMgmt.versionMod}
                    initialData={[{ ...selectedRow }]}
                    resultData={modifyToServer}
                    onClose={() => setIsOpenMod(false)}
                    title="버전 수정"
                />
            )}
            <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />
            <SearchModal
                // returnData={(companyInfo) => fetchAllData({ ...companyInfo, ...condition })}
                returnData={(companyInfo) => searchGetData({ ...companyInfo, ...condition })}
                onClose={() => setIsOpenSearch(false)}
                isOpen={isOpenSearch}
                width={350}
                height={210}
                title="구매내역 검색"
            />
        </>
    );
}

export default OrderPlanMgmt;
