import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Missing from './pages/Missing';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import Layout from './components/Layout';
import Logout from './components/Logout';
import QuizManage from './pages/QuizManage';
import Quiz from './pages/Quiz';

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
              <Route path='/dashboard' element={ <Layout><Dashboard/></Layout> } />
              <Route path='/dashboard/quiz' element={ <Layout><QuizManage/></Layout> } />
              <Route path='/dashboard/quiz/:id' element={ <Layout><Quiz/></Layout> } />
              <Route path='/uitloggen' element={<Logout/>} />
          </Route>
        </Route>

        <Route path='*' element={<Missing/>}/>
      </Routes>
  </Router>
  )
}

export default App
