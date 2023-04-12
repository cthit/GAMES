import { useEffect, useState } from 'react';

export const useApiGet = <T>(apiPath: string) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/v1' + apiPath);

				if (!response.ok) {
					throw new Error(
						'Error fetching data from server with status code: ' +
							response.status
					);
				}

				const data = await response.json();

				console.log(data);

				setData(data);
			} catch (error: any) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [apiPath]);

	return { data, loading, error };
};
