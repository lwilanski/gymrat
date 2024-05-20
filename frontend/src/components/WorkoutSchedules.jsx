import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from '@mui/material';
import axios from 'axios';

function WorkoutSchedules() {
  const [workouts, setWorkouts] = useState([]);
  const [schedule, setSchedule] = useState({ workout_id: '', date: '' });
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    fetchWorkouts();
    fetchUpcomingWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const fetchUpcomingWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/workout-schedules');
      const today = new Date().toISOString().split('T')[0];
      const upcoming = response.data.filter(schedule => schedule.date >= today);
      setUpcomingWorkouts(upcoming);
    } catch (error) {
      console.error('Error fetching upcoming workouts:', error);
    }
  };

  const handleScheduleChange = (field, value) => {
    setSchedule({ ...schedule, [field]: value });
  };

  const handleScheduleWorkout = async () => {
    const workoutToSchedule = { ...schedule, user_id: currentUser };

    try {
      await axios.post('http://localhost:8000/workout-schedules', workoutToSchedule);
      setSchedule({ workout_id: '', date: '' });
      setOpenForm(false);
      fetchUpcomingWorkouts();
    } catch (error) {
      console.error('Error scheduling workout:', error);
    }
  };

  const openAddDialog = () => {
    setSchedule({ workout_id: '', date: '' });
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Schedule Workout</Typography>
      <Button variant="contained" color="primary" onClick={openAddDialog}>Add Schedule</Button>

      <Typography variant="h6" sx={{ marginTop: 4 }}>Upcoming Workouts</Typography>
      <ul>
        {upcomingWorkouts.map((workout, index) => (
          <li key={index}>
            {workout.date}: {workouts.find(w => w.id === workout.workout_id)?.name}
          </li>
        ))}
      </ul>

      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>Schedule Workout</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="workout-select-label">Workout Plan</InputLabel>
            <Select
              labelId="workout-select-label"
              value={schedule.workout_id}
              label="Workout Plan"
              onChange={e => handleScheduleChange('workout_id', e.target.value)}
            >
              {workouts.map((workout, i) => (
                <MenuItem key={i} value={workout.id}>{workout.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            value={schedule.date}
            onChange={e => handleScheduleChange('date', e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleScheduleWorkout} color="primary">Schedule</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default WorkoutSchedules;
