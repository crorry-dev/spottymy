import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import './JoinParty.css'

function JoinParty() {
  const navigate = useNavigate()
  const { partyCode: urlPartyCode } = useParams()
  const [partyCode, setPartyCode] = useState(urlPartyCode || '')
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)

  const joinParty = async () => {
    if (!partyCode.trim() || !userName.trim()) {
      alert('Please enter both party code and your name')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`/api/party/${partyCode}/join`, {
        user_name: userName
      })
      
      if (response.data.success) {
        // Store user name for use in other views
        localStorage.setItem('userName', userName)
        navigate(`/party/${partyCode}/mobile`)
      }
    } catch (error) {
      console.error('Error joining party:', error)
      if (error.response?.status === 404) {
        alert('Party not found. Please check the code.')
      } else {
        alert('Failed to join party. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="join-party-container">
      <motion.div
        className="join-party-form"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Join a Party</h1>
        <p className="subtitle">Enter the party code to join</p>

        <div className="form-group">
          <label>Party Code</label>
          <input
            type="text"
            placeholder="Enter party code"
            value={partyCode}
            onChange={(e) => setPartyCode(e.target.value.toUpperCase())}
            maxLength={8}
          />
        </div>

        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinParty()}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={joinParty}
          disabled={loading}
        >
          {loading ? 'Joining...' : 'Join Party'}
        </button>

        <button
          className="btn btn-link"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  )
}

export default JoinParty
