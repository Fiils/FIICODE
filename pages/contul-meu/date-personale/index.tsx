import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import Image from 'next/image'

import SideMenu from '../../../components/MyAccount/SideMenu'
import styles from '../../../styles/scss/MyAccount/GridContainer.module.scss'

interface User {
    user: {
        name: string;
        firstName: string;
        profilePicture: string;
        email: string;
        gender: string;
        city: string;
        county: string;
        street: string;
    }
}

const PersonalData: NextPage<User> = ({ user }) => {

    return (
        <div className={styles.container_grid}>
            <SideMenu active={1} />
            
            <div className={styles.container_options}>
                <div style={{ position: 'relative'}}>
                    <div className={styles.image_profile}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648229267/FIICODE/user-3295_1_hljo9n.svg' width={120} height={120} />
                        <Image className={styles.edit_icon} src='https://res.cloudinary.com/multimediarog/image/upload/v1648392904/FIICODE/pencil-5824_txy3j9.svg' width={20} height={20} />
                    </div>
                </div>
                    <div className={styles.option}>
                        <p title='Nume'>
                            Ipatov
                        </p>
                        <p title='Prenume'>
                            Ioan Alexandru
                        </p>
                        <p title='Nume'>
                            Ipatov
                        </p>
                        <p title='Prenume'>
                            Ioan Alexsad oiash douuas du asandru
                        </p>
                    </div>
            </div>
        </div>
    )
}

export default PersonalData;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies['x-access-token']
    let redirect = false

    const shouldRedirect = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err.response);
                            redirect = true
                        })

    if(!redirect || (shouldRedirect && shouldRedirect.active && shouldRedirect.active === false)) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    }

    const user = await axios.get('http://localhost:9999/api/myaccount/pd-personaldata', { withCredentials: true, headers: { Cookie: req.headers.cookie! } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err.response);
                        })


    return {
        props: {
            user
        }
    }
}