import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import DateInput from '../Forms/DateInput/DateInput';
import Select from '../Forms/Select/Select';
import TextArea from '../Forms/TextArea/TextArea';
import TextInput from '../Forms/TextInput/TextInput';

interface AddGameProps {}

interface Platform {
	name: string;
}

const AddGame: FC<AddGameProps> = () => {
	const { data, error, loading } = useApiGet<Platform[]>('/platforms');

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [platform, setPlatform] = useState('');
	const [releaseDate, setReleaseDate] = useState<Date>();
	const [playtime, setPlaytime] = useState<number>();
	const [playerMin, setPlayerMin] = useState<number>();
	const [playerMax, setPlayerMax] = useState<number>();

	const {
		error: postError,
		loading: postLoading,
		postData
	} = useApiPost('/games/add');

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				postData({
					name,
					description,
					platform,
					releaseDate: releaseDate?.toISOString(),
					playtime,
					playerMin,
					playerMax
				});
			}}
		>
			<TextInput
				label="Name of the game"
				type="text"
				onChange={(input) => setName(input.currentTarget.value)}
				value={name}
			/>
			<br />

			<TextArea
				label="Description fo the game"
				onChange={(textarea) => setDescription(textarea.currentTarget.value)}
				value={description}
			/>
			<br />

			<Select
				label="Platform"
				options={data.map((platform) => platform.name)}
				placeholder="Select a platform"
				onChange={(select) => setPlatform(select.target.value)}
				value={platform}
			/>
			<br />

			<DateInput
				label="Release date"
				onChange={(input) =>
					setReleaseDate(new Date(input.currentTarget.value))
				}
				value={releaseDate?.toISOString().split('T')[0] || ''}
			/>
			<br />

			<TextInput
				label="Expected playtime"
				type="number"
				onChange={(input) =>
					setPlaytime(Number.parseInt(input.currentTarget.value))
				}
				value={playtime?.toString() || ''}
			/>
			<br />
			<TextInput
				label="Minimum number of players"
				type="number"
				onChange={(input) =>
					setPlayerMin(Number.parseInt(input.currentTarget.value))
				}
				value={playerMin?.toString() || ''}
			/>
			<br />
			<TextInput
				label="Maximum number of players"
				type="number"
				onChange={(input) =>
					setPlayerMax(Number.parseInt(input.currentTarget.value))
				}
				value={playerMax?.toString() || ''}
			/>
			<br />

			<input type="submit" value="Submit" />
		</form>
	);
};

export default AddGame;
