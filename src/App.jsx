import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ContactModal from './components/ContactModal'
import HomePage from './pages/HomePage'
import ArchivePage from './pages/ArchivePage'
import ClientPage from './pages/ClientPage'
import PersonalProjectPage from './pages/PersonalProjectPage'
import './components/ArchiveFilter.css'

function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const handleOpenContact = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContact = () => {
    setIsContactModalOpen(false)
  }

  return (
    <Router>
      <div className="app">
        <Header
          onContactClick={handleOpenContact}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/:slug" element={<ClientPage />} />
        </Routes>
        {isContactModalOpen && <ContactModal onClose={handleCloseContact} />}
      </div>
    </Router>
  )
}

export default App

