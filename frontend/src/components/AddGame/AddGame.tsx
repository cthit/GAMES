import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import DateInput from '../Forms/DateInput/DateInput';
import Select from '../Forms/Select/Select';
import TextArea from '../Forms/TextArea/TextArea';
import TextInput from '../Forms/TextInput/TextInput';
import { usePlatforms } from '@/src/hooks/api/usePlatforms';
import { useAddGame } from '@/src/hooks/api/useAddGame';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
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
		releaseDate: z.string().datetime(), // ISO date string
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

	watch((data) => console.log(data));

	console.log(errors);

	if (isLoading || register === undefined) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(async (d) => {
					try {
						await toast.promise(postDataAsync(d), {
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
						});
					} catch (e) {}
				})}
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
					options={data.map((platform) => platform.name)}
					placeholder="Select a platform"
					name="platform"
					control={control}
					error={errors.platform?.message}
				/>
				<Select
					label="Platform"
					options={data.map((platform) => platform.name)}
					placeholder="Select a platform"
					onChange={(select) => setPlatform(select.target.value)}
					value={platform}
				/>
				<br />

				<DateInput
					label="Release date"
					onChange={(input) =>
						setReleaseDate(new Date(input.currentTarget.value))
					}
					value={releaseDate?.toISOString().split('T')[0] || ''}
				/>
				<br />

				<TextInput
					label="Expected playtime"
					type="number"
					onChange={(input) =>
						setPlaytime(Number.parseInt(input.currentTarget.value))
					}
					value={playtime?.toString() || ''}
				/>
				<br />
				<TextInput
					label="Minimum number of players"
					type="number"
					onChange={(input) =>
						setPlayerMin(Number.parseInt(input.currentTarget.value))
					}
					value={playerMin?.toString() || ''}
				/>
				<br />
				<TextInput
					label="Maximum number of players"
					type="number"
					onChange={(input) =>
						setPlayerMax(Number.parseInt(input.currentTarget.value))
					}
					value={playerMax?.toString() || ''}
				/>
				<br />
				<TextInput
					label="Location of the game"
					type="text"
					onChange={(input) => setLocation(input.currentTarget.value)}
					value={location}
				/>
				<br />

				<input type="submit" disabled={postLoading} value="Submit" />
			</form>
		</>
	);
};

export default AddGame;
