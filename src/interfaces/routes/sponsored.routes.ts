import { Router } from 'express';
import { SponsorController } from '@/interfaces/controllers/SponsoredController';
import { ensureAuthenticated } from '@/shared/middleware/authenticate';

const sponsoredContentRoutes = Router();
const sponsorController = new SponsorController();

/**
 * @swagger
 * tags:
 *   name: Sponsored Content
 *   description: Conteúdo patrocinado.
 */

/**
 * @swagger
 * /api/v1/sponsor:
 *   post:
 *     summary: Criar um novo patrocínio
 *     tags:
 *       - Patrocínio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               refType:
 *                 type: string
 *                 enum: [curso, video, mentoria, produto, bolsa, paper, ticket, flick]
 *               days:
 *                 type: number
 *               filters:
 *                 type: object
 *                 properties:
 *                   area_of_study:
 *                     type: string
 *                   interest:
 *                     type: array
 *                     items:
 *                       type: string
 *                   localization:
 *                     type: string
 *                   curse:
 *                     type: string
 *                   academic_level:
 *                     type: string
 *     responses:
 *       201:
 *         description: Patrocínio criado com sucesso
 */
sponsoredContentRoutes.post('/sponsor',  ensureAuthenticated, sponsorController.create);

/**
 * @swagger
 * /api/v1/sponsor:
 *   get:
 *     summary: Listar todos os patrocínios
 *     tags:
 *       - Patrocínio
 *     responses:
 *       200:
 *         description: Lista de patrocínios
 */
sponsoredContentRoutes.get('/sponsor', sponsorController.getAll);

/**
 * @swagger
 * /api/v1/sponsor/by-type:
 *   get:
 *     summary: Buscar patrocínios por tipo
 *     tags:
 *       - Patrocínio
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [curso, video, mentoria, produto, bolsa, paper, ticket, flick]
 *     responses:
 *       200:
 *         description: Lista de patrocínios por tipo
 */
sponsoredContentRoutes.get('/sponsor/by-type', sponsorController.getByType);

/**
 * @swagger
 * /api/v1/sponsor:
 *   patch:
 *     summary: Estender dias de um patrocínio
 *     tags:
 *       - Patrocínio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               extraDays:
 *                 type: number
 *     responses:
 *       200:
 *         description: Dias estendidos com sucesso
 */
sponsoredContentRoutes.patch('/sponsor/extend-days',  ensureAuthenticated, sponsorController.update);

/**
 * @swagger
 * /api/v1/sponsor/{id}:
 *   delete:
 *     summary: Excluir patrocínio
 *     tags:
 *       - Patrocínio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Patrocínio excluído
 */
sponsoredContentRoutes.delete('/sponsor/:id',  ensureAuthenticated, sponsorController.delete);

export { sponsoredContentRoutes };