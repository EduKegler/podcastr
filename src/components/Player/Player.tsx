import Image from 'next/image';
import { useContext, useRef } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';


export default function Player() {

    const player = useContext(PlayerContext);
    const audioRef = useRef<HTMLAudioElement>(null);

    React.useEffect(() => {
        if (audioRef.current) {
            player.isPlaying ?
                audioRef.current.play() :
                audioRef.current.pause();
        }
    }, [player.isPlaying])

    const episode = player.episodes[player.currentEpisodeIndex];

    return (
        <div className={styles.container} >
            <header>
                <img src="/playing.svg" alt="Tocando Agora" />
                <strong> Tocando agora </strong>
            </header>
            
            {episode ?
                <div className={styles.currentEpisode}>
                    <Image
                        src={episode.thumbnail}
                        alt={episode.title}
                        width={592}
                        height={592}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div> :
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            }

            <footer className={!episode && styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ?
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#97f5ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            /> :
                            <div className={styles.emptySlider} />
                        }
                    </div>
                    <span>00:00</span>
                </div>

                {episode && <audio
                    ref={audioRef}
                    src={episode.url}
                    autoPlay={true}
                    onPlay={() => player.togglePlay(true)}
                    onPause={() => player.togglePlay(false)}
                />}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar Anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={() => player.togglePlay()}
                    >
                        {player.isPlaying ?
                            <img src="/pause.svg" alt="Pause" /> :
                            <img src="/play.svg" alt="Tocar" />}
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar Próxima" />
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}