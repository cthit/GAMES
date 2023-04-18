import { Router } from 'express';
import { addPlatform, getAllPlatforms } from '../services/platformService.js';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';

const platformRouter = Router();

/**
 * @api {get} /api/v1/platforms Request Platforms
 * @apiName GetPlatforms
 * @apiGroup Platforms
 * @apiDescription Get all platforms
 *
 * @apiSuccess {Object[]} platforms List of platforms
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *    name: "Steam"
 *  }
 * ]
 */
platformRouter.get('/', async (req, res) => {
	const platforms = await getAllPlatforms();

	res.status(200).json(platforms);
});

const addPlatformSchema = z.object({
	name: z.string().min(1).max(100)
});

platformRouter.post(
	'/add',
	validateRequestBody(addPlatformSchema),
	async (req, res) => {
		const platform = req.body.name;

		await addPlatform(platform);

		res.status(200).json({ message: 'Platform added' });
	}
);

export default platformRouter;
