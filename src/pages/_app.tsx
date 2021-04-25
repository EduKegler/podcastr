import React from 'react'
import Player from '../components/Player/Player'
import Header from '../components/Header/Header'
import './../styles/global.scss'
import styles from './../styles/app.module.scss'
import { PlayerContext } from '../contexts/PlayerContext'

function MyApp({ Component, pageProps }) {

  const [episodes, setEpisodes] = React.useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  function play(episode) { 
    setEpisodes(oldValue => [episode, ...oldValue])
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(state?: boolean) { 
    setIsPlaying(oldValue => state !== undefined ? state : !oldValue)
  }
  
  return (
    <PlayerContext.Provider value={{ episodes, currentEpisodeIndex, play, isPlaying, togglePlay }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp
