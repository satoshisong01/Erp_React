import { axiosFetch, axiosPost } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect } from "react";
import { ReorganizeManCost } from "./ReorganizeData";

export default function ReferenceInfo() {
    const { addPdiNm, addPgNm, setUnitPriceList, setUnitPriceListRenew, returnKeyWord, setPgNmList, setPdiNmList } = useContext(PageContext);
    useEffect(() => {
        unitPriceItem();
    }, []);

    const unitPriceItem = async () => {
        //급별단가
        const resultData = await axiosFetch("/api/baseInfrm/product/gradeunitPrice/totalListAll.do", { searchCondition: "1", searchKeyword: "13" });
        setUnitPriceList && setUnitPriceList([...resultData]);
        setUnitPriceListRenew && setUnitPriceListRenew(ReorganizeManCost(resultData));
    };
    //const unitPriceRenew = async () => {
    //    const url = `/api/baseInfrm/product/gradeunitPrice/type/p/listAll.do`;
    //    const requestData = { useAt: "Y" };
    //    const resultData = await axiosFetch(url, requestData);
    //};

    //const pgNmItem = async () => {
    //    let requestData = "";
    //    const url = `/api/baseInfrm/product/productGroup/totalListAll.do`;
    //    if (returnKeyWord) {
    //        requestData = returnKeyWord;
    //    } else {
    //        requestData = { useAt: "Y" };
    //    }
    //    const resultData = await axiosFetch(url, requestData);
    //    //품목그룹 저장
    //    setPgNmList(
    //        resultData.map((item) => ({
    //            pgNm: item.pgNm,
    //            pgId: item.pgId,
    //        }))
    //    );
    //};

    //const pdiNmItem = async () => {
    //    let requestData = "";
    //    const url = `/api/baseInfrm/product/productInfo/totalListAll.do`;
    //    if (returnKeyWord) {
    //        requestData = returnKeyWord;
    //    } else {
    //        requestData = { useAt: "Y" };
    //    }
    //    const resultData = await axiosFetch(url, requestData);

    //    //품목ID, 품명 , 품목그룹명,단위,품목규격,제조원 저장
    //    setPdiNmList(
    //        resultData.map((item) => ({
    //            pdiId: item.pdiId,
    //            pdiNm: item.pdiNm,
    //            pgNm: item.pgNm,
    //            pdiWght: item.pdiWght,
    //            pdiStnd: item.pdiStnd,
    //            pdiMenufut: item.pdiMenufut,
    //        }))
    //    );
    //};

    //useEffect(() => {
    //    if (addPgNm === true) {
    //        fnAddPgNm();
    //    }
    //    if (addPdiNm === true) {
    //        fnAddPdiNm();
    //    }
    //}, [addPgNm, addPdiNm]);

    //const fnAddPgNm = async () => {
    //    const url = `/api/baseInfrm/product/productGroup/add.do`;
    //    const requestData = { ...addPgNm, lockAt: "Y", userAt: "Y" };

    //    const resultData = await axiosPost(url, requestData);
    //    pgNmItem();
    //};

    //const fnAddPdiNm = async () => {
    //    const url = `/api/baseInfrm/product/productInfo/add.do`;
    //    const requestData = { ...addPdiNm, lockAt: "Y", userAt: "Y" };

    //    const resultData = await axiosPost(url, requestData);
    //    pdiNmItem();
    //};

    //return <div>ReferenceInfo</div>;
}
