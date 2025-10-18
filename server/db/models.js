import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    default: ''
  },
  posts: [{
    title: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const goalSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creator',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const messageSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creator',
    required: true
  },
  supporterName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export const Creator = mongoose.models.Creator || mongoose.model('Creator', creatorSchema);
export const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
