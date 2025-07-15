import { Router } from "express";
import { SubscriptionController } from "@/interfaces/controllers/SubscriptionController";

const subscriptionRoutes = Router();
const controller = new SubscriptionController();

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Cria uma nova subscrição
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *     responses:
 *       201:
 *         description: Subscrição criada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno do servidor
 */
subscriptionRoutes.post("/subscriptions", controller.create);

export { subscriptionRoutes };