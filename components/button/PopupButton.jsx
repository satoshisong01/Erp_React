import React, { useContext, useEffect, useState } from "react";
import "../../css/componentCss/CodeUtilBtn.css";
import { PageContext } from "components/PageProvider";

/* URl에 해당하는 화면을 새창으로 띄어주고 data를 넘겨주는 버튼 */
function PopupButton({ targetUrl, data, size, clickBtn, onClick }) {
    const openPopup = () => {
        const url = `${targetUrl}?data=${encodeURIComponent(JSON.stringify(data))}`;
        console.log("targetUrl", targetUrl, "size:", size);
        const width = size?.width || 1400;
        const height = size?.height || 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
        window.open(url, "newWindow", windowFeatures);
    };

    const [disabled, setDisabled] = useState(false);
    const { lengthSelectRow } = useContext(PageContext);

    useEffect(() => {
        if (targetUrl === "/MyInfo") {
            setDisabled(false);
        }
    }, []);

    useEffect(() => {
        if (targetUrl !== "/MyInfo") {
            if (lengthSelectRow && lengthSelectRow === 1) {
                setDisabled(false);
            } else {
                setDisabled(true);
                if (!clickBtn) {
                    setDisabled(false);
                }
            }
        }
    }, [lengthSelectRow, clickBtn]);

    const buttonClassName = `table-btn table-btn-primary${disabled ? " disabled" : ""}`;

    return (
        <button onClick={onClick ? onClick : openPopup} className={buttonClassName} disabled={disabled}>
            {data.label}
        </button>
    );
}

export default PopupButton;
