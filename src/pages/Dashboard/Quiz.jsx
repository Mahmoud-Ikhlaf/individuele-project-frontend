import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Modal, Label, TextInput, Dropdown, DropdownItem, Alert } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiInformationCircle } from 'react-icons/hi'
import { MdDelete, MdOutlineEdit } from "react-icons/md"

const Quiz = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState({ title: '', description: '', user: {username: ''}});
  const [vraag, setVraag] = useState('');
  const [antwoord1, setAntwoord1] = useState('');
  const [antwoord2, setAntwoord2] = useState('');
  const [antwoord3, setAntwoord3] = useState('');
  const [antwoord4, setAntwoord4] = useState('');
  const [titel, setTitel] = useState('');
  const [beschrijving, setBeschrijving] = useState('');

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditQuizModal, setOpenEditQuizModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [dropDown, setDropDown] = useState('');
  const [error, setError] = useState('');
  const [errorDelete, setErrorDelete] = useState('');
  const [errorEditQuiz, setErrorEditQuiz] = useState('');
  const [errorEditQuestion, setErrorEditQuestion] = useState('');
  const [deleteId, setDeleteId] = useState();
  const [questionId, setQuestionId] = useState();
  
  useEffect(() => {
    getQuiz();
    getQuestions();
  }, [])

  const getQuiz = async () => {
    try {
      const response = await axiosPrivate.get("/quizzes/" + id);
      setTitel(response.data.title);
      setBeschrijving(response.data.description);
      setQuiz(response.data);
    } catch (error) {
      if (!error?.response) {
        console.log("Server is momenteel niet bereikbaar!");
        return;
      } else if (error.response?.status === 401) {
        console.log("U moet ingelogd zijn om dit te kunnen doen!");
        return;
      } else if (error.response?.status === 403) {
        navigate("/dashboard/quiz");
      } else {
        console.log("Er is iets verkeerd gegaan. Probeer het opnieuw!");
        return;
      }
    }
  }

  const getQuestions = async () => {
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

  const editQuizButton = () => {
    setErrorEditQuiz("");
    setOpenEditQuizModal(true);
  }

  const editQuestionButton = (id) => {
    setErrorEditQuestion("");
    const questionToSet = questions.find((question) => question.id === id);
    if (questionToSet) {
      setVraag(questionToSet.question);
      setAntwoord1(questionToSet.answer1);
      setAntwoord2(questionToSet.answer2);
      setAntwoord3(questionToSet.answer3);
      setAntwoord4(questionToSet.answer4);
      setDropDown(questionToSet.correctAnswer);
    }
    setQuestionId(id);
    setOpenEditModal(true);
  }

  const editQuiz = async () => {
    try {
      await axiosPrivate.put("/quizzes/" + id, 
        JSON.stringify({ title: titel, description: beschrijving })
      );
      getQuiz();
      setOpenEditQuizModal(false);
    } catch (error) {
      if (!error?.response) {
        setErrorEditQuiz("Server is momenteel niet bereikbaar!");
        return;
      } else if (error.response?.status === 401) {
        setErrorEditQuiz("U moet ingelogd zijn om dit te kunnen doen!");
        return;
      } else if (error.response?.status === 403) {
        setErrorEditQuiz("U heeft niet de juiste toegangsrechten!");
        return;
      } else if (error.response?.status === 409) {
        setErrorEditQuiz("Titel bestaat al!");
        return; 
      } else {
        setErrorEditQuiz("Er is iets verkeerd gegaan. Probeer het opnieuw!");
        return;
      }
    }
  }

  const editQuestion = async () => {
    try {
      await axiosPrivate.put("/questions/" + questionId, 
        JSON.stringify({ 
          question: vraag, 
          answer1: antwoord1,
          answer2: antwoord2,
          answer3: antwoord3,
          answer4: antwoord4,
          correctAnswer: dropDown,
          quizId: id
        })
      );
      getQuestions();
      setOpenEditModal(false);
    } catch (error) {
      if (!error?.response) {
        setErrorEditQuiz("Server is momenteel niet bereikbaar!");
        return;
      } else if (error.response?.status === 401) {
        setErrorEditQuiz("U moet ingelogd zijn om dit te kunnen doen!");
        return;
      } else if (error.response?.status === 403) {
        setErrorEditQuiz("U heeft niet de juiste toegangsrechten!");
        return;
      } else if (error.response?.status === 409) {
        setErrorEditQuiz("Titel bestaat al!");
        return; 
      } else {
        setErrorEditQuiz("Er is iets verkeerd gegaan. Probeer het opnieuw!");
        return;
      }
    }
  }

  const deleteButton = (id) => {
    setErrorDelete("");
    setOpenDeleteModal(true);
    setDeleteId(id);
  }

  const deleteQuestion = async () => {
    try {
      await axiosPrivate.delete("/questions/" + deleteId);
      setQuestions((prevQuestions) => prevQuestions.filter(question => question.id !== deleteId));
      setOpenDeleteModal(false);
    } catch (error) {
      if (!error?.response) {
        console.log(error);
        setErrorDelete("Server is momenteel niet bereikbaar!");
        return;
      } else if (error.response?.status === 401) {
        setErrorDelete("U moet ingelogd zijn om dit te kunnen doen!");
        return;
      } else if (error.response?.status === 403) {
        setErrorDelete("U heeft niet de juiste toegangsrechten!");
        return;
      } else {
        setErrorDelete("Er is iets verkeerd gegaan. Probeer het opnieuw!");
        return;
      }
    }
  }

  const createNewQuestion = async () => {
    setError('');

    try {
      const response = await axiosPrivate.post("/questions", 
        JSON.stringify({ question: vraag, answer1: antwoord1, answer2: antwoord2, answer3: antwoord3, answer4: antwoord4, correctAnswer: dropDown, quizId: quiz.id })
      );
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);
      setOpenNewModal(false);
    } catch (error) {
      if (!error?.response) {
        setError("Server is momenteel niet bereikbaar!");
        return;
      } else if (error.response?.status === 401) {
        setError("U moet ingelogd zijn om dit te kunnen doen!");
        return;
      } else if (error.response?.status === 409) {
        setError("Titel bestaat al!");
        return;
      } else {
        setError("Er is iets verkeerd gegaan. Probeer het opnieuw!");
        return;
      }
    }
  }

  const newQuestion = () => {
    clearModal();
    setOpenNewModal(true);
  }

  const clearModal = () => {
    setVraag('');
    setAntwoord1('');
    setAntwoord2('');
    setAntwoord3('');
    setAntwoord4('');
    setDropDown('');
  }

  return (
    <div className="quiz">
      <div className='relative top-20'>
        <h4 className='text-4xl text-center mb-5'>Jouw gemaakte quiz:</h4>
        <Table hoverable>
          <TableHead>
            <TableHeadCell>Naam</TableHeadCell>
            <TableHeadCell>Auteur</TableHeadCell>
            <TableHeadCell>Beschrijving</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            <TableRow key={quiz.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {quiz.title}
              </TableCell>
              <TableCell>{quiz.user.username}</TableCell>
              <TableCell>{quiz.description}</TableCell>
              <TableCell className='flex'>
                <MdOutlineEdit className="mx-2 h-5 w-5 text-gray-400 dark:text-gray-200"></MdOutlineEdit>
                <a onClick={() => editQuizButton()} className="font-medium text-cyan-600 hover:underline cursor-pointer dark:text-cyan-500">
                  Bewerken
                </a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className='relative top-40'>
        <h4>Nieuwe vraag? <Button onClick={() => newQuestion()}>Klik hier</Button></h4>
        {questions.length > 0 ? (
          <><h4 className='text-4xl text-center mb-5'>Jouw gemaakte vragen:</h4>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Vraag</TableHeadCell>
              <TableHeadCell>Antwoord 1</TableHeadCell>
              <TableHeadCell>Antwoord 2</TableHeadCell>
              <TableHeadCell>Antwoord 3</TableHeadCell>
              <TableHeadCell>Antwoord 4</TableHeadCell>
              <TableHeadCell>Juiste antwoord</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {questions.map((question) => (
                <TableRow key={question.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {question.question}
                  </TableCell>
                  <TableCell>{question.answer1}</TableCell>
                  <TableCell>{question.answer2}</TableCell>
                  <TableCell>{question.answer3}</TableCell>
                  <TableCell>{question.answer4}</TableCell>
                  <TableCell>{question.correctAnswer}</TableCell>
                  <TableCell className='flex'>
                    <MdOutlineEdit className="mx-2 h-5 w-5 text-gray-400 dark:text-gray-200"></MdOutlineEdit>
                    <a onClick={() => editQuestionButton(question.id)} className="font-medium text-cyan-600 hover:underline cursor-pointer dark:text-cyan-500">
                      Bewerken
                    </a>
                  </TableCell>
                  <TableCell className='flex'>
                    <MdDelete className="mx-2 h-5 w-5 text-gray-400 dark:text-gray-200"></MdDelete>
                    <a onClick={() => deleteButton(question.id)} className="font-medium text-cyan-600 hover:underline cursor-pointer dark:text-cyan-500">
                      Verwijderen
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></>
        ) : (
          <h4 className='text-4xl text-center mb-5'>U heeft nog geen vragen gemaakt!</h4>
        )}
      </div>

      <Modal className='deleteModal' show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {errorDelete &&
              <Alert color="failure" icon={HiInformationCircle}>
                {errorDelete}
              </Alert>
            }
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Weet je zeker dat je de quiz wil verwijderen?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => deleteQuestion()}>
                {"Ja"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                Nee
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal className='editModal' show={openEditModal} size="3xl" onClose={() => setOpenEditModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">Bewerk je vraag</h3>
            {errorEditQuestion &&
                <Alert color="failure" icon={HiInformationCircle}>
                  {errorEditQuestion}
                </Alert>
              }
            <div className='flex flex-row gap-5 flex-wrap'>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="vraag" value="Vraag" />
                </div>
                <TextInput
                  id="vraag"
                  value={vraag}
                  onChange={(event) => setVraag(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="antwoord1" value="Antwoord 1" />
                </div>
                <TextInput
                  id="antwoord1"
                  value={antwoord1}
                  onChange={(event) => setAntwoord1(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="antwoord2" value="Antwoord 2" />
                </div>
                <TextInput
                  id="antwoord2"
                  value={antwoord2}
                  onChange={(event) => setAntwoord2(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="antwoord3" value="Antwoord 3" />
                </div>
                <TextInput
                  id="antwoord3"
                  value={antwoord3}
                  onChange={(event) => setAntwoord3(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="antwoord4" value="Antwoord 4" />
                </div>
                <TextInput
                  id="antwoord4"
                  value={antwoord4}
                  onChange={(event) => setAntwoord4(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="titel" value="Juiste antwoord" />
                </div>
                <Dropdown label={dropDown} dismissOnClick={true} >
                  <DropdownItem onClick={() => setDropDown('1')}>1</DropdownItem>
                  <DropdownItem onClick={() => setDropDown('2')}>2</DropdownItem>
                  <DropdownItem onClick={() => setDropDown('3')}>3</DropdownItem>
                  <DropdownItem onClick={() => setDropDown('4')}>4</DropdownItem>
                </Dropdown>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <Button onClick={() => editQuestion()}>Opslaan</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal className='editQuizModal' show={openEditQuizModal} size="md" onClose={() => setOpenEditQuizModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">Bewerk je quiz</h3>
              {errorEditQuiz &&
                <Alert color="failure" icon={HiInformationCircle}>
                  {errorEditQuiz}
                </Alert>
              }
              <div className='mb-3'>
                <div className="mb-2 block">
                  <Label htmlFor="titel" value="Titel van de quiz" />
                </div>
                <TextInput
                  id="titel"
                  value={titel}
                  onChange={(event) => setTitel(event.target.value)}
                  required
                />
              </div>
              <div className='mb-3'>
                <div className="mb-2 block">
                  <Label htmlFor="beschrijving" value="Beschrijving van de quiz" />
                </div>
                <TextInput 
                  id="beschrijving" 
                  type="text" 
                  value={beschrijving}
                  onChange={(event) => setBeschrijving(event.target.value)}
                  required 
                />
              </div>
              <div className="w-full flex justify-center">
                <Button onClick={() => editQuiz()}>Bewerk</Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal className='newModal' show={openNewModal} size="3xl" onClose={() => setOpenNewModal(false)} popup dismissible>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-center underline-offset-2 text-gray-900 dark:text-white">Maak een nieuwe vraag aan</h3>
              {error &&
                <Alert color="failure" icon={HiInformationCircle}>
                  {error}
                </Alert>
              }
              <div className='flex flex-row gap-5 flex-wrap'>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="vraag" value="Vraag" />
                  </div>
                  <TextInput
                    id="vraag"
                    value={vraag}
                    onChange={(event) => setVraag(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="antwoord1" value="Antwoord 1" />
                  </div>
                  <TextInput
                    id="antwoord1"
                    value={antwoord1}
                    onChange={(event) => setAntwoord1(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="antwoord2" value="Antwoord 2" />
                  </div>
                  <TextInput
                    id="antwoord2"
                    value={antwoord2}
                    onChange={(event) => setAntwoord2(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="antwoord3" value="Antwoord 3" />
                  </div>
                  <TextInput
                    id="antwoord3"
                    value={antwoord3}
                    onChange={(event) => setAntwoord3(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="antwoord4" value="Antwoord 4" />
                  </div>
                  <TextInput
                    id="antwoord4"
                    value={antwoord4}
                    onChange={(event) => setAntwoord4(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="titel" value="Juiste antwoord" />
                  </div>
                  <Dropdown label={dropDown} dismissOnClick={true} >
                    <DropdownItem onClick={() => setDropDown('1')}>1</DropdownItem>
                    <DropdownItem onClick={() => setDropDown('2')}>2</DropdownItem>
                    <DropdownItem onClick={() => setDropDown('3')}>3</DropdownItem>
                    <DropdownItem onClick={() => setDropDown('4')}>4</DropdownItem>
                  </Dropdown>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <Button onClick={() => createNewQuestion()}>Maak je nieuwe vraag aan</Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Quiz