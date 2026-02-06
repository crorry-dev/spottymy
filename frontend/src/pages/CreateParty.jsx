import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'
import './CreateParty.css'

function CreateParty() {
  const navigate = useNavigate()
  const [hostName, setHostName] = useState('')
  const [partyCreated, setPartyCreated] = useState(false)
  const [partyData, setPartyData] = useState(null)
  const [loading, setLoading] = useState(false)

  const createParty = async () => {
    if (!hostName.trim()) {
      alert('Please enter your name')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/party/create', {
        host_name: hostName
      })
      // Store host name for use in other views
      localStorage.setItem('userName', hostName)
      setPartyData(response.data)
      setPartyCreated(true)
    } catch (error) {
      console.error('Error creating party:', error)
      alert('Failed to create party. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (partyCreated && partyData) {
    return (
      <div className="create-party-container">
        <motion.div
          className="party-created"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>🎉 Party Created!</h1>
          
          <div className="party-info">
            <h2>Party Code</h2>
            <div className="party-code">{partyData.party_code}</div>
          </div>

          <div className="qr-code-container">
            <h3>Scan to Join</h3>
            <QRCodeSVG 
              value={partyData.party_url} 
              size={250}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/party/${partyData.party_code}/projector`)}
            >
              Open Projector View
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/party/${partyData.party_code}/mobile`)}
            >
              Open Mobile View
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="create-party-container">
      <motion.div
        className="create-party-form"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Host a Party</h1>
        <p className="subtitle">Create a collaborative playlist for your party</p>

        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createParty()}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={createParty}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Party'}
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

export default CreateParty
