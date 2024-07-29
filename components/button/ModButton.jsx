import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

/* 1개의 item에 대한 수정 버튼 */
export default function ModButton({ label, onClick, report }) {
    const [disabled, setDisabled] = useState(true);
    const { lengthSelectRow, modalLengthSelectRow } = useContext(PageContext);

    useEffect(() => {
        if (lengthSelectRow === 1 || modalLengthSelectRow === 1) {
            setDisabled(false);
        } else if (report) {
            setDisabled(false);
        } else if (lengthSelectRow === 0 || modalLengthSelectRow === 0) {
            setDisabled(true);
        }
    }, [lengthSelectRow, modalLengthSelectRow, report]);

    const buttonClassName = `table-btn table-btn-default${disabled ? " disabled" : ""}`;
    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}
