const express = require('express');
const { body } = require('express-validator');
const {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// All project routes require authentication
router.use(protect);

/** Validation rules for creating a project */
const createProjectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 100 })
    .withMessage('Project name cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'archived'])
    .withMessage('Status must be active, completed, or archived'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid ISO 8601 date'),
];

router
  .route('/')
  .get(getAllProjects)
  .post(restrictTo('admin'), createProjectValidation, validate, createProject);

router
  .route('/:id')
  .get(getProjectById)
  .patch(updateProject)
  .delete(restrictTo('admin'), deleteProject);

router
  .route('/:id/members')
  .post(restrictTo('admin'), addMember);

router
  .route('/:id/members/:userId')
  .delete(restrictTo('admin'), removeMember);

module.exports = router;
