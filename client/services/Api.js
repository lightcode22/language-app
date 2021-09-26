import axios from "axios";

const baseURL = "http://localhost:3000/";

const axiosInstance = axios.create({
	baseURL,
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	// со статусом 2xx
	// автоматически оборачивает в промис
	(response) => {
		return response;
	},
	// с любым другим статусом
	(error) => {
		if (error.response.status === 401) {
			return Promise.resolve({
				status: 401,
				data: error.response,
			});
		}

		// if (error.response.status === 404) {
		// 	return Promise.resolve({
		// 		status: 404,
		// 		data: error.response,
		// 	});
		// }

		return Promise.reject(error);
	}
);

export default () => axiosInstance;
