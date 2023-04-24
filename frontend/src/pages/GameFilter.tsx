import { ChangeEvent, FC, useState } from 'react';
import styles from './GameFilter.module.css';
import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import Select from '../Forms/Select/Select';
import DateInput from '../Forms/DateInput/DateInput';
import TextInput from '../Forms/TextInput/TextInput';

interface GameFilterProps {}
interface Platform {
	name: string;
}
const GameFilter: FC<GameFilterProps> = () => {

	const { data, error, loading } = useApiGet<Platform[]>('/platforms');

	const [platform, setPlatform] = useState('');
	const [releaseBefore, setReleaseBefore] = useState<Date>();
	const [releaseAfter, setReleaseAfter] = useState<Date>();
	const [playtime, setPlaytime] = useState<number>();
	const [playerCount, setPlayerCount] = useState<number>();

	const {
		error: postError,
		loading: postLoading,
		postData
	} = useApiPost('/games/filter');

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	return (
		<form
			onSubmit={(e) => {
				postData({
					platform: platform,
					releaseBefore: releaseBefore?.toISOString(),
					releaseAfter: releaseAfter?.toISOString(),
					playtime,
					playerCount
				});
			}}
		>
			<Select
				label="Platform"
				options={data.map((platform) => platform.name)}
				placeholder="Filter for platform"
				onChange={(select) => setPlatform(select.target.value)}
				value={platform}
			/>
			<br />

			<DateInput
				label="Released before"
				onChange={(input) =>
					setReleaseBefore(new Date(input.currentTarget.value))
				}
				value={releaseBefore?.toISOString().split('T')[0] || ''}
			/>
			<br />

			<DateInput
				label="Released after"
				onChange={(input) =>
					setReleaseAfter(new Date(input.currentTarget.value))
				}
				value={releaseAfter?.toISOString().split('T')[0] || ''}
			/>
			<br />

			<TextInput
				label="Playtime"
				type="number"
				onChange={(input) =>
					setPlaytime(Number.parseInt(input.currentTarget.value))
				}
				value={playtime?.toString() || ''}
			/>
			<br />

			<TextInput
				label="Player count"
				type="number"
				onChange={(input) =>
					setPlayerCount(Number.parseInt(input.currentTarget.value))
				}
				value={playerCount?.toString() || ''}
			/>
			<br />

			<input type="submit" value="Submit" />
		</form>
	);
};

export default GameFilter;
