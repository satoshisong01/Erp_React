import React from "react";
import "../../css/componentCss/CodeUtilBtn.css";

/* 견적품의서, 수주보고서 팝업 */
function PopupButtonReport({ targetUrl, data }) {
    const openPopup = () => {
        if(!data.poiId) {
            alert("프로젝트를 선택해주세요.");
            return;
        } else if (!data.versionId) {
            alert("버전 정보가 없는 프로젝트입니다.");
            return;
        }
        const url = `${targetUrl}?data=${encodeURIComponent(JSON.stringify(data))}`;
        console.log("⭐targetUrl", targetUrl, "data:", data);
        const width = 1400;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
        window.open(url, "newWindow", windowFeatures);
    };

    const buttonClassName = `table-btn table-btn-primary`;

    return (
        <button onClick={openPopup} className={buttonClassName}>
            {data.label}
        </button>
    );
}

export default PopupButtonReport;
