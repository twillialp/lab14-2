const router = require('express').Router();
const Note  = require('../models/Note');
const { authMiddleware } = require('../middlewares/auth');
 
router.use(authMiddleware);
 
router.get('/', async (req, res) => {
  try {
    console.log(req.user);
    const notes = await Note.find({user: req.user._id});
    console.log(notes);
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});
 
router.put('/:id', async (req, res) => {
  try {
    const noteToUpdate = await Note.findById(req.params.id);
    if (req.user._id !== noteToUpdate.user.toString()) {
        return res.status(403).json({message: "User is not authorized to update this note."})
    }

    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    res.json({ message: 'Note deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});
 
module.exports = router;