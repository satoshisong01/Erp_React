import React, { useEffect, useState } from "react";

export default function MouseDc({ showTooltip }) {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        setTooltipPosition({ x: clientX, y: clientY });
    };

    useEffect(() => {
        if (showTooltip) {
            window.addEventListener("mousemove", handleMouseMove);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [showTooltip]);
    return (
        <div style={{ position: "relative" }}>
            {showTooltip && (
                <div
                    className="showMouse"
                    style={{
                        top: tooltipPosition.y + 20,
                        left: tooltipPosition.x + 20,
                    }}>
                    더블클릭시 수정
                </div>
            )}
        </div>
    );
}
