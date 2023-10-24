import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/Inloggen" Component={Login}></Route>
        <Route path="/Registreren" Component={Register}></Route>
      </Routes>
  </Router>
  )
}

export default App
