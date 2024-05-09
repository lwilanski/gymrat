import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [newExercise, setNewExercise] = useState({
    name: '', difficulty: '', body_part: '', description: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/exercises')
      .then(response => response.json())
      .then(data => {
        setExercises(data);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
        setSnackbar({ open: true, message: 'Failed to fetch exercises', severity: 'error' });
      });
  }, []);

  const handleChange = (prop) => (event) => {
    setNewExercise({ ...newExercise, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    handleAdd(newExercise);
    setOpenForm(false);
    setNewExercise({ name: '', difficulty: '', body_part: '', description: '' });
  };

  const handleAddDialog = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = (exerciseId) => {
    fetch(`http://localhost:8000/exercises/${exerciseId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        setExercises(exercises.filter(ex => ex._id !== exerciseId));
        setSnackbar({ open: true, message: 'Exercise deleted successfully', severity: 'success' });
      })
      .catch(error => {
        console.error('Error deleting exercise:', error);
        setSnackbar({ open: true, message: 'Failed to delete exercise', severity: 'error' });
      });
  };

  const handleEdit = (exerciseId, updatedExercise) => {
    if (!exerciseId) {
      console.error('Exercise ID is undefined');
      return;
    }
    fetch(`http://localhost:8000/exercises/${exerciseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedExercise)
    })
      .then(response => response.json())
      .then(data => {
        const updatedExercises = exercises.map(ex => ex._id === exerciseId ? { ...ex, ...updatedExercise } : ex);
        setExercises(updatedExercises);
        setSnackbar({ open: true, message: 'Exercise updated successfully', severity: 'success' });
      })
      .catch(error => {
        console.error('Error updating exercise:', error);
        setSnackbar({ open: true, message: 'Failed to update exercise', severity: 'error' });
      });
  };

  const handleAdd = (newExercise) => {
    fetch('http://localhost:8000/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExercise)
    })
      .then(response => response.json())
      .then(data => {
        setExercises([...exercises, data]);
        setSnackbar({ open: true, message: 'Exercise added successfully', severity: 'success' });
      })
      .catch(error => {
        console.error('Error adding exercise:', error);
        setSnackbar({ open: true, message: 'Failed to add exercise', severity: 'error' });
      });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              <TableCell align="right">Body Part</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">
                <IconButton onClick={handleAddDialog}>
                  <AddBoxIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise._id}>
                <TableCell component="th" scope="row">{exercise.name}</TableCell>
                <TableCell align="right">{exercise.difficulty}</TableCell>
                <TableCell align="right">{exercise.body_part}</TableCell>
                <TableCell align="right">{exercise.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(exercise._id, exercise)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(exercise._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>Add New Exercise</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth variant="standard" value={newExercise.name} onChange={handleChange('name')} />
          <TextField margin="dense" label="Difficulty" type="text" fullWidth variant="standard" value={newExercise.difficulty} onChange={handleChange('difficulty')} />
          <TextField margin="dense" label="Body Part" type="text" fullWidth variant="standard" value={newExercise.body_part} onChange={handleChange('body_part')} />
          <TextField margin="dense" label="Description" type="text" fullWidth variant="standard" value={newExercise.description} onChange={handleChange('description')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Exercises;
