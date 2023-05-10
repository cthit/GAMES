import { useApiGet } from '@/src/hooks/apiHooks';
import { FC } from 'react';
import DateInput from '../Forms/DateInput/DateInput';
import NumberInput from '../Forms/NumberInput/NumberInput';
import Select from '../Forms/Select/Select';
import styles from './GameFilter.module.css';

interface GameFilterProps {
	setPlatform: (s: string) => void;
	setReleaseBefore: (a: Date) => void;
	setReleaseAfter: (a: Date) => void;
	setPlaytimeMax: (x: number) => void;
	setPlaytimeMin: (x: number) => void;
	setPlayerCount: (x: number) => void;
	setOwner: (s: string) => void;
	setIsPlayed: (b: boolean | undefined) => void;
	platform: string | undefined;
	releaseAfter: Date | undefined;
	releaseBefore: Date | undefined;
	playtimeMax: number | undefined;
	playtimeMin: number | undefined;
	playerCount: number | undefined;
	owner: string | undefined;
	isPlayed: boolean | undefined;
	filterFunction: any;
}

interface Platform {
	name: string;
}

interface Owner {
	id: string;
	name: string;
}

const GameFilter: FC<GameFilterProps> = ({
	setPlatform,
	setReleaseBefore,
	setReleaseAfter,
	setPlaytimeMax,
	setPlaytimeMin,
	setPlayerCount,
	setOwner,
	setIsPlayed,
	platform,
	playerCount,
	playtimeMax,
	playtimeMin,
	releaseAfter,
	releaseBefore,
	owner,
	isPlayed,
	filterFunction
}: GameFilterProps) => {
	const { data: platforms, loading: platformsLoading } =
		useApiGet<Platform[]>('/platforms');
	const { data: owners, loading: ownersLoading } =
		useApiGet<Owner[]>('/games/owners');

	const nums = '0123456789';
	const dateReg =
		/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

	if (platformsLoading || ownersLoading) {
		filterFunction();
		return <p>Loading...</p>;
	}

	if (!platforms || !owners) {
		return <p>Uh oh</p>;
	}

	return (
		<form className={styles.formClass}>
			<h2>Filtering</h2>
			<Select
				label="Platform"
				options={platforms.map((platform) => platform.name)}
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

			<Select
				label="Owner"
				options={owners.map((owner) => owner.name)}
				values={owners.map((owner) => owner.id)}
				placeholder="Filter for owner"
				onChange={(select) => setOwner(select.target.value)}
				value={owner ? owner : ''}
			/>
			<br />

			{/* <Select
				label="Play status"
				options={['Played games','Not played games']}
				values={['true','false']}
				placeholder="All games"
				onChange={(select) => {
					const newBool = (select.target.value == 'undefined')?undefined:(select.target.value=='true')?true:false;
					setIsPlayed(newBool)}}
				value={isPlayed ? 'true' : 'false'}
			/> */}
			<fieldset>
				<p>
					<input type='radio' name="playStatus" onClick={() => setIsPlayed(undefined)} />
					All games
				</p>
				<p>
					<input type='radio' name="playStatus" onClick={() => setIsPlayed(true)} />
					Played games
				</p>
				<p>
					<input type='radio' name="playStatus" onClick={() => setIsPlayed(false)} />
					Not played games
				</p>
			</fieldset>
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
