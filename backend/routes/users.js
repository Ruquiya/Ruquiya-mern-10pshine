const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/profile', auth, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;