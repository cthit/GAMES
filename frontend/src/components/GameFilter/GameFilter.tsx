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
	setPlaytime: (x: number) => void;
	setPlayerCount: (x: number) => void;
	setOwner: (s: string) => void;
	platform: string | undefined;
	releaseAfter: Date | undefined;
	releaseBefore: Date | undefined;
	playtime: number | undefined;
	playerCount: number | undefined;
	owner: string | undefined;
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
	setPlaytime,
	setPlayerCount,
	setOwner,
	platform,
	playerCount,
	playtime,
	releaseAfter,
	releaseBefore,
	owner,
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
				label="Playtime"
				type="number"
				onChange={(input) => {
					let newTime = '';
					for (const element of input.currentTarget.value) {
						newTime += nums.includes(element) ? element : '';
					}
					setPlaytime(Number.parseInt(newTime));
				}}
				value={playtime?.toString() || ''}
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
