import { FC } from 'react';
import FormInput from '../Forms/FormInput/FormInput';
import * as z from 'zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddPlatform } from '@/src/hooks/api/useAddPlatform';
import { toast } from 'react-toastify';

interface AddPlatformProps {}

const addPlatformSchema = z.object({
	name: z
		.string({ required_error: 'Please enter a platform name' })
		.min(1, 'Please enter a platform name')
		.max(100, "Platform name can't be longer than 100 characters")
});

type AddPlatformForm = z.infer<typeof addPlatformSchema>;

const AddPlatform: FC<AddPlatformProps> = () => {
	const {
		error: postError,
		isLoading: postLoading,
		mutateAsync: postDataAsync
	} = useAddPlatform();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset: resetForm
	} = useForm<AddPlatformForm>({
		resolver: zodResolver(addPlatformSchema)
	});

	const submitHandler = async (d: AddPlatformForm) => {
		try {
			await toast.promise(
				postDataAsync(d),
				{
					pending: 'Adding platform...',
					success: 'Platform added!',
					error: {
						render: () => {
							return (
								<>
									{postError?.response?.status === 401
										? 'You need to be signed in to add platforms'
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

	const invalidFormHandler = (e: FieldErrors<AddPlatformForm>) => {
		toast.error('Please fill out all fields correctly!', {
			position: 'bottom-right'
		});
	};

	return (
		<form onSubmit={handleSubmit(submitHandler, invalidFormHandler)}>
			<FormInput
				label="Platform name"
				name="name"
				type="text"
				register={register}
				error={errors.name?.message}
			/>
			<br />

			<input type="submit" value="Add platform" />
		</form>
	);
};

export default AddPlatform;
