import express from "express";
import bcrypt from "bcryptjs";
import { connectDB } from "./db/connection.js";
import { Creator, Goal, Message } from "./db/models.js";
import { authenticateToken, generateToken } from "./middleware/auth.js";

export async function registerRoutes(app) {
  // Connect to MongoDB first
  await connectDB();

  console.log('Registering API routes...');

  // Auth Routes
  app.post('/api/signup', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { email, username, password, name } = req.body;

      // Validate input
      if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
      }

      // Check if user already exists
      const existingUser = await Creator.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const creator = await Creator.create({
        email,
        username: username.toLowerCase(),
        password: hashedPassword,
        name: name || username
      });

      // Generate token
      const token = generateToken(creator);

      const response = {
        token,
        user: {
          id: creator._id,
          email: creator.email,
          username: creator.username,
          name: creator.name
        }
      };

      console.log('Signup response:', response);
      return res.status(201).json(response);
    } catch (error) {
      console.error('Signup error:', error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Failed to create account' });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const creator = await Creator.findOne({ email: email.toLowerCase() });

      if (!creator) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, creator.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken(creator);

      const response = {
        token,
        user: {
          id: creator._id,
          email: creator.email,
          username: creator.username,
          name: creator.name
        }
      };

      console.log('Login response:', response);
      return res.json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Creator Profile Routes
  app.get('/api/creator/:username', async (req, res) => {
    try {
      const { username } = req.params;

      const creator = await Creator.findOne({
        username: username.toLowerCase()
      }).select('-password');

      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }

      // Get goals for this creator
      const goals = await Goal.find({ creatorId: creator._id });

      res.json({
        ...creator.toObject(),
        goals
      });
    } catch (error) {
      console.error('Get creator error:', error);
      res.status(500).json({ error: 'Failed to fetch creator' });
    }
  });

  app.put('/api/creator', authenticateToken, async (req, res) => {
    try {
      const { name, bio, upiId, profilePic } = req.body;

      const creator = await Creator.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            name,
            bio,
            upiId,
            ...(profilePic && { profilePic })
          }
        },
        { new: true }
      ).select('-password');

      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }

      res.json(creator);
    } catch (error) {
      console.error('Update creator error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Dashboard Route
  app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
      const creator = await Creator.findById(req.user.id).select('-password');

      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }

      // Get goals
      const goals = await Goal.find({ creatorId: creator._id });

      // Get messages
      const messages = await Message.find({ creatorId: creator._id })
        .sort({ createdAt: -1 });

      // Calculate stats
      const totalMessages = messages.length;
      const uniqueSupporters = new Set(messages.map(m => m.supporterName)).size;
      const totalAmount = messages.reduce((sum, m) => sum + (m.amount || 0), 0);

      res.json({
        creator,
        goals,
        messages,
        stats: {
          totalSupporters: uniqueSupporters,
          totalMessages,
          totalAmount
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Message Routes
  app.post('/api/message', async (req, res) => {
    try {
      const { creatorUsername, supporterName, message, amount } = req.body;

      if (!creatorUsername || !supporterName) {
        return res.status(400).json({ error: 'Creator username and supporter name are required' });
      }

      // Find creator
      const creator = await Creator.findOne({ username: creatorUsername.toLowerCase() });

      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }

      // Create message
      const newMessage = await Message.create({
        creatorId: creator._id,
        supporterName,
        message: message || '',
        amount: amount || 0
      });

      // Update goal progress if amount is provided
      if (amount && amount > 0) {
        const goals = await Goal.find({ creatorId: creator._id });
        if (goals.length > 0) {
          // Update the first incomplete goal
          const incompleteGoal = goals.find(g => g.currentAmount < g.targetAmount);
          if (incompleteGoal) {
            incompleteGoal.currentAmount = Math.min(
              incompleteGoal.currentAmount + amount,
              incompleteGoal.targetAmount
            );
            await incompleteGoal.save();
          }
        }
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Create message error:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  });

  app.get('/api/messages/:username', async (req, res) => {
    try {
      const { username } = req.params;

      const creator = await Creator.findOne({ username: username.toLowerCase() });

      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }

      const messages = await Message.find({ creatorId: creator._id })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // Goal Routes
  app.post('/api/goals', authenticateToken, async (req, res) => {
    try {
      const { title, targetAmount } = req.body;

      if (!title || !targetAmount) {
        return res.status(400).json({ error: 'Title and target amount are required' });
      }

      const goal = await Goal.create({
        creatorId: req.user.id,
        title,
        targetAmount,
        currentAmount: 0
      });

      res.status(201).json(goal);
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  });

  app.put('/api/goals/:goalId', authenticateToken, async (req, res) => {
    try {
      const { goalId } = req.params;
      const { title, targetAmount, currentAmount } = req.body;

      const goal = await Goal.findOneAndUpdate(
        { _id: goalId, creatorId: req.user.id },
        {
          $set: {
            ...(title && { title }),
            ...(targetAmount !== undefined && { targetAmount }),
            ...(currentAmount !== undefined && { currentAmount })
          }
        },
        { new: true }
      );

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      res.json(goal);
    } catch (error) {
      console.error('Update goal error:', error);
      res.status(500).json({ error: 'Failed to update goal' });
    }
  });

  app.delete('/api/goals/:goalId', authenticateToken, async (req, res) => {
    try {
      const { goalId } = req.params;

      const goal = await Goal.findOneAndDelete({
        _id: goalId,
        creatorId: req.user.id
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Delete goal error:', error);
      res.status(500).json({ error: 'Failed to delete goal' });
    }
  });

  console.log('API routes registered successfully');
}