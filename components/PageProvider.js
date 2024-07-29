import React, { createContext, useEffect, useState } from "react";

export const PageContext = createContext();

/**
 * tabs 안에 띄어지는 모든 page에서 공유하는 상태 값
 * 외부에서 <PageProvider>로 감싸야 children으로 인정 됨
 */
export function PageProvider({ children }) {
    //const [loadButton, setLoadButton] = useState(""); // 클릭된 데이터 테이블의 CRUD 버튼 이름

    const [inquiryConditions, setInquiryConditions] = useState({}); // 클릭된 데이터 테이블의 CRUD 버튼 이름

    const [nameOfButton, setNameOfButton] = useState(""); // 클릭된 데이터 테이블의 CRUD 버튼 이름
    const [isSaveFormTable, setIsSaveFormTable] = useState(true); // 버튼 on/off, false일때 저장 실행
    const [newRowData, setNewRowData] = useState({}); // 외부에서 추가된 table row data (수주등록, 팝업으로 추가)
    const [searchData, setSearchData] = useState(""); // 검색 조건

    const [projectItem, setProjectItem] = useState([]); //프로젝트 id, 이름, 코드 저장(프로젝트 수주발주)
    const [projectInfo, setProjectInfo] = useState({ poiId: "", poiNm: "", poiMonth: "", isPoIdSelected: false }); // 프로젝트 오브젝트 정보
    const [conditionExe, setConditionExe] = useState({}); // 실행의 조회 조건

    const [pgNmList, setPgNmList] = useState([]); // 품목그룹 ID, 품목그룹명 저장
    const [projectPgNm, setProjectPgNm] = useState({ pgNm: "", pgId: "" }); // 클릭한 품목그룹명, 품목그룹id 저장

    const [pdiNmList, setPdiNmList] = useState([]); // 품목ID,품명,(품목그룹명),단위,규격,제조사
    const [projectPdiNm, setProjectPdiNm] = useState({
        pdiId: "",
        pdiNm: "",
        pdiNum: "",
        pgNm: "",
        pdiStnd: "",
        pdiUnit: "",
        pdiWght: "",
        pdiMenufut: "",
        pupUnitPrice: "",
        byUnitPrice: "",
        pdiSeller: "",
    }); // 선택한 id 저장

    const [emUserInfo, setEmUserInfo] = useState({ uniqId: "", empNm: "", posNm: "" }); // 업무회원 정보 - 고유아이디, 사용자명, 직급

    const [unitPriceList, setUnitPriceList] = useState([]); // 급별단가 목록
    const [unitPriceListRenew, setUnitPriceListRenew] = useState([]); // 급별포맷 변경 목록

    const [addPgNm, setAddPgNm] = useState("");
    const [currentTable, setCurrentTable] = useState(null); // 유니크한 현재 데이터 테이블
    const [isOpenModalPgNm, setIsOpenModalPgNm] = useState(false);
    const [returnKeyWord, setReturnKeyWord] = useState(""); //pmNm검색어 저장

    const [companyList, setCompanyList] = useState([]); // 회사명 선택
    const [companyInfo, setCompanyInfo] = useState({}); // 선택한 id 저장
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);
    const [authorGroupInfo, setAuthorGroupInfo] = useState({}); //권한그룹 정보

    const [addPdiNm, setAddPdiNm] = useState("");

    const [returnKeyWordPdiNm, setReturnKeyWordPdiNm] = useState(""); //pdiNm검색어 저장
    const [isOpenModalPdiNm, setIsOpenModalPdiNm] = useState(false);

    const [currentPageName, setCurrentPageName] = useState({ name: "", id: "" }); // tab 현재페이지
    const [prevCurrentPageName, setPrevCurrentPageName] = useState({ name: "", id: "" }); // tab 이전페이지
    const [innerPageName, setInnerPageName] = useState({ name: "", id: "" }); // snbLabel과 같은 역할. 컴포넌트 안의 탭 라벨
    const [prevInnerPageName, setPrevInnerPageName] = useState({ name: "", id: "" });
    const [modalPageName, setModalPageName] = useState("");
    const [modalLengthSelectRow, setModalLengthSelectRow] = useState(0); //모달 테이블의 버튼 플래그
    const [lengthSelectRow, setLengthSelectRow] = useState(0); // 테이블 버튼 플래그
    const [isModalTable, setIsModalTable] = useState(false);

    const [saveSaleManCost, setSaveSaleManCost] = useState([]);
    const [isCancelTable, setIsCancelTable] = useState(false); // 테이블 초기값으로 돌리기

    const [refresh, setRefresh] = useState(false); //임시로 리프레시 flag 생성

    const [gnbLabel, setGnbLabel] = useState(""); //헤더

    const [fileId, setFileId] = useState([]);
    const [fileName, setFileName] = useState([]);

    const [filePageName, setFilePageName] = useState([]);

    const [estimate, setEstimate] = useState([]);
    const [buyIngInfo, setBuyIngInfo] = useState([]);
    
    const [atchFileId, setAtchFileId] = useState(""); //파일 부모ID
    const [fileInfo, setFileInfo] = useState(""); //파일 부모+자식정보
    const [fileLength, setFileLength] = useState(0); //파일 길이
    const [fileLCatch, setFileCatch] = useState(false); //파일 ???

    const contextValue = {
        isOpenModalPgNm,
        setIsOpenModalPgNm,
        returnKeyWord,
        setReturnKeyWord,
        pgNmList,
        setPgNmList,
        addPgNm,
        setAddPgNm,
        projectPgNm,
        setProjectPgNm,
        nameOfButton,
        setNameOfButton,
        isSaveFormTable,
        setIsSaveFormTable,
        newRowData,
        setNewRowData,
        searchData,
        setSearchData,
        projectItem,
        setProjectItem,
        projectInfo,
        setProjectInfo,
        currentTable,
        setCurrentTable,
        currentPageName,
        setCurrentPageName,
        prevCurrentPageName,
        setPrevCurrentPageName,
        innerPageName,
        setInnerPageName,
        prevInnerPageName,
        setPrevInnerPageName,
        modalPageName,
        setModalPageName,
        modalLengthSelectRow,
        setModalLengthSelectRow,
        lengthSelectRow,
        setLengthSelectRow,
        isCancelTable,
        setIsCancelTable,
        isModalTable,
        setIsModalTable,
        pdiNmList,
        setPdiNmList,
        projectPdiNm,
        setProjectPdiNm,
        returnKeyWordPdiNm,
        setReturnKeyWordPdiNm,
        isOpenModalPdiNm,
        setIsOpenModalPdiNm,
        addPdiNm,
        setAddPdiNm,
        unitPriceList,
        setUnitPriceList,
        companyList,
        setCompanyList,
        companyInfo,
        setCompanyInfo,
        isOpenModalCompany,
        setIsOpenModalCompany,
        saveSaleManCost,
        setSaveSaleManCost,
        refresh,
        setRefresh,
        gnbLabel,
        setGnbLabel,
        conditionExe,
        setConditionExe,
        unitPriceListRenew,
        setUnitPriceListRenew,
        emUserInfo,
        setEmUserInfo,
        //loadButton,
        //setLoadButton,
        authorGroupInfo,
        setAuthorGroupInfo,

        fileName,
        setFileName,
        fileId,
        setFileId,
        atchFileId,
        setAtchFileId,
        filePageName,
        setFilePageName,

        inquiryConditions,
        setInquiryConditions,
        estimate,
        setEstimate,
        buyIngInfo,
        setBuyIngInfo,
        fileLength,
        setFileLength,

        fileLCatch,
        setFileCatch,
        fileInfo, setFileInfo
    };

    return <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>;
}
