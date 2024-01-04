import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { HiInformationCircle } from 'react-icons/hi'
import { Alert } from 'flowbite-react';
import getWsUrl from '../../api/websockets';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [quizCode, setQuizCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const wsUrl = getWsUrl();

  const handleJoin = () => {
    if (typeof quizCode === "undefined" || quizCode.match("^[0-9]+$") === null) {
      setError("Code moet uit getallen bestaan!");
      return;
    }

    if (playerName === "") {
      setError("Naam is verplicht!");
      return;
    }

    setError("");

    const socket = new SockJS(wsUrl);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
        stompClient.send(`/app/join/${quizCode}`, {}, playerName);
        stompClient.subscribe(`/topic/${quizCode}/playerJoined`, (response) => {
          const playerInfo = JSON.parse(response.body);
          if (playerInfo.name === "" || playerInfo.name === null) {
            setError("Quiz bestaat niet of naam is al in gebruik!"); 
            return;
          }
          localStorage.setItem("quizCode", quizCode);
          localStorage.setItem("playerName", playerName);
          
          navigate("/quiz/" + quizCode);
      });
    });

    return () => {
      stompClient.disconnect();
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='font-bold text-6xl py-10'>Mahoot</h1>
        {error &&
          <Alert color="failure" icon={HiInformationCircle}>
            {error}
          </Alert>
        }
        <input
          placeholder='Quiz Code'
          className='mb-4 mt-5 px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500'
          type='number'
          value={quizCode}
          onChange={(e) => setQuizCode(e.target.value)}
        />
        <input
          placeholder='Speler Naam'
          className='mb-4 px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500'
          type='text'
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          className='px-4 py-2 mb-5 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'
          type='submit'
          onClick={() => handleJoin()}
        >
          Speel
        </button>
      </div>

      <div className='flex gap-2'>
        <Link to='/inloggen' className='text-indigo-400 text-lg hover:text-indigo-500'>Inloggen</Link>
        <Link to='/registreren' className='text-indigo-400 text-lg hover:text-indigo-500'>Registreren</Link>
      </div>
    </div>
  )
}

export default Home