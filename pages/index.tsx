import type { NextPage } from 'next'
import Image from 'next/image'

import styles from '../styles/scss/Homepage/Introduction.module.scss'

const Home: NextPage = () => {
  return (
    <div>
      <h1 className={styles.title_1}>Ajută la îmbunătățirea orașului tău printr-o singură postare</h1>
      <div className={styles.bg_img}>
        {/* <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647445174/FIICODE/ads_d5e34c.webp' layout='fill' /> */}
      </div>
    </div>
  )
}

export default Home
