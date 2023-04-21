import { useEffect, useState } from 'react';

export const useApiGet = <T>(apiPath: string) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/v1' + apiPath);

				if (!response.ok) {
					throw new Error(
						'Error fetching data from server with status code: ' +
							response.status
					);
				}

				const data = await response.json();

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

export const useApiPost = <T>(apiPath: string) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const postData = async (body: any) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch('/api/v1' + apiPath, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				console.error(await response.text());
				throw new Error(
					'Error fetching data from server with status code: ' + response.status
				);
			}

			setSuccess(true);
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { success, loading, error, postData };
};
