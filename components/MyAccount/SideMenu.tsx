import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'
import type { FC } from 'react'

import styles from '../../styles/scss/MyAccount/SideMenu.module.scss'
import { useAuth } from '../../utils/useAuth'

interface ListItem {
    name: string;
    url: string;
    index: number;
}

interface PropsForStyling {
    active: number;
}


const MyAccount: FC<PropsForStyling> = ({ active }) => {
    const router = useRouter()

    const user = useAuth()

    const ListItem = ({name, url, index}: ListItem) => {

        return (
            <li className={index === active ? styles.active_item : '' }>
                <Link href={`${url.toLowerCase()}`}>
                    <a  className={index === active ? styles.active_link : '' }>{name}</a>
                </Link>
            </li>
        )
    }

    const LogOut = async () => {
        const result = await axios.post('http://localhost:9999/api/functionalities/logout', {}, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => console.log(err))

        console.log(result)
        if(result.message === 'User delogat') {
            router.reload()
            user.setUser({ isLoggedIn: false, active: false, userId: '' })
        }
    }

    return (
            <div className={styles.user_list}>
                <ul>
                    <ListItem name='Date Personale' url='date-personale' index={1} />
                    <ListItem name='Postări Apreciate' url='postari-apreciate' index={2} />
                    <ListItem name='Postările mele' url='postari-personale' index={3} />
                    <ListItem name='Favorite' url='favorite' index={4} />
                    <ListItem name='Securitate' url='securitate' index={5} />
                    <li className={styles.logout}>
                        <a onClick={() => LogOut()} style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'center'}}>
                            Deloghează-te
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648387131/FIICODE/exit-logout-2857_ycu1g7.svg' width={30} height={30} />
                        </a>
                    </li>
                </ul>
            </div>
    )
}

export default MyAccount