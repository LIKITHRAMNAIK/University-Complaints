import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import universities from '../utils/universities';
import {
  Button, TextField, Select, MenuItem, Box, Typography,
  Paper, Card, CardContent, CardActions, Stack, Modal
} from '@mui/material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    university: '',
    subject: '',
    problem: '',
    solution: '',
    image: null,
  });
  const [comment, setComment] = useState('');
  const [likeLoading, setLikeLoading] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchComplaints();
  }, [user, navigate]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch complaints');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('university', form.university);
    data.append('subject', form.subject);
    data.append('problem', form.problem);
    data.append('solution', form.solution);
    if (form.image) {
      data.append('image', form.image);
    }

    try {
      await axios.post('http://localhost:5000/api/complaints', data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Complaint submitted');
      setForm({
        university: '',
        subject: '',
        problem: '',
        solution: '',
        image: null,
      });
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint');
    }
  };

  const handleLike = async (id) => {
    setLikeLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(`http://localhost:5000/api/complaints/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchComplaints();
    } finally {
      setLikeLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleComment = async (id) => {
    if (!comment.trim()) return;
    setCommentLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(`http://localhost:5000/api/complaints/${id}/comment`, {
        text: comment,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComment('');
      fetchComplaints();
    } finally {
      setCommentLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary">🎓 University Dashboard</Typography>
        <Button variant="outlined" color="secondary" onClick={() => { logout(); navigate('/login'); }}>
          Logout
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 3, mb: 5, backgroundColor: '#fff' }}>
        <Typography variant="h6" gutterBottom color="secondary">Submit a Complaint</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Select
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            displayEmpty
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Select University</MenuItem>
            {universities.map((u) => (
              <MenuItem key={u} value={u}>{u}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Subject"
            fullWidth
            margin="normal"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
          <TextField
            label="Problem"
            fullWidth
            margin="normal"
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            required
          />
          <TextField
            label="Solution"
            fullWidth
            margin="normal"
            value={form.solution}
            onChange={(e) => setForm({ ...form, solution: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            style={{ margin: '16px 0' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            🚀 Submit
          </Button>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom color="primary">📢 All Complaints</Typography>
      {complaints.length === 0 ? (
        <Typography>No complaints submitted yet.</Typography>
      ) : (
        complaints.map((c) => (
          <Card key={c._id} variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">{c.subject} ({c.university})</Typography>
              <Typography variant="body2" color="text.secondary">By: {c.user?.name || 'Unknown'}</Typography>
              <Typography variant="body2">🛠️ Problem: {c.problem}</Typography>
              <Typography variant="body2">✅ Solution: {c.solution}</Typography>
              {c.image && (
                <Box mt={1} mb={1}>
                  <img
                    src={`http://localhost:5000/uploads/${c.image}`}
                    alt="complaint"
                    width={180}
                    style={{ borderRadius: 8, cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedImage(`http://localhost:5000/uploads/${c.image}`);
                      setOpenModal(true);
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ cursor: 'pointer', color: 'blue', mt: 0.5 }}
                    onClick={() => {
                      setSelectedImage(`http://localhost:5000/uploads/${c.image}`);
                      setOpenModal(true);
                    }}
                  >
                    🔍 Full View
                  </Typography>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleLike(c._id)} disabled={likeLoading[c._id]}>
                👍 Like ({c.likes?.length || 0})
              </Button>
              <TextField
                size="small"
                placeholder="Add comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mx: 1, width: 200 }}
              />
              <Button size="small" onClick={() => handleComment(c._id)} disabled={commentLoading[c._id]}>
                💬 Comment
              </Button>
            </CardActions>
            <Box px={2} pb={2}>
              {c.comments?.map((com, idx) => (
                <Typography key={idx} variant="body2" color="text.secondary">
                  <b>{com.user?.name || 'User'}:</b> {com.text}
                </Typography>
              ))}
            </Box>
          </Card>
        ))
      )}

      {/* Image Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 'none',
            maxHeight: '90vh',
            maxWidth: '90vw',
          }}
        >
          <img
            src={selectedImage}
            alt="Full View"
            style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '8px' }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
