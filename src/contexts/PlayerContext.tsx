import React, { useContext } from "react";
import { createContext } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string
    url: string;
    duration: number
}

type PlayerContextData = {
    episodes: Episode[];
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
    playList: (episodes: Episode[], index: number) => void;

    playNext: () => void;
    playPrevious: () => void;

    isPlaying: boolean;
    togglePlay: (state?: boolean) => void;

    isLooping: boolean;
    toggleLooping: (state?: boolean) => void;

    isShuffling: boolean;
    toggleShuffle: (state?: boolean) => void;

    hasPrevious: boolean;
    hasNext: boolean;

    clearPlayerState: () => void;
}

type PlayerContextProps = {
    children: React.ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider(props: PlayerContextProps): JSX.Element {

    const [episodes, setEpisodes] = React.useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isLooping, setIsLooping] = React.useState(false);
    const [isShuffling, setIsShuffling] = React.useState(false);

    function clearPlayerState() {
        setEpisodes([])
        setCurrentEpisodeIndex(0);
        setIsPlaying(false);
    }

    function play(episode: Episode) {
        setEpisodes([episode])
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(episodes: Episode[], index: number) {
        setEpisodes(episodes)
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function toggleLooping(state?: boolean): void {
        setIsLooping(oldValue => state !== undefined ? state : !oldValue)
    }

    function toggleShuffle(state?: boolean): void {
        setIsShuffling(oldValue => state !== undefined ? state : !oldValue)
    }

    function togglePlay(state?: boolean): void {
        setIsPlaying(oldValue => state !== undefined ? state : !oldValue)
    }

    function playNext(): void {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(
                Math.random() * episodes.length
            )
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function playPrevious(): void {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    const hasPrevious = currentEpisodeIndex !== 0;
    const hasNext = isShuffling || episodes.length !== currentEpisodeIndex + 1;

    return (
        <PlayerContext.Provider
            value={{
                episodes,
                currentEpisodeIndex,
                playList,
                play,
                isPlaying,
                togglePlay,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                toggleLooping,
                isLooping,
                toggleShuffle,
                isShuffling,
                clearPlayerState
            }}
        >
            {props.children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}
