import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import {
	isAuthenticated,
	isSiteAdmin
} from '../middleware/authenticationCheckMiddleware.js';
import { getGammaSuperGroups } from '../services/gammaService.js';
import {
	getOrganizationsIdsAndNames,
	getOrganization,
	addOrganization,
	removeOrganization,
	removeOrganizationMember,
	addOrganizationMember,
	addOrganizationAdmin,
	removeOrganizationAdmin
} from '../services/organizationService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';
import { ErrorProperty } from '../utils/sendApiValidationError.js';
import { getAccountFromId } from '../services/accountService.js';

const siteAdminRouter = Router();

siteAdminRouter.use(isAuthenticated);
siteAdminRouter.use(isSiteAdmin);

siteAdminRouter.get('/gamma/supergroups', async (req, res) => {
	res.status(200).json(await getGammaSuperGroups());
});

siteAdminRouter.get('/orgs', async (req, res) => {
	const orgs = await getOrganizationsIdsAndNames();

	res.status(200).json(orgs);
});

siteAdminRouter.get('/orgs/:id', async (req, res) => {
	const org = await getOrganization(req.params.id);

	res.status(200).json(org);
});

const addOrganizationSchema = z.object({
	name: z.string().min(1).max(250),
	gammaSuperGroups: z.array(z.string()),
	addGammaAsOrgAdmin: z.boolean()
});

siteAdminRouter.post(
	'/orgs/add',
	validateRequestBody(addOrganizationSchema),
	async (req, res) => {
		const existingSuperGroups = (await getGammaSuperGroups()).map(
			(sg) => sg.name
		);

		var validationErrors: ErrorProperty[] = [];

		for (const superGroup of req.body.gammaSuperGroups) {
			if (!existingSuperGroups.includes(superGroup)) {
				validationErrors.push({
					path: 'gammaSuperGroups',
					message: `Gamma super group ${superGroup} does not exist`
				});
			}
		}

		if (validationErrors.length > 0) {
			return sendApiValidationError(res, validationErrors, 'Body');
		}

		await addOrganization(
			req.body.name,
			req.body.gammaSuperGroups,
			req.body.addGammaAsOrgAdmin
		);
	}
);

siteAdminRouter.delete('/orgs/:id', async (req, res) => {
	const org = await getOrganization(req.params.id);

	if (!org) {
		return res.status(404).json({ message: 'Organization not found' });
	}

	await removeOrganization(req.params.id);

	res.status(200).json({ message: 'Organization deleted' });
});

const addOrgMemberSchema = z.object({
	userId: z.string().cuid(),
	isOrgAdmin: z.boolean()
});

siteAdminRouter.post(
	'/orgs/:id/addMember',
	validateRequestBody(addOrgMemberSchema),
	async (req, res) => {
		const org = await getOrganization(req.params.id);

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

siteAdminRouter.delete('/orgs/:id/removeMember/:memberId', async (req, res) => {
	const org = await getOrganization(req.params.id);

	if (!org) {
		return res.status(404).json({ message: 'Organization not found' });
	}

	if ((await getAccountFromId(req.params.memberId)) === null) {
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

	if (!memberIds.includes(req.params.memberId)) {
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

	await removeOrganizationMember(req.params.id, req.params.memberId);
});

const setAdminStatusSchema = z.object({
	userId: z.string().cuid(),
	isOrgAdmin: z.boolean()
});

siteAdminRouter.put(
	'/orgs/:id/setAdminStatus',
	validateRequestBody(setAdminStatusSchema),
	async (req, res) => {
		const org = await getOrganization(req.params.id);

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
