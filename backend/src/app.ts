import express from 'express';

const app = express();

/**
 * @api {get} / Request Hello World
 * @apiName GetHelloWorld
 * @apiGroup Hello
 *
 * @apiSuccess {String} message Hello World
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "message": "Hello World"
 *  }
 */
app.get('/', (req, res) => {
	res.status(200).json({ message: 'Hello World' });
});

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});
