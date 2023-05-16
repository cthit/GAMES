import { FC } from 'react';
import SuggestionCard from '../SuggestionCard/SuggestionCard';
import { useGameSuggestions } from '@/src/hooks/api/useGameSuggestions';
import styles from './SuggestionsList.module.scss';

interface SuggestionsListProps {}

const SuggestionsList: FC<SuggestionsListProps> = () => {
	const { data, error, isLoading } = useGameSuggestions();

	return (
		<div>
			<h1 className={styles.suggestionsListHeader}>Suggestions List</h1>

			{isLoading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error.message}</p> : null}

			{data ? (
				<ul className={styles.suggestionsList}>
					{data.map((suggestion) => (
						<SuggestionCard
							key={suggestion.name}
							name={suggestion.name}
							description={suggestion.description}
							platform={suggestion.platformName}
							playtimeMinutes={suggestion.playtimeMinutes}
							releaseDate={suggestion.releaseDate}
							playerMin={suggestion.playerMin}
							playerMax={suggestion.playerMax}
							motivation={suggestion.motivation}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default SuggestionsList;
