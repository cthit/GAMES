import GameSummaryCard from '@/src/components/GameDetails/GameSummaryCard/GameSummaryCard';
import Header from '@/src/components/Header/Header';
import { useGame } from '@/src/hooks/api/games';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import styles from './[gameId].module.scss';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const gameId = query.gameId;

	return {
		props: {
			gameId
		}
	};
};

const GamePage: NextPage<{ gameId: string }> = ({ gameId }) => {
	return (
		<>
			<Head>
				<title>GAMES | Game details</title>
				<meta
					name="description"
					content="A service for finding and browsing games in different mediums and formats."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main>
				<GamePageContents gameId={gameId} />
			</main>
		</>
	);
};

const GamePageContents = ({ gameId }: { gameId: string }) => {
	const { data, isLoading, error } = useGame(gameId);

	if (isLoading) return <p>Loading...</p>;

	if (error) return <p>Error: {error.message}</p>;

	if (!data) return <p>No game found</p>;

	return (
		<div className={styles.layout}>
			<GameSummaryCard
				name={data.name}
				description={data.description}
				imgUrl="/images/game-default.png"
			/>
		</div>
	);
};

export default GamePage;
