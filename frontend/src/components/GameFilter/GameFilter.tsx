import { useGameOwners } from '@/src/hooks/api/useGameOwners';
import { usePlatforms } from '@/src/hooks/api/usePlatforms';
import { FC } from 'react';
import DateInput from '../Forms/DateInput/DateInput';
import NumberInput from '../Forms/NumberInput/NumberInput';
import Select from '../Forms/Select/Select';
import { useFilterState } from '../GamesList/GamesList';
import styles from './GameFilter.module.scss';

interface GameFilterProps {
	filterState: ReturnType<typeof useFilterState>;
}

const GameFilter: FC<GameFilterProps> = ({
	filterState: filter
}: GameFilterProps) => {
	const { data: platforms, isLoading: platformsLoading } = usePlatforms();
	const { data: owners, isLoading: ownersLoading } = useGameOwners();

	const nums = '0123456789';
	const dateReg =
		/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

	if (platformsLoading || ownersLoading) {
		return <p>Loading...</p>;
	}

	if (!platforms || !owners) {
		return <p>Uh oh</p>;
	}

	return (
		<form className={styles.filterDiv}>
			<h2>(icon)Filter</h2>
			<Select
				label="Platform"
				options={platforms.map((platform) => platform.name)}
				placeholder="Filter for platform"
				onChange={(select) => filter.setPlatform(select.target.value)}
				value={filter.full.platform ? filter.full.platform : ''}
			/>
			<br />

			<DateInput
				label="Released before"
				onChange={(input) =>
					filter.setReleaseBefore(new Date(input.currentTarget.value))
				}
				value={
					dateReg.test(filter.full.releaseBefore + '')
						? filter.full.releaseBefore?.toISOString().split('T')[0]
						: undefined
				}
			/>
			<br />

			<DateInput
				label="Released after"
				onChange={(input) =>
					filter.setReleaseAfter(new Date(input.currentTarget.value))
				}
				value={
					dateReg.test(filter.full.releaseAfter + '')
						? filter.full.releaseAfter?.toISOString().split('T')[0]
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
					filter.setPlaytimeMin(Number.parseInt(newTime));
				}}
				value={filter.full.playtimeMin?.toString() || ''}
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
					filter.setPlaytimeMax(Number.parseInt(newTime));
				}}
				value={filter.full.playtimeMax?.toString() || ''}
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
					filter.setPlayerCount(Number.parseInt(newCount));
				}}
				value={filter.full.playerCount?.toString() || ''}
			/>
			<br />

			<Select
				label="Owner"
				options={owners.map((owner) => owner.name)}
				values={owners.map((owner) => owner.id)}
				placeholder="Filter for owner"
				onChange={(select) => filter.setOwner(select.target.value)}
				value={filter.full.owner ? filter.full.owner : ''}
			/>
			<br />
		</form>
	);
};



export default GameFilter;
