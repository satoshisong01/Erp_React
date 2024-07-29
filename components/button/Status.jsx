import React, { useEffect, useState } from "react";

export default function Status ({ status }) {
    const getStateElement = (stateTitle) => {
        if (stateTitle === "작성중") {
            return (
                <div className="state-area b-gray">
                    <span className="dot">●</span>
                    <span>작성중</span>
                </div>
            );
        } else if (stateTitle === "견적완료") {
            return (
                <div className="state-area b-green">
                    <span className="dot">●</span>
                    <span>견적완료</span>
                </div>
            );
        } else if (stateTitle === "사업진행중") {
            return (
                <div className="state-area b-blue">
                    <span className="dot">●</span>
                    <span>사업진행중</span>
                </div>
            );
        } else if (stateTitle === "사업완료") {
            return (
                <div className="state-area b-orange">
                    <span className="dot">●</span>
                    <span>사업완료</span>
                </div>
            );
        }
    };

    return (
        getStateElement(status)
    );
}