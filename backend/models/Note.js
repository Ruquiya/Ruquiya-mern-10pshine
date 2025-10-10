const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  type: { type: String, enum: ['text', 'todo', 'code', 'drawing', 'audio', 'link'], default: 'text' },
  tags: { type: [String], default: [] },
  folder: { type: String, default: 'General' },
  color: { type: String, default: '' },
  pinned: { type: Boolean, default: false },
  important: { type: Boolean, default: false },
  reminder: { 
    date: { type: Date, default: null },
    time: { type: String, default: null },
    isActive: { type: Boolean, default: false }
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
