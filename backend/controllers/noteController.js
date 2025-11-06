const Note = require('../models/Note');
const logger = require('../utils/logger');

exports.createNote = async (req, res) => {
  try {
    req.log && req.log.info({ bodyKeys: Object.keys(req.body || {}), userId: req.user.id }, 'Create note request');
    
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      type: req.body.type || 'text',
      tags: req.body.tags || [],
      folder: req.body.folder || 'General',
      color: req.body.color || '',
      pinned: req.body.pinned || false,
      important: req.body.important || false,
      reminder: {
        date: req.body.reminder?.date || null,
        time: req.body.reminder?.time || null,
        isActive: req.body.reminder?.isActive || false
      },
      user: req.user.id
    });

    await note.save();
    
    req.log && req.log.info({ noteId: note._id }, 'Note created successfully');
    
    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully'
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id }, 'Create note error');
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};


exports.getNotes = async (req, res) => {
  try {
    req.log && req.log.info({ userId: req.user.id, category: req.query.category }, 'Fetching notes for user');
    const { category } = req.query;
    let query = { user: req.user.id };
    
  
    if (category === 'trash') {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true }; 
    }
    
    const notes = await Note.find(query).sort({ createdAt: -1 });
    
    req.log && req.log.info({ count: notes.length, category: category || 'all' }, 'Fetched notes');
    
    res.json({
      success: true,
      data: notes,
      count: notes.length
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id }, 'Get notes error');
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.getNote = async (req, res) => {
  try {
    req.log && req.log.info({ noteId: req.params.id, userId: req.user.id }, 'Getting note');
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!note) {
      req.log && req.log.warn({ noteId: req.params.id }, 'Note not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    req.log && req.log.info({ noteId: note._id }, 'Note found');
    
    res.json({
      success: true,
      data: note
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id, noteId: req.params?.id }, 'Get note error');
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.updateNote = async (req, res) => {
  try {
    req.log && req.log.info({ noteId: req.params.id, userId: req.user.id }, 'Updating note');
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      req.log && req.log.warn({ noteId: req.params.id }, 'Note not found for update');
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    req.log && req.log.info({ noteId: note._id }, 'Note updated successfully');
    
    res.json({
      success: true,
      data: note,
      message: 'Note updated successfully'
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id, noteId: req.params?.id }, 'Update note error');
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    req.log && req.log.info({ noteId: req.params.id, userId: req.user.id }, 'Deleting note');
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        isDeleted: true, 
        deletedAt: new Date() 
      },
      { new: true }
    );
    
    if (!note) {
      req.log && req.log.warn({ noteId: req.params.id }, 'Note not found for deletion');
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    req.log && req.log.info({ noteId: req.params.id }, 'Note moved to trash successfully');
    
    res.json({ 
      success: true, 
      message: 'Note moved to trash successfully',
      deletedNoteId: req.params.id
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id, noteId: req.params?.id }, 'Delete note error');
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.restoreNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        isDeleted: false, 
        deletedAt: null 
      },
      { new: true }
    );
    if (!note) return res.status(404).json({ 
      success: false, 
      message: 'Note not found' 
    });
    req.log && req.log.info({ noteId: req.params.id }, 'Note restored successfully');
    res.json({ 
      success: true, 
      message: 'Note restored successfully' 
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id, noteId: req.params?.id }, 'Restore note error');
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.permanentDeleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ 
      success: false, 
      message: 'Note not found' 
    });
    req.log && req.log.info({ noteId: req.params.id }, 'Note permanently deleted');
    res.json({ 
      success: true, 
      message: 'Note permanently deleted' 
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id, noteId: req.params?.id }, 'Permanent delete note error');
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.togglePin = async (req, res) => {
  try {
    req.log && req.log.info({ noteId: req.params.id, userId: req.user.id }, 'Toggling pin for note');
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!note) {
      req.log && req.log.warn({ noteId: req.params.id }, 'Note not found for pin toggle');
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    note.pinned = !note.pinned;
    await note.save();
    
    req.log && req.log.info({ noteId: note._id, pinned: note.pinned }, 'Pin status updated');
    
    res.json({
      success: true,
      data: note,
      message: 'Note pin status updated'
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id, noteId: req.params?.id }, 'Toggle pin error');
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.toggleImportant = async (req, res) => {
  try {
    req.log && req.log.info({ noteId: req.params.id, userId: req.user.id }, 'Toggling important for note');
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!note) {
      req.log && req.log.warn({ noteId: req.params.id }, 'Note not found for important toggle');
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    note.important = !note.important;
    await note.save();
    
    req.log && req.log.info({ noteId: note._id, important: note.important }, 'Important status updated');
    
    res.json({
      success: true,
      data: note,
      message: 'Note importance status updated'
    });
  } catch (err) {
    (req.log || logger).error({ err, userId: req.user?.id, noteId: req.params?.id }, 'Toggle important error');
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};