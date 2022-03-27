import type { NextPage } from 'next'

import SideMenu from '../../../components/MyAccount/SideMenu'
import styles from '../../../styles/scss/MyAccount/GridContainer.module.scss'


const Favorite: NextPage = () => {

    return (
        <div className={styles.container_grid}>
            <SideMenu active={4} />
            
            <div className={styles.container_options}>

            </div>
        </div>
    )
}

export default Favorite;