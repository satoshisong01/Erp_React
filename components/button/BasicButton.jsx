import React from "react";

export default function BasicButton({ label, onClick, style }) {
    return (
        <button onClick={onClick} className={"table-btn table-btn-basic"} style={style}>
            {label}
        </button>
    );
}