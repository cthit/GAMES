import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import SuggestionCard from '../SuggestionCard/SuggestionCard';
import styles from './SuggestionsList.module.css';
import debounce from 'lodash.debounce';

interface SuggestionsListProps {}

interface Suggestion {
	name: string;
	description: string;
	platformName: string;
	playtimeMinutes: string;
	releaseDate: string;
	playerMin: string;
	playerMax: string;
}

const SuggestionsList: FC<SuggestionsListProps> = () => {
	const { data, error, loading } = useApiGet<Suggestion[]>('/suggest');

	return (
		<div>
			<h1 className={styles.suggestionsListHeader}>Suggestions List</h1>

			{loading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error}</p> : null}

			{data ? (
				<ul className={styles.suggestionsList}>
					{data.map((suggestion) => (
						<SuggestionCard
							name={suggestion.name}
							description={suggestion.description}
							platform={suggestion.platformName}
							playtimeMinutes={suggestion.playtimeMinutes}
							releaseDate={suggestion.releaseDate}
							playerMin={suggestion.playerMin}
							playerMax={suggestion.playerMax}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};



export default SuggestionsList;
