import React from "react";
import LaborCostDoc from "./LaborCostDoc";
import LaborSummaryDoc from "./LaborSummaryDoc";
import OrderSummaryDoc from "./OrderSummaryDoc";
import DetailDoc from "./DetailDoc";

export default function TotalDoc() {
    const displayNone = true;

    return (
        <div>
            <LaborCostDoc displayNone={displayNone} />
            <LaborSummaryDoc displayNone={displayNone} />
            <OrderSummaryDoc displayNone={displayNone} />
            <DetailDoc displayNone={displayNone} />
        </div>
    );
}
