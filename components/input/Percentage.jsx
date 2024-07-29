import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* 숫자 입력시 퍼센트 표시 */
export default function Percentage ({item, onChange, value}) {
    return (
        <input
            id={uuidv4()}
            name={item.col}
            // type="number"
            onChange={(e) => onChange(e, item.col)}
            value={value || ""}
            placeholder={item.placeholder}
            className="basic-input percent"
        />
    )
} 