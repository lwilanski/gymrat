import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useTheme } from '@mui/material/styles';

function Exercises() {
  const theme = useTheme();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/exercises')
      .then(response => response.json())
      .then(data => setExercises(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleDelete = (index) => {
    console.log('Deleting item at index', index);
    // Add deletion logic here
  };

  const handleEdit = (index) => {
    console.log('Editing item at index', index);
    // Add edit logic here
  };

  const handleAdd = () => {
    console.log('Adding a new item');
    // Add add logic here
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: theme.palette.text.third }}>Name</TableCell>
            <TableCell sx={{ color: theme.palette.text.third }} align="right">Difficulty</TableCell>
            <TableCell sx={{ color: theme.palette.text.third }} align="right">Body Part</TableCell>
            <TableCell sx={{ color: theme.palette.text.third }} align="right">Description</TableCell>
            <TableCell align="right">
              <IconButton onClick={handleAdd}>
                <AddBoxIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises.map((exercise, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ color: theme.palette.text.third }} component="th" scope="row">
                {exercise.name}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.third }} align="right">{exercise.difficulty}</TableCell>
              <TableCell sx={{ color: theme.palette.text.third }} align="right">{exercise.body_part}</TableCell>
              <TableCell sx={{ color: theme.palette.text.third }} align="right">{exercise.description}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleEdit(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Exercises;
