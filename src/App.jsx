import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Missing from './pages/Missing';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes  */}
        <Route path="/" element={<Home/>} />
        <Route path="/inloggen" element={<Login/>} />
        <Route path="/registreren" element={<Register/>} />

        {/* Private routes  */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth />}>
            <Route path='/dashboard' element={<Home/>} />
          </Route>
        </Route>

        <Route path='*' element={<Missing/>}/>
      </Routes>
  </Router>
  )
}

export default App
