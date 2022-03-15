import { FC } from 'react';

import styles from '../../styles/scss/Layout/Header.module.scss'
import Link from 'next/link'

const Header: FC = () => {

    return (
        <>
        <div className={styles.container}>
            <Link href="/">Prima pagină</Link>
            <Link href="/postari">Postări</Link>
            <Link href="/postari/creare">Creează o postare</Link>
            <div className={styles.links}>
               <Link href="/autentificare">Autentifică-te</Link>
               <button><Link href="/inregistrare">Înregistrează-te</Link></button>
            </div>
        </div>
        </>
    )
}

export default Header