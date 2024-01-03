import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Stomp from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import ColorButton from '../../components/ColorButton';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';

const StartScreen = () => {
  const {id} = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [code, setCode] = useState();
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const [players, setPlayers] = useState(storedPlayers);
  const [countPlayers, setCountPlayers] = useState(players.length);
  
  const [countDown, setCountDown] = useState(3);
  const stompClientRef = useRef(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  
  const [timer, setTimer] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentResults, setCurrentResults] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [playerAnswered, setPlayerAnswered] = useState(0);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function generateCode() {
      try {
        const response = await axiosPrivate.post("/quizzes/code/" + id);
        setCode(response.data);
        localStorage.setItem("code", response.data);
      } catch (error) {
        if (!error?.response) {
          console.log("Server is momenteel niet bereikbaar!");
          return;
        } else if (error.response?.status === 401) {
          console.log("U moet ingelogd zijn om dit te kunnen doen!");
          return;
        } else if (error.response?.status === 403) {
          console.log("U heeft niet de juiste toegangsrechten!");
          return;
        } else {
          console.log("Er is iets verkeerd gegaan. Probeer het opnieuw!");
          return;
        }
      }
    }

    async function getQuestions() {
      try {
      const response = await axiosPrivate.get("/questions/" + id);
      setQuestions(response.data);
      } catch (error) {
        if (!error?.response) {
          console.log("Server is momenteel niet bereikbaar!");
          return;
        } else if (error.response?.status === 401) {
          console.log("U moet ingelogd zijn om dit te kunnen doen!");
          return;
        } else if (error.response?.status === 403) {
          console.log("U heeft niet de juiste toegangsrechten!");
          return;
        } else {
          console.log("Er is iets verkeerd gegaan. Probeer het opnieuw!");
          return;
        }
      }
    }

    generateCode();
    getQuestions();
    
    const socket = new SockJS('http://localhost:8081/ws');    
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      var code = localStorage.getItem("code");
      stompClient.send('/app/create', {}, code);
    
      stompClient.subscribe(`/topic/${code}/playerJoined`, (message) => {
          const playerInfo = JSON.parse(message.body);
          
          if (playerInfo.name !== "" && playerInfo.name !== null) {
            setCountPlayers((prevCount) => prevCount + 1);
            setPlayers((prevPlayers) => {
              const updatedPlayers = [...prevPlayers, playerInfo.name];
              localStorage.setItem("players", JSON.stringify(updatedPlayers));
              return updatedPlayers;
            });
          }
      });

      stompClient.subscribe(`/topic/${code}/playerAnswered`, (message) => {
        const check = message.body;

        if (check === "true") {
          setPlayerAnswered((prevAnswered) => prevAnswered + 1)  
        };
      });

      stompClient.subscribe(`/topic/${code}/scores`, (message) => {
        const scores = JSON.parse(message.body);
        const sortedScores = [...scores].sort((a,b) => b.score - a.score);
        setScores(sortedScores);
      });
    });

    return () => {
      stompClient.disconnect();
      stompClientRef.current.disconnect();
    }
  }, [])

  useEffect(() => {
    if (buttonClicked && countDown >= 0) {
      const countdownTimer = setTimeout(updateCountDown, 1000);

      return () => clearTimeout(countdownTimer);
    }
  }, [buttonClicked, countDown]);
  
  useEffect(() => {
    let timerId;
    const totalPlayers = Number(localStorage.getItem("totalPlayers"));

    if (timer > 0 && showQuestion && playerAnswered !== totalPlayers) {
      timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
      
      if (showQuestion && currentQuestionIndex < (questions.length - 1)) {
        setTimer(10);
        setPlayerAnswered(0);
        setShowQuestion(false);
        setCurrentResults(true);
        stompClientRef.current.send(`/app/${code}/questionEnded`, {}, true);   
      } else if(showQuestion) {
        setShowQuestion(false);
        setQuizEnded(true);
        setCurrentResults(true);
        stompClientRef.current.send(`/app/${code}/quizEnded`, {}, true);
      }
    }

    return () => {
      clearInterval(timerId);
    };
  }, [timer, showQuestion]);
  
  const updateCountDown = () => {
    if (countDown > 1) {
      setCountDown((prevCountdown) => prevCountdown - 1);
    } else {
      stompClientRef.current.send('/app/start', {}, `${code},${questions[currentQuestionIndex].correctAnswer}`);
      setButtonClicked(false);
      setShowQuestion(true);
    }
  };

  const startQuiz = () => {
    localStorage.setItem("totalPlayers", Object.keys(players).length)
    const socket = new SockJS('http://localhost:8081/ws');    
    stompClientRef.current = Stomp.over(socket);
    setButtonClicked(true);
  };

  const deleteCode = async () => {
    try {
      await axiosPrivate.delete("/quizzes/code/" + id);
    } catch (error) {
      if (!error?.response) {
        console.log("Server is momenteel niet bereikbaar!");
        return;
      } else if (error.response?.status === 401) {
        console.log("U moet ingelogd zijn om dit te kunnen doen!");
        return;
      } else if (error.response?.status === 403) {
        console.log("U heeft niet de juiste toegangsrechten!");
        return;
      } else {
        console.log("Er is iets verkeerd gegaan. Probeer het opnieuw!");
        return;
      }
    }
  }

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCurrentResults(false);
      setShowQuestion(true);
      stompClientRef.current.send(`/app/${code}/nextQuestion`, {}, `${questions[currentQuestionIndex + 1].correctAnswer}`);
    } else {
      await deleteCode();
      localStorage.removeItem("totalPlayers");
      localStorage.removeItem("players");
      localStorage.removeItem("code");
      navigate("/dashboard");
    }
  };

  return (
    <div className='startScreen'>
      <div className='relative top-20'>
        {buttonClicked ? (
          <div className='flex justify-center items-center min-h-max relative'>
            <div className='relative' style={{fontSize: 30 + 'em'}}>{countDown}</div>
         </div>
        ) : showQuestion ? (
          <div className=''>
            <div className='mb-16'>
              <h4 className='text-4xl text-center mb-5'>{questions[currentQuestionIndex].question}</h4>
              <div className='flex gap-72 justify-center'>
                <h1 className='text-3xl'>Tijd: {timer}</h1>
                <h1 className='text-3xl'>Aantal antwoorden: {playerAnswered}</h1>
              </div>
            </div>
            <div className='flex flex-row justify-center items-center w-full h-72 gap-5'>
              <div className='flex flex-col w-full h-full gap-5'>
                <ColorButton color="red" text={questions[currentQuestionIndex].answer1}/>
                <ColorButton color="green" text={questions[currentQuestionIndex].answer2}/>
              </div>
              <div className='flex flex-col w-full h-full gap-5'>
                <ColorButton color="#b3a227" text={questions[currentQuestionIndex].answer3}/>
                <ColorButton color="blue" text={questions[currentQuestionIndex].answer4}/>
              </div>
            </div>
          </div>
        ) : currentResults ? ( 
          <div className='flex flex-col gap-10'>
            <div className='flex flex-row gap-48 justify-center'>
              <div className='flex flex-col h-full -mt-10 gap-2'>
                <h1 className='text-3xl text-center'>Juiste antwoord was:</h1>
                {
                  questions[currentQuestionIndex].correctAnswer === 1 ? 
                  (
                    <div>
                      {/* <h1 className='text-3xl text-center'>{questions[currentQuestionIndex].answer1}</h1> */}
                      <ColorButton color="red" text={questions[currentQuestionIndex].answer1}/>
                    </div>
                  ) : questions[currentQuestionIndex].correctAnswer === 2 ? (
                    <div><ColorButton color="green" text={questions[currentQuestionIndex].answer2}/></div>
                  ) : questions[currentQuestionIndex].correctAnswer === 3 ? (
                    <div><ColorButton color="#b3a227" text={questions[currentQuestionIndex].answer3}/></div>
                  ) : questions[currentQuestionIndex].correctAnswer === 4 ? (
                    <div><ColorButton color="blue" text={questions[currentQuestionIndex].answer4}/></div>
                  ) : null
                }
              </div>
              { quizEnded ? (
                <Button onClick={() => handleNextQuestion()}>Beëindig quiz</Button>
              ) : (
                <Button onClick={() => handleNextQuestion()}>Volgende vraag</Button>
              )}
            </div>

            <div className='flex flex-col'>
              { quizEnded ? (
                <h1 className='text-3xl text-center mt-10'>Definitieve score:</h1>
              ) : (
                <h1 className='text-3xl text-center mt-10'>Huidige score:</h1>
              )}
              <div className='mt-10'>
                <Table hoverable>
                  <TableHead>
                    <TableHeadCell>Plaats</TableHeadCell>
                    <TableHeadCell>Naam</TableHeadCell>
                    <TableHeadCell>Punten</TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {scores.map((entry, index) => (
                      <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {index + 1}
                        </TableCell>
                        <TableCell className='text-black dark:text-white font-medium'>{entry.playerName}</TableCell>
                        <TableCell className='text-black dark:text-white font-medium'>{entry.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h4 className='text-4xl text-center mb-5'>Quiz Code:</h4>
              <h6 className='text-2xl text-center mb-5'>{code}</h6>
            </div>
            <div className='flex gap-72'>
              <h4 className='text-3xl mt-12 text-center'>Aantal spelers: {countPlayers}</h4>
              <h4 className='text-4xl text-center mt-12 mb-12 ml-32'>Spelers:</h4>
              <Button onClick={() => startQuiz()} className='mb-24 mt-12 ml-12'>Start</Button>
            </div>
            <div className='flex'>
              <div className='flex gap-40 flex-wrap'>
                {players.map((player, index) => (
                  <h4 key={index} className='text-2xl mt-5'>{player}</h4>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StartScreen