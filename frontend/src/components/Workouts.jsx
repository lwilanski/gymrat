import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Typography, Box, useTheme, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function Workouts() {
  const theme = useTheme();
  const [workoutPlan, setWorkoutPlan] = useState({
    name: '',
    exercises: []
  });
  const [availableExercises, setAvailableExercises] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/exercises')
      .then(response => response.json())
      .then(data => setAvailableExercises(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleAddExercise = () => {
    setWorkoutPlan(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', reps: 0, sets: 0 }]
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = workoutPlan.exercises.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setWorkoutPlan(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };

  const handleSavePlan = () => {
    console.log('Workout Plan to save:', workoutPlan);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Create Workout Plan</Typography>
      <TextField
        label="Plan Name"
        variant="outlined"
        fullWidth
        value={workoutPlan.name}
        onChange={e => setWorkoutPlan({ ...workoutPlan, name: e.target.value })}
        sx={{ marginBottom: 2, input: { color: theme.palette.text.third } }}
      />
      {workoutPlan.exercises.map((exercise, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <FormControl fullWidth sx={{ marginRight: 1, marginBottom: 1 }}>
            <InputLabel id={`exercise-label-${index}`}>Exercise Name</InputLabel>
            <Select
              labelId={`exercise-label-${index}`}
              value={exercise.name}
              label="Exercise Name"
              onChange={e => handleExerciseChange(index, 'name', e.target.value)}
              sx={{ input: { color: theme.palette.text.third } }}
            >
              {availableExercises.map((ex, i) => (
                <MenuItem 
                  key={i} value={ex.name}>{ex.name}
                  sx={{ input: { color: theme.palette.text.third } }}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Reps"
            type="number"
            variant="outlined"
            value={exercise.reps}
            onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
            sx={{ width: '100px', marginRight: 1, input: { color: theme.palette.text.third } }}
          />
          <TextField
            label="Sets"
            type="number"
            variant="outlined"
            value={exercise.sets}
            onChange={e => handleExerciseChange(index, 'sets', e.target.value)}
            sx={{ width: '100px', input: { color: theme.palette.text.third } }}
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddExercise}>Add Exercise</Button>
      <Button variant="contained" color="secondary" onClick={handleSavePlan} sx={{ float: 'right' }}>Save Plan</Button>
    </Paper>
  );
}

export default Workouts;
