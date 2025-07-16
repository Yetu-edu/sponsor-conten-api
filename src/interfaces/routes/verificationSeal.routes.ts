import { Router } from 'express';
import { VerificationSealController } from '@/interfaces/controllers/VerifySealController';
import { ensureAuthenticated } from '@/shared/middleware/authenticate';

const verificationSealRoutes = Router();
const controller = new VerificationSealController();

/**
 * @swagger
 * tags:
 *   name: Verificação de selo
 *   description: Gerenciamento do selo de verificação dos usuários
 */

/**
 * @swagger
 * /api/v1/verification-seal:
 *   post:
 *     summary: Cria um novo selo de verificação para um usuário
 *     tags: [VerificationSeal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Selo criado com sucesso
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro interno do servidor
 */
verificationSealRoutes.post('/verification-seal', controller.create);

/**
 * @swagger
 * /api/v1/verification-seal/verify:
 *   patch:
 *     summary: Verifica o usuário (ativa o selo)
 *     tags: [VerificationSeal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Selo verificado
 *       404:
 *         description: Selo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
verificationSealRoutes.patch('/verification-seal/verify', controller.verify);

/**
 * @swagger
 * /api/v1/verification-seal/unverify:
 *   patch:
 *     summary: Remove a verificação do usuário
 *     tags: [VerificationSeal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Selo desverificado
 *       404:
 *         description: Selo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
verificationSealRoutes.patch('/verification-seal/unverify', controller.unverify);

/**
 * @swagger
 * /api/v1/verification-seal/user/{user_id}:
 *   get:
 *     summary: Retorna o selo de verificação de um usuário
 *     tags: [VerificationSeal]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Selo encontrado
 *       404:
 *         description: Selo não encontrado
 */
verificationSealRoutes.get('/verification-seal/user/:user_id', controller.findByUserId);

/**
 * @swagger
 * /api/v1/verification-seal/verified/{user_id}:
 *   get:
 *     summary: Verifica se o usuário está verificado
 *     tags: [VerificationSeal]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Status de verificação retornado
 *       404:
 *         description: Selo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
verificationSealRoutes.get('/verification-seal/verified/:user_id', controller.isVerified);

/**
 * @swagger
 * /api/v1/verification-seal:
 *   get:
 *     summary: Retorna todos os selos de verificação
 *     tags: [VerificationSeal]
 *     responses:
 *       200:
 *         description: Lista de selos retornada
 *       500:
 *         description: Erro interno do servidor
 */
verificationSealRoutes.get('/verification-seal', controller.getAll);

export { verificationSealRoutes };