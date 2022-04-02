import type { NextPage } from 'next';
import Image from 'next/image'
import { useRouter } from 'next/router'

import styles from '../styles/scss/Layout/ErrorPage.module.scss'

const ErrorPage: NextPage = () => {
    const router = useRouter()

    return (
        <div className={styles.container_flex}>
            <div className={styles.info}>
                <h1>Ceva neașteptat s-a întâmplat</h1>
                <p>Pagina pe care ai încercat să o accesezi nu a fost găsită. Apasă pe butonul de mai jos pentru a merge pe pagina principală</p>
                <button onClick={() => router.push('/')}>Înapoi</button>
            </div>
            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648906258/FIICODE/laptop-error-12463_1_kriddr.svg' width={500} height={500} />
        </div>
    )
}

export default ErrorPage;