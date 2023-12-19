import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useState, useEffect } from 'react';
import { MdPlayCircle } from "react-icons/md"

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getQuizzes() {
      try {
        const response = await axiosPrivate.get("/quizzes");
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

  const playButton = () => {

  }

  return (
    <div className="quiz">
      <div className='relative top-20'>
        {quizzes.length > 0 ? (
          <><h4 className='text-4xl text-center mb-5'>Online Quizzen:</h4>
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
                    <MdPlayCircle className="mx-2 h-5 w-5 text-gray-400 dark:text-gray-200"></MdPlayCircle>
                    <a onClick={() => playButton(quiz.id)} className="font-medium text-cyan-600 hover:underline cursor-pointer dark:text-cyan-500">
                      Speel
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></>
        ) : (
          <h4 className='text-4xl text-center mb-5'>Er zijn geen quizzen gemaakt!</h4>
        )}
      </div>
    </div>
  )
}

export default Dashboard