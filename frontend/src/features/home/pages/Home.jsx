import React, { useState } from 'react'
import Face from '../../expression/components/Face'
import SongPlayer from '../components/SongPlayer'
const Home = () => {
  const [detectedMood, setDetectedMood] = useState(null)
  
  return (
    <div>
      <Face onMoodDetected={(mood) => {
        setDetectedMood(mood)
      }}>
      </Face>
      <SongPlayer detectedMood={detectedMood}/>
    </div>
  )
}

export default Home
