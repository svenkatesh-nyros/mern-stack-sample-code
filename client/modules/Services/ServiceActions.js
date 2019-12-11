import callApi from '../../util/apiCaller';

// Export Constants

export const GET_SERVICES = 'GET_SERVICES';
export const GET_LABORS =  'GET_LABORS';
export const GET_CUSTOM_SERVICES = 'GET_CUSTOM_SERVICES';
export const GET_SERVICES_BY_LOCATION = 'GET_SERVICES_BY_LOCATION';


// Export Actions
export function getServices(data) {
  return {
    type: GET_SERVICES,
    data,
  };
}

export function getServicesRequest() {
  return (dispatch) => {
    var data = {query: "{services {id, name, image}}"};
	return callApi('graphql','post',data).then(res => {
      	dispatch(getServices(res.data.services));
    });
  };
}

export function getCustomServices(data) {
	return {
		type: GET_CUSTOM_SERVICES,
		data,
	}
}

export function getCustomServicesRequest()
{
	return (dispatch) => {
		var data = { query : "{services {key:id, text:name, value: id}}"}
		return callApi('graphql','post',data).then(res => {
			dispatch(getCustomServices(res.data.services));
		});
	}
}

export function getServicesByLocation(data){
	return {
		type: GET_SERVICES_BY_LOCATION,
		data,
	}
}

export function getServicesByLocationRequest(data){
	console.log(`services_by_location/${data}`);
	var data={lat: data.location.lat, lng: data.location.lng}
	return (dispatch) => {
			return callApi('services_by_location','post',data).then(res => {
				dispatch(getServicesByLocation(res.data));
			})
		}
}

