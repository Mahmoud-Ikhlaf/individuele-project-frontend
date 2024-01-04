import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home'
import Login from './pages/Home/Login'
import Register from './pages/Home/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Missing from './pages/Home/Missing';
import QuizManage from './pages/Dashboard/QuizManage';
import Quiz from './pages/Dashboard/Quiz';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import Layout from './components/Layout';
import Logout from './components/Logout';
import StartScreen from './pages/Dashboard/StartScreen';
import PlayQuiz from './pages/Home/PlayQuiz';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes  */}
        <Route path="/" element={<Home/>} />
        <Route path="/inloggen" element={<Login/>} />
        <Route path="/registreren" element={<Register/>} />
        <Route path='/quiz/:quizCode' element={<PlayQuiz/>} />

        {/* Private routes  */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth />}>
              <Route path='/dashboard' element={ <Layout><Dashboard/></Layout> } />
              <Route path='/dashboard/quiz' element={ <Layout><QuizManage/></Layout> } />
              <Route path='/dashboard/quiz/:id' element={ <Layout><Quiz/></Layout> } />

              <Route path='/dashboard/play/:id' element={<StartScreen/>} />

              <Route path='/uitloggen' element={<Logout/>} />
          </Route>
        </Route>

        <Route path='*' element={<Missing/>}/>
      </Routes>
  </Router>
  )
}

export default App
