import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Cookies from 'js-cookie'

import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import EmailIcon from '@mui/icons-material/Email';

import styles from '../../styles/scss/Authentication/Registration.module.scss'
import overrideStyles from '../../styles/scss/Authentication/Authentication.module.scss'
import { server } from '../../config/server'
import useWindowSize from '../../utils/useWindowSize'
import { NoSSR } from '../../utils/NoSsr'


const Inregistrare: NextPage = () => {
    const router = useRouter()

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ loading, setLoading ] = useState(false)
    const [ width, height ] = useWindowSize()

    const [ showPassword, setShowPassword ] = useState(false)
    const [ error, setError ] = useState({ email: false, password: false })
    const [ errorMessages, setErrorMessages ] = useState({ email: '', password: '' })
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        const person = { email, password }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        setError({
            email: !email.length ? !email.length : (!email.match(emailRegex) ? true : false),
            password: !password.length
        })
        setErrorMessages({
            email: !email.length ? 'Spațiul nu poate fi gol' : (!email.match(emailRegex) ? 'Email invalid' : ''),
            password: !password.length ? 'Spațiul nu poate fi gol' : ''
        })

        if(!email.length || !password.length || !email.match(emailRegex)) {
            setLoading(false)
            return;
        }

        const result = await axios.post(`${server}/api/login`, person, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            setLoading(false)
                            if(err.response && err.response.data.type && err.response.data.type === 'email') {
                                setError({
                                    ...error,
                                    email: true
                                })
                                setErrorMessages({
                                    ...errorMessages,
                                    email: err.response.data.message
                                })
                            } else if(err.response &&  err.response.data.type && err.response.data.type === 'password') {
                                setError({
                                    ...error,
                                    password: true
                                })
                                setErrorMessages({
                                    ...errorMessages,
                                    password: err.response.data.message
                                })
                            } else console.log(err)
                        })

        if(result && result.message === 'User logat') {
            Cookies.set('x-access-token', result.token, { expires: 30 })
            router.reload()
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    return (
        <NoSSR fallback={null}>
            <Head>

                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />

            </Head>
            <div className={styles.container}>
                <div className={styles.go_back}>
                    <span><Link href='/'>Înapoi</Link></span>
                    <KeyboardReturnRoundedIcon />
                </div>

                <div className={styles.logo}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' alt='Icon' width={width > 450 ? (width < 900 ? 40 : 60) : 30} height={width > 450 ? (width < 900 ? 40 : 60) : 30} priority/>
                    <span>ROMDIG</span>
                </div>

                <form className={overrideStyles.form}>
                    {width > 1100 && 
                        <div className={styles.design}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649256461/FIICODE/Background_Login_img_green_lw9i3n.png' alt='Icon' layout='fill' priority/>
                        </div>
                    }

                    <div>
                            <h2>Intră în cont</h2>
                            <div className={`${styles.input_d} ${error.email ? styles.wrong_input : ''}`}>
                                <label htmlFor='email'>E-mail*</label>
                                <input type="text" autoComplete='email' id='email' name='email' value={email} onChange={e => { setEmail(e.target.value); setError({ ...error, email: false }); setErrorMessages({ ...errorMessages, email: '' }) }} />
                                <div className={styles.svg_container}>
                                    <EmailIcon />
                                </div>
                                {errorMessages.email !== ''  ? <label style={{ color: 'red' }}>{errorMessages.email}</label> : <></> }
                            </div>
                            <div className={`${styles.input_d} ${error.password ? styles.wrong_input : ''}`}>
                                <label htmlFor='password'>Parolă*</label>
                                <input type={!showPassword ? 'password' : 'text'} autoComplete='password' id='password' name='password' value={password} onChange={e => { setPassword(e.target.value); setError({ ...error, password: false }); setErrorMessages({ ...errorMessages, password: '' }) }} />
                                <div className={styles.svg_container}>
                                    {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                                </div>
                                {errorMessages.password !== ''  ? <label style={{ color: 'red' }}>{errorMessages.password}</label> : <></> }
                            </div>

                            <div className={styles.additional_info}>
                                <Link href='/autentificare/parola-uitata'>Ai uitat parola?</Link>
                            </div>

                            <div className={overrideStyles.button_sub}>
                                {!loading ?
                                <button type="submit" onClick={e => handleSubmit(e)}>Trimite</button>
                                :
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' alt='Icon' width={150} height={150} /> }
                            </div>     
                        </div>           
                </form>
            </div>
        </NoSSR>
    )
}

export default Inregistrare;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies['x-access-token']

    if(!token) {
        return { props: {} }
    } else {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {}
        }
    }
}