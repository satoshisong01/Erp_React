import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function HideCard({ children, title, color, style, className }) {

    const handleClick1 = () => {
        setIsClicked(!isClicked);
    };

    const [isClicked, setIsClicked] = useState(false);

    //pointer-events: none;
    return (
        <div className={`hide-card ${className||""}`}>
            <div className={`hide-header flex-between ${color||""}`}>
                <div className="hide-title" style={{userSelect: "none"}}>{title}</div>
                <div className={`hide-button ${isClicked ? "" : "clicked"}`}>
                    <button className="arrowBtnStyle" style={{ zIndex: "100" }} onClick={handleClick1}>
                        <FontAwesomeIcon className={`arrowBtn ${isClicked ? "" : "clicked"}`} icon={faArrowUp} />
                    </button>
                </div>
            </div>
            <div className="hide-content">
                <div className={`hideDivRun ${isClicked ? "" : "clicked"}`}>
                    { children }
                </div>
            </div>
        </div>
    )
}