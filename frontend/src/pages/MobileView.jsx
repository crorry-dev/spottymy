import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import io from 'socket.io-client'
import { FaSearch, FaChevronUp, FaChevronDown, FaMusic } from 'react-icons/fa'
import './MobileView.css'

function MobileView() {
  const { partyCode } = useParams()
  const [party, setParty] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('queue') // 'queue' or 'search'
  const userName = localStorage.getItem('userName') || 'Anonymous'
  const socketRef = useRef(null)

  useEffect(() => {
    loadPartyData()
    setupSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
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

  const searchSongs = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchResults(response.data.tracks)
    } catch (error) {
      console.error('Error searching:', error)
      alert('Failed to search. Make sure Spotify is connected.')
    } finally {
      setSearching(false)
    }
  }

  const addToQueue = async (track) => {
    try {
      await axios.post(`/api/party/${partyCode}/queue/add`, {
        ...track,
        added_by: userName
      })
      setActiveTab('queue')
      setSearchQuery('')
      setSearchResults([])
    } catch (error) {
      console.error('Error adding to queue:', error)
      alert('Failed to add song to queue')
    }
  }

  const voteSong = async (songIndex, voteType) => {
    try {
      await axios.post(`/api/party/${partyCode}/queue/${songIndex}/vote`, {
        voter: userName,
        vote: voteType
      })
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${seconds.padStart(2, '0')}`
  }

  if (!party) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="mobile-view">
      <header className="mobile-header">
        <h1>🎉 {party.host}'s Party</h1>
        <p className="party-code">Code: {party.code}</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          Queue ({party.queue.length})
        </button>
        <button
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Add Songs
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'queue' && (
          <motion.div
            key="queue"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="content-section"
          >
            {party.current_song && (
              <div className="now-playing">
                <h3>🎵 Now Playing</h3>
                <div className="current-song">
                  {party.current_song.image_url && (
                    <img src={party.current_song.image_url} alt={party.current_song.name} />
                  )}
                  <div className="song-info">
                    <h4>{party.current_song.name}</h4>
                    <p>{party.current_song.artist}</p>
                  </div>
                </div>
              </div>
            )}

            <h3>Up Next</h3>
            {party.queue.length === 0 ? (
              <div className="empty-queue">
                <FaMusic size={50} />
                <p>No songs in queue yet</p>
                <button
                  className="btn-add"
                  onClick={() => setActiveTab('search')}
                >
                  Add First Song
                </button>
              </div>
            ) : (
              <div className="queue-list">
                {party.queue.map((song, index) => (
                  <motion.div
                    key={`${song.id}-${index}`}
                    className="queue-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {song.image_url && (
                      <img src={song.image_url} alt={song.name} className="song-image" />
                    )}
                    <div className="song-details">
                      <h4>{song.name}</h4>
                      <p>{song.artist}</p>
                      <span className="added-by">Added by {song.added_by}</span>
                    </div>
                    <div className="vote-buttons">
                      <button
                        className="vote-btn up"
                        onClick={() => voteSong(index, 'up')}
                      >
                        <FaChevronUp />
                      </button>
                      <span className="vote-count">{song.votes}</span>
                      <button
                        className="vote-btn down"
                        onClick={() => voteSong(index, 'down')}
                      >
                        <FaChevronDown />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="content-section"
          >
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search for songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchSongs()}
              />
              <button onClick={searchSongs} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>

            <div className="search-results">
              {searchResults.map((track) => (
                <motion.div
                  key={track.id}
                  className="search-result-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {track.image_url && (
                    <img src={track.image_url} alt={track.name} />
                  )}
                  <div className="track-info">
                    <h4>{track.name}</h4>
                    <p>{track.artist}</p>
                    <span className="duration">{formatDuration(track.duration_ms)}</span>
                  </div>
                  <button
                    className="btn-add-small"
                    onClick={() => addToQueue(track)}
                  >
                    Add
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileView
