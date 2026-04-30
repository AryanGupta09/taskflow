const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'archived'],
        message: 'Status must be active, completed, or archived',
      },
      default: 'active',
    },
    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual: count of tasks belonging to this project.
 * Populated via .populate('taskCount') or explicit virtual populate.
 */
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  justOne: false,
});

/**
 * Pre-remove hook (deleteOne / findOneAndDelete):
 * Cascade-delete all tasks that belong to this project.
 */
projectSchema.pre(
  ['deleteOne', 'findOneAndDelete'],
  { document: false, query: true },
  async function (next) {
    const Task = require('./Task');
    const filter = this.getFilter();
    await Task.deleteMany({ project: filter._id });
    next();
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
