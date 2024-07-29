import React, { useState } from "react";

export default function AddButton({ label, onClick, type, className, disabled }) {
    const buttonClassName = `table-btn table-btn-default${disabled ? ' disabled' : ''}`;

    return (
        <button onClick={onClick} className={buttonClassName+" "+className} disabled={disabled} type={type} >
            {label}
        </button>
    );
}