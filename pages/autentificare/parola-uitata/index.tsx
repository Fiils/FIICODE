import type { NextPage } from 'next';
import axios from 'axios'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from '../../../styles/scss/Authentication/Registration.module.scss'
import overrideStyles from '../../../styles/scss/Authentication/ForgotPassword.module.scss'


const Inregistrare: NextPage = () => {

    const router = useRouter()

    const [ email, setEmail ] = useState('')


    const [ sent, setSent ] = useState(false)
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const person = { email }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        
        setError(!email.length ? !email.length : (!email.match(emailRegex) ? true : false))
        setErrorMessage(!email.length ? 'Spațiul nu poate fi gol' : (!email.match(emailRegex) ? 'Email invalid' : ''))

        if(error) return;
        

        const result = await axios.post('http://localhost:9999/api/login/forgot-password', person)
                        .then(res => res.data)
                        .catch(err => {
                            if(err.response.data.type === 'email') {
                                setError(true)
                                setErrorMessage(err.response.data.message)
                            } else console.log(err)
                        })

        if(result && result === 'Email trimis') {
            setSent(true)
        }
    }

    return (
        <div className={styles.container}>
            
            {!sent ?
            <form className={overrideStyles.form}>
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Ai uitat parola?</h2>
                    <p className={overrideStyles.additional_info}>Dacă ți-ai uitat parola, notează-ți mai jos email-ul si îți vom trimite noi un email prin care ți-o vei putea schimba</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20}}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648312754/FIICODE/login-password-11921_qnznau.svg' width={100} height={100} priority/>
                    </div>
                    <div className={`${styles.input_d} ${error ? styles.wrong_input : ''}`}>
                        <label htmlFor='email'>E-mail*</label>
                        <input type="email" id='email' name='email' value={email} onChange={e => { setEmail(e.target.value); setError(false); setErrorMessage('') }} />
                        {errorMessage !== ''  ? <label style={{ color: 'red' }}>{errorMessage}</label> : <></> }
                    </div>
                    <div className={styles.additional_info}>
                        <Link href='/inregistrare'>Nu ai un cont?</Link>
                    </div>

                    <div className={overrideStyles.button_sub} style={{ marginTop: 30}}>
                        <button type="submit" onClick={e => handleSubmit(e)}>Trimite</button>
                    </div>     
                </div>           
            </form>
            : 
            <div className={overrideStyles.form}>
                <div>
                        <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Email trimis</h2>
                        <p className={overrideStyles.additional_info}>Tocmai ce v-a fost trimis un email; în el veți găsi un link, iar dacă îl accesați vă veți putea schimba parola cu una nouă. Dacă nu-l găsiți în inbox, verificați în secțiunea spam. </p>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40}}>
                            <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647536857/FIICODE/mail-1182_hk1jkc.png' width={140} height={140} />
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
    )
}

export default Inregistrare;