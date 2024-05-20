import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

function Workouts() {
  const [workoutPlan, setWorkoutPlan] = useState({ name: '', exercises: [] });
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
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center' }}>Workout Plans</Typography>
      <Box sx={{ marginBottom: 3 }}>
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
          <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id={`exercise-label-${index}`}>Exercise</InputLabel>
                <Select
                  labelId={`exercise-label-${index}`}
                  value={exercise.exercise_id}
                  label="Exercise"
                  onChange={e => handleExerciseChange(index, 'exercise_id', e.target.value)}
                >
                  {availableExercises.map((ex, i) => (
                    <MenuItem key={i} value={ex.id}>{ex.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Reps"
                type="number"
                variant="outlined"
                fullWidth
                value={exercise.reps}
                onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Sets"
                type="number"
                variant="outlined"
                fullWidth
                value={exercise.sets}
                onChange={e => handleExerciseChange(index, 'sets', e.target.value)}
              />
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddExercise} sx={{ marginBottom: 2 }}>Add Exercise</Button>
        <Button variant="contained" color="primary" onClick={handleSavePlan} sx={{ float: 'right' }}>Save Plan</Button>
      </Box>

      <Typography variant="h5" sx={{ marginBottom: 2 }}>Existing Workout Plans</Typography>
      <Button variant="outlined" onClick={toggleShowOwnWorkouts} sx={{ marginBottom: 3 }}>
        {showOwnWorkouts ? "Show All Workouts" : "Show My Workouts"}
      </Button>

      <Grid container spacing={3}>
        {filteredWorkouts.map((workout, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{workout.name}</Typography>
                <Typography variant="subtitle2" color="textSecondary">Created by: {workout.user_id}</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Exercise</TableCell>
                        <TableCell>Reps</TableCell>
                        <TableCell>Sets</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workout.exercises.map((ex, i) => (
                        <TableRow key={i}>
                          <TableCell>{availableExercises.find(e => e.id === ex.exercise_id)?.name}</TableCell>
                          <TableCell>{ex.reps}</TableCell>
                          <TableCell>{ex.sets}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
              {workout.user_id === currentUser && (
                <CardActions>
                  <Button startIcon={<EditIcon />} onClick={() => handleEditWorkout(workout)}>Edit</Button>
                  <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteWorkout(workout.id)} color="error">Delete</Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

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
              <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id={`edit-exercise-label-${index}`}>Exercise</InputLabel>
                    <Select
                      labelId={`edit-exercise-label-${index}`}
                      value={exercise.exercise_id}
                      label="Exercise"
                      onChange={e => handleEditExerciseChange(index, 'exercise_id', e.target.value)}
                    >
                      {availableExercises.map((ex, i) => (
                        <MenuItem key={i} value={ex.id}>{ex.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Reps"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={exercise.reps}
                    onChange={e => handleEditExerciseChange(index, 'reps', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Sets"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={exercise.sets}
                    onChange={e => handleEditExerciseChange(index, 'sets', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={() => handleRemoveExerciseFromEdit(index)} color="error">Remove</Button>
                </Grid>
              </Grid>
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
