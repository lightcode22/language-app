import Api from "./Api";

export const login = function(data) {
	return Api()
		.post("/auth/login", data)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.log(error.response);
			return error;
		});
};

export const register = (data) => {
	return Api()
		.post("/auth/register", data)
		.then((response) => {
			console.log(response);
			return response.data;
		})
		.catch((error) => {
			console.log(error.response);
			return error.response;
		});
};

export const checkAccess = () => {
	return Api()
		.get("/auth/check-access")
		.then((response) => {
			console.log(response);
			return response.data;
		})
		.catch(function(error) {
			return error.response;
		});
};
