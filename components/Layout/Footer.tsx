import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/scss/Layout/Footer.module.scss'
import useWindowSize from '../../utils/useWindowSize'


const Footer = () => {
    const [ width, height ] = useWindowSize()

    return (
        <div className={styles.container_footer}>
            <div className={styles.fill}></div>
            <div className={styles.contact}>
                <h3>Ne găsiți și pe:</h3>
                <div className={styles.icon}>
                    <Link href='/'>
                        <a>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811327/FIICODE/facebook-2870_i9ta7v.svg' width={width > 700 ? 50 : 40} height={width > 700 ? 50 : 40} />
                        </a>
                    </Link>
                    <Link href='/'>
                        <a>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811325/FIICODE/twitter-logo-2429_oqqgc7.svg' width={width > 700 ? 50 : 40} height={width > 700 ? 50 : 40} />
                        </a>
                    </Link>                
                    <Link href='/'>
                        <a>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811329/FIICODE/tumblr-logo-2434_lr6qoq.svg' width={width > 700 ? 50 : 40} height={width > 700 ? 50 : 40} />
                        </a>
                    </Link>               
                     <Link href='/'>
                         <a>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811330/FIICODE/instagram-logo-8869_jxddho.svg' width={width > 700 ? 50 : 40} height={width > 700 ? 50 : 40} />
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
    )
}

export default Footer