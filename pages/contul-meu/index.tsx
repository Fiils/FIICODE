import type { NextPage } from 'next'
import Link from 'next/link'

import styles from '../../styles/scss/MyAccount/SideMenu.module.scss'

interface ListItem {
    name: string;
    url: string;
}


const MyAccount: NextPage = () => {

    const ListItem = ({name, url}: ListItem) => {

        return (
            <li>
                <Link href={`/${url.toLowerCase()}`}>{name}</Link>
            </li>
        )
    }

    return (
        <div className={styles.container_grid}>
            <div className={styles.user_list}>
                <ul>
                    <ListItem name='Date Personale' url='date-personale' />
                    <ListItem name='Postări' url='postari' />
                    <ListItem name='Postările mele' url='postari-personale' />
                    <ListItem name='Favorite' url='favorite' />
                </ul>
            </div>
        </div>
    )
}

export default MyAccount