import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, Grid } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import backgroundImg from '../images/gym.jpeg';

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
  background: rgba(0, 0, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.9);
`;

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Calendar = () => {
  const theme = useTheme();
  const [calendar, setCalendar] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    fetchWorkouts();
    fetchCalendar();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const fetchCalendar = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/calendars/${currentUser}`);
      setCalendar(response.data || null);
    } catch (error) {
      console.error('Error fetching calendar:', error);
    }
  };

  const handleCreateCalendar = async () => {
    const newCalendar = {
      _id: '',
      user_id: currentUser,
      workouts: []
    };

    console.log('Sending new calendar:', JSON.stringify(newCalendar, null, 2));

    try {
      const response = await axios.post('http://localhost:8000/calendars', newCalendar);
      setCalendar(response.data);
    } catch (error) {
      console.error('Error creating calendar:', error);
    }
  };

  const handleRemoveWorkout = async (workout_id, date) => {
    try {
      const payload = {
        workout_id,
        date: date
      };
      console.log('Sending payload to remove workout from calendar:', JSON.stringify(payload, null, 2));
  
      await axios.put(`http://localhost:8000/calendars/${calendar._id}/workouts/remove`, payload);
      fetchCalendar();
    } catch (error) {
      console.error('Error removing workout from calendar:', error);
    }
  };  
  

  const handleScheduleWorkout = async () => {
    if (!selectedWorkout || !selectedDate) {
      alert('Please select a workout and a date.');
      return;
    }

    const newCalendarWorkout = {
      workout_id: selectedWorkout,
      date: new Date(selectedDate).toISOString(),
    };

    const updatedCalendar = {
      ...calendar,
      workouts: [...calendar.workouts, newCalendarWorkout],
    };

    try {
      await axios.put(`http://localhost:8000/calendars/${calendar._id}`, updatedCalendar);
      setSelectedWorkout('');
      setSelectedDate('');
      setOpenForm(false);
      fetchCalendar();
    } catch (error) {
      console.error('Error scheduling workout:', error);
    }
  };

  const openAddDialog = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  return (
    <Background>
      <Overlay />
      <Content>
        <FormContainer elevation={3}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Calendar</Typography>
          {calendar ? (
            <>
              <Button variant="contained" onClick={openAddDialog}>Schedule Workout</Button>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {calendar.workouts.map((entry, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <StyledCard>
                      <CardContent>
                        <Typography variant="h6">
                          {workouts.find(workout => workout._id === entry.workout_id)?.name}
                        </Typography>
                        <Typography variant="subtitle2">
                          {new Date(entry.date).toLocaleDateString()}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          onClick={() => handleRemoveWorkout(entry.workout_id, entry.date)}
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Button variant="contained" onClick={handleCreateCalendar}>Create Calendar</Button>
          )}
          <Dialog open={openForm} onClose={handleClose}>
            <DialogTitle>Schedule Workout</DialogTitle>
            <DialogContent>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="workout-select-label">Workout</InputLabel>
                <Select
                  labelId="workout-select-label"
                  value={selectedWorkout}
                  label="Workout"
                  onChange={(e) => setSelectedWorkout(e.target.value)}
                >
                  {workouts.map((workout) => (
                    <MenuItem key={workout._id} value={workout._id}>
                      {workout.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleScheduleWorkout} variant="contained">Schedule</Button>
            </DialogActions>
          </Dialog>
        </FormContainer>
      </Content>
    </Background>

  );
}

export default Calendar;
