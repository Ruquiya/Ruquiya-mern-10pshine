const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  color: {
    type: String,
    default: ''
  },
  pinned: {
    type: Boolean,
    default: false
  },
  important: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  color: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  notes: [noteSchema],
  noteCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Update noteCount before saving
folderSchema.pre('save', function(next) {
  this.noteCount = this.notes.length;
  next();
});

module.exports = mongoose.model('Folder', folderSchema);