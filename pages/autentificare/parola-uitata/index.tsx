import type { NextPage } from 'next';
import axios from 'axios'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

import styles from '../../../styles/scss/Authentication/Registration.module.scss'
import overrideStyles from '../../../styles/scss/Authentication/ForgotPassword.module.scss'
import { server } from '../../../config/server'
import useWindowSize from '../../../utils/useWindowSize'
import { NoSSR } from '../../../utils/NoSsr'


const Inregistrare: NextPage = () => {
    const [ width ] = useWindowSize()

    const [ email, setEmail ] = useState('')

    const [ loading, setLoading ] = useState(false)

    const [ sent, setSent ] = useState(false)
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        const person = { email }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        
        setError(!email.length ? !email.length : (!email.match(emailRegex) ? true : false))
        setErrorMessage(!email.length ? 'Spațiul nu poate fi gol' : (!email.match(emailRegex) ? 'Email invalid' : ''))

        if(!email.length || !email.match(emailRegex)) {
            setLoading(false)
            return;
        }
        

        let redirect
        const result = await axios.post(`${server}/api/login/forgot-password`, person)
                        .then(res => res.data)
                        .catch(err => {
                            setLoading(false)
                            if(err.response && err.response.data.type && err.response.data.type === 'email' && err.response.data.message !== 'Emailul nu a fost găsit') {
                                setError(true)
                                setErrorMessage(err.response.data.message)
                            } else if(err.response.data.message === 'Emailul nu a fost găsit') {
                                redirect = err.response.data.message
                            } else console.log(err)
                        })


        if((result && result.message === 'Email trimis') || (redirect && redirect === 'Emailul nu a fost găsit')) {
            setSent(true)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    return (
        <>
            <Head>
          
                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />

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
                
                {!sent ?
                <form className={overrideStyles.form}>
                    <div>
                        <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Ai uitat parola?</h2>
                        <p className={overrideStyles.additional_info}>Dacă ți-ai uitat parola, notează-ți mai jos email-ul si îți vom trimite noi un email prin care ți-o vei putea schimba</p>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20}}>
                            <NoSSR fallback={null}><Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648312754/FIICODE/login-password-11921_qnznau.svg' alt='Icon' width={width > 900 ? 100 : 80} height={width > 900 ? 100 : 80} priority/></NoSSR>
                        </div>
                        <div className={`${styles.input_d} ${error ? styles.wrong_input : ''}`}>
                            <label htmlFor='email'>E-mail*</label>
                            <input type="email" autoComplete='email' id='email' name='email' value={email} onChange={e => { setEmail(e.target.value); setError(false); setErrorMessage('') }} />
                            {errorMessage !== ''  ? <label style={{ color: 'red' }}>{errorMessage}</label> : <></> }
                        </div>
                        <div className={styles.additional_info}>
                            <Link href='/inregistrare'>Nu ai un cont?</Link>
                        </div>

                        <div className={overrideStyles.button_sub} style={{ marginTop: 30}}>
                            {!loading ?
                            <button type="submit" onClick={e => handleSubmit(e)}>Trimite</button>
                            :
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' alt='Loading...' width={150} height={150} /> }
                        </div>     
                    </div>           
                </form>
                : 
                <div className={overrideStyles.form}>
                    <div>
                            <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Email trimis</h2>
                            <p className={overrideStyles.additional_info}>Dacă emailul este valid, atunci veți primi un mail de la noi; în el veți găsi un link, iar dacă îl accesați vă veți putea schimba parola cu una nouă. Dacă nu-l găsiți în inbox, verificați în secțiunea spam. </p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40}}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647536857/FIICODE/mail-1182_hk1jkc.png' alt='Icon' width={140} height={140} />
                            </div>
                            <div className={overrideStyles.button_sub} style={{ marginTop: 50 }}>
                                <button type="button">
                                    <Link href='/autentificare'>Autentifică-te</Link>
                                </button>
                            </div>     
                        </div>           
                </div>
            }
            </div>
        </>
    )
}

export default Inregistrare;