import React from "react";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RefreshButton({ label, onClick, style, color }) {
    return (
        <button type="button" onClick={onClick} className={`table-btn ${color || "table-btn-default"} refresh`} style={style}>
            <FontAwesomeIcon icon={faArrowRotateRight} className="refresh-Icon" />
            {label}
        </button>
    );
}