const Folder = require('../models/Folder');

exports.createFolder = async (req, res) => {
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
};

exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const { name, color, date, notes } = req.body;
    
    let folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    
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
};

exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

   
    if (folder.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await Folder.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
