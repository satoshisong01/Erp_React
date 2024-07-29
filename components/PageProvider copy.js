import React, { createContext, useState } from "react";

export const PageContext = createContext();

/**
 * tabs 안에 띄어지는 모든 page에서 공유하는 상태 값
 * 외부에서 <PageProvider>로 감싸야 children으로 인정 됨
 * ㅇㅋㅇㅋ
 */
export function PageProvider({ children }) {
    const [nameOfButton, setNameOfButton] = useState(""); // 클릭된 데이터 테이블의 CRUD 버튼 이름
    const [isSaveFormTable, setIsSaveFormTable] = useState(true); // row 수정 테이블 저장, 수정 플래그
    const [newRowData, setNewRowData] = useState({}); // 외부에서 추가된 table row data (수주등록, 팝업으로 추가)
    const [searchData, setSearchData] = useState(""); // 검색 조건
    const [openModal, setOpenModal] = useState({type: '', isOpen: false}); // 모달창 open 조건  // type: add, modify
    const [projectItem, setProjectItem] = useState([]); //프로젝트 id, 이름, 코드 저장
    const [projectInfo, setProjectInfo] = useState({poiId: '', poiNm: '', poiCode: ''}); // 선택한 id 저장
    const [projectPgNm, setProjectPgNm] = useState({pgNm: ''}); // 선택한 id 저장
    const [addPgNm, setAddPgNm] = useState("");
    const [currentTable, setCurrentTable] = useState(null); // 유니크한 현재 데이터 테이블
    const [isOpenModal ,setIsOpenModal] = useState(false)
    const [isOpenModalPgNm ,setIsOpenModalPgNm] = useState(false)
    const [pgNmList, setPgNmList] = useState([]) // 품목그룹명 선택
    const [returnKeyWord, setReturnKeyWord] = useState(""); //pmNm검색어 저장
    
    const contextValue = {
        nameOfButton,
        setNameOfButton,
        isSaveFormTable,
        setIsSaveFormTable,
        newRowData,
        setNewRowData,
        searchData,
        setSearchData,
        openModal,
        setOpenModal,
        projectItem,
        setProjectItem,
        projectInfo,
        setProjectInfo,
        projectPgNm,
        setProjectPgNm,
        currentTable,
        setCurrentTable,
        isOpenModal,
        setIsOpenModal,
        isOpenModalPgNm,
        setIsOpenModalPgNm,
        returnKeyWord,
        setReturnKeyWord,
        pgNmList,
        setPgNmList,
        addPgNm,
        setAddPgNm
    };

    return (
        <PageContext.Provider value={contextValue}>
            {children}
        </PageContext.Provider>
    );
}
