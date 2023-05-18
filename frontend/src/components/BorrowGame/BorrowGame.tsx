import { useUser } from '@/src/hooks/api/auth';
import { useBorrow, useBorrowRequest } from '@/src/hooks/api/borrow';
import { useGameOwner } from '@/src/hooks/api/games';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import FormInput from '../Forms/FormInput/FormInput';

interface BorrowGameProps {
	game?: string;
}

const validGameId = z.string().cuid2({ message: 'Invalid game ID' });

const borrowGameSchema = z
	.object({
		borrowStart: z.date({
			required_error: 'Please enter a start date',
			invalid_type_error: 'Please enter a start date'
		}),
		borrowEnd: z.date({
			required_error: 'Please enter an end date',
			invalid_type_error: 'Please enter an end date'
		})
	})
	.refine((data) => data.borrowEnd > data.borrowStart, {
		message: 'End date must be after start date',
		path: ['borrowEnd']
	})
	//I hate that this it the best way to strip the time from a date...
	.refine((data) => data.borrowStart >= new Date(new Date().toDateString()), {
		message: 'Start date cant be in the past',
		path: ['borrowStart']
	});

type BorrowGameForm = z.infer<typeof borrowGameSchema>;

const BorrowGame: FC<BorrowGameProps> = ({ game }) => {
	const isValidGameId = validGameId.safeParse(game).success;

	const { data: user, isLoading: loadingUser } = useUser();
	const { data: gameOwner, isLoading: gameOwnerLoading } = useGameOwner(
		game || ''
	);
	const { mutateAsync: borrowGameAsync, error: borrowPostError } = useBorrow();
	const { mutateAsync: requestBorrowAsync, error: borrowRequestPostError } =
		useBorrowRequest();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset: resetForm
	} = useForm<BorrowGameForm>({
		resolver: zodResolver(borrowGameSchema)
	});

	if (!isValidGameId || !game) {
		return <p>Invalid game ID</p>;
	}

	if (loadingUser || gameOwnerLoading) {
		return <p>Loading...</p>;
	}

	if (!user || !gameOwner) {
		return <p>Uh oh</p>;
	}

	const requestBorrowHandler = async (d: BorrowGameForm) => {
		try {
			await toast.promise(
				requestBorrowAsync({
					gameId: game,
					...d
				}),
				{
					pending: 'Sending borrow request...',
					success: 'Borrow request sent!',
					error: {
						render: () => {
							return (
								<>
									{borrowRequestPostError?.response?.status === 401
										? 'You need to be signed in to borrow games'
										: 'Something went wrong!'}
								</>
							);
						}
					}
				},
				{
					position: 'bottom-right'
				}
			);
			resetForm();
		} catch (e) {}
	};

	const immediatelyBorrowHandler = async (d: BorrowGameForm) => {
		try {
			await toast.promise(
				borrowGameAsync({
					gameId: game,
					...d
				}),
				{
					pending: 'Borrowing game...',
					success: 'Game borrow added, no need to wait for approval',
					error: {
						render: () => {
							return (
								//TODO indicate if the user does not have permission to immediately borrow the game. Requires changes in backend
								<>
									{borrowPostError?.response?.status === 401
										? 'You need to be signed in to borrow games'
										: 'Something went wrong!'}
								</>
							);
						}
					}
				},
				{
					position: 'bottom-right'
				}
			);
			resetForm();
		} catch (e) {}
	};

	const invalidFormHandler = (e: FieldErrors<BorrowGameForm>) => {
		toast.error('Please fill out all fields correctly!', {
			position: 'bottom-right'
		});
	};

	return (
		<form>
			<FormInput
				label="Start date"
				name="borrowStart"
				type="date"
				register={register}
				registerOptions={{ valueAsDate: true }}
				error={errors.borrowStart?.message}
			/>
			<br />

			<FormInput
				label="End date"
				name="borrowEnd"
				type="date"
				register={register}
				registerOptions={{ valueAsDate: true }}
				error={errors.borrowEnd?.message}
			/>
			<br />

			<input
				type="submit"
				value="Request Borrow"
				onClick={handleSubmit(requestBorrowHandler, invalidFormHandler)}
			/>

			{user.gameOwnerId === gameOwner ? (
				<input
					type="submit"
					value="Borrow immediately"
					onClick={handleSubmit(immediatelyBorrowHandler, invalidFormHandler)}
				/>
			) : null}
		</form>
	);
};

export default BorrowGame;
