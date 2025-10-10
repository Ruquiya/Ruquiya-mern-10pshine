const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const auth = require('../middleware/auth');

// @desc    Get all folders for user
// @route   GET /api/folders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create a folder
// @route   POST /api/folders
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, color, date, notes } = req.body;

    if (!name || !color) {
      return res.status(400).json({ success: false, message: 'Folder name and color are required' });
    }

    const folder = new Folder({
      name: name.trim(),
      color,
      date: date || new Date().toLocaleDateString('en-GB'),
      notes: notes || [],
      userId: req.user.id
    });

    const savedFolder = await folder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update a folder
// @route   PUT /api/folders/:id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, color, date, notes } = req.body;
    
    let folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Check if folder belongs to user
    if (folder.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    folder.name = name?.trim() || folder.name;
    folder.color = color || folder.color;
    folder.date = date || folder.date;
    folder.notes = notes || folder.notes;

    const updatedFolder = await folder.save();
    res.json(updatedFolder);
  } catch (error) {
    console.error('Error updating folder:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete a folder
// @route   DELETE /api/folders/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Check if folder belongs to user
    if (folder.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await Folder.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;