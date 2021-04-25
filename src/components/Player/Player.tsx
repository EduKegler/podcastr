import Image from 'next/image';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export default function Player() {

    const player = usePlayer();
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        if (audioRef.current) {
            player.isPlaying ?
                audioRef.current.play() :
                audioRef.current.pause();
        }
    }, [player.isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate',
            () => setProgress(Math.floor(audioRef.current.currentTime)));
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(Math.floor(amount));
    }

    function handleEpisodeEnded() {
        if(player.hasNext) { 
            player.playNext();
        } else { 
            setProgress(0);
            player.clearPlayerState();
        }
    }

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
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ?
                            <Slider
                                max={episode.duration}
                                min={0}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#97f5ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            /> :
                            <div className={styles.emptySlider} />
                        }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && <audio
                    onLoadedMetadata={setupProgressListener}
                    ref={audioRef}
                    loop={player.isLooping}
                    src={episode.url}
                    onEnded={handleEpisodeEnded}
                    autoPlay={true}
                    onPlay={() => player.togglePlay(true)}
                    onPause={() => player.togglePlay(false)}
                />}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || player.episodes.length <= 1}
                        onClick={() => player.toggleShuffle()}
                        className={player.isShuffling && styles.isActive}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !player.hasPrevious}
                        onClick={player.playPrevious}
                    >
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
                    <button
                        type="button"
                        disabled={!episode || !player.hasNext}
                        onClick={player.playNext}
                    >
                        <img src="/play-next.svg" alt="Tocar Próxima" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={() => player.toggleLooping()}
                        className={player.isLooping && styles.isActive}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}