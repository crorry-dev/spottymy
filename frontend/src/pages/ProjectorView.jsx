import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import io from 'socket.io-client'
import { QRCodeSVG } from 'qrcode.react'
import { FaUsers, FaMusic } from 'react-icons/fa'
import './ProjectorView.css'

function ProjectorView() {
  const { partyCode } = useParams()
  const [party, setParty] = useState(null)
  const [time, setTime] = useState(new Date())
  const socketRef = useRef(null)

  useEffect(() => {
    loadPartyData()
    setupSocket()

    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      clearInterval(timer)
    }
  }, [partyCode])

  const loadPartyData = async () => {
    try {
      const response = await axios.get(`/api/party/${partyCode}`)
      setParty(response.data)
    } catch (error) {
      console.error('Error loading party:', error)
    }
  }

  const setupSocket = () => {
    socketRef.current = io()
    socketRef.current.emit('join', { party_code: partyCode })

    socketRef.current.on('queue_updated', (queue) => {
      setParty(prev => ({ ...prev, queue }))
    })

    socketRef.current.on('playback_updated', (currentSong) => {
      setParty(prev => ({ ...prev, current_song: currentSong }))
    })

    socketRef.current.on('party_updated', (updatedParty) => {
      setParty(updatedParty)
    })
  }

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${seconds.padStart(2, '0')}`
  }

  if (!party) {
    return (
      <div className="projector-loading">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <FaMusic size={100} />
        </motion.div>
        <h2>Loading Party...</h2>
      </div>
    )
  }

  return (
    <div className="projector-view">
      {/* Animated Background */}
      <div className="projector-bg">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-particle"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="projector-header">
        <div className="header-left">
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            🎉 {party.host}'s Party
          </motion.h1>
          <motion.div
            className="party-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>
              <FaUsers /> {party.members.length} guests
            </span>
            <span>
              <FaMusic /> {party.queue.length} songs
            </span>
          </motion.div>
        </div>
        <motion.div
          className="time"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="projector-content">
        {/* Current Song - Big Display */}
        <AnimatePresence mode="wait">
          {party.current_song ? (
            <motion.div
              key={party.current_song.id}
              className="current-playing"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="album-art"
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(29, 185, 84, 0.5)',
                    '0 0 60px rgba(29, 185, 84, 0.8)',
                    '0 0 40px rgba(29, 185, 84, 0.5)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                {party.current_song.image_url && (
                  <img src={party.current_song.image_url} alt={party.current_song.name} />
                )}
              </motion.div>
              <div className="song-details-large">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {party.current_song.name}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {party.current_song.artist}
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-song"
              className="no-current-song"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FaMusic size={80} />
              <h2>Waiting for music...</h2>
              <p>Add songs from your phone!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Queue Section */}
        <div className="projector-queue-section">
          <h3>🎵 Up Next</h3>
          <div className="projector-queue">
            {party.queue.length === 0 ? (
              <motion.div
                className="empty-queue-projector"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>Queue is empty</p>
                <p className="scan-text">Scan the QR code to add songs!</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {party.queue.slice(0, 5).map((song, index) => (
                  <motion.div
                    key={`${song.id}-${index}`}
                    className="projector-queue-item"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <span className="queue-number">{index + 1}</span>
                    {song.image_url && (
                      <img src={song.image_url} alt={song.name} />
                    )}
                    <div className="queue-song-info">
                      <h4>{song.name}</h4>
                      <p>{song.artist}</p>
                    </div>
                    <motion.div
                      className="vote-display"
                      animate={{
                        scale: song.votes > 0 ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                    >
                      <span className={song.votes > 0 ? 'positive' : song.votes < 0 ? 'negative' : ''}>
                        {song.votes > 0 ? '+' : ''}{song.votes}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Corner */}
      <motion.div
        className="qr-corner"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="qr-code-display">
          <QRCodeSVG
            value={`${window.location.origin}/join/${party.code}`}
            size={150}
            level="H"
            includeMargin={true}
          />
        </div>
        <p>Scan to Join</p>
        <p className="code-display">{party.code}</p>
      </motion.div>
    </div>
  )
}

export default ProjectorView
