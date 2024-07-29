import React, { useContext, useEffect, useMemo, useState } from "react";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageContext } from "components/PageProvider";

export default function ReactTableButton({ showButton }) {
    const { setNameOfButton } = useContext(PageContext);

    const buttons = useMemo(() => [
        {
            id: "refresh",
            // btnClass: "btn btn-primary refreshIcon",
            btnClass: "table-btn table-btn-default refresh",
            label: <FontAwesomeIcon icon={faArrowRotateRight} className="refresh-Icon" />,
        },
        {
            id: "csv",
            // btnClass: "btn btn-primary csvIcon",
            btnClass: "table-btn",
            iconClass: "fa fa-file-excel-o",
            label: "CSV",
        },
        {
            id: "copy",
            // btnClass: "btn btn-primary copyIcon",
            btnClass: "table-btn",
            iconClass: "fa fa-copy",
            label: "Copy",
        },
        {
            id: "print",
            // btnClass: "btn btn-primary printIcon",
            btnClass: "table-btn",
            iconClass: "fa fa-print",
            label: "Print",
        },
        {
            id: "delete",
            // btnClass: "btn btn-primary delIcon",
            btnClass: "table-btn table-btn-warning",
            label: "삭제",
        },
        {
            id: "add",
            // btnClass: "btn btn-primary addIcon",
            btnClass: "table-btn table-btn-primary",
            label: "추가",
        },
    ], [showButton]);

    useEffect(() => {
        buttons.forEach((button) => {
            if (showButton.includes(button.id)) {
                setShowButton(button.id, true);
            }
        });
    }, [showButton]);

    const setShowButton = (buttonId, value) => {
        setButtonState((prevState) => ({ ...prevState, [buttonId]: value }));
    };

    /* 초가값 false */
    const [buttonState, setButtonState] = useState(
        buttons.reduce((acc, button) => ({ ...acc, [button.id]: false }), {})
    );

    return (
        <div className="table-buttons">
            {buttons.map(
                (button) =>
                    buttonState[button.id] && (
                        <button
                            key={button.id}
                            className={`${button.btnClass}`}
                            onClick={() => setNameOfButton(button.id)}
                        >
                                <i className={button.iconClass}>
                                    {button.label}
                                </i>
                        </button>
                    )
            )}
        </div>
    );
}