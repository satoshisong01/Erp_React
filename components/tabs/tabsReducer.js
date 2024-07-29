import { SELECT_LNB, SELECT_SNB } from "./TabsActions";

export function tabsReducer(
    state = {
        lnbId: "",
        snbId: "",
        gnbLabel: "",
        lnbLabel: "",
        snbLabel: "",
    },
    action
) {
    switch (action.type) {
        case SELECT_LNB:
            return {
                ...state,
                lnbId: action.lnbId,
                lnbLabel: action.lnbLabel,
                snbId: "",
                snbLabel: "",
            };

        case SELECT_SNB:
            return {
                ...state,
                snbId: action.snbId,
                snbLabel: action.snbLabel,
                lnbId: "",
                lnbLabel: "",
            };
        default:
            // 기본값 세팅
            return { ...state };
    }
}
