const Task = require('../models/Task');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');

/**
 * @desc    Get all tasks with optional filters and pagination
 *          Filters: project, status, assignedTo, priority
 *          Members only see tasks in projects they belong to.
 * @route   GET /api/tasks
 * @access  Protected
 */
const getAllTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query filter
    const filter = {};

    if (req.query.project) filter.project = req.query.project;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.priority) filter.priority = req.query.priority;

    // Members can only see tasks in their projects
    if (req.user.role !== 'admin') {
      const memberProjects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      }).select('_id');

      const projectIds = memberProjects.map((p) => p._id);

      // If a specific project filter was requested, verify membership
      if (filter.project) {
        const hasAccess = projectIds.some((id) => id.toString() === filter.project);
        if (!hasAccess) {
          return next(new AppError('You do not have access to this project.', 403));
        }
      } else {
        filter.project = { $in: projectIds };
      }
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('project', 'name status')
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task (admin only)
 * @route   POST /api/tasks
 * @access  Admin
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } =
      req.body;

    // Verify the project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return next(new AppError('No project found with that ID.', 404));
    }

    // If assignedTo is provided, verify the user is a member of the project
    if (assignedTo) {
      const isMember =
        projectExists.owner.toString() === assignedTo ||
        projectExists.members.some((m) => m.toString() === assignedTo);

      if (!isMember) {
        return next(
          new AppError('Assigned user is not a member of this project.', 400)
        );
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      status,
      priority,
      dueDate,
    });

    await task.populate('project', 'name status');
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Protected (member must belong to the task's project)
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name status members owner')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!task) {
      return next(new AppError('No task found with that ID.', 404));
    }

    // Members can only view tasks in their projects
    if (req.user.role !== 'admin') {
      const project = task.project;
      const isMember =
        project.owner.toString() === req.user._id.toString() ||
        project.members.some((m) => m.toString() === req.user._id.toString());

      if (!isMember) {
        return next(new AppError('You do not have access to this task.', 403));
      }
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 *          - Admin: can update all fields
 *          - Member: can only update the status field
 * @route   PATCH /api/tasks/:id
 * @access  Protected
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      'project',
      'members owner'
    );

    if (!task) {
      return next(new AppError('No task found with that ID.', 404));
    }

    // Members can only update tasks in their projects
    if (req.user.role !== 'admin') {
      const project = task.project;
      const isMember =
        project.owner.toString() === req.user._id.toString() ||
        project.members.some((m) => m.toString() === req.user._id.toString());

      if (!isMember) {
        return next(new AppError('You do not have access to this task.', 403));
      }

      // Members can only change status
      const allowedForMember = ['status'];
      const requestedFields = Object.keys(req.body);
      const hasDisallowedFields = requestedFields.some(
        (f) => !allowedForMember.includes(f)
      );

      if (hasDisallowedFields) {
        return next(
          new AppError('Members can only update the task status.', 403)
        );
      }

      // Validate status value
      if (req.body.status) {
        task.status = req.body.status;
      }
    } else {
      // Admin can update all allowed fields
      const adminAllowedFields = [
        'title',
        'description',
        'assignedTo',
        'status',
        'priority',
        'dueDate',
      ];

      adminAllowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          task[field] = req.body[field];
        }
      });
    }

    await task.save({ runValidators: true });
    await task.populate('project', 'name status');
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task (admin only)
 * @route   DELETE /api/tasks/:id
 * @access  Admin
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return next(new AppError('No task found with that ID.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dashboard statistics
 *          - totalTasks, completedTasks, inProgressTasks, todoTasks
 *          - overdueTasks (dueDate < now AND status !== 'completed')
 *          - tasksByPriority: { low, medium, high }
 *          - recentTasks: last 5 tasks populated with assignedTo name
 *          Members only see stats for their projects.
 * @route   GET /api/tasks/dashboard
 * @access  Protected
 */
const getDashboard = async (req, res, next) => {
  try {
    let projectFilter = {};

    // Scope to member's projects
    if (req.user.role !== 'admin') {
      const memberProjects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      }).select('_id');

      const projectIds = memberProjects.map((p) => p._id);
      projectFilter = { project: { $in: projectIds } };
    }

    const now = new Date();

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      lowPriority,
      mediumPriority,
      highPriority,
      recentTasks,
    ] = await Promise.all([
      Task.countDocuments(projectFilter),
      Task.countDocuments({ ...projectFilter, status: 'completed' }),
      Task.countDocuments({ ...projectFilter, status: 'in-progress' }),
      Task.countDocuments({ ...projectFilter, status: 'todo' }),
      Task.countDocuments({
        ...projectFilter,
        dueDate: { $lt: now },
        status: { $ne: 'completed' },
      }),
      Task.countDocuments({ ...projectFilter, priority: 'low' }),
      Task.countDocuments({ ...projectFilter, priority: 'medium' }),
      Task.countDocuments({ ...projectFilter, priority: 'high' }),
      Task.find(projectFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignedTo', 'name email avatar')
        .populate('project', 'name'),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        tasksByPriority: {
          low: lowPriority,
          medium: mediumPriority,
          high: highPriority,
        },
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboard,
};
