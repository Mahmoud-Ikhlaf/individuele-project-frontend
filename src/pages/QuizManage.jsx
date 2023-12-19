import React, {useEffect, useState} from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Modal, Label, TextInput, Alert } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiInformationCircle } from 'react-icons/hi'
import { MdDelete, MdOutlineEdit } from "react-icons/md"
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const QuizManage = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [error, setError] = useState('');
  const [errorDelete, setErrorDelete] = useState('');

  const [quizzes, setQuizzes] = useState([]);
  const [titel, setTitel] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [deleteId, setDeleteId] = useState();

  useEffect(() => {
    async function getQuizzes() {
      try {
        const response = await axiosPrivate.get("/quizzes?userid=" + jwtDecode(auth?.accessToken).sub);
        setQuizzes(response.data);
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
    getQuizzes();
  }, [])

  const editButton = (id) => {
    navigate("/dashboard/quiz/" + id);
  }
  
  const deleteButton = (id) => {
      setOpenDeleteModal(true);
      setDeleteId(id);
  }

  const deleteQuiz = async () => {
    try {
      await axiosPrivate.delete("/quizzes/" + deleteId);
      setQuizzes((prevQuizzess) => prevQuizzess.filter(quiz => quiz.id !== deleteId));
      setOpenDeleteModal(false);
    } catch (error) {
      if (!error?.response) {
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

  const createNewQuiz = async () => {
    setError('');

    try {
      const response = await axiosPrivate.post("/quizzes", 
        JSON.stringify({ title: titel, description: beschrijving })
      );
      const quizId = response.data.message;
      navigate("/dashboard/quiz/" + quizId);
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

  return (
    <div className="quiz">
      <div className='relative top-20'>
        <h4>Nieuwe quiz? <Button onClick={() => setOpenNewModal(true)}>Klik hier</Button></h4>
        {quizzes.length > 0 ? (
          <><h4 className='text-4xl text-center mb-5'>Jouw gemaakte quizzen:</h4>
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
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {quiz.title}
                  </TableCell>
                  <TableCell>{quiz.user.username}</TableCell>
                  <TableCell>{quiz.description}</TableCell>
                  <TableCell className='flex'>
                    <MdOutlineEdit className="mx-2 h-5 w-5 text-gray-400 dark:text-gray-200"></MdOutlineEdit>
                    <a onClick={() => editButton(quiz.id)} className="font-medium text-cyan-600 hover:underline cursor-pointer dark:text-cyan-500">
                      Bewerken
                    </a>
                  </TableCell>
                  <TableCell className='flex'>
                    <MdDelete className="mx-2 h-5 w-5 text-gray-400 dark:text-gray-200"></MdDelete>
                    <a onClick={() => deleteButton(quiz.id)} className="font-medium text-cyan-600 hover:underline cursor-pointer dark:text-cyan-500">
                      Verwijderen
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></>
        ) : (
          <h4 className='text-4xl text-center mb-5'>U heeft nog geen quizzen gemaakt!</h4>
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
              <Button color="failure" onClick={() => deleteQuiz()}>
                {"Ja"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                Nee
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal className='newModal' show={openNewModal} size="md" onClose={() => setOpenNewModal(false)} popup dismissible>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">Maak een nieuwe quiz aan</h3>
              {error &&
                <Alert color="failure" icon={HiInformationCircle}>
                  {error}
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
                <Button onClick={() => createNewQuiz()}>Maak je nieuwe quiz aan</Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
    )
}

export default QuizManage