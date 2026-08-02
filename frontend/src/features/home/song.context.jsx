import { useState } from "react";

import { createContext } from "react";

export const SongContext = createContext();
export const SOngContextProvider=({children})=>{
    const [song, setSong] = useState({
            "title": "To the Moon",
            "SongUrl": "https://ik.imagekit.io/fr6xntzql/moodify/songs/To_the_Moon_CrfY0-XO_m.mp3",
            "PosterUrl": "https://ik.imagekit.io/fr6xntzql/moodify/posters/To_the_Moon_2ZM6c3pHa.jpeg",
            "mood": "SURPRISED",
        });
    const [Loading, setLoading] = useState(false);

    return <SongContext.Provider value={{song, setSong, Loading, setLoading}}>
        {children}
    </SongContext.Provider>
}
