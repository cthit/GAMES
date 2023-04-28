import { Response } from 'express';
import { z } from 'zod';
import { sendErrors } from 'zod-express-middleware';

export interface ErrorProperty {
	path: string;
	message: string;
}

/**
 * @apiDefine ZodError
 * @apiError InvalidRequest Invalid request body
 * @apiErrorExample {json} Error-Response:
 *  [
 *	 {
 *	  "type": "Body",
 *	   "errors": {
 *		 "issues": [
 *		  {
 *		   "code": "invalid_type",
 *		   "expected": "string",
 *		   "received": "undefined",
 *		   "path": [
 *			"name"
 *		   ],
 *		   "message": "Required"
 *	      }
 *	   	],
 *	   	"name": "ZodError"
 *     }
 *	  }
 *  ]
 */

const sendApiValidationError = (
	res: Response,
	errors: ErrorProperty[] | ErrorProperty,
	type: 'Body' | 'Query' | 'Params'
) => {
	let zErrors;
	if (Array.isArray(errors)) {
		zErrors = errors.map((error) => ({
			type,
			errors: z.ZodError.create([
				{
					path: [error.path],
					message: error.message,
					code: 'custom'
				}
			])
		}));
	} else {
		zErrors = [
			{
				type,
				errors: z.ZodError.create([
					{
						path: [errors.path],
						message: errors.message,
						code: 'custom'
					}
				])
			}
		];
	}

	sendErrors(zErrors, res);
};

export default sendApiValidationError;
