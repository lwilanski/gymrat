import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import background from '../images/background.jpg';

const Background = styled.div`
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: white;
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

const Content = styled(Box)`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AnimatedMotto = styled(Typography)`
  animation: fade-in 3s infinite;
  @keyframes fade-in {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
`;

function Home() {
  const [motto, setMotto] = useState("Be Stronger");
  const mottos = ["Become Stronger", "Become Fitter", "Become GymRat"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMotto((prevMotto) => {
        const nextIndex = (mottos.indexOf(prevMotto) + 1) % mottos.length;
        return mottos[nextIndex];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Background>
      <Overlay />
      <Content>
        <Typography variant="h2" component="h1" gutterBottom color="secondary" sx={{ fontWeight: 'bold' }}>
          Welcome to GymRat
        </Typography>
        <AnimatedMotto variant="h4" gutterBottom color="secondary">
          {motto}
        </AnimatedMotto>
      </Content>
    </Background>
  );
}

export default Home;
