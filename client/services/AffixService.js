import Api from "./Api";

export const getAll = () => {
	return Api()
		.get("/affixes")
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			return error;
		});
};

export const getOne = (id) => {
	return Api()
		.get(`/affixes/${id}`)
		.then((response) => {
			console.log(response.data);
			return response.data;
		})
		.catch((error) => {
			return error;
		});
};

export const addNew = (data) => {
	return Api()
		.post("affixes", data)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.log(error);
			return error;
		});
};
