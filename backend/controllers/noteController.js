const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    console.log(' Create note request:', req.body);
    console.log('User ID:', req.user.id);
    
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
    
    console.log('Note created successfully:', note._id);
    
    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully'
    });
  } catch (err) {
    console.error(' Create note error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};


exports.getNotes = async (req, res) => {
  try {
    console.log('👤 Fetching notes for user:', req.user.id);
    const { category } = req.query;
    let query = { user: req.user.id };
    
  
    if (category === 'trash') {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true }; 
    }
    
    const notes = await Note.find(query).sort({ createdAt: -1 });
    
    console.log(` Found ${notes.length} notes for user (category: ${category || 'all'})`);
    
    res.json({
      success: true,
      data: notes,
      count: notes.length
    });
  } catch (err) {
    console.error(' Get notes error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.getNote = async (req, res) => {
  try {
    console.log(' Getting note:', req.params.id, 'for user:', req.user.id);
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!note) {
      console.log(' Note not found:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    console.log(' Note found:', note._id);
    
    res.json({
      success: true,
      data: note
    });
  } catch (err) {
    console.error('Get note error:', err.message);
    
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
    console.log(' Updating note:', req.params.id, 'for user:', req.user.id);
    
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
      console.log(' Note not found for update:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    console.log(' Note updated successfully:', note._id);
    
    res.json({
      success: true,
      data: note,
      message: 'Note updated successfully'
    });
  } catch (err) {
    console.error(' Update note error:', err.message);
    
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
    console.log('Deleting note:', req.params.id, 'for user:', req.user.id);
    
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
      console.log(' Note not found for deletion:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    console.log(' Note moved to trash successfully:', req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Note moved to trash successfully',
      deletedNoteId: req.params.id
    });
  } catch (err) {
    console.error(' Delete note error:', err.message);
    
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
    res.json({ 
      success: true, 
      message: 'Note restored successfully' 
    });
  } catch (err) {
    console.error(err.message);
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
    res.json({ 
      success: true, 
      message: 'Note permanently deleted' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.togglePin = async (req, res) => {
  try {
    console.log(' Toggling pin for note:', req.params.id, 'for user:', req.user.id);
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!note) {
      console.log(' Note not found for pin toggle:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    note.pinned = !note.pinned;
    await note.save();
    
    console.log('Pin status updated:', note._id, 'Pinned:', note.pinned);
    
    res.json({
      success: true,
      data: note,
      message: 'Note pin status updated'
    });
  } catch (err) {
    console.error(' Toggle pin error:', err.message);
    
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
    console.log('Toggling important for note:', req.params.id, 'for user:', req.user.id);
    
    if (!req.params.id || req.params.id.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!note) {
      console.log(' Note not found for important toggle:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    note.important = !note.important;
    await note.save();
    
    console.log(' Important status updated:', note._id, 'Important:', note.important);
    
    res.json({
      success: true,
      data: note,
      message: 'Note importance status updated'
    });
  } catch (err) {
    console.error(' Toggle important error:', err.message);
    
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