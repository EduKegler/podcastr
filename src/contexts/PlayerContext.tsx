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
    isPlaying: boolean;
    play: (episode: Episode) => void;
    togglePlay: (state?: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);