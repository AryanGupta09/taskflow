const express = require('express');
const { body } = require('express-validator');
const {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboard,
} = require('../controllers/taskController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// All task routes require authentication
router.use(protect);

/** Validation rules for creating a task */
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('project').notEmpty().withMessage('Project ID is required'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be todo, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
];

// Dashboard must be defined BEFORE /:id to avoid route conflict
router.get('/dashboard', getDashboard);

router
  .route('/')
  .get(getAllTasks)
  .post(restrictTo('admin'), createTaskValidation, validate, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(restrictTo('admin'), deleteTask);

module.exports = router;
