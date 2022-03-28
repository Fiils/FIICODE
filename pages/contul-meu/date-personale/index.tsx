import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import SideMenu from '../../../components/MyAccount/SideMenu'
import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/PersonalData.module.scss'
import { useState } from 'react'

interface User {
    user: {
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
}

const PersonalData: NextPage<User> = ({ user }) => {
    const router = useRouter()

    const [ mouseOver, setMouseOver ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const [ profilePicture, setProfilePicture ] = useState({ profile: '' })

    const convertToBase64 = (file: any): any => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result)
          }
          fileReader.onerror = (error) => {
            reject(error)
          }
        })
      }

    const handleChange = async (e: any) => {
            const base64: string = await convertToBase64(e.target.files[0])
            setProfilePicture({ profile: base64 })
    }

    useEffect(() => {
        const changePhoto = async () => {
            setLoading(true)
            const photo = profilePicture.profile
            console.log(loading)
            await axios.post('http://localhost:9999/api/functionalities/profile-picture', { photo }, { withCredentials: true })
                .then(res => res.data)
                .catch(err => console.log(err))
            setLoading(false)
            router.reload()
        }
        if(profilePicture.profile !== '') {
            changePhoto()
        }
    }, [profilePicture.profile])

    return (
        <div className={gridStyles.container_grid}>
            <SideMenu active={1} />
            
            <div className={gridStyles.container_options}>
                <div className={styles.title}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648483006/FIICODE/resume-9871_grltqn.svg' width={50} height={50} />
                    <h1>
                        Date personale
                    </h1>
                </div>
                <div style={{ position: 'relative'}}>
                    <div className={styles.image_profile}>
                        <Image onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} src={user.user.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : user.user.profilePicture } width={120} height={120} /> 
                        <div className={`${styles.overlay} ${loading ? styles.display_on : ''}`}>
                            {!loading ? 
                                <>
                                    <label htmlFor='profile-picture'>Schimbă</label>
                                    <input id='profile-picture' type='file' onChange={e => handleChange(e)} style={{ display: 'none' }}/>
                                </> 
                            : 
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' width={30} height={30} />
                            }
                        </div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexFlow: 'column wrap', gap: '2em'}}>
                    <div className={styles.flex_option}>
                        <div className={styles.option}>
                            <p title='Nume'>
                                {user.user.name}
                            </p>
                        </div>

                        <div className={styles.option}>
                            <p title='Nume'>
                                {user.user.name}
                            </p>
                        </div>
                    </div>

                    <div className={styles.flex_option}>
                        <div className={styles.option}>
                            <p title='Sex'>
                                {user.user.gender}
                            </p>
                        </div>

                        <div className={styles.option}>
                            <p title='Email'>
                                {user.user.email}    
                            </p>
                        </div>
                    </div>

                    <div className={styles.flex_option}>
                        <div className={styles.option}>
                            <p title='Oraș'>
                                {user.user.city}
                            </p>
                        </div>

                        <div className={styles.option}>
                            <p title='Județ'>
                                {user.user.county}
                            </p>
                        </div>
                    </div>

                    <div className={styles.flex_option}>
                        <div className={styles.option}>
                            <p title='Stradă'>
                                {user.user.street}    
                            </p>
                        </div>

                        <div style={{ width: 300 }}></div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default PersonalData;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    let redirect = true
    const token = req.cookies['x-access-token']

    if(!token) {
        return { 
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {} 
        }
    }

    const shouldRedirect = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err.response);
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