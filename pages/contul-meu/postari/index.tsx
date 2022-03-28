import type { NextPage } from 'next'

import SideMenu from '../../../components/MyAccount/SideMenu'
import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/PostsSection.module.scss'

const Posts: NextPage = () => {

    return (
        <div className={gridStyles.container_grid}>
            <SideMenu active={2} />
            
            <div className={gridStyles.container_options}>
                <h2 className={styles.title}>Postări votate pozitiv</h2>
            </div>
        </div>
    )
}

export default Posts;