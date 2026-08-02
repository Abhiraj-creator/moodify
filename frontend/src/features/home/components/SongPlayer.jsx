import React, { useRef, useState, useEffect } from 'react'
import useSong from '../hooks/useSong.js'
import '../styles/player.scss'

const defaultSong = {
  title: "To the Moon",
  SongUrl: "https://ik.imagekit.io/fr6xntzql/moodify/songs/To_the_Moon_CrfY0-XO_m.mp3",
  PosterUrl: "https://ik.imagekit.io/fr6xntzql/moodify/posters/To_the_Moon_2ZM6c3pHa.jpeg",
  mood: "DEFAULT"
}

const SongPlayer = ({ detectedMood }) => {
  const { song: contextSong, Loading, HandleGetSong } = useSong()
  const [currentSong, setCurrentSong] = useState(defaultSong)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Use context song if available, otherwise use default
  const displaySong = contextSong || currentSong

  // Fetch new song when mood is detected
  useEffect(() => {
    if (detectedMood && detectedMood !== 'DEFAULT') {
      const mood = detectedMood.trim().toUpperCase()
      HandleGetSong(mood)
      // Pause current song when switching
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [detectedMood])

  // Update current song when context song changes
  useEffect(() => {
    if (contextSong) {
      setCurrentSong(contextSong)
      // Reset player state
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [contextSong])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (Loading) {
    return (
      <div className="song-player loading">
        <div className="player-card">
          <div className="loading-spinner">🎵</div>
          <p>Finding song for your mood...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="song-player">
      <div className="player-card">
        <div className="poster-container">
          <img 
            src={displaySong.PosterUrl} 
            alt={displaySong.title}
            className={`poster ${isPlaying ? 'playing' : ''}`}
          />
        </div>
        
        <div className="song-info">
          <h3 className="title">{displaySong.title}</h3>
          <span className="mood-badge">{displaySong.mood}</span>
        </div>

        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <button className="control-btn" onClick={() => audioRef.current.currentTime -= 10}>
            ⏮ 10s
          </button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="control-btn" onClick={() => audioRef.current.currentTime += 10}>
            10s ⏭
          </button>
        </div>

        <audio
          ref={audioRef}
          src={displaySong.SongUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          key={displaySong.SongUrl}
        />
      </div>
    </div>
  )
}

export default SongPlayer
