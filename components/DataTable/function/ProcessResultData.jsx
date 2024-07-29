export const updateEstMmProperty = (data) => {
    data.forEach((item) => {
        const estMonth = item.estMonth;
        if (estMonth) {
            //const paddedMonth = estMonth;
            item[`estMm${estMonth}`] = item.estMm;
        }
    });
    return data;
};
export const ProcessResultDataRun = (resultData, condition) => {
    const changeDD = updateEstMmProperty(resultData);
    const transformedData = changeDD.reduce((accumulator, item) => {
        const {
            estId,
            estMm,
            estPosition,
            estUnitPrice,
            pgId,
            pgNm,
            pdiId,
            poiNm,
            pdiNm,
            pdiUnit,
            estDesc,
            estMm1,
            estMm2,
            estMm3,
            estMm4,
            estMm5,
            estMm6,
            estMm7,
            estMm8,
            estMm9,
            estMm10,
            estMm11,
            estMm12,
            estMm13,
            estMm14,
            estMm15,
            estMm16,
            estMm17,
            estMm18,
            estMm19,
            estMm20,
            estMm21,
            estMm22,
            estMm23,
            estMm24,
        } = item;

        const key = `${pgNm}_${estPosition}`;
        if (!accumulator[key]) {
            accumulator[key] = {
                estMm,
                estPosition,
                estUnitPrice,
                pgId,
                pdiId,
                poiNm,
                pdiNm,
                pgNm,
                pdiUnit,
                estDesc,
                estMm1,
                estMm2,
                estMm3,
                estMm4,
                estMm5,
                estMm6,
                estMm7,
                estMm8,
                estMm9,
                estMm10,
                estMm11,
                estMm12,
                estMm13,
                estMm14,
                estMm15,
                estMm16,
                estMm17,
                estMm18,
                estMm19,
                estMm20,
                estMm21,
                estMm22,
                estMm23,
                estMm24,
                estId: [],
            };
        }

        accumulator[key].estId.push(estId);
        accumulator[key].estId.sort((a, b) => a - b);

        for (let i = 1; i <= 24; i++) {
            const estMmKey = `estMm${i}`;
            if (item[estMmKey] !== undefined) {
                accumulator[key][estMmKey] = item[estMmKey];
            }
        }

        return accumulator;
    }, []);
    //여기까지가통합

    // mergedData 에서 다시 tableData에쓸 배열로 재정의
    const mergedData = Object.values(transformedData).map((mergedItem, index) => {
        const newObj = {};
        newObj["estIdList"] = mergedItem.estId;
        newObj["estMm"] = mergedItem.estMm;
        newObj["estPosition"] = mergedItem.estPosition;
        newObj["estUnitPrice"] = mergedItem.estUnitPrice;
        newObj["pgId"] = mergedItem.pgId;
        newObj["pdiId"] = mergedItem.pdiId;
        newObj["pdiNm"] = mergedItem.pdiNm;
        newObj["pjbgDt"] = mergedItem.pjbgBeginDt;
        newObj["pgNm"] = mergedItem.pgNm;
        newObj["pdiUnit"] = mergedItem.pdiUnit;
        newObj["poiNm"] = mergedItem.poiNm;
        newObj["estDesc"] = mergedItem.estDesc;
        newObj["estMm1"] = mergedItem.estMm1;
        newObj["estMm2"] = mergedItem.estMm2;
        newObj["estMm3"] = mergedItem.estMm3;
        newObj["estMm4"] = mergedItem.estMm4;
        newObj["estMm5"] = mergedItem.estMm5;
        newObj["estMm6"] = mergedItem.estMm6;
        newObj["estMm7"] = mergedItem.estMm7;
        newObj["estMm8"] = mergedItem.estMm8;
        newObj["estMm9"] = mergedItem.estMm9;
        newObj["estMm10"] = mergedItem.estMm10;
        newObj["estMm11"] = mergedItem.estMm11;
        newObj["estMm12"] = mergedItem.estMm12;
        newObj["estMm13"] = mergedItem.estMm13;
        newObj["estMm14"] = mergedItem.estMm14;
        newObj["estMm15"] = mergedItem.estMm15;
        newObj["estMm16"] = mergedItem.estMm16;
        newObj["estMm17"] = mergedItem.estMm17;
        newObj["estMm18"] = mergedItem.estMm18;
        newObj["estMm19"] = mergedItem.estMm19;
        newObj["estMm20"] = mergedItem.estMm20;
        newObj["estMm21"] = mergedItem.estMm21;
        newObj["estMm22"] = mergedItem.estMm22;
        newObj["estMm23"] = mergedItem.estMm23;
        newObj["estMm24"] = mergedItem.estMm24;
        newObj["poiId"] = condition.poiId;
        newObj["versionId"] = condition.versionId;
        let total = 0;
        for (let j = 1; j <= 24; j++) {
            const propName = `estMm${j}`;
            if (mergedItem[propName] !== null) {
                total += mergedItem[propName];
            }
        }

        newObj["total"] = total;
        newObj["price"] = total * mergedItem.estUnitPrice;

        return newObj;
    });
    return mergedData;
};
