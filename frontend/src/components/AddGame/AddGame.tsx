import { FC, useState } from 'react';
import { usePlatforms } from '@/src/hooks/api/usePlatforms';
import { useAddGame } from '@/src/hooks/api/useAddGame';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../Forms/FormInput/FormInput';
import FormTextArea from '../Forms/FormTextArea/FormTextArea';
import FormSelect from '../Forms/FromSelect/FormSelect';

interface AddGameProps {}

interface Platform {
	name: string;
}

const AddGame: FC<AddGameProps> = () => {
	const { data, error, isLoading } = usePlatforms();

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [platform, setPlatform] = useState('');
	const [releaseDate, setReleaseDate] = useState<Date>();
	const [playtime, setPlaytime] = useState<number>();
	const [playerMin, setPlayerMin] = useState<number>();
	const [playerMax, setPlayerMax] = useState<number>();
	const [location, setLocation] = useState('');

	const {
		error: postError,
		isLoading: postLoading,
		mutateAsync: postDataAsync
	} = useAddGame();

	const addGameSchema = z.object({
		name: z.string().min(1).max(250),
		description: z.string().min(1).max(2000),
		platform: z.string().min(1),
		releaseDate: z.date(), // ISO date string
		playtime: z.number().int().min(1),
		playerMin: z.number().int().min(1),
		playerMax: z.number().int().min(1), //Maybe check that max > min?
		location: z.string().min(1).max(250)
	});

	type AddGameForm = z.infer<typeof addGameSchema>;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch
	} = useForm<AddGameForm>({
		resolver: zodResolver(addGameSchema)
	});

	if (isLoading || register === undefined) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(
					async (d) => {
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
						} catch (e) {}
					},
					(e) =>
						toast.error('Please fill out all fields correctly!', {
							position: 'bottom-right'
						})
				)}
			>
				<FormInput
					label="Name of the game"
					name="name"
					type="text"
					register={register}
					error={errors.name?.message}
				/>
				<br />

				<FormTextArea
					label="Description fo the game"
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

				<FormInput
					label="Minimum number of players"
					name="playerMin"
					type="number"
					register={register}
					registerOptions={{ valueAsNumber: true }}
					error={errors.playerMin?.message}
				/>
				<br />

				<FormInput
					label="Maximum number of players"
					name="playerMax"
					type="number"
					register={register}
					registerOptions={{ valueAsNumber: true }}
					error={errors.playerMax?.message}
				/>
				<br />

				<FormInput
					label="Location of the game"
					name="location"
					type="text"
					register={register}
					error={errors.location?.message}
				/>
				<br />

				<input type="submit" disabled={postLoading} value="Submit" />
			</form>
		</>
	);
};

export default AddGame;
