import React, { useState } from "react";

export default function ViewButton({ label, onClick, type, className }) {
    const [disabled, setDisabled] = useState(false);

    const buttonClassName = `table-btn table-btn-default${disabled ? " disabled" : ""}`;

    return (
        <button onClick={onClick} className={buttonClassName + " " + className} disabled={disabled} type={type}>
            {label}
        </button>
    );
}
