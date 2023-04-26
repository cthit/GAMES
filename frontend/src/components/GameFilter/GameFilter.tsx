import { ChangeEvent, FC, useState } from 'react';
import styles from './GameFilter.module.css';
import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import Select from '../Forms/Select/Select';
import DateInput from '../Forms/DateInput/DateInput';
import TextInput from '../Forms/TextInput/TextInput';

interface GameFilterProps {
	setPlatform: (s: string) => void;
	setReleaseBefore: (a: Date) => void;
	setReleaseAfter: (a: Date) => void;
	setPlaytime: (x: number) => void;
	setPlayerCount: (x: number) => void;
	platform: string | undefined;
	releaseAfter: Date | undefined;
	releaseBefore: Date | undefined;
	playtime: number | undefined;
	playerCount: number | undefined;
	filterFunction: any;
}
interface Platform {
	name: string;
}
const GameFilter: FC<GameFilterProps> = ({
	setPlatform,
	setReleaseBefore,
	setReleaseAfter,
	setPlaytime,
	setPlayerCount,
	platform,
	playerCount,
	playtime,
	releaseAfter,
	releaseBefore,
	filterFunction
}: GameFilterProps) => {
	const { data, error, loading } = useApiGet<Platform[]>('/platforms');

	if (loading) {
		filterFunction();
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	return (
		<form className={styles.formClass}>
			<h2>Filtering</h2>
			<Select
				label="Platform"
				options={data.map((platform) => platform.name)}
				placeholder="Filter for platform"
				onChange={(select) => setPlatform(select.target.value)}
				value={platform ? platform : ''}
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

			<input
				type="button"
				value="Submit"
				onClick={() => {
					filterFunction();
				}}
			/>
		</form>
	);
};

export default GameFilter;