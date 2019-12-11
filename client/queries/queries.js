import { gql } from 'apollo-boost';

const getLabors = gql`
{
	labors{
		id
		name
		avatar
		service_location
		years
		months
		availability
		call_count
	}
}
`;

const getCustomServicesQuery = gql`
	{
		services{
			key:id 
			text:name
			valud: id
		}
	}
`;

export { getLabors, getCustomServicesQuery };