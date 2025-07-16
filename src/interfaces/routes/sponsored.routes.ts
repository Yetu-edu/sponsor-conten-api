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
 * /sponsor:
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
 *               refContent:
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
sponsoredContentRoutes.post('/sponsor', sponsorController.create);

/**
 * @swagger
 * /sponsor:
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
 * /sponsor/by-type:
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
 * /sponsor:
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
sponsoredContentRoutes.patch('/sponsor', sponsorController.update);

/**
 * @swagger
 * /sponsor/{id}:
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
sponsoredContentRoutes.delete('/sponsor/:id', sponsorController.delete);

export { sponsoredContentRoutes };