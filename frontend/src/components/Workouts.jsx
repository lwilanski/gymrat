import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from 'styled-components';
import backgroundImg from '../images/gym.jpeg'; // Replace with your background image path

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Adjust the overlay opacity */
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContainer = styled(Paper)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  width: 100%;
  margin: 2rem 0;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9); /* Make the form container semi-transparent */
`;

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Workouts = () => {
  const theme = useTheme();
  const [workoutPlan, setWorkoutPlan] = useState({
    _id: '',
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
    const user_id = localStorage.getItem('currentUser');
    if (!user_id) {
        console.error('User not authenticated');
        return;
    }

    const workoutToSave = { ...workoutPlan, user_id };

    console.log('Sending workout to save:', JSON.stringify(workoutToSave, null, 2));

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
        setWorkoutPlan({ _id: '', name: '', exercises: [] });
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
      setWorkouts(workouts.filter(workout => workout._id !== workoutId));
    })
    .catch(error => console.error('Error:', error));
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
  };

  const handleUpdateWorkout = () => {
    const workoutToUpdate = { ...editingWorkout };

    fetch(`http://localhost:8000/workouts/${workoutToUpdate._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutToUpdate)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Workout Plan updated:', data);
        setWorkouts(workouts.map(workout => workout._id === data._id ? data : workout));
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
    <Background>
      <Overlay />
      <Content>
        <FormContainer elevation={3}>
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
            <Box key={index} sx={{ marginBottom: 2, display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id={`exercise-label-${index}`}>Exercise Name</InputLabel>
                <Select
                  labelId={`exercise-label-${index}`}
                  value={exercise.exercise_id}
                  label="Exercise Name"
                  onChange={e => handleExerciseChange(index, 'exercise_id', e.target.value)}
                >
                  {availableExercises.map((ex, i) => (
                    <MenuItem key={i} value={ex._id}>{ex.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Reps"
                type="number"
                variant="outlined"
                value={exercise.reps}
                onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
                sx={{ width: '100px' }}
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
          <Button variant="contained" color="primary" onClick={handleAddExercise} sx={{ mb: 2 }}>Add Exercise</Button>
          <Button variant="contained" color="secondary" onClick={handleSavePlan} sx={{ mb: 2 }}>Save Plan</Button>

          <Typography variant="h6" sx={{ marginTop: 4 }}>Existing Workout Plans</Typography>
          <Button variant="outlined" onClick={toggleShowOwnWorkouts} sx={{ marginBottom: 2 }}>
            {showOwnWorkouts ? "Show All Workouts" : "Show My Workouts"}
          </Button>

          <Grid container spacing={3}>
            {filteredWorkouts.map((workout, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6">{workout.name}</Typography>
                    <Typography variant="subtitle2">Created by: {workout.user_id}</Typography>
                    {workout.exercises.map((ex, i) => (
                      <Typography key={i} variant="body2">
                        {availableExercises.find(e => e._id === ex.exercise_id)?.name} - {ex.reps} reps x {ex.sets} sets
                      </Typography>
                    ))}
                  </CardContent>
                  {workout.user_id === currentUser && (
                    <CardActions>
                      <Button startIcon={<EditIcon />} onClick={() => handleEditWorkout(workout)}>Edit</Button>
                      <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteWorkout(workout._id)} color="error">Delete</Button>
                    </CardActions>
                  )}
                </StyledCard>
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
                  <Box key={index} sx={{ marginBottom: 2, display: 'flex', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel id={`edit-exercise-label-${index}`}>Exercise Name</InputLabel>
                      <Select
                        labelId={`edit-exercise-label-${index}`}
                        value={exercise.exercise_id}
                        label="Exercise Name"
                        onChange={e => handleEditExerciseChange(index, 'exercise_id', e.target.value)}
                      >
                        {availableExercises.map((ex, i) => (
                          <MenuItem key={i} value={ex._id}>{ex.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Reps"
                      type="number"
                      variant="outlined"
                      value={exercise.reps}
                      onChange={e => handleEditExerciseChange(index, 'reps', e.target.value)}
                      sx={{ width: '100px' }}
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
        </FormContainer>
      </Content>
    </Background>
  );
}

export default Workouts;
