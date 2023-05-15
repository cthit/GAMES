import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import FormInput from '../Forms/FormInput/FormInput';
import FormTextArea from '../Forms/FormTextArea/FormTextArea';
import FormSelect from '../Forms/FromSelect/FormSelect';
import { useAddGameSuggestion } from '@/src/hooks/api/useAddGameSuggestion';
import { usePlatforms } from '@/src/hooks/api/usePlatforms';

interface AddSuggestionProps {}

const AddSuggestion: FC<AddSuggestionProps> = () => {
	const { data, error, isLoading } = usePlatforms();

	const { mutateAsync: postDataAsync, error: postError } =
		useAddGameSuggestion();

	const addGameSuggestionSchema = z.object({
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
			.min(1, "Maximum players can't be less than 1"), //Maybe check that max > min?
		location: z
			.string({ required_error: 'A location is required' })
			.min(1, 'A location is required')
			.max(250, "Location can't be longer than 250 characters"),
		motivation: z
			.string({ required_error: 'A motivation is required' })
			.min(1, 'A motivation is required')
			.max(2000, "Motivation can't be longer than 2000 characters")
	});

	type AddGameSuggestionForm = z.infer<typeof addGameSuggestionSchema>;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset: resetForm
	} = useForm<AddGameSuggestionForm>({
		resolver: zodResolver(addGameSuggestionSchema)
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	return (
		<form
			onSubmit={handleSubmit(
				async (d) => {
					try {
						await toast.promise(
							postDataAsync(d),
							{
								pending: 'Adding game suggestion...',
								success: 'Game suggestion added!',
								error: {
									render: () => {
										return (
											<>
												{postError?.response?.status === 401
													? 'You need to be signed in to add games suggestions'
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

			<FormTextArea
				label="Motivation"
				register={register}
				name="motivation"
				error={errors.motivation?.message}
			/>
			<br />

			<input type="submit" value="Submit" />
		</form>
	);
};

export default AddSuggestion;
