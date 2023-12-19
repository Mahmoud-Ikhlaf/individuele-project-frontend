import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='font-bold text-6xl py-10'>Mahoot</h1>
        <input
          placeholder='Quiz Code'
          className='mb-4 px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500'
          type='number'
        />
        <button
          className='px-4 py-2 mb-5 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'
          type='submit'
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