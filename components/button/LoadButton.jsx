import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

/* 저장 버튼 */
export default function LoadButton({ label, onClick }) {
    const [disabled, setDisabled] = useState(false);

    const buttonClassName = `table-btn table-btn-default${disabled ? " disabled" : ""}`;
    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}
