import { Request, Response } from 'express';
import { registerSchema, checkEmailSchema } from './auth.schemas';
import * as authService from './auth.service';
import { AppError } from './auth.service';
import { success, error, formatZodErrors, internalError } from '../../utils/response';

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json(error('VALIDATION_ERROR', 'Invalid input', formatZodErrors(parsed.error)));
    return;
  }

  try {
    const result = await authService.register(parsed.data);
    res.status(201).json(success(result));
  } catch (err) {
    if (err instanceof AppError && err.code === 'EMAIL_ALREADY_EXISTS') {
      res.status(409).json(error(err.code, err.message));
      return;
    }
    res.status(500).json(internalError(err));
  }
}

export async function checkEmail(req: Request, res: Response): Promise<void> {
  const parsed = checkEmailSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json(error('VALIDATION_ERROR', 'Invalid email format'));
    return;
  }

  try {
    const result = await authService.checkEmailAvailability(parsed.data.email);
    res.status(200).json(success(result));
  } catch (err) {
    res.status(500).json(internalError(err));
  }
}
