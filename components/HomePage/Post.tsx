import { FC } from 'react';
import Image from 'next/image'

import styles from '../../styles/scss/Homepage/LatestPosts.module.scss'

const Post: FC = () => {

    return (
        <div className={styles.post}>
            <div className={styles.image}>
                <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647357606/FIICODE/photo-1453728013993-6d66e9c9123a_iifdqc.jpg' layout='fill' />
            </div>
            <p className={styles.date}>Postat: 12.04.2021</p>
        </div>
    )
}

export default Post;