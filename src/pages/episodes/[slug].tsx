import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import api from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    members: string;
    publishedAt: string;
    thumbnail: string;
    description: string;
    url: string;
    durationAsString: string;
    duration: number;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode(props: EpisodeProps) {
    const { episode } = props;

    const player = usePlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr </title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type='button'>
                        <img src='/arrow-left.svg' alt='Voltar' />
                    </button>
                </Link>
                <Image
                    src={episode.thumbnail}
                    width={700}
                    height={160}
                    objectFit='cover'
                />
                <button type='button' onClick={() => player.play(episode)}>
                    <img src='/play.svg' alt='Tocar' />
                </button>
            </div>

            <header className={styles.header}>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get(`/episodes/`, {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => ({ params: { slug: episode.id } }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
        description: data.description,
    }

    return {
        props: { episode },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}