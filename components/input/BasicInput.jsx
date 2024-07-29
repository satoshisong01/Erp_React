import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* CSS를 가지고있는 기본 input */
export default function BasicInput({ item, onChange, onClick, value, readOnly }) {
    return (
        <input
            autoComplete="off"
            id={uuidv4()}
            className="basic-input"
            name={item.col || ""}
            onChange={onChange && ((e) => onChange(e))}
            onClick={onClick && ((e) => onClick(e))}
            value={value || ""}
            placeholder={item.placeholder || ""}
            readOnly={readOnly || false}
            //disabled={item.disabled || false}
        />
    );
}
