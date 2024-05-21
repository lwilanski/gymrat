import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, Box } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import backgroundImg from '../images/gym.jpeg';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

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

const FormContainer = styled.div`
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

const Calendar = () => {
  const theme = useTheme();
  const [calendar, setCalendar] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
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

  const fetchExercises = async () => {
    try {
      const response = await axios.get('http://localhost:8000/exercises');
      setAvailableExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const fetchCalendar = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/calendars/${currentUser}`);
      const calendarData = response.data || null;
      setCalendar(calendarData);
      if (calendarData) {
        const events = calendarData.workouts.map(workout => ({
          title: '',
          start: new Date(workout.date),
          end: new Date(workout.date),
          workout_id: workout.workout_id,
          date: workout.date // Adding date to event
        }));
        setEvents(events);
      }
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

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(format(start, 'yyyy-MM-dd'));
    setOpenForm(true);
  };

  const handleEventClick = (event) => {
    const workoutDetails = workouts.find(workout => workout._id === event.workout_id);
    setSelectedEvent({ ...workoutDetails, date: event.date });
  };

  const handleRemoveWorkout = async (workout_id, date) => {
    try {
      const payload = {
        workout_id,
        date
      };
      console.log('Sending payload to remove workout from calendar:', JSON.stringify(payload, null, 2));
  
      await axios.put(`http://localhost:8000/calendars/${calendar._id}/workouts/remove`, payload);
      fetchCalendar();
      handleClose(); // Close the dialog after removing the workout
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
      date: selectedDate,
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

  const handleClose = () => {
    setOpenForm(false);
    setSelectedEvent(null);
  };

  return (
    <Background>
      <Overlay />
      <Content>
        <FormContainer>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Calendar</Typography>
          {calendar ? (
            <>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, width: '100%' }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleEventClick}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: '#FFD700',
                    borderRadius: '50%',
                    opacity: 1,
                    color: 'white',
                    border: '0px',
                    display: 'block',
                    width: '38px',
                    height: '38px',
                    margin: 'auto'
                  }
                })}
              />
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
                disabled
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleScheduleWorkout} variant="contained">Schedule</Button>
            </DialogActions>
          </Dialog>
          {selectedEvent && (
            <Dialog open={!!selectedEvent} onClose={handleClose}>
              <DialogTitle>Workout Details</DialogTitle>
              <DialogContent>
                <Typography variant="h6">{selectedEvent.name}</Typography>
                <Box mt={2}>
                  <Typography variant="h6">Exercises:</Typography>
                  {selectedEvent.exercises.map((exercise, index) => {
                    const exerciseDetails = availableExercises.find(e => e._id === exercise.exercise_id);
                    return (
                      <Typography key={index} variant="body2">
                        {exerciseDetails ? exerciseDetails.name : 'Unknown Exercise'} - {exercise.reps} reps x {exercise.sets} sets
                      </Typography>
                    );
                  })}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleRemoveWorkout(selectedEvent._id, selectedEvent.date)} color="error" variant="contained">Remove</Button>
                <Button onClick={handleClose} variant="contained">Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </FormContainer>
      </Content>
    </Background>
  );
}

export default Calendar;
