import { FC } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import styles from '../../styles/scss/Layout/Header.module.scss'
import { useAuth } from '../../utils/useAuth'

const Header: FC = () => {

    const user = useAuth()

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={60} height={60} />
                <span>ROMDIG</span>
            </div>
            <Link href="/">Prima pagină</Link>
            <Link href="/postari/cx/p1">Postări</Link>
            <Link href="/postari/creare-postare">Creează o postare</Link>
            {(!user.user.isLoggedIn || ( !user.user.active && !user.user.isLoggedIn )) ?
                <div className={styles.links}>
                    <Link href="/autentificare">Autentifică-te</Link>
                    <button><Link href="/inregistrare">Înregistrează-te</Link></button>
                </div>
            :
                <div className={styles.profile_account}>
                    <Link href="/contul-meu/date-personale">Contul meu</Link>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648476786/FIICODE/user-4250_psd62d.svg' width={40} height={40} />
                </div>
            }
        </div>
    )
}

export default Header