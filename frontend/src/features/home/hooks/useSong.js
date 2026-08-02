import  { useContext } from "react"
import { SongContext } from "../song.context";
import { GetSong } from "../services/songs.api";

const useSong=()=>{
   const context= useContext(SongContext);
   const {song,setSong,Loading,setLoading}=context;

   const HandleGetSong=async (mood)=>{
        setLoading(true);
        try {
            const data= await GetSong(mood)
            setSong(data.song);
        } catch (error) {
            console.error('Failed to get song:', error)
        } finally {
            setLoading(false);
        }
   }

   return {song, Loading, HandleGetSong};
}
export default useSong;