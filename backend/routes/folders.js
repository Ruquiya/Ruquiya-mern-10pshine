const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const auth = require('../middleware/auth');
const {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
  addNoteToFolder,
  removeNoteFromFolder
} = require('../controllers/folderController');

// @desc    Get all folders for user
// @route   GET /api/folders
// @access  Private
router.get('/', auth, getFolders);

// @desc    Create a folder
// @route   POST /api/folders
// @access  Private
router.post('/', auth, createFolder);

// @desc    Update a folder
// @route   PUT /api/folders/:id
// @access  Private
router.put('/:id', auth, updateFolder);

// @desc    Delete a folder
// @route   DELETE /api/folders/:id
// @access  Private
router.delete('/:id', auth, deleteFolder);

// @desc    Add note to folder
// @route   POST /api/folders/:folderId/notes
// @access  Private
router.post('/:folderId/notes', auth, addNoteToFolder);

// @desc    Remove note from folder
// @route   DELETE /api/folders/:folderId/notes/:noteId
// @access  Private
router.delete('/:folderId/notes/:noteId', auth, removeNoteFromFolder);

module.exports = router;