import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* CSS를 가지고있는 기본 input */
export default function BasicSelect({ item, onChange, onClick, value, readOnly }) {
    const defaultValue = item.option && item.option.length > 0 ? item.option[0].value : "";

    return (
        <>
            <select
                id={uuidv4()}
                className="basic-input"
                name={item.col || ""}
                onChange={onChange && ((e) => onChange(e))}
                onClick={onClick && ((e) => onClick(e))}
                value={value || defaultValue}
                placeholder={item.placeholder || ""}
                readOnly={readOnly || false}
                disabled={item.disabled || false}>
                {item.option &&
                    item.option.map((op, index) => (
                        <option key={index} value={op.value}>
                            {op.label}
                        </option>
                    ))}
            </select>
        </>
    );
}
