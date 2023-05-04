import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import {
	isAuthenticated,
	isSiteAdmin
} from '../middleware/authenticationCheckMiddleware.js';
import { getAccountFromId } from '../services/accountService.js';
import { getGammaSuperGroups } from '../services/gammaService.js';
import {
	addOrganization,
	addOrganizationAdmin,
	addOrganizationMember,
	getOrganization,
	getOrganizationWithMembers,
	getOrganizationsIdsAndNames,
	removeOrganization,
	removeOrganizationAdmin,
	removeOrganizationMember
} from '../services/organizationService.js';
import sendApiValidationError, {
	ErrorProperty
} from '../utils/sendApiValidationError.js';
import { updateOrganization } from '../services/organizationService.js';

const siteAdminRouter = Router();

siteAdminRouter.use(isAuthenticated);
siteAdminRouter.use(isSiteAdmin);

/**
 * @api {get} /api/v1/admin/gamma/supergroups Get gamma supergroups
 * @apiPermission siteAdmin
 * @apiName GetSuperGroups
 * @apiGroup SiteAdmin
 * @apiDescription Requests all supergroups from Gamma API
 *
 * @apiSuccess {Object[]} supergproups List of supergroups
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *	[
 *	    {
 *	        "id": "ef9375b7-2195-43e0-8047-da508613b794",
 *	        "name": "superadmin",
 *	        "prettyName": "super admin",
 *	        "type": "COMMITTEE",
 *	        "email": "admin@chalmers.it"
 *	    }
 *	]
 */
siteAdminRouter.get('/gamma/supergroups', async (req, res) => {
	res.status(200).json(await getGammaSuperGroups());
});

/**
 * @api {get} /api/v1/admin/orgs Get all organizations
 * @apiPermission siteAdmin
 * @apiName GetOrganizations
 * @apiGroup SiteAdmin
 * @apiDescription Returns all organizations
 *
 * @apiSuccess {Object[]} organizations List of organizations
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *	[
 *	    {
 *	        "id": "clgzcwryp0000lpr082ontt9u",
 *	        "name": "Test org"
 *	    }
 *	]
 */
siteAdminRouter.get('/orgs', async (req, res) => {
	const orgs = await getOrganizationsIdsAndNames();

	res.status(200).json(orgs);
});

/**
 * @api {get} /api/v1/admin/orgs/:id Get organization
 * @apiParam {String} id Organization id
 * @apiPermission siteAdmin
 * @apiName GetOrganization
 * @apiGroup SiteAdmin
 * @apiDescription Returns the organization with the specified id
 *
 * @apiError (404) OrganizationNotFound Organization with specified id does not exist
 *
 * @apiSuccess {Object} organization Organization
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *	{
 *	    "id": "clgzcwryp0000lpr082ontt9u",
 *	    "name": "Test org"
 *	}
 */
siteAdminRouter.get('/orgs/:id', async (req, res) => {
	const org = await getOrganizationWithMembers(req.params.id);

	if (!org) {
		return res.status(404).json({
			message: `Organization with id ${req.params.id} does not exist`
		});
	}

	res.status(200).json(org);
});

const addOrEditOrganizationSchema = z.object({
	name: z.string().min(1).max(250),
	gammaSuperNames: z.array(z.string()),
	addGammaAsOrgAdmin: z.boolean()
});

/**
 * @api {post} /api/v1/admin/orgs/add Add organization
 * @apiPermission siteAdmin
 * @apiName AddOrganization
 * @apiGroup SiteAdmin
 * @apiDescription Adds a new organization
 *
 * @apiBody {String} name The name of the organization
 * @apiBody {String[]} gammaSuperGroups The gamma super groups to link to the organization
 * @apiBody {Number} addGammaAsOrgAdmin Whether to add the gamma super groups members as organization admins
 *
 * @apiSuccess {String} message The organization was added
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 *  {
 *      "message": "Organization added"
 *  }
 *
 * @apiUse ZodError
 *
 */
siteAdminRouter.post(
	'/orgs/add',
	validateRequestBody(addOrEditOrganizationSchema),
	async (req, res) => {
		var validationErrors: ErrorProperty[] = await validateGammaGroups(
			req.body.gammaSuperNames
		);

		if (validationErrors.length > 0) {
			return sendApiValidationError(res, validationErrors, 'Body');
		}

		await addOrganization(
			req.body.name,
			req.body.gammaSuperNames,
			req.body.addGammaAsOrgAdmin
		);

		res.status(200).json({ message: 'Organization added' });
	}
);

/**
 * @api {delete} /api/v1/admin/orgs/:id Delete organization
 * @apiParam {String} id Organization id
 * @apiPermission siteAdmin
 * @apiName DeleteOrganization
 * @apiGroup SiteAdmin
 * @apiDescription Deletes the organization with the specified id
 *
 * @apiError (404) OrganizationNotFound Organization with specified id does not exist
 *
 * @apiSuccess {String} message The organization was deleted
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 *  {
 *      "message": "Organization deleted"
 *  }
 *
 */
siteAdminRouter.delete('/orgs/:id', async (req, res) => {
	const org = await getOrganization(req.params.id);

	if (!org) {
		return res.status(404).json({ message: 'Organization not found' });
	}

	await removeOrganization(req.params.id);

	res.status(200).json({ message: 'Organization deleted' });
});

/**
 * @api {post} /api/v1/admin/orgs/:id Update organization
 * @apiPermission siteAdmin
 * @apiName UpdateOrganization
 * @apiGroup SiteAdmin
 * @apiDescription Updates an organization
 *
 * @apiBody {String} name The name of the organization
 * @apiBody {String[]} gammaSuperGroups The gamma super groups to link to the organization
 * @apiBody {Number} addGammaAsOrgAdmin Whether to add the gamma super groups members as organization admins
 *
 * @apiSuccess {String} message The organization was updated
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 *  {
 *      "message": "Organization updated"
 *  }
 *
 * @apiUse ZodError
 *
 */
siteAdminRouter.put(
	'/orgs/:id',
	validateRequestBody(addOrEditOrganizationSchema),
	async (req, res) => {
		const org = await getOrganization(req.params.id);
		if (!org) {
			return res.status(404).json({ message: 'Organization not found' });
		}

		var validationErrors: ErrorProperty[] = await validateGammaGroups(
			req.body.gammaSuperNames
		);

		if (validationErrors.length > 0) {
			return sendApiValidationError(res, validationErrors, 'Body');
		}

		await updateOrganization(
			req.params.id,
			req.body.name,
			req.body.gammaSuperNames,
			req.body.addGammaAsOrgAdmin
		);

		res.status(200).json({ message: 'Organization updated' });
	}
);

const addOrgMemberSchema = z.object({
	userId: z.string().cuid(),
	isOrgAdmin: z.boolean()
});

/**
 * @api {post} /api/v1/admin/orgs/:id/addMember Add organization
 * @apiParam {String} id Organization id
 * @apiPermission siteAdmin
 * @apiName AddOrganization
 * @apiGroup SiteAdmin
 * @apiDescription Adds a new member to the organization
 *
 * @apiError (404) OrganizationNotFound Organization with specified id does not exist
 *
 * @apiBody {String} userId The id of the user to add
 * @apiBody {Boolean} isOrgAdmin The users admin status
 *
 * @apiSuccess {String} message Member added (and made admin)
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 *  {
 *      "message": "Member added"
 *  }
 *
 * @apiUse ZodError
 *
 */
siteAdminRouter.post(
	'/orgs/:id/addMember',
	validateRequestBody(addOrgMemberSchema),
	async (req, res) => {
		const org = await getOrganizationWithMembers(req.params.id);

		if (!org) {
			return res.status(404).json({ message: 'Organization not found' });
		}

		if ((await getAccountFromId(req.body.userId)) === null) {
			return sendApiValidationError(
				res,
				[
					{
						path: 'id',
						message: 'Account does not exist'
					}
				],
				'Body'
			);
		}

		const memberIds = org.members.map((m) => m.userId);

		if (memberIds.includes(req.body.userId)) {
			return sendApiValidationError(
				res,
				[
					{
						path: 'id',
						message: 'Account is already a member of this organization'
					}
				],
				'Body'
			);
		}

		await addOrganizationMember(req.params.id, req.body.userId);

		if (!req.body.isOrgAdmin) {
			return res.status(200).json({ message: 'Member added' });
		}

		await addOrganizationAdmin(req.params.id, req.body.userId);

		res.status(200).json({ message: 'Member added and made admin' });
	}
);

/**
 * @api {delete} /api/v1/admin/orgs/removeMember/:userID Remove organization member
 * @apiParam {String} id Organization id
 * @apiParam {String} userId User id
 * @apiPermission siteAdmin
 * @apiName RemoveOrganizationMember
 * @apiGroup SiteAdmin
 * @apiDescription Removes the user with the specified userId from the organization with the specified id
 *
 * @apiError (404) OrganizationNotFound Organization with specified id does not exist
 *
 * @apiSuccess {String} message The user was removed from the organization
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 *  {
 *      "message": "Organization deleted"
 *  }
 *
 * @apiUse ZodError
 *
 */
siteAdminRouter.delete('/orgs/:id/removeMember/:userId', async (req, res) => {
	const org = await getOrganizationWithMembers(req.params.id);

	if (!org) {
		return res.status(404).json({ message: 'Organization not found' });
	}

	if ((await getAccountFromId(req.params.userId)) === null) {
		return sendApiValidationError(
			res,
			[
				{
					path: 'id',
					message: 'Account does not exist'
				}
			],
			'Body'
		);
	}

	const memberIds = org.members.map((m) => m.userId);

	if (!memberIds.includes(req.params.userId)) {
		return sendApiValidationError(
			res,
			[
				{
					path: 'id',
					message: 'Account is not a member of this organization'
				}
			],
			'Body'
		);
	}

	await removeOrganizationMember(req.params.id, req.params.userId);
});

const setAdminStatusSchema = z.object({
	userId: z.string().cuid(),
	isOrgAdmin: z.boolean()
});

/**
 * @api {put} /api/v1/admin/orgs/:id/setAdminStatus Set organization member admin status
 * @apiParam {String} id Organization id
 * @apiPermission siteAdmin
 * @apiName AddOrganization
 * @apiGroup SiteAdmin
 * @apiDescription Sets the admin status of the user with the specified userId in the organization with the specified id
 *
 * @apiBody {String} userId The id of the user to modify
 * @apiBody {Boolean} isOrgAdmin The users new admin status
 *
 * @apiError (404) OrganizationNotFound Organization with specified id does not exist
 *
 * @apiSuccess {String} message Admin status updated
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 *  {
 *      "message": "Admin status updated"
 *  }
 *
 * @apiUse ZodError
 *
 */
siteAdminRouter.put(
	'/orgs/:id/setAdminStatus',
	validateRequestBody(setAdminStatusSchema),
	async (req, res) => {
		const org = await getOrganizationWithMembers(req.params.id);

		if (!org) {
			return res.status(404).json({ message: 'Organization not found' });
		}

		if ((await getAccountFromId(req.body.userId)) === null) {
			return sendApiValidationError(
				res,
				[
					{
						path: 'id',
						message: 'Account does not exist'
					}
				],
				'Body'
			);
		}

		const memberIds = org.members.map((m) => m.userId);

		if (!memberIds.includes(req.body.userId)) {
			return sendApiValidationError(
				res,
				[
					{
						path: 'id',
						message: 'Account is not a member of this organization'
					}
				],
				'Body'
			);
		}

		if (req.body.isOrgAdmin) {
			await addOrganizationAdmin(req.params.id, req.body.userId);
		} else {
			await removeOrganizationAdmin(req.params.id, req.body.userId);
		}

		res.status(200).json({ message: 'Admin status updated' });
	}
);

export default siteAdminRouter;

async function validateGammaGroups(gammaSuperGroups: string[]) {
	const existingSuperGroups = (await getGammaSuperGroups()).map(
		(sg) => sg.name
	);

	var validationErrors: ErrorProperty[] = [];

	for (const superGroup of gammaSuperGroups) {
		if (!existingSuperGroups.includes(superGroup)) {
			validationErrors.push({
				path: 'gammaSuperGroups',
				message: `Gamma super group ${superGroup} does not exist`
			});
		}
	}
	return validationErrors;
}
