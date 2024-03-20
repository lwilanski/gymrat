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

function Exercises() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/exercises')
      .then(response => response.json())
      .then(data => setExercises(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // Przykładowe funkcje obsługi - zaktualizuj je, aby odpowiadały logice Twojej aplikacji
  const handleDelete = (index) => {
    console.log('Usuwanie elementu o indeksie', index);
    // Tutaj logika usuwania
  };

  const handleEdit = (index) => {
    console.log('Edycja elementu o indeksie', index);
    // Tutaj logika edycji
  };

  const handleAdd = () => {
    console.log('Dodawanie nowego elementu');
    // Tutaj logika dodawania
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'primary.main' }}>NAME</TableCell>
            <TableCell sx={{ color: 'primary.main' }} align="right">DIFFICULTY</TableCell>
            <TableCell sx={{ color: 'primary.main' }} align="right">BODY PART</TableCell>
            <TableCell sx={{ color: 'primary.main' }} align="right">
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
              <TableCell sx={{ color: 'primary.main' }} component="th" scope="row">
                {exercise.name}
              </TableCell>
              <TableCell sx={{ color: 'primary.main' }} align="right">{exercise.difficulty}</TableCell>
              <TableCell sx={{ color: 'primary.main' }} align="right">{exercise.body_part}</TableCell>
              <TableCell sx={{ color: 'primary.main' }} align="right">
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
