import React, { useEffect, useRef, useState } from 'react'
import Loading from '../../components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import ColorButton from '../../components/ColorButton';
import getWsUrl from '../../api/websockets';
import { Button } from 'flowbite-react';

const PlayQuiz = () => {
  const wsUrl = getWsUrl();
  const code = localStorage.getItem("quizCode");
  const {quizCode} = useParams();
  const navigate = useNavigate();
  const stompClientRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [buttons, showButtons] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [waitingOnNextQuestion, setWaitingOnNextQuestion] = useState(false);
  const [serverTime, setServerTime] = useState(0);
  const [answer, setAnswer] = useState(-1);
  const [endQuiz, setEndQuiz] = useState(false);

  useEffect(() => {
    if (quizCode !== code) {
      navigate("/");
    } 
    
    const socket = new SockJS(wsUrl);    
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClientRef.current = stompClient;
      stompClient.subscribe(`/topic/${code}/quizStart`, (message) => {
        const body = message.body;
        const check = body.split(",")[0];
        setServerTime(parseInt(body.split(",")[1]));

        if (check === "true") {
          setLoading(false);
          showButtons(true);
          };
      });
    });

    return () => {
      stompClient.disconnect();
      stompClientRef.current.disconnect();
    }
  }, [])

  const sendAnswer = (answer) => {
    setWaiting(true);
    showButtons(false);
    const localTimeWhenAnswerSubmitted = new Date().getTime();
    const timeElapsed = Math.floor((localTimeWhenAnswerSubmitted - serverTime) / 1000);

    const playerName = localStorage.getItem("playerName");

    stompClientRef.current.send(`/app/${code}/answer`, {}, `${playerName},${answer},${timeElapsed}`);

    stompClientRef.current.subscribe(`/topic/${code}/${playerName}/answer`, (message) => {
      const check = message.body;
      
      if (check === "true") {
        setAnswer(0);
      } else {
        setAnswer(1);
      }
    });

    stompClientRef.current.subscribe(`/topic/${code}/questionEnded`, (message) => {
      const check = message.body;
      
      if (check === "true") {
        setWaiting(false);
        showButtons(false);
        setWaitingOnNextQuestion(true);
        };
    });

    stompClientRef.current.subscribe(`/topic/${code}/nextQuestion`, (message) => {
      const time = parseInt(message.body);
      
      if (time > 0) {
        setServerTime(time);
        setWaitingOnNextQuestion(false);
        showButtons(true); 
        };
    });

    stompClientRef.current.subscribe(`/topic/${code}/quizEnded`, (message) => {
      const check = message.body;
      
      if (check === "true") {
        setWaiting(false);
        showButtons(false);
        setWaitingOnNextQuestion(false);
        setEndQuiz(true);
        localStorage.removeItem("quizCode");
        localStorage.removeItem("playerName");
        };
    });
  }
  
  const quizEnd = () => {
    navigate("/");
  }
  
  return (
    <div>
      <div className='relative top-20'>
        {loading && 
          <div className="flex flex-col flex-wrap items-center justify-center gap-20">
            <h1 className='text-3xl'>Wachten om te beginnen!</h1>
            <Loading size={100}/>
          </div>
        }
        {waiting &&
          <div className="flex flex-col flex-wrap items-center justify-center gap-20">
              <h1 className='text-3xl'>Wachten op andere spelers!</h1>
              <Loading size={100}/>
          </div>
        }
        {waitingOnNextQuestion &&
          <div className="flex flex-col flex-wrap items-center">
            <div className='flex flex-col items-center gap-20'>
              <h1 className='text-3xl'>Wachten op de volgende vraag!</h1>
              <Loading size={100}/>
            </div>
            { answer === 0 ? (
              <div className='flex flex-col gap-10 items-center mt-20'>
                <h1 className='text-3xl'>Uw antwoord was: </h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="green" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                  <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                </svg>
              </div>
            ) : answer === 1 ? (
              <div className='flex flex-col gap-10 items-center mt-20'>
                <h1 className='text-3xl'>Uw antwoord was: </h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="red" className="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                  <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                </svg>
              </div>
            ) : null }
          </div>
        }
        { endQuiz &&
          <div className='flex flex-col items-center'>
            { answer === 0 ? (
              <div className='flex flex-col gap-10 items-center mt-20'>
                <h1 className='text-3xl'>Uw antwoord was: </h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="green" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                  <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                </svg>
              </div>
            ) : answer === 1 ? (
              <div className='flex flex-col gap-10 items-center mt-20'>
                <h1 className='text-3xl'>Uw antwoord was: </h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="red" className="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                  <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                </svg>
              </div>
            ) : null }
            <div className='flex flex-col gap-3 w-max items-center mt-20'>
              <h1 className='text-3xl'>Dit was de quiz!</h1>
              <Button onClick={() => quizEnd()}>Ga naar de homepagina</Button>
            </div>
          </div>
        }
      </div>
      {buttons &&
        <div className='flex flex-row justify-center items-center w-screen h-screen -ml-20 md:-ml-96'>
          <div className='flex flex-col w-full h-full'>
            <ColorButton onClick={() => sendAnswer(1)} color="red"/>
            <ColorButton onClick={() => sendAnswer(2)} color="green"/>
          </div>
          <div className='flex flex-col w-full h-full'>
            <ColorButton onClick={() => sendAnswer(3)} color="#b3a227"/>
            <ColorButton onClick={() => sendAnswer(4)} color="blue"/>
          </div>
      </div>
      }
    </div>
  )
}

export default PlayQuiz