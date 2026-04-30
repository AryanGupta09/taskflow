const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware that reads express-validator results and short-circuits
 * the request with a 400 response if any validation errors exist.
 *
 * Usage: place after your validation chain in a route definition.
 *
 * @example
 * router.post('/register', registerValidation, validate, authController.register);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
