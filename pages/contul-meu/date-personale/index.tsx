import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/PersonalData.module.scss'
import { server } from '../../../config/server'

const SideMenu = dynamic(() => import('../../../components/MyAccount/SideMenu'), { ssr: false })
const SideMenuMobile = dynamic(() => import('../../../components/MyAccount/SideMenuMobile'), { ssr: false })


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
            comuna: string;
            active: boolean;
        }
    }
}

const PersonalData: NextPage<User> = ({ user }) => {
    const router = useRouter()

    const isSmallScreen = useMediaQuery({ query: '(max-width: 900px)'})

    const [ showPassword, setShowPassword ] = useState(false)
    const [ showNewPassword, setShowNewPassword ] = useState(false)

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

            await axios.post(`${server}/api/functionalities/profile-picture`, { photo }, { withCredentials: true })
                .then(res => res.data)
                .catch(err => console.log(err))
            setLoading(false)
            router.reload()
        }
        if(profilePicture.profile !== '') {
            changePhoto()
        }
    }, [profilePicture.profile])


    const [ password, setPassword ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const [ resetNewPassword, setResetNewPassword ] = useState('')

    const [ loadingPassword, setLoadingPassword ] = useState(false)
    const [ success, setSuccess ] = useState(false)
    const [ errorPassword, setErrorPassword ] = useState(false)

    const handleResetPassword = async (e: any) => {
        e.preventDefault()

        setLoadingPassword(true)
        setErrorPassword(false)

        if(password === '' || newPassword === '' || resetNewPassword === '' || newPassword !== resetNewPassword) {
            setErrorPassword(true)
            setLoadingPassword(false)
            return;
        }

        const result = await axios.patch(`${server}/api/login/reset-known-password`, { password, newPassword, resetNewPassword }, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err)
                            setLoadingPassword(false)
                            setErrorPassword(true)
                        })

        if(result && result.message === 'Parolă schimbată cu succes') {
            setLoadingPassword(false)
            setSuccess(true)
            setPassword('')
            setNewPassword('')
            setResetNewPassword('')
        } else {
            setLoadingPassword(false)
            setErrorPassword(true)
        }
    }

    return (
        <div className={gridStyles.container_grid}>
            {!isSmallScreen ?
                <SideMenu active={1} />
            :
                <SideMenuMobile active={1} />
            }
            
            <div className={gridStyles.container_options}>
                {!user.user.active &&
                <div className={styles.restricted_view}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648554021/FIICODE/user-login-security-11955_wtbrnb.svg' alt='Icon' width={200} height={200} />
                        <h2 style={{ width: '70%', textAlign: 'center', color: '#808080', fontSize: '2rem'}}>Contul dumneavoastră va fi activat în cel mai scurt timp</h2>
                </div>
                }
                <div className={styles.title}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648483006/FIICODE/resume-9871_grltqn.svg' alt='Icon' width={50} height={50} />
                    <h1>
                        Date personale
                    </h1>
                </div>
                <div style={{ position: 'relative'}}>
                    <div className={styles.image_profile}>
                            <Image className={styles.make_visible} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} src={user.user.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : user.user.profilePicture } alt='Poza Profil' width={120} height={120} /> 
                                {!loading ? 
                                    <>
                                    {mouseOver &&
                                    <div onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} className={`${mouseOver ? styles.overlay : ''} ${loading ? styles.display_on : ''}`}>
                                        <label htmlFor='profile-picture'><p>Schimbă</p></label>
                                        <input id='profile-picture' type='file' onChange={e => handleChange(e)} style={{ display: 'none' }}/>
                                    </div>
                                    }
                                    </> 
                                : 
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' alt='Loading...' width={30} height={30} />
                                }
                        </div>
                </div>
                
                <div style={{ display: 'flex', flexFlow: 'column wrap', gap: '2em', marginLeft: 0}}>
                    <div className={styles.flex_option}>
                        <div className={styles.option}>
                            <label>Nume</label>
                            <p title='Nume'>
                                {user.user.name}
                            </p>
                        </div>

                        <div className={styles.option}>
                            <label>Prenume</label>
                            <p title='Prenume'>
                                {user.user.firstName}
                            </p>
                        </div>
                    </div>

                    <div className={styles.flex_option}>
                        <div className={styles.option}>
                            <label>Sex</label>
                            <p title='Sex'>
                                {user.user.gender}
                            </p>
                        </div>

                        <div className={styles.option}>
                            <label>Email</label>
                            <p title='Email'>
                                {user.user.email}    
                            </p>
                        </div>
                    </div>

                    <div className={styles.flex_option}>
                        <div className={styles.option}>
                            {user.user.comuna === '' ?
                                <>
                                    <label>Oraș</label>
                                    <p title='Oraș'>
                                        { user.user.city !== '' ? user.user.city : 'NULL' }
                                    </p>
                                </>
                            :
                                <>
                                    <label>Comună</label>
                                    <p title='Comună'>
                                        { user.user.comuna !== '' ? user.user.comuna : 'NULL' }
                                    </p>
                                </>
                            }
                        </div>

                        {user.user.comuna === '' ?
                            <div className={styles.option}>
                                <label>Județ</label>
                                <p title='Județ'>
                                    {user.user.county}
                                </p>
                            </div>
                        :
                            <div className={styles.option}>
                                <label>Sat</label>
                                <p title='Sat'>
                                    { user.user.city !== '' ? user.user.city : 'NULL' }
                                </p>
                            </div>
}
                    </div>

                    <div className={styles.flex_option}>
                        {user.user.comuna !== '' && 
                            <div className={styles.option}>
                                <label>Județ</label>
                                <p title='Județ'>
                                    {user.user.county}
                                </p>
                            </div>
                        }
                        <div className={styles.option}>
                            <label>Stradă</label>
                            <p title='Stradă'>
                                {user.user.street}    
                            </p>
                        </div>

                        {user.user.comuna === '' && <div style={{ width: 300 }} className={styles.override_wid}></div> }
                    </div>

                </div>

                <div className={styles.setting} style={{ marginTop: 100 }}>
                    <div style={{ width: '100%'}}>
                        <h2>Schimbă parola</h2>
                        <p style={{ color: 'rgb(180, 180, 180)' }}>Introdu alături vechea ta parolă, după care introdu noua ta parola pe care vrei să o folosești</p>
                    </div>
                    <div className={styles.reset}>
                        <div className={`${styles.input} ${errorPassword ? styles.wrong_input : ''}`}>
                            <label htmlFor='current-password'>Parola curentă</label>
                            <input type={!showPassword ? 'password' : 'text'} id='current-password' name='current-password' value={password} onChange={e => { setPassword(e.target.value); setSuccess(false) }} />
                            <div className={styles.svg_container}>
                                {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                            </div>
                        </div>
                        <div className={`${styles.input} ${errorPassword ? styles.wrong_input : ''}`}>
                            <label htmlFor='new-password'>Parola nouă</label>
                            <input type={!showNewPassword ? 'password' : 'text' } id='new-password' name='new-password' value={newPassword} onChange={e => { setNewPassword(e.target.value); setSuccess(false) }} />
                            <div className={styles.svg_container}>
                                {!showNewPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowNewPassword(!showNewPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowNewPassword(!showNewPassword)}/> }
                            </div>
                        </div>
                        <div className={`${styles.input} ${errorPassword ? styles.wrong_input : ''}`}>
                            <label htmlFor='reset-new-password'>Verificare parola nouă</label>
                            <input type='password' id='reset-new-password' name='reset-new-password' value={resetNewPassword} onChange={e => { setResetNewPassword(e.target.value); setSuccess(false) }} />
                        </div>
                        <div style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', width: '120%', mixBlendMode: 'multiply' }} className={styles.change_button}>
                            {!loadingPassword ?
                                <>
                                    <button onClick={e => handleResetPassword(e)}>Schimbă parola</button>
                                    <p style={{ color: '#8BBD8B' }}>{success ? 'Parolă schimbată' : ''}</p>
                                </>
                            :
                             <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' width={50} height={50} alt='Loading...' />
                            }
                        </div>
                    </div>
                </div>

                <div className={styles.setting} style={{ marginTop: 100 }}>
                    <div>
                        <h2 style={{ marginTop: 0 }}>Schimbarea datelor</h2>
                        <p style={{ color: 'rgb(180, 180, 180)' }}>Pentru înâmpinarea oricăror probeleme sau pentru orice altceva pentru care vreți să ne comunicați, contactați-ne la <span style={{ color: 'rgb(120, 120, 120)' }}>contact.romdig@gmail.com</span></p>
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

    const shouldRedirect = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
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

    const user = await axios.get(`${server}/api/myaccount/pd-personaldata`, { withCredentials: true, headers: { Cookie: req.headers.cookie! } })
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