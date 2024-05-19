import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Typography, Box, useTheme, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Workouts() {
  const theme = useTheme();
  const [workoutPlan, setWorkoutPlan] = useState({
    name: '',
    exercises: []
  });
  const [availableExercises, setAvailableExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [showOwnWorkouts, setShowOwnWorkouts] = useState(true);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    fetch('http://localhost:8000/exercises')
      .then(response => response.json())
      .then(data => setAvailableExercises(data))
      .catch(error => console.error('Error:', error));

    fetch('http://localhost:8000/workouts')
      .then(response => response.json())
      .then(data => setWorkouts(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleAddExercise = () => {
    setWorkoutPlan(prev => ({
      ...prev,
      exercises: [...prev.exercises, { exercise_id: '', reps: 0, sets: 0 }]
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
    const user_id = localStorage.getItem('currentUser'); // Pobierz username z localStorage
    if (!user_id) {
        console.error('User not authenticated');
        return;
    }

    const workoutToSave = { ...workoutPlan, user_id };

    fetch('http://localhost:8000/workouts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutToSave)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Workout Plan saved:', data);
        setWorkouts([...workouts, data]);
        setWorkoutPlan({ name: '', exercises: [] });
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDeleteWorkout = (workoutId) => {
    fetch(`http://localhost:8000/workouts/${workoutId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Delete response:', data);
      setWorkouts(workouts.filter(workout => workout.id !== workoutId));
    })
    .catch(error => console.error('Error:', error));
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
  };

  const handleUpdateWorkout = () => {
    const workoutToUpdate = { ...editingWorkout };

    fetch(`http://localhost:8000/workouts/${workoutToUpdate.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutToUpdate)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Workout Plan updated:', data);
        setWorkouts(workouts.map(workout => workout.id === data.id ? data : workout));
        setEditingWorkout(null);
    })
    .catch(error => console.error('Error:', error));
  };

  const handleCancelEdit = () => {
    setEditingWorkout(null);
  };

  const toggleShowOwnWorkouts = () => {
    setShowOwnWorkouts(!showOwnWorkouts);
  };

  const handleEditExerciseChange = (index, field, value) => {
    const newExercises = editingWorkout.exercises.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setEditingWorkout(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };

  const handleAddExerciseToEdit = () => {
    setEditingWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { exercise_id: '', reps: 0, sets: 0 }]
    }));
  };

  const handleRemoveExerciseFromEdit = (index) => {
    const newExercises = editingWorkout.exercises.filter((_, i) => i !== index);
    setEditingWorkout(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };

  const filteredWorkouts = showOwnWorkouts ? workouts.filter(workout => workout.user_id === currentUser) : workouts;

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Create Workout Plan</Typography>
      <TextField
        label="Plan Name"
        variant="outlined"
        fullWidth
        value={workoutPlan.name}
        onChange={e => setWorkoutPlan({ ...workoutPlan, name: e.target.value })}
        sx={{ marginBottom: 2 }}
      />
      {workoutPlan.exercises.map((exercise, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <FormControl fullWidth sx={{ marginRight: 1, marginBottom: 1 }}>
            <InputLabel id={`exercise-label-${index}`}>Exercise Name</InputLabel>
            <Select
              labelId={`exercise-label-${index}`}
              value={exercise.exercise_id}
              label="Exercise Name"
              onChange={e => handleExerciseChange(index, 'exercise_id', e.target.value)}
            >
              {availableExercises.map((ex, i) => (
                <MenuItem key={i} value={ex.id}>{ex.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Reps"
            type="number"
            variant="outlined"
            value={exercise.reps}
            onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
            sx={{ width: '100px', marginRight: 1 }}
          />
          <TextField
            label="Sets"
            type="number"
            variant="outlined"
            value={exercise.sets}
            onChange={e => handleExerciseChange(index, 'sets', e.target.value)}
            sx={{ width: '100px' }}
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddExercise}>Add Exercise</Button>
      <Button variant="contained" color="secondary" onClick={handleSavePlan} sx={{ float: 'right' }}>Save Plan</Button>

      <Typography variant="h6" sx={{ marginTop: 4 }}>Existing Workout Plans</Typography>
      <Button variant="outlined" onClick={toggleShowOwnWorkouts} sx={{ marginBottom: 2 }}>
        {showOwnWorkouts ? "Show All Workouts" : "Show My Workouts"}
      </Button>

      {filteredWorkouts.map((workout, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{workout.name}</Typography>
            <Typography variant="subtitle2">Created by: {workout.user_id}</Typography>
            {workout.exercises.map((ex, i) => (
              <Typography key={i} variant="body2">
                {availableExercises.find(e => e.id === ex.exercise_id)?.name} - {ex.reps} reps x {ex.sets} sets
              </Typography>
            ))}
          </CardContent>
          {workout.user_id === currentUser && (
            <CardActions>
              <Button startIcon={<EditIcon />} onClick={() => handleEditWorkout(workout)}>Edit</Button>
              <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteWorkout(workout.id)} color="error">Delete</Button>
            </CardActions>
          )}
        </Card>
      ))}

      {editingWorkout && (
        <Dialog open={true} onClose={handleCancelEdit}>
          <DialogTitle>Edit Workout</DialogTitle>
          <DialogContent>
            <TextField
              label="Plan Name"
              variant="outlined"
              fullWidth
              value={editingWorkout.name}
              onChange={e => setEditingWorkout({ ...editingWorkout, name: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            {editingWorkout.exercises.map((exercise, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <FormControl fullWidth sx={{ marginRight: 1, marginBottom: 1 }}>
                  <InputLabel id={`edit-exercise-label-${index}`}>Exercise Name</InputLabel>
                  <Select
                    labelId={`edit-exercise-label-${index}`}
                    value={exercise.exercise_id}
                    label="Exercise Name"
                    onChange={e => handleEditExerciseChange(index, 'exercise_id', e.target.value)}
                  >
                    {availableExercises.map((ex, i) => (
                      <MenuItem key={i} value={ex.id}>{ex.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Reps"
                  type="number"
                  variant="outlined"
                  value={exercise.reps}
                  onChange={e => handleEditExerciseChange(index, 'reps', e.target.value)}
                  sx={{ width: '100px', marginRight: 1 }}
                />
                <TextField
                  label="Sets"
                  type="number"
                  variant="outlined"
                  value={exercise.sets}
                  onChange={e => handleEditExerciseChange(index, 'sets', e.target.value)}
                  sx={{ width: '100px' }}
                />
                <Button onClick={() => handleRemoveExerciseFromEdit(index)} color="error">Remove</Button>
              </Box>
            ))}
            <Button variant="contained" onClick={handleAddExerciseToEdit}>Add Exercise</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleUpdateWorkout} color="primary">Update Workout</Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
}

export default Workouts;
