import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* CSS를 가지고있는 기본 input */
export default function BasicTextarea ({item, onChange, value}) {
    return (
        <textarea
            id={uuidv4()}
            className="basic-input"
            name={item.col}
            onChange={(e) => onChange(e, item.col)}
            value={value || ""}
            placeholder={item.placeholder}
            style={{ height: 120, resize: "none", caretColor: 'initial' }}
        />
    )
} 