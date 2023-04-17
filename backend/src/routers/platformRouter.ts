import { Router } from 'express';
import { getAllPlatforms } from '../services/platformService';

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

export default platformRouter;
