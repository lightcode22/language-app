import Api from "./Api";

export const getAll = function (data) {
	return Api()
		.get("/admin/users", data)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			return error;
		});
};
