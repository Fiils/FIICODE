import type { NextPage } from 'next';
import axios from 'axios'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

import styles from '../../styles/scss/Authentication/Registration.module.scss'


const Inregistrare: NextPage = () => {

    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ gender, setGender ] = useState('')
    const [ location, setLocation ] = useState('')
    const [ street, setStreet ] = useState('')

    const [ showPassword, setShowPassword ] = useState(false)
    const [ nextPage, setNextPage ] = useState(false)
    const [ hideFirstPage, setHideFirstPage ] = useState(false)
    const [ showNextPage, setShowNextPage ] = useState(false)
    

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const person = { name, email, password, gender }
        if( name === '' || email === '' || password === '' || gender === '' ) return;

        const result = await axios.post('http://localhost:9999/api/register', person)
                        .then(res => res.data)
    }

    useEffect(() => {
        if(nextPage) {
            setTimeout(() => {
                setShowNextPage(true)
            }, 200)
            setTimeout(() => {
                setHideFirstPage(true)
            }, 500)
        }
    }, [ nextPage ])

    return (
        <div className={styles.container}>
            <div className={styles.go_back}>
                <span><Link href='/'>Înapoi</Link></span>
                <KeyboardReturnRoundedIcon />
            </div>
            <form className={styles.form}>
                {!hideFirstPage &&
                    <div className={`${nextPage ? styles.animation_slide_left : styles.animation_slide_from_right } ${hideFirstPage ? styles.hidden : ''}`}>
                    <h2>Înregistrare</h2>
                    <div className={styles.input_d}>
                        <label htmlFor='name'>Nume*</label>
                        <input type="text" id='name' name='name' value={name} onChange={e => { setName(e.target.value)}} />
                        <div className={styles.svg_container}>
                            <BadgeIcon />
                        </div>
                    </div>
                    <div className={styles.input_d}>
                        <label htmlFor='email'>E-mail*</label>
                        <input type="email" id='email' name='email' value={email} onChange={e => { setEmail(e.target.value)}} />
                        <div className={styles.svg_container}>
                            <EmailIcon />
                        </div>
                    </div>
                    <div className={styles.input_d}>
                        <label htmlFor='password'>Parola*</label>
                        <input type={!showPassword ? 'password' : 'text'} minLength={8} id='password' name='password' value={password} onChange={e => { setPassword(e.target.value)}} />
                        <div className={styles.svg_container}>
                            {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                        </div>
                    </div>
                    <div className={styles.buttons_gender}>
                        <button className={gender === 'barbat' ? styles.selected : ''} type="button" onClick={() => setGender('barbat')}><ManIcon /></button>
                        <button className={gender === 'femeie' ? styles.selected : ''} type="button" onClick={() => setGender('femeie')}><WomanIcon /></button>
                    </div>
                    <div className={styles.button_sub}>
                        <button type="button" onClick={() => setNextPage(!nextPage)}>Următorul pas</button>
                    </div>
                    </div> }
                    {showNextPage && 
                    <div className={styles.animation_slide_from_right}>
                        <h2>Înregistrare</h2>
                        <h4>Pentru finalizarea procesului de inregistrare</h4>

                        <div className={styles.button_sub}>
                            <button type="submit" onClick={e => handleSubmit(e)}>Trimite</button>
                        </div>
                    </div>
                    }
                
            </form>
        </div>
    )
}

export default Inregistrare;