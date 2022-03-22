import { FC } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import styles from '../../styles/scss/Layout/Header.module.scss'

const Header: FC = () => {

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={60} height={60} />
                <span>ROMDIG</span>
            </div>
            <Link href="/">Prima pagină</Link>
            <Link href="/postari">Postări</Link>
            <Link href="/postari/creare">Creează o postare</Link>
            <div className={styles.links}>
               <Link href="/autentificare">Autentifică-te</Link>
               <button><Link href="/inregistrare">Înregistrează-te</Link></button>
            </div>
        </div>
    )
}

export default Header