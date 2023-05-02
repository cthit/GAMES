import { ChangeEvent, FC, useState } from 'react';
import styles from './GameFilter.module.css';
import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import Select from '../Forms/Select/Select';
import DateInput from '../Forms/DateInput/DateInput';
import NumberInput from '../Forms/NumberInput/NumberInput';

interface GameFilterProps {
	setPlatform: (s: string) => void;
	setReleaseBefore: (a: Date) => void;
	setReleaseAfter: (a: Date) => void;
	setPlaytimeMax: (x: number) => void;
	setPlaytimeMin: (x: number) => void;
	setPlayerCount: (x: number) => void;
	platform: string | undefined;
	releaseAfter: Date | undefined;
	releaseBefore: Date | undefined;
	playtimeMax: number | undefined;
	playtimeMin: number | undefined;
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
	setPlaytimeMax,
	setPlaytimeMin,
	setPlayerCount,
	platform,
	playerCount,
	playtimeMax,
	playtimeMin,
	releaseAfter,
	releaseBefore,
	filterFunction
}: GameFilterProps) => {
	const { data, error, loading } = useApiGet<Platform[]>('/platforms');
	const nums = '0123456789';
	const dateReg =
		/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
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
				value={
					dateReg.test(releaseBefore + '')
						? releaseBefore?.toISOString().split('T')[0]
						: undefined
				}
			/>
			<br />

			<DateInput
				label="Released after"
				onChange={(input) =>
					setReleaseAfter(new Date(input.currentTarget.value))
				}
				value={
					dateReg.test(releaseAfter + '')
						? releaseAfter?.toISOString().split('T')[0]
						: undefined
				}
			/>
			<br />

			<NumberInput
				label="Min Playtime"
				type="number"
				onChange={(input) => {
					let newTime = '';
					for (const element of input.currentTarget.value) {
						newTime += nums.includes(element) ? element : '';
					}
					setPlaytimeMin(Number.parseInt(newTime));
				}}
				value={playtimeMin?.toString() || ''}
			/>
			<br />

			<NumberInput
				label="Max Playtime"
				type="number"
				onChange={(input) => {
					let newTime = '';
					for (const element of input.currentTarget.value) {
						newTime += nums.includes(element) ? element : '';
					}
					setPlaytimeMax(Number.parseInt(newTime));
				}}
				value={playtimeMax?.toString() || ''}
			/>
			<br />

			<NumberInput
				label="Player count"
				type="number"
				onChange={(input) => {
					let newCount = '';
					for (const element of input.currentTarget.value) {
						newCount += nums.includes(element) ? element : '';
					}
					setPlayerCount(Number.parseInt(newCount));
				}}
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
