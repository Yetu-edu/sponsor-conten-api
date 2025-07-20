import { Router } from 'express';
import { UserController } from '@/interfaces/controllers/UserController';

const authRouter = Router();
const authController = new UserController();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_ref
 *               - email
 *               - password
 *             properties:
 *               user_ref:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro ao registrar usuário
 */
authRouter.post('/register', (req, res) => authController.register(req, res));

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
authRouter.post('/login', (req, res) => authController.login(req, res));

export { authRouter };