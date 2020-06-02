import { Router } from 'express';
import ForgotPaswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPaswordController = new ForgotPaswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', forgotPaswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
