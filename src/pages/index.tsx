import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import api from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  durationAsString: string;
  duration: number;
}

type HomeProps = {
  episodes: Array<Episode>;
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
}

export default function Home(props: HomeProps) {
  const { allEpisodes, episodes, latestEpisodes } = props;

  const player = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode =>
            <li key={episode.id}>
              <Image
                src={episode.thumbnail}
                alt={episode.title}
                width={192}
                height={192}
                objectFit="cover"
              />
              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title} </a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type='button'>
                <img src='./play-green.svg' alt='Tocar Episódio' onClick={() => player.play(episode)} />
              </button>
            </li>
          )}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode =>
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    alt={episode.title}
                    src={episode.thumbnail}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title} </a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type='button'>
                    <img src='/play-green.svg' alt="Tocar episódio" onClick={() => player.play(episode)} />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    url: episode.file.url,
    description: episode.description,
  }))

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: { episodes, latestEpisodes, allEpisodes },
    revalidate: 60 * 60 * 8 // 8 horas
  }

}
