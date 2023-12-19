import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { setAuth } = useAuth();
  
  const LOGIN_URL = '/auth/login';
  const navigate = useNavigate();

  const [user, setUserName] = useState('');
  const [pwd, setPasswd] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Gebruiksnaam is verplicht!");
      return;
    } else if (!pwd) {
      setError("Wachtwoord is verplicht!");
      return;
    }

    try {
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
      );
      const accessToken = response.data.accessToken;
      setAuth({accessToken});
      navigate("/dashboard", { replace: true});
    } catch (error) {
      if (!error?.response) {
        setError("Server is momenteel niet bereikbaar!");
        return;
      } else if (error.response?.status === 401) {
        setError("Gebruiksnaam en/of wachtwoord is verkeerd!");
        return;
      } else {
        setError("Login is misgegaan. Probeer het opnieuw!");
        return;
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-96 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold text-center tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Inloggen
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="gebruiksnaam"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gebruiksnaam
              </label>
              <input
                type="text"
                name="gebruiksnaam"
                id="gebruiksnaam"
                onChange={(e) => setUserName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Kees"
              />
            </div>
            <div>
              <label
                htmlFor="wachtwoord"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Wachtwoord
              </label>
              <input
                type="password"
                name="wachtwoord"
                id="wachtwoord"
                onChange={(e) => setPasswd(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex items-start">
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Nog geen account?{" "}
                <Link to='/registreren' className="font-medium text-primary-600 hover:underline dark:text-primary-500">Klik hier</Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-400 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Inloggen
            </button>
          </form>
        </div>
      </div>
    </div> 
  );
}

export default Login;
