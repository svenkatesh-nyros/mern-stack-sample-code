import callApi from '../../util/apiCaller';
export const GET_LABORS =  'GET_LABORS';

export function getLabors(data){
	return {
		type: GET_LABORS,
		data
	}
}

export function getLaborsRequest(){
	return (dispatch) => {
		return callApi('get_labors','post').then(res => {
			dispatch(getLabors(res.data))
		});
	};
}
