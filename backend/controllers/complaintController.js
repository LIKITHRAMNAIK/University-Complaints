import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
  const { university, subject, problem, solution } = req.body;
  const image = req.file ? req.file.filename : null;

  const complaint = await Complaint.create({
    user: req.user._id,
    university,
    subject,
    problem,
    solution,
    image
  });

  res.status(201).json(complaint);
};

export const getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find().populate('user', 'name university').populate('comments.user', 'name');
  res.json(complaints);
};

export const likeComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  if (!complaint.likes.includes(req.user._id)) {
    complaint.likes.push(req.user._id);
    await complaint.save();
  }
  res.json({ likes: complaint.likes.length });
};

export const commentComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  complaint.comments.push({ user: req.user._id, text: req.body.text });
  await complaint.save();
  res.json(complaint.comments);
};
