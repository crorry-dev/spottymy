import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaSpotify, FaMusic, FaUsers } from 'react-icons/fa'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <FaSpotify size={80} color="#1DB954" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Spottymy
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The Ultimate Party Playlist Experience
        </motion.p>

        <motion.div
          className="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="feature">
            <FaMusic />
            <p>Vote on Songs</p>
          </div>
          <div className="feature">
            <FaUsers />
            <p>Party Together</p>
          </div>
          <div className="feature">
            <FaSpotify />
            <p>Spotify Powered</p>
          </div>
        </motion.div>

        <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            className="btn btn-primary"
            onClick={() => navigate('/create')}
          >
            Host a Party
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/join')}
          >
            Join a Party
          </button>
        </motion.div>
      </motion.div>

      <div className="animated-bg">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-circle"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
