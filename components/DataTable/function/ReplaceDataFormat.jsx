export const ChangePrmnPlanData = (data, poiId) => {
    const groupedData = {}; //인건비 바꿔서 넣어줄 빈 객체
    // 포지션에 대한 고정된 번호를 매핑하는 객체 생성
    const positionMapping = {
        임원: 1,
        특급기술사: 2,
        고급기술사: 3,
        중급기술사: 4,
        초급기술사: 5,
        고급기능사: 6,
        중급기능사: 7,
        초급기능사: 8,
        부장: 9,
        차장: 10,
        과장: 11,
        대리: 12,
        주임: 13,
        사원: 14,
    };

    //날짜포맷
    data.forEach((item) => {
        const key = `${item.pmpMonth}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                //pgNm: item.pgNm,
                pmpId: [],
                poiId: poiId,
                useAt: "Y",
                deleteAt: "N",
                calendarVisible: false,
                pmpmmPositionCode1: 0,
                pmpmmPositionCode2: 0,
                pmpmmPositionCode3: 0,
                pmpmmPositionCode4: 0,
                pmpmmPositionCode5: 0,
                pmpmmPositionCode6: 0,
                pmpmmPositionCode7: 0,
                pmpmmPositionCode8: 0,
                pmpmmPositionCode9: 0,
                pmpmmPositionCode10: 0,
                pmpmmPositionCode11: 0,
                pmpmmPositionCode12: 0,
                pmpmmPositionCode13: 0,
                pmpmmPositionCode14: 0,
                pmpMonth2: `${item.pmpMonth}`,
                pmpMonth: `${item.pmpMonth}`,
                total: 0,
                versionId: item.versionId,
                pmpDesc: item.pmpDesc
            };
        }
        groupedData[key].pmpId.push(item.pmpId);
        const positionNumber = positionMapping[item.pmpmmPositionCode];

        if (positionNumber) {
            const pmpmmNumKey = `pmpmmPositionCode${positionNumber}`;
            groupedData[key][pmpmmNumKey] = item.pmpmmNum;
            groupedData[key].total += item.pmpmmNum;
        }
    });

    // groupedData 객체를 배열로 변환
    const transformedData = Object.values(groupedData);
    return transformedData;
};

/* 영업구매-조회: 계산 */
export const buyIngInfoCalculation = (list) => {
    const updatedData = list.map((row) => {
        const {
            byQunty, // 수량
            byConsumerUnitPrice, // 소비자단가
            consumerAmount, // 소비자금액
            unitPrice, // 단가
            planAmount, // 금액
            byUnitPrice, // 원단가
            estimatedCost, // 원가
            plannedProfits, // 이익금
            plannedProfitMargin, // 이익률
            byStandardMargin, // 구매-기준이익률
            byConsumerOutputRate, // 구매-소비자가산출률
        } = {
            ...row,
            byConsumerUnitPrice: row.byConsumerUnitPrice ? row.byConsumerUnitPrice : 0,
            byStandardMargin: row.byStandardMargin ? row.byStandardMargin : 0,
            byConsumerOutputRate: row.byConsumerOutputRate ? row.byConsumerOutputRate : 0,
        };
        // 1.원가 : 수량 * 원단가
        const updatedEstimatedCost = estimatedCost ? estimatedCost : byQunty * byUnitPrice;
        // 2.공급단가 : 원단가 / (1 - 사전원가기준이익율)
        const updatedUnitPrice = unitPrice ? unitPrice : division(byUnitPrice, 1 - byStandardMargin / 100);
        // 3.공급금액 : 수량 * 공급단가
        const updatedPlanAmount = planAmount ? planAmount : byQunty * updatedUnitPrice;
        // 4.소비자단가 : 공급단가 / 소비자산출율
        const updatedbyConsumerUnitPrice = byConsumerUnitPrice ? byConsumerUnitPrice : division(updatedUnitPrice, byConsumerOutputRate);
        // 5.소비자금액 : 수량 * 소비자단가
        const updatedConsumerAmount = consumerAmount ? consumerAmount : byQunty * updatedbyConsumerUnitPrice;
        // 6.이익금 : 공급금액 - 원가
        const updatedPlannedProfits = plannedProfits ? plannedProfits : updatedPlanAmount - updatedEstimatedCost;
        // 7.이익률 : 이익금 / 공급금액
        const updatedPlannedProfitMargin = plannedProfitMargin ? plannedProfitMargin : division(updatedPlannedProfits, updatedPlanAmount);

        const result = {
            ...row,
            estimatedCost: Math.round(updatedEstimatedCost),
            unitPrice: Math.round(updatedUnitPrice),
            planAmount: Math.round(updatedPlanAmount),
            byConsumerUnitPrice: Math.round(updatedbyConsumerUnitPrice) ,
            consumerAmount: Math.round(updatedConsumerAmount) ,
            plannedProfits: Math.round(updatedPlannedProfits),
            plannedProfitMargin: Math.round(updatedPlannedProfitMargin * 100),
            // plannedProfitMargin: updatedPlannedProfitMargin,
            byStandardMargin: Math.round(byStandardMargin),
            byConsumerOutputRate: Math.round(byConsumerOutputRate),
        }

        return result;
    });

    return updatedData;
};

export const division = (value1, value2) => {
    if (!value1 || !value2) {
        return 0;
    }
    return value1 / value2;
};

export const calculateTotalBuy = (list) => {
    const groupedData = list.reduce((result, current) => {
        const existingGroup = result.find((group) => group.pdiSeller === current.pdiSeller && group.pgNm === current.pgNm); //제조사, 품목그룹
        if (existingGroup) {
            existingGroup.estimatedCost += current.estimatedCost; //원가
            existingGroup.consumerAmount += current.consumerAmount; //소비자금액
            existingGroup.planAmount += current.planAmount; //공급금액
            existingGroup.byQunty += current.byQunty; //수량
        } else {
            result.push({ ...current });
        }
        return result;
    }, []);

    //합산의 네고율, 이익금, 이익율 구하기
    const groupedDataWithCalculations = groupedData.map((group) => {
        // 할인율: (1 - (공급금액 / 소비자금액)) * 100
        const temp1 = group.planAmount !== 0 ? (group.planAmount / group.consumerAmount - 1) * -100 : 0;
        group.nego = Math.round(temp1) + " %";
        // 이익금: 공급금액 - 원가
        group.profits = group.planAmount - group.estimatedCost;
        // 이익률: (공급금액-원가)/원가*100
        const temp2 = group.planAmount !== 0 ? ((group.planAmount - group.estimatedCost) / group.planAmount) * 100 : 0;
        //group.margin = Math.round(temp2) + " %";
        group.margin = temp2.toFixed(2) + " %"; //소숫점 1자리까지
        return group;
    });

    //마지막 토탈 행 구하기
    const totals = groupedDataWithCalculations.reduce(
        (sums, group) => {
            sums.estimatedCost += group.estimatedCost || 0;
            sums.consumerAmount += group.consumerAmount || 0;
            sums.planAmount += group.planAmount || 0;
            sums.profits += group.profits || 0;
            sums.byQunty += group.byQunty;
            sums.margin = 0;
            return sums;
        },
        {
            estimatedCost: 0,
            consumerAmount: 0,
            planAmount: 0,
            nego: 0,
            profits: 0,
            margin: 0,
            byQunty: 0,
        }
    );

    groupedDataWithCalculations.push({
        pgNm: "TOTAL",
        pdiSeller: "",
        consumerAmount: totals.consumerAmount, //소비자금액
        planAmount: totals.planAmount, //공급금액
        nego: totals.planAmount !== 0 ? Math.round((totals.planAmount / totals.consumerAmount - 1) * -100) + " %" : 0 + " %", //네고율
        estimatedCost: totals.estimatedCost, //원가
        profits: totals.profits, //이익금
        // 마진 = (이익금/공급금액)*100
        margin: totals.planAmount !== 0 ? Math.round((totals.profits / totals.planAmount) * 100) + " %" : 0 + " %", //이익율
        byQunty: totals.byQunty,
    });

    return groupedDataWithCalculations;
}