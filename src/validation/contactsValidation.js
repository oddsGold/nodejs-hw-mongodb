import { check, validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export const validateContactCreate = [
    check('name').notEmpty().withMessage('Name is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('email').optional().isEmail().withMessage('Valid email is required'),
    check('isFavourite').optional(),
    check('contactType').optional(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createHttpError(400, 'Validation failed', { errors: errors.array() }));
        }
        next();
    },
];

export const validateContactUpdate = [
    check('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    check('phoneNumber').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
    check('email').optional().isEmail().withMessage('Valid email is required'),
    check('isFavourite').optional(),
    check('contactType').optional(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createHttpError(400, 'Validation failed', { errors: errors.array() }));
        }
        next();
    },
];
