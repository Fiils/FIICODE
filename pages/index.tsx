import type { NextPage } from 'next'
import Image from 'next/image'

import styles from '../styles/scss/Homepage/Introduction.module.scss'
// import Post from '../components/HomePage/Post'

const Home: NextPage = () => {
  return (
    <div>
      <h1 className={styles.title_1}>Ajută la îmbunătățirea orașului tău printr-o singură postare</h1>
      {/* <div className={styles.back_img}>
        <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647359734/FIICODE/background_tlbuls.webp' layout='fill' />
      </div> */}
    </div>
  )
}

export default Home
