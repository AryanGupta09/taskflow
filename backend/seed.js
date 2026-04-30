/**
 * Seed Script — populates the database with sample data for development/testing.
 *
 * Creates:
 *   - 1 admin user  (admin@test.com / admin123)
 *   - 2 member users (member1@test.com / member123, member2@test.com / member123)
 *   - 2 projects with members
 *   - 5 tasks spread across the projects
 *
 * Usage: node seed.js
 */

require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  console.log('🌱 Starting seed...');

  // ── Clean existing data ──────────────────────────────────────────────────────
  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});
  console.log('🗑️  Cleared existing data.');

  // ── Create Users ─────────────────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
  });

  const member1 = await User.create({
    name: 'Alice Johnson',
    email: 'member1@test.com',
    password: 'member123',
    role: 'member',
  });

  const member2 = await User.create({
    name: 'Bob Smith',
    email: 'member2@test.com',
    password: 'member123',
    role: 'member',
  });

  console.log('👤 Users created.');

  // ── Create Projects ───────────────────────────────────────────────────────────
  const project1 = await Project.create({
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern UI/UX.',
    owner: admin._id,
    members: [member1._id, member2._id],
    status: 'active',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  const project2 = await Project.create({
    name: 'Mobile App MVP',
    description: 'Build the minimum viable product for the iOS and Android app.',
    owner: admin._id,
    members: [member1._id],
    status: 'active',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
  });

  console.log('📁 Projects created.');

  // ── Create Tasks ──────────────────────────────────────────────────────────────
  await Task.insertMany([
    {
      title: 'Design new homepage mockup',
      description: 'Create Figma mockups for the new homepage layout.',
      project: project1._id,
      assignedTo: member1._id,
      createdBy: admin._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment.',
      project: project1._id,
      assignedTo: member2._id,
      createdBy: admin._id,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Write unit tests for auth module',
      description: 'Achieve 80% code coverage for authentication logic.',
      project: project1._id,
      assignedTo: member2._id,
      createdBy: admin._id,
      status: 'completed',
      priority: 'high',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // already past
    },
    {
      title: 'Define app navigation structure',
      description: 'Map out all screens and navigation flows for the mobile app.',
      project: project2._id,
      assignedTo: member1._id,
      createdBy: admin._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Integrate push notifications',
      description: 'Set up Firebase Cloud Messaging for push notifications.',
      project: project2._id,
      assignedTo: null,
      createdBy: admin._id,
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log('✅ Tasks created.');
  console.log('\n─────────────────────────────────────────');
  console.log('🎉 Seed completed successfully!\n');
  console.log('Credentials:');
  console.log('  Admin   → admin@test.com   / admin123');
  console.log('  Member1 → member1@test.com / member123');
  console.log('  Member2 → member2@test.com / member123');
  console.log('─────────────────────────────────────────\n');

  mongoose.connection.close();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.connection.close();
  process.exit(1);
});
