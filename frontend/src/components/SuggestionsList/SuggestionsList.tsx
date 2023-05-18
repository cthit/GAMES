import { useGameSuggestions } from '@/src/hooks/api/useGameSuggestions';
import { FC } from 'react';
import SuggestionCard from '../SuggestionCard/SuggestionCard';
import styles from './SuggestionsList.module.scss';

interface SuggestionsListProps {}

const SuggestionsList: FC<SuggestionsListProps> = () => {
	const { data, error, isLoading } = useGameSuggestions();

	if (isLoading) return <div>Loading...</div>;

	if (error) return <div>Something went wrong...</div>;

	return (
		<ul className={styles.suggestionsList}>
			{data.map((suggestion) => (
				<SuggestionCard
					key={suggestion.name}
					name={suggestion.name}
					platform={suggestion.platformName}
					playtimeMinutes={suggestion.playtimeMinutes}
					playerMin={suggestion.playerMin}
					playerMax={suggestion.playerMax}
					motivation={suggestion.motivation}
				/>
			))}
		</ul>
	);
};

export default SuggestionsList;
