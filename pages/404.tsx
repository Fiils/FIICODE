import type { NextPage } from 'next';
import Image from 'next/image'
import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../styles/scss/Layout/ErrorPage.module.scss'
import useWindowSize from '../utils/useWindowSize'
import { NoSSR } from '../utils/NoSsr'

const ErrorPage: NextPage = () => {
    const router = useRouter()

    const [ width, height ] = useWindowSize()

    return (
        <>
            <Head>

                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />

            </Head>
            
            <div className={styles.container_flex}>
                <div className={styles.info}>
                    <h1>Ceva neașteptat s-a întâmplat</h1>
                    <p>Pagina pe care ai încercat să o accesezi nu a fost găsită. Apasă pe butonul de mai jos pentru a merge pe pagina principală</p>
                    <button onClick={() => router.push('/')}>Înapoi</button>
                </div>
                <NoSSR fallback={null}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648906258/FIICODE/laptop-error-12463_1_kriddr.svg' width={width > 1000 ? 500 : (width > 800 ? 300 : 200)} height={width > 1000 ? 500 : (width > 800 ? 300 : 200)} alt='Eroare' /> 
                </NoSSR>
            </div>
        </>
    )
}

export default ErrorPage;