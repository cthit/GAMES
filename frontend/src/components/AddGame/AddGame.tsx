import { FC } from 'react';
import { usePlatforms } from '@/src/hooks/api/usePlatforms';
import { useAddGame } from '@/src/hooks/api/useAddGame';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../Forms/FormInput/FormInput';
import FormTextArea from '../Forms/FormTextArea/FormTextArea';
import FormSelect from '../Forms/FormSelect/FormSelect';
import styles from './AddGame.module.scss';

interface AddGameProps {
	showSelf: (b: boolean) => void;
}

const addGameSchema = z
	.object({
		name: z
			.string({ required_error: 'Name is required' })
			.min(1, 'Name is required')
			.max(250, "Name can't be longer than 250 characters"),
		description: z
			.string({ required_error: 'A description is required' })
			.min(1, 'A description is required')
			.max(2000, "Description can't be longer than 2000 characters"),
		platform: z
			.string({ required_error: 'Please select a platform' })
			.min(1, 'Please select a platform'),
		releaseDate: z.date({
			required_error: 'Please enter a release date',
			invalid_type_error: 'Please enter a release date'
		}),
		playtime: z
			.number({ invalid_type_error: 'Playtime is required' })
			.int({ message: 'Please enter a whole number' })
			.min(1, "Playtime can't be less than 1 minute"),
		playerMin: z
			.number({ invalid_type_error: 'Minimum players is required' })
			.int({ message: 'Please enter a whole number' })
			.min(1, "Minimum players can't be less than 1"),
		playerMax: z
			.number({ invalid_type_error: 'Maximum players is required' })
			.int({ message: 'Please enter a whole number' })
			.min(1, "Maximum players can't be less than 1"),
		location: z
			.string({ required_error: 'A location is required' })
			.min(1, 'A location is required')
			.max(250, "Location can't be longer than 250 characters")
	})
	.refine((data) => data.playerMax >= data.playerMin, {
		message: 'Maximum players must be greater than or equal to Minimum players',
		path: ['playerMax']
	});

type AddGameForm = z.infer<typeof addGameSchema>;

const AddGame: FC<AddGameProps> = ({ showSelf }) => {
	const { data, error, isLoading } = usePlatforms();

	const {
		error: postError,
		isLoading: postLoading,
		mutateAsync: postDataAsync
	} = useAddGame();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset: resetForm
	} = useForm<AddGameForm>({
		resolver: zodResolver(addGameSchema)
	});

	if (isLoading || register === undefined) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	const submitHandler = async (d: AddGameForm) => {
		try {
			await toast.promise(
				postDataAsync(d),
				{
					pending: 'Adding game...',
					success: 'Game added!',
					error: {
						render: () => {
							return (
								<>
									{postError?.response?.status === 401
										? 'You need to be signed in to add games'
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

	const invalidFormHandler = (e: FieldErrors<AddGameForm>) => {
		toast.error('Please fill out all fields correctly!', {
			position: 'bottom-right'
		});
	};

	return (
		<>

			<div className={styles.lightBox} onClick={() => {
				showSelf(false);
			}} />
			<form className={styles.addGameContainer} onSubmit={() => {
				handleSubmit(submitHandler, invalidFormHandler);
			}}>
				<h2 className={styles.title}>Add new game</h2>
				<div className={styles.divider} />
				<FormInput
					label="Name of the game"
					name="name"
					type="text"
					register={register}
					error={errors.name?.message}
				/>
				<br />
				<FormTextArea
					label="Description of the game"
					register={register}
					name="description"
					error={errors.description?.message}
				/>
				<br />
				<FormSelect
					label="Platform"
					options={data.map((platform) => {
						return { value: platform.name, label: platform.name };
					})}
					placeholder="Select a platform"
					name="platform"
					control={control}
					error={errors.platform?.message}
				/>
				<br />
				<FormInput
					label="Release date"
					name="releaseDate"
					type="date"
					register={register}
					registerOptions={{ valueAsDate: true }}
					error={errors.releaseDate?.message}
				/>
				<br />
				<FormInput
					label="Expected playtime"
					name="playtime"
					type="number"
					register={register}
					registerOptions={{ valueAsNumber: true }}
					error={errors.playtime?.message}
				/>
				<br />
				<PlayerInput register={register} errors={errors} />
				<br />
				<FormInput
					label="Location of the game"
					name="location"
					type="text"
					register={register}
					error={errors.location?.message}
				/>

				{errors.root ? <p>Error: {errors.root.message}</p> : null}

				<input className={styles.button} type="submit" disabled={postLoading} value="Submit" />
			</form>
		</ >
	);
};

export default AddGame;

interface PlayerInputProps {
	register: any;
	errors: FieldErrors<AddGameForm>;
}
const PlayerInput: FC<PlayerInputProps> = ({ register, errors }) => {
	return (
		<div className={styles.playerBox}>
			<h3>Amount of players</h3>
			<div className={styles.playerInput}>
				<FormInput

					name="playerMin"
					type="number"
					register={register}
					registerOptions={{ valueAsNumber: true }}
					error={errors.playerMin?.message}
				/>
				<p className={styles.playerDivider}>-</p>
				<FormInput

					name="playerMax"
					type="number"
					register={register}
					registerOptions={{ valueAsNumber: true }}
					error={errors.playerMax?.message}
				/>
			</div></div>);
}
