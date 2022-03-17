import type { NextPage } from 'next';
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import EmailIcon from '@mui/icons-material/Email';

import styles from '../../styles/scss/Authentication/Registration.module.scss'
import overrideStyles from '../../styles/scss/Authentication/Authentication.module.scss'


const Inregistrare: NextPage = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ showPassword, setShowPassword ] = useState(false)
    const [ error, setError ] = useState({ email: false, password: false })
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const person = { email, password }

        if(email === '' || password === '') {
            if(email === ''){
                setError({ ...error, email: true })
            }
            if(password === ''){
                setError({ ...error, password: true })
            }
            return;
        };

        const result = await axios.post('http://localhost:9999/api/login', person)
                        .then(res => res.data)
    }

    return (
        <div className={styles.container}>
            <div className={styles.go_back}>
                <span><Link href='/'>Înapoi</Link></span>
                <KeyboardReturnRoundedIcon />
            </div>
            <div className={styles.logo}>
                <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={60} height={60} />
                <span>ROMDIG</span>
            </div>

            <form className={overrideStyles.form}>
                <div className={styles.design}>
                    <h3>
                        <span>Schimbă viitorul</span>
                        <br />
                        <span>cu un simplu</span>
                        <br/>
                        <span>click.</span>
                    </h3>
                    <div>
                        <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647461367/FIICODE/background-2462430_dhiz4x.jpg' layout='fill' />
                    </div> 
                </div>
                <div>
                        <h2>Intră în cont</h2>
                        <div className={`${styles.input_d} ${error.email ? styles.wrong_input : ''}`}>
                            <label htmlFor='email'>E-mail*</label>
                            <input type="email" id='email' name='email' value={email} onChange={e => { setEmail(e.target.value); setError({ ...error, email: false }) }} />
                            <div className={styles.svg_container}>
                                <EmailIcon />
                            </div>
                        </div>
                        <div className={`${styles.input_d} ${error.password ? styles.wrong_input : ''}`}>
                            <label htmlFor='password'>Parolă*</label>
                            <input type={!showPassword ? 'password' : 'text'} id='password' name='password' value={password} onChange={e => { setPassword(e.target.value); setError({ ...error, password: false }) }} />
                            <div className={styles.svg_container}>
                                {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                            </div>
                        </div>

                        <div className={styles.additional_info}>
                            <Link href='/autentificare/parola-uitata'>Ai uitat parola?</Link>
                        </div>

                        <div className={styles.button_sub}>
                            <button type="submit" onClick={e => handleSubmit(e)}>Trimite</button>
                        </div>     
                    </div>           
            </form>
        </div>
    )
}

export default Inregistrare;