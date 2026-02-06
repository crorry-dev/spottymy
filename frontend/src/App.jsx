import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateParty from './pages/CreateParty'
import JoinParty from './pages/JoinParty'
import MobileView from './pages/MobileView'
import ProjectorView from './pages/ProjectorView'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateParty />} />
        <Route path="/join/:partyCode?" element={<JoinParty />} />
        <Route path="/party/:partyCode/mobile" element={<MobileView />} />
        <Route path="/party/:partyCode/projector" element={<ProjectorView />} />
      </Routes>
    </Router>
  )
}

export default App
