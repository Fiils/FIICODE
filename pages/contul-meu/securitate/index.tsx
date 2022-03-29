import type { NextPage, GetServerSideProps} from 'next'
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'

import SideMenu from '../../../components/MyAccount/SideMenu'
import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/Settings.module.scss'

const Posts: NextPage = () => {


    return (
        <div className={gridStyles.container_grid}>
            <SideMenu active={5} />
            
            <div className={gridStyles.container_options}>

            </div>
        </div>
    )
}

export default Posts;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies['x-access-token']
    let redirect = true

    if(!token) {
        return {
            redirect: {
                destination: '/date-personale',
                permanent: false
            }
        }
    }

    const user = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
        .then(res => res.data)
        .catch(err => {
            console.log(err);
            redirect = false
    })

    if(!redirect) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    }

    if(user.active === false) {
        return {
            redirect: {
                permanent: false,
                destination: '/contul-meu/date-personale'
            },
            props: {}
        }
    }

    return { props: {} }
}