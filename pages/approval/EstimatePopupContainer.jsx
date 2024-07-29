import React, { useEffect, useState } from "react";
import EstimateMgmtPopup from "pages/sales/EstimateMgmt/EstimateMgmtPopup";

/* 견적서 */
function EstimatePopupContainer() {
    const [title, setTitle] = useState("");

    useEffect(() => {
        // URL로 넘어온 파라미터 값 파싱
        const urlParams = new URLSearchParams(window.location.search);
        const dataString = urlParams.get("data");
        const data = JSON.parse(decodeURIComponent(dataString));
        setTitle(data.title);
        console.log(data);
        console.log(data.title, "2222222222");
    }, []);

    //let content;
    //if (title === "사전 원가 계획") {
    //    content = <BusinessPopup />;
    //} else if (title === "실행 원가 계획") {
    //    //content =
    //} else {
    //    content = null; // 'title'이 어떤 조건과도 일치하지 않을 경우 렌더링하지 않음
    //}

    console.log(title, "받아온 타이틀이 무엇이냐");
    return (
        <div className="">
            <EstimateMgmtPopup title={title} />
        </div>
    );
}

export default EstimatePopupContainer;
