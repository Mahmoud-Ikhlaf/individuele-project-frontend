import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='flex flex-col justify-between items-center h-screen'>
      <div className='flex flex-col items-center justify-center grow'>
        <h1 className='font-bold text-6xl py-10'>Mahoot</h1>
        <input
          placeholder='Quiz Code'
          className='mb-4 px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500'
          type='number'
        />
        <button
          className='px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'
          type='submit'
        >
          Speel
        </button>
      </div>

      <div className='flex gap-2'>
        <Link to='/Inloggen' className='text-indigo-400 text-lg hover:text-indigo-500'>Inloggen</Link>
        <Link to='/Registreren' className='text-indigo-400 text-lg hover:text-indigo-500'>Registreren</Link>
      </div>
    </div>
  )
}

export default Home