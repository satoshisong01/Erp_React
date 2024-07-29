export const SELECT_GNB = 'SELECT_GNB';
export const SELECT_LNB = 'SELECT_LNB';
export const SELECT_SNB = 'SELECT_SNB';

/* local(site map) navi bar */
export function selectLnb(label, id) {
	return dispatch => {
		return dispatch({
			type: SELECT_LNB,
			lnbLabel: label,
            lnbId: id
		})
	} 
}

/* side(left) navi bar */
export function selectSnb(label, id) {
	return dispatch => {
		return dispatch({
			type: SELECT_SNB,
			snbLabel: label,
            snbId: id
		})
	} 
}

