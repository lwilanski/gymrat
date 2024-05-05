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
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useTheme } from '@mui/material/styles';

function Exercises() {
  const theme = useTheme();
  const [exercises, setExercises] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    difficulty: '',
    body_part: '',
    description: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/exercises')
      .then(response => response.json())
      .then(data => setExercises(data))
      .catch(error => console.error('Error:', error));
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
  };



  const handleDelete = (exerciseId) => {
    fetch(`http://localhost:8000/exercises/${exerciseId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Delete response:', data);
      setExercises(exercises.filter(ex => ex.id !== exerciseId)); // Remove the exercise from local state
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
      console.log('Edit response:', data);
      const updatedExercises = exercises.map(ex => ex.id === exerciseId ? {...ex, ...updatedExercise} : ex);
      setExercises(updatedExercises); // Update the exercise in the local state
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
      console.log('Success:', data);
      setExercises([...exercises, data]); 
    })
    .catch((error) => {
      console.error('Error:', error);
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
            {exercises.map((exercise, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {exercise.name}
                </TableCell>
                <TableCell align="right">{exercise.difficulty}</TableCell>
                <TableCell align="right">{exercise.body_part}</TableCell>
                <TableCell align="right">{exercise.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(exercise.id, exercise)}> {/* Updated to use ID */}
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(exercise.id)}> {/* Updated to use ID */}
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
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newExercise.name}
            onChange={handleChange('name')}
          />
          <TextField
            margin="dense"
            label="Difficulty"
            type="text"
            fullWidth
            variant="standard"
            value={newExercise.difficulty}
            onChange={handleChange('difficulty')}
          />
          <TextField
            margin="dense"
            label="Body Part"
            type="text"
            fullWidth
            variant="standard"
            value={newExercise.body_part}
            onChange={handleChange('body_part')}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={newExercise.description}
            onChange={handleChange('description')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Exercises;
