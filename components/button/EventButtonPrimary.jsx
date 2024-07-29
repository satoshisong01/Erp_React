import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

export default function EventButtonPrimary({ label, onClick }) {
    const { lengthSelectRow } = useContext(PageContext)
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if(lengthSelectRow && lengthSelectRow === 1) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [lengthSelectRow]);

    const buttonClassName = `table-btn table-btn-primary${disabled ? ' disabled' : ''}`;

    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}