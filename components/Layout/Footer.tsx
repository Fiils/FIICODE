import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/scss/Layout/Footer.module.scss'
import useWindowSize from '../../utils/useWindowSize'
import { NoSSR } from '../../utils/NoSsr'


const Footer = () => {
    const [ width, height ] = useWindowSize()

    return (
        <NoSSR fallback={null}>
            <div className={styles.container_footer}>
                <div className={styles.contact}>
                    <h3>Ne găsiți și pe:</h3>
                    <div className={styles.icon}>
                        <Link href='https://www.facebook.com/romdig.gov'>
                            <a target='_blank' rel="nofollow">
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811327/FIICODE/facebook-2870_i9ta7v.svg' alt='Facebook' width={width > 700 ? 50 : 35} height={width > 700 ? 50 : 35} />
                            </a>
                        </Link>
                        <Link href='https://twitter.com/Romdig2'>
                            <a target='_blank' rel="nofollow">
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811325/FIICODE/twitter-logo-2429_oqqgc7.svg' alt='Twitter' width={width > 700 ? 50 : 35} height={width > 700 ? 50 : 35} />
                            </a>
                        </Link>                     
                        <Link href='/'>
                            <a>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811330/FIICODE/instagram-logo-8869_jxddho.svg' alt='Instagram' width={width > 700 ? 50 : 35} height={width > 700 ? 50 : 35} />
                            </a>
                        </Link>
                    </div>  
                </div>
                <div className={styles.team}>
                    Echipa: bionic
                </div>
                <div className={styles.copyright}>
                    Drepturi de autor © 2022, ROMDIG
                </div>
            </div>
        </NoSSR>
    )
}

export default Footer