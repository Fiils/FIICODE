import type { FC } from 'react';
import { useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { server } from '../../config/server'
import styles from '../../styles/scss/MyAccount/SideMenu.module.scss'


interface PropsForStyling {
    active: number;
}

interface ListItem {
    name: string;
    url: string;
    index: number;
}


const SideMenuMobile: FC<PropsForStyling> = ({ active }) => {
    const router = useRouter()

    const [ category, setCategory ] = useState(router.pathname === '/contul-meu/date-personale' ? 'Date Personale' : (router.pathname === '/contul-meu/postari-apreciate' ? 'Postări apreciate': (router.pathname === '/contul-meu/postari-personale' ? 'Postările mele' : 'Favorite')))
    const [ openedMenu, setOpenedMenu ] = useState<boolean | null>(null)

    const ListItem = ({name, url, index}: ListItem) => {

        return (
            <li className={index === active ? styles.active_item : '' }>
                <Link href={`${url.toLowerCase()}`}>
                    <a  className={index === active ? styles.active_link : '' }>{name}</a>
                </Link>
            </li>
        )
    }

    const LogOut = async () => {
        const result = await axios.post(`${server}/api/functionalities/logout`, {}, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => console.log(err))

        if(result.message === 'User delogat') {
            router.reload()
        }
    }

    return (
        <>
            <Head>
                
                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />

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

                <div className={styles.active_page} onClick={() => setOpenedMenu(!openedMenu)}>
                    <div>
                        <span>{category}</span>
                        <Image src={openedMenu ? 'https://res.cloudinary.com/multimediarog/image/upload/v1649594478/FIICODE/arrow-234_k98gm1.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1649594481/FIICODE/north-arrow-235_vlrcqp.svg'} width={10} height={10} />
                    </div>
                </div>
                {openedMenu !== null &&
                    <div className={`${styles.list_items} ${openedMenu !== null ? (openedMenu ? styles.open_menu : styles.close_menu ) : ''}`}>
                        <ul>
                            <ListItem name='Date Personale' url='/contul-meu/date-personale' index={1} />
                            <ListItem name='Postări Apreciate' url='/contul-meu/postari-apreciate' index={2} />
                            <ListItem name='Postările mele' url='/contul-meu/postari-personale' index={3} />
                            <ListItem name='Favorite' url='/contul-meu/favorite' index={4} />
                            <li className={styles.logout}>
                                <a onClick={() => LogOut()} style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'center'}}>
                                    Deloghează-te
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648387131/FIICODE/exit-logout-2857_ycu1g7.svg' width={30} height={30} />
                                </a>
                            </li>
                        </ul>
                    </div>
                }
        </>
    )
}

export default SideMenuMobile;