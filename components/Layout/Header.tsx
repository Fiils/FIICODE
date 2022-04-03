import { FC } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../styles/scss/Layout/Header.module.scss'
import { useAuth } from '../../utils/useAuth'

const Header: FC = () => {
    const router = useRouter()

    const user = useAuth()

    return (
        <>
        <Head>

          <link
            rel="preload"
            href="/fonts/LibreBaskerville/LibreBaskerville.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/LibreBaskerville/LibreBaskerville.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/LibreBaskerville/LibreBaskerville.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous" 
          />
          
        </Head>
            <div className={styles.container}>
                <div className={styles.logo}>
                    {router.pathname !== '/autentificare' && <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={60} height={60} /> }
                    <span>ROMDIG</span>
                </div>
                <Link href="/">Prima pagină</Link>
                <Link href="/postari/cx/popular/p1">Postări</Link>
                <Link href="/creare-postare">Creează o postare</Link>
                {(!user.user.isLoggedIn || ( !user.user.active && !user.user.isLoggedIn )) ?
                    <div className={styles.links}>
                        <Link href="/autentificare">Autentifică-te</Link>
                        <button><Link href="/inregistrare">Înregistrează-te</Link></button>
                    </div>
                :
                    <div className={styles.profile_account}>
                        <Link href="/contul-meu/date-personale">Contul meu</Link>
                        <Image src={user.user.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648476786/FIICODE/user-4250_psd62d.svg' : user.user.profilePicture } width={40} height={40} />
                    </div>
                }
            </div>
        </>
    )
}

export default Header