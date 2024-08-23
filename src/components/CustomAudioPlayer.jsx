import React, { useState, useRef } from 'react';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

function CustomAudioPlayer(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-player">
      <button
        className={`play-pause-button`}
        onClick={togglePlayPause}
      >

        {isPlaying ? <PauseCircleIcon style={{ color: "#fff" }} /> : <PlayCircleIcon style={{ color: "#fff" }}/>}
      </button>
      <audio ref={audioRef}>
        <source src={props.url} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>
  );
}

export default CustomAudioPlayer;
