import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import styled from 'styled-components';

const TableTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState({
    _id: '',
    name: '',
    difficulty: '',
    body_part: '',
    description: '',
    user: ''
  });
  const [showMyExercises, setShowMyExercises] = useState(false);
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    fetch('http://localhost:8000/exercises')
      .then(response => response.json())
      .then(data => setExercises(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleChange = (prop) => (event) => {
    setCurrentExercise({ ...currentExercise, [prop]: event.target.value });
  };

  const openAddDialog = () => {
    setIsEditing(false);
    setCurrentExercise({ _id: '', name: '', difficulty: '', body_part: '', description: '', user: currentUser });
    setOpenForm(true);
  };

  const openEditDialog = (exercise) => {
    setIsEditing(true);
    setCurrentExercise(exercise);
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit(currentExercise._id, currentExercise);
    } else {
      handleAdd(currentExercise);
    }
    setOpenForm(false);
  };

  const handleDelete = (exerciseId) => {
    fetch(`http://localhost:8000/exercises/${exerciseId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete exercise');
        }
        return response.json();
      })
      .then(data => {
        setExercises(exercises.filter(ex => ex._id !== exerciseId));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (exerciseId, updatedExercise) => {
    fetch(`http://localhost:8000/exercises/${exerciseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedExercise)
    })
      .then(response => response.json())
      .then(data => {
        const updatedExercises = exercises.map(ex => ex._id === exerciseId ? { ...ex, ...data } : ex);
        setExercises(updatedExercises);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleAdd = (newExercise) => {
    fetch('http://localhost:8000/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExercise)
    })
      .then(response => response.json())
      .then(data => {
        setExercises([...exercises, data]);
      })
      .catch(error => console.error('Error:', error));
  };

  const toggleShowMyExercises = () => {
    setShowMyExercises(prev => !prev);
  };

  const filteredExercises = showMyExercises
    ? exercises.filter(exercise => exercise.user === currentUser)
    : exercises;

  return (
    <>
      <TableTitle>
        <Button variant="outlined" onClick={toggleShowMyExercises}>
          {showMyExercises ? 'Show All Exercises' : 'Show My Exercises'}
        </Button>
        <IconButton color="primary" onClick={openAddDialog}>
          <AddBoxIcon />
        </IconButton>
      </TableTitle>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="exercises table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              <TableCell align="right">Body Part</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Created by</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExercises.map((exercise) => (
              <TableRow key={exercise._id}>
                <TableCell component="th" scope="row">
                  {exercise.name}
                </TableCell>
                <TableCell align="right">{exercise.difficulty}</TableCell>
                <TableCell align="right">{exercise.body_part}</TableCell>
                <TableCell align="right">{exercise.description}</TableCell>
                <TableCell align="right">{exercise.user}</TableCell>
                <TableCell align="right">
                  {exercise.user === currentUser && (
                    <>
                      <IconButton onClick={() => openEditDialog(exercise)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(exercise._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={currentExercise.name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Difficulty"
                type="text"
                fullWidth
                variant="outlined"
                value={currentExercise.difficulty}
                onChange={handleChange('difficulty')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Body Part"
                type="text"
                fullWidth
                variant="outlined"
                value={currentExercise.body_part}
                onChange={handleChange('body_part')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={currentExercise.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Created by"
                type="text"
                fullWidth
                variant="outlined"
                value={currentExercise.user}
                onChange={handleChange('user')}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Exercises;
