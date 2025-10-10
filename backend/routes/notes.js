const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleImportant
} = require('../controllers/noteController');

router.use((req, res, next) => {
  console.log(` Notes route hit: ${req.method} ${req.originalUrl}`);
  console.log(' User:', req.user?.id || 'No user');
  next();
});

router.use(auth);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePin);
router.patch('/:id/important', toggleImportant);

module.exports = router;