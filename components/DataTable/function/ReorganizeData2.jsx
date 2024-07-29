export const ReorganizeData = (data) => {
    const roleMapping = {
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
    const filteredUsers = data.filter((data) => {
        return data.gupDesc !== "인건비";
    });
    // reduce 함수를 사용하여 데이터 배열을 순회하면서 재구성된 결과를 구축합니다.
    return filteredUsers.reduce((acc, item) => {
        // 현재 아이템에서 속성들을 비구조화하여 가져옵니다.
        const { gupBaseDate, gupDesc, guppName, gupId, gupType, gupPrice, guppId } = item;

        // gupBaseDate 배열에서 연도를 추출합니다.
        const year = gupBaseDate;

        // 찾은 데이터의 인덱스
        // gupDesc를 기반으로 누적 배열에서 그룹의 인덱스를 찾습니다.
        const foundIndex = acc.findIndex((group) => group && group.year === year && group.gupDesc === gupDesc);
        const roleKey = `gupPrice${roleMapping[guppName]}`;

        // 해당하는 그룹이 없을 경우 새로운 그룹 생성
        // 동일한 gupDesc를 가진 그룹이 존재하는지 확인합니다.
        if (foundIndex === -1) {
            // 그룹이 존재하지 않으면 새로운 그룹을 생성하고 누적 배열에 추가합니다.
            acc.push({ gupDesc, gupType, gupBaseDate, year, [roleKey]: Number(gupPrice), gupId: [gupId], guppId: [guppId] });
        } else {
            // 그룹이 이미 존재하면 데이터를 기존 그룹에 추가합니다.
            acc[foundIndex][`gupPrice${roleMapping[guppName]}`] = Number(gupPrice);
            //항상 배열로 쓰이고 낮은순서로 저장됨
            acc[foundIndex].gupId = [...acc[foundIndex].gupId, ...(Array.isArray(gupId) ? gupId : [gupId])].sort((a, b) => a - b);
            acc[foundIndex].guppId = [...acc[foundIndex].guppId, ...(Array.isArray(guppId) ? guppId : [guppId])].sort((a, b) => a - b);
        }
        return acc;
    }, []);
};

export const ReorganizeManCost = (data) => {
    const roleMapping = {
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
    const filteredUsers = data.filter((data) => {
        return data.gupDesc === "인건비";
    });
    // reduce 함수를 사용하여 데이터 배열을 순회하면서 재구성된 결과를 구축합니다.
    return filteredUsers.reduce((acc, item) => {
        // 현재 아이템에서 속성들을 비구조화하여 가져옵니다.
        const { gupBaseDate, gupDesc, guppName, gupId, gupType, gupPrice } = item;

        let year = 0;
        // gupBaseDate 배열에서 연도를 추출합니다.
        if (gupBaseDate && gupBaseDate.length > 4) {
            year = gupBaseDate.slice(0, 4);
        }
        // 찾은 데이터의 인덱스
        // gupDesc를 기반으로 누적 배열에서 그룹의 인덱스를 찾습니다.
        const foundIndex = acc.findIndex((group) => group && group.year === year);
        const roleKey = `gupPrice${roleMapping[guppName]}`;

        // 해당하는 그룹이 없을 경우 새로운 그룹 생성
        // 동일한 gupDesc를 가진 그룹이 존재하는지 확인합니다.
        if (foundIndex === -1) {
            // 그룹이 존재하지 않으면 새로운 그룹을 생성하고 누적 배열에 추가합니다.
            acc.push({ gupDesc, gupType, year, [roleKey]: Number(gupPrice), gupId: [gupId] });
        } else {
            // 그룹이 이미 존재하면 데이터를 기존 그룹에 추가합니다.
            acc[foundIndex][`gupPrice${roleMapping[guppName]}`] = Number(gupPrice);
            //항상 배열로 쓰이고 낮은순서로 저장됨
            acc[foundIndex].gupId = [...acc[foundIndex].gupId, ...(Array.isArray(gupId) ? gupId : [gupId])].sort((a, b) => a - b);
        }
        return acc;
    }, []);
};

export const ReorganizeManCostOrigin = (data) => {
    const roleMapping = {
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
    const filteredUsers = data.filter((data) => {
        return data.gupDesc === "인건비";
    });
    // reduce 함수를 사용하여 데이터 배열을 순회하면서 재구성된 결과를 구축합니다.
    return filteredUsers.reduce((acc, item) => {
        // 현재 아이템에서 속성들을 비구조화하여 가져옵니다.
        const { gupBaseDate, gupDesc, guppName, gupId, gupType, gupPrice, guppId } = item;

        // gupBaseDate 배열에서 연도를 추출합니다.
        const year = gupBaseDate;
        // 찾은 데이터의 인덱스
        // gupDesc를 기반으로 누적 배열에서 그룹의 인덱스를 찾습니다.
        const foundIndex = acc.findIndex((group) => group && group.year === year);
        const roleKey = `gupPrice${roleMapping[guppName]}`;

        // 해당하는 그룹이 없을 경우 새로운 그룹 생성
        // 동일한 gupDesc를 가진 그룹이 존재하는지 확인합니다.
        if (foundIndex === -1) {
            // 그룹이 존재하지 않으면 새로운 그룹을 생성하고 누적 배열에 추가합니다.
            acc.push({ gupDesc, gupType, year, [roleKey]: Number(gupPrice), gupId: [gupId], guppId: [guppId] });
        } else {
            // 그룹이 이미 존재하면 데이터를 기존 그룹에 추가합니다.
            acc[foundIndex][`gupPrice${roleMapping[guppName]}`] = Number(gupPrice);
            //항상 배열로 쓰이고 낮은순서로 저장됨
            acc[foundIndex].gupId = [...acc[foundIndex].gupId, ...(Array.isArray(gupId) ? gupId : [gupId])].sort((a, b) => a - b);
            acc[foundIndex].guppId = [...acc[foundIndex].guppId, ...(Array.isArray(guppId) ? guppId : [guppId])].sort((a, b) => a - b);
        }
        return acc;
    }, []);
};
