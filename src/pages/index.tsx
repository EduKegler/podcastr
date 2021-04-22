import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import api from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  durationasString: string;
}

type HomeProps = {
  episodes: Array<Episode>;
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
}

export default function Home(props: HomeProps) {
  const { allEpisodes, episodes, latestEpisodes } = props;
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map(ep =>
            <li key={ep.id}>
              <Image
                src={ep.thumbnail}
                alt={ep.title}
                width={192}
                height={192}
                objectFit="cover"
              />
              <div className={styles.episodeDetails}>
                <a href=''>{ep.title}</a>
                <p>{ep.members}</p>
                <span>{ep.publishedAt}</span>
                <span>{ep.durationasString}</span>
              </div>

              <button type='button'>
                <img src='./play-green.svg' alt='Tocar Episódio' />
              </button>
            </li>
          )}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
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
    durationasString: convertDurationToTimeString(Number(episode.file.duration)),
    url: episode.file.url,
    description: episode.description,
  }))

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: { episodes, latestEpisodes, allEpisodes },
    revalidate: 60 * 60 * 8
  }

}
