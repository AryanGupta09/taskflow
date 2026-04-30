const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * @desc    Get all projects
 *          - Admin: returns all projects
 *          - Member: returns only projects they are a member of (or own)
 * @route   GET /api/projects
 * @access  Protected
 */
const getAllProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build filter based on role
    let filter = {};
    if (req.user.role !== 'admin') {
      filter = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    }

    // Optional status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('owner', 'name email avatar')
        .populate('members', 'name email avatar')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Project.countDocuments(filter),
    ]);

    // Attach task count for each project
    const projectsWithCount = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        const obj = project.toObject();
        obj.taskCount = taskCount;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: projects.length,
      projects: projectsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new project (admin only)
 * @route   POST /api/projects
 * @access  Admin
 */
const createProject = async (req, res, next) => {
  try {
    const { name, description, members, status, deadline } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: members || [],
      status,
      deadline,
    });

    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single project with populated members and task count
 * @route   GET /api/projects/:id
 * @access  Protected (admin: any project; member: only their projects)
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return next(new AppError('No project found with that ID.', 404));
    }

    // Members can only view projects they belong to
    if (req.user.role !== 'admin') {
      const isMember =
        project.owner._id.toString() === req.user._id.toString() ||
        project.members.some((m) => m._id.toString() === req.user._id.toString());

      if (!isMember) {
        return next(new AppError('You do not have access to this project.', 403));
      }
    }

    const taskCount = await Task.countDocuments({ project: project._id });
    const projectObj = project.toObject();
    projectObj.taskCount = taskCount;

    res.status(200).json({
      success: true,
      project: projectObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a project (admin or project owner)
 * @route   PATCH /api/projects/:id
 * @access  Admin / Project Owner
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('No project found with that ID.', 404));
    }

    // Only admin or the project owner can update
    if (
      req.user.role !== 'admin' &&
      project.owner.toString() !== req.user._id.toString()
    ) {
      return next(new AppError('You do not have permission to update this project.', 403));
    }

    const allowedFields = ['name', 'description', 'status', 'deadline'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save({ runValidators: true });
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project and all its tasks (admin only)
 * @route   DELETE /api/projects/:id
 * @access  Admin
 */
const deleteProject = async (req, res, next) => {
  try {
    // findOneAndDelete triggers the pre-hook that cascades task deletion
    const project = await Project.findOneAndDelete({ _id: req.params.id });

    if (!project) {
      return next(new AppError('No project found with that ID.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Project and all associated tasks deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a member to a project (admin only)
 * @route   POST /api/projects/:id/members
 * @access  Admin
 */
const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return next(new AppError('Please provide a userId.', 400));
    }

    // Verify the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return next(new AppError('No user found with that ID.', 404));
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new AppError('No project found with that ID.', 404));
    }

    // Prevent duplicate members
    if (project.members.some((m) => m.toString() === userId)) {
      return next(new AppError('User is already a member of this project.', 400));
    }

    project.members.push(userId);
    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Member added successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a member from a project (admin only)
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Admin
 */
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('No project found with that ID.', 404));
    }

    const memberIndex = project.members.findIndex(
      (m) => m.toString() === req.params.userId
    );

    if (memberIndex === -1) {
      return next(new AppError('User is not a member of this project.', 404));
    }

    project.members.splice(memberIndex, 1);
    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
