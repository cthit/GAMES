import { useGameOwners } from '@/src/hooks/api/useGameOwners';
import { usePlatforms } from '@/src/hooks/api/usePlatforms';
import SliderIcon from '@/src/icons/Slider';
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

	if (platformsLoading || ownersLoading) {
		return <p>Loading...</p>;
	}

	if (!platforms || !owners) {
		return <p>Uh oh</p>;
	}

	return (
		<div>
			<h2 className={styles.filterMarker}>
				<SliderIcon className={styles.icon} />
				<span className={styles.titleText}>Filter</span>
			</h2>

			<Select
				label="Platform"
				options={platforms.map((platform) => platform.name)}
				placeholder="Filter for platform"
				onChange={(select) => filter.setPlatform(select.target.value)}
				value={filter.full.platform ? filter.full.platform : ''}
			/>

			<ReleaseDate filterState={filter} />

			<Playtime filterState={filter} />

			<NumberInput
				label="Amount of players"
				onChange={(input) =>
					filter.setPlayerCount(Number.parseInt(input.currentTarget.value))
				}
				value={filter.full.playerCount?.toString() || ''}
				placeholder="Input players"
				className={styles.playerCountInput}
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
		</div>
	);
};

const ReleaseDate: FC<GameFilterProps> = ({ filterState: filter }) => {
	const dateReg =
		/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

	return (
		<div className={styles.betweenPickerDiv}>
			<label className={styles.label} htmlFor="">
				Release date
			</label>

			<div className={styles.dateInputDiv}>
				<DateInput
					label=""
					onChange={(input) =>
						filter.setReleaseBefore(new Date(input.currentTarget.value))
					}
					value={
						dateReg.test(filter.full.releaseBefore + '')
							? filter.full.releaseBefore?.toISOString().split('T')[0]
							: undefined
					}
				/>

				<p>-</p>

				<DateInput
					label=""
					onChange={(input) =>
						filter.setReleaseAfter(new Date(input.currentTarget.value))
					}
					value={
						dateReg.test(filter.full.releaseAfter + '')
							? filter.full.releaseAfter?.toISOString().split('T')[0]
							: undefined
					}
				/>
			</div>
		</div>
	);
};

const Playtime: FC<GameFilterProps> = ({ filterState: filter }) => {
	return (
		<div className={styles.betweenPickerDiv}>
			<label className={styles.label} htmlFor="">
				Playtime
			</label>
			<div className={styles.playtimeInputDiv}>
				<NumberInput
					label=""
					onChange={(input) =>
						filter.setPlaytimeMin(Number.parseInt(input.currentTarget.value))
					}
					value={filter.full.playtimeMin?.toString() || ''}
					placeholder="Min time"
					className={styles.playtimeInput}
				/>

				<p>-</p>

				<NumberInput
					label=""
					onChange={(input) =>
						filter.setPlaytimeMax(Number.parseInt(input.currentTarget.value))
					}
					value={filter.full.playtimeMax?.toString() || ''}
					placeholder="Max time"
					className={styles.playtimeInput}
				/>
			</div>
		</div>
	);
};

export default GameFilter;
