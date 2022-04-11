import type { FC } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'

import styles from '../../styles/scss/Layout/Header.module.scss'
import { useAuth } from '../../utils/useAuth'
import useWindowSize from '../../utils/useWindowSize'
import { NoSSR } from '../../utils/NoSsr'


const Header: FC = () => {
    const router = useRouter()

    const [ width, height ] = useWindowSize()
    const user = useAuth()

    const [ clickMenu, setClickMenu ] = useState<boolean | null>(null)

    return (
        <NoSSR fallback={null}>
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
        
            {width > 850 ?
                    <div className={styles.container}>
                    <div className={styles.logo}>
                        {router.pathname !== '/autentificare' && <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={width > 481  ? 60 : 50} height={width > 481  ? 60 : 50} alt='Logo' /> }
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
                            <div style={{ position: 'relative'}}>
                                <Link href="/contul-meu/date-personale">Contul meu</Link>
                                {!user.user.active && <div className={styles.inactive}></div>}
                            </div>
                            <Image src={user.user.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648476786/FIICODE/user-4250_psd62d.svg' : user.user.profilePicture } width={40} height={40} alt='Poza Profil' />
                        </div>
                    }
                    </div>
            :
                <>
                    <div className={styles.container}>
                        <div className={styles.logo}>
                            {router.pathname !== '/autentificare' && <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={width > 481  ? 60 : 50} height={width > 481  ? 60 : 50}  alt='Poza Profil' /> }
                            <span>ROMDIG</span>
                        </div>
                        <div className={`${styles.menu_open} ${clickMenu ? styles.open_menu_transition : styles.close_menu_transition }`}>
                            <Image onClick={() => setClickMenu(!clickMenu)} src='https://res.cloudinary.com/multimediarog/image/upload/v1649142515/FIICODE/open-menu-6208_dhao2h.svg' width={40} height={40} alt='Meniu' />
                        </div>
                    </div>
                    {clickMenu !== null &&
                        <div className={`${styles.menu_container} ${clickMenu !== null ? (clickMenu ? styles.opened_container : styles.closed_container) : ''}`}>
                            <ul className={styles.menu_list}>
                                <li><Link href='/'><a onClick={() => setClickMenu(false)}>Prima Pagină</a></Link></li>
                                <li><Link href='/postari/cx/popular/p1'><a onClick={() => setClickMenu(false)}>Postări</a></Link></li>
                                <li><Link href='/creare-postare'><a onClick={() => setClickMenu(false)}>Creează o postare</a></Link></li>
                                {(!user.user.isLoggedIn || ( !user.user.active && !user.user.isLoggedIn )) ?
                                    <li className={styles.authentication_links}>
                                        <Link href="/autentificare"><a id='#login' onClick={() => setClickMenu(false)}>Autentifică-te</a></Link>
                                        <button><Link href="/inregistrare"><a onClick={() => setClickMenu(false)}>Înregistrează-te</a></Link></button>
                                    </li>
                                    :
                                    <li className={styles.authentication_links}>
                                        <button><Link href='/contul-meu/date-personale'><a onClick={() => setClickMenu(false)}>Contul meu</a></Link></button>
                                    </li>
                                }
                            </ul>
                        </div>
                    }
                </>
            }
        </NoSSR>
    )
}

export default Header