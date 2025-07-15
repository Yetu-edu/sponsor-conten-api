import { Router } from 'express';
import { SponsoredContentController } from '@/interfaces/controllers/SponsoredController';
import { ensureAuthenticated } from '@/shared/middleware/authenticate';

const sponsoredContentRoutes = Router();
const controller = new SponsoredContentController();

/**
 * @swagger
 * tags:
 *   name: Sponsored Content
 *   description: Conteúdo patrocinado, como posts ou badges.
 */

/**
 * @swagger
 * /sponsored-content:
 *   post:
 *     summary: Cria um conteúdo patrocinado.
 *     tags: [Sponsored Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - type
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Exemplo de conteúdo patrocinado"
 *               type:
 *                 type: string
 *                 enum: [badge, post]
 *                 example: "badge"
 *     responses:
 *       201:
 *         description: Conteúdo criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Requisição inválida.
 *       401:
 *         description: Token inválido ou ausente.
 *       500:
 *         description: Erro interno no servidor.
 */
sponsoredContentRoutes.post('/sponsored-content', ensureAuthenticated, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /sponsored-content:
 *   get:
 *     summary: Lista os conteúdos patrocinados ativos por tipo.
 *     tags: [Sponsored Content]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [badge, post]
 *         description: O tipo de conteúdo patrocinado a ser listado.
 *     responses:
 *       200:
 *         description: Conteúdos encontrados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Requisição inválida.
 *       404:
 *         description: Nenhum conteúdo encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
sponsoredContentRoutes.get('/sponsored-content', (req, res) => controller.list(req, res));

export { sponsoredContentRoutes };