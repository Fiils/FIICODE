import type { NextPage } from 'next';
import axios from 'axios'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import AddRoadTwoToneIcon from '@mui/icons-material/AddRoadTwoTone';

import styles from '../../styles/scss/Authentication/Registration.module.scss'


const Inregistrare: NextPage = () => {

    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ gender, setGender ] = useState('')

    const [ city, setCity ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ photo, setPhoto ] = useState({ photo: ''})

    const [ showPassword, setShowPassword ] = useState(false)
    const [ nextPage, setNextPage ] = useState(false)
    const [ hideFirstPage, setHideFirstPage ] = useState(false)
    const [ showNextPage, setShowNextPage ] = useState(false)
    const [ showPrevPageAnim, setShowPrevPageAnim ] = useState(false)

    const [ error, setError ] = useState({ name: false, email: false, password: false, gender: false, city: false, street: false, photo: false})
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const person = { name, email, password, gender }
        if( name === '' || email === '' || password === '' || gender === '' || city === '' || street === '' || photo.photo === '' ) {
            if(name === ''){
                // setError({ ...error, name: true })
                error.name = true
            }
            if(email === ''){
                // setError({ ...error, email: true })
                error.email = true
            }
            if(password === ''){
                // setError({ ...error, password: true })
                error.password = true
            }
            if(gender === ''){
                // setError({ ...error, gender: true })
                error.gender = true
            }
            if(city === ''){
                // setError({ ...error, city: true })
                error.city = true
            }
            if(street === ''){
                // setError({ ...error, street: true })
                error.street = true
            }
            if(photo.photo === ''){
                // setError({ ...error, photo: true })
                error.photo = true
            }
            return;
        };

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

    const previousStep = (e: any) => {
        setNextPage(false) 
        setShowPrevPageAnim(true)
        setTimeout(() => {
           setShowNextPage(false)
        }, 300)
        setTimeout(() => {
            setHideFirstPage(false)
        }, 300)

        setTimeout(() => {
            setShowPrevPageAnim(false)
        }, 900)
        
    }

    const convertToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };

    const uploadPhoto = async (e: any) => {
        if(e.target.files[0]) { 
            const base64 = await convertToBase64(e.target.files[0])
            setPhoto({ photo: base64 })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.go_back}>
                <span><Link href='/'>Înapoi</Link></span>
                <KeyboardReturnRoundedIcon />
            </div>
            <form className={styles.form}>
                {!hideFirstPage &&
                    <div className={`${(nextPage && !showPrevPageAnim) ? styles.animation_slide_left : ''} ${hideFirstPage ? styles.hidden : ''} ${showPrevPageAnim ? styles.animation_slide_from_left : ''}`}>
                    <h2>Înregistrare</h2>
                    <div className={styles.input_d}>
                        <label htmlFor='name'>Nume*</label>
                        <input type="text" id='name' name='name' value={name} onChange={e => { setName(e.target.value) }} onClick={() => error.name = false} className={error.name ? styles.wrong_input : ''} />
                        <div className={styles.svg_container}>
                            <BadgeIcon />
                        </div>
                    </div>
                    <div className={styles.input_d}>
                        <label htmlFor='email'>E-mail*</label>
                        <input type="email" id='email' name='email' value={email} onChange={e => { setEmail(e.target.value) }} onClick={() => error.email = false} className={error.email ? styles.wrong_input : ''} />
                        <div className={styles.svg_container}>
                            <EmailIcon />
                        </div>
                    </div>
                    <div className={styles.input_d}>
                        <label htmlFor='password'>Parola*</label>
                        <input type={!showPassword ? 'password' : 'text'} minLength={8} id='password' name='password' value={password} onChange={e => { setPassword(e.target.value) }} onClick={() => error.password = false} className={error.password ? styles.wrong_input : ''} />
                        <div className={styles.svg_container}>
                            {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                        </div>
                    </div>
                    <div className={`${styles.buttons_gender} ${error.gender ? styles.wrong_input : ''}`}>
                        <button className={gender === 'barbat' ? styles.selected : ''} type="button" onClick={() => setGender('barbat')}><ManIcon /></button>
                        <button className={gender === 'femeie' ? styles.selected : ''} type="button" onClick={() => setGender('femeie')}><WomanIcon /></button>
                    </div>
                    <div className={styles.button_sub}>
                        <button type="button" onClick={() => setNextPage(true)}>Următorul pas</button>
                    </div>
                    </div> }
                    {showNextPage && 
                    <div className={`${nextPage ? styles.animation_slide_from_right : styles.animation_slide_right}`}>
                        <div className={styles.prev} onClick={e => previousStep(e)}>
                            <ArrowCircleLeftRoundedIcon />
                            <span>Pasul anterior</span>
                        </div>
                        <h2>Înregistrare</h2>
                        <div className={styles.input_d}>
                            <label htmlFor='provenience'>Localitate*</label>
                            <input type="text" id='provenience' name='provenience' value={city} onChange={e => { setCity(e.target.value) }} onClick={() => { error.city = false; }} className={error.city ? styles.wrong_input : ''} />
                            <div className={styles.svg_container}>
                                <LocationCityRoundedIcon />
                            </div>
                        </div>
                        <div className={styles.input_d}>
                            <label htmlFor='street'>Strada*</label>
                            <input type="text" id='street' name='street' value={street} onChange={e => { setStreet(e.target.value) }} onClick={() => error.street = false} className={error.street ? styles.wrong_input : ''} />
                            <div className={styles.svg_container}>
                                <AddRoadTwoToneIcon />
                            </div>
                        </div>
                        <div className={styles.input_d}>
                            <label htmlFor='dom'>Dovada domiciliului*</label>
                            <div className={styles.file_upload}>
                                <input type="file" id='domiciliu' name='domiciliu' onChange={e => uploadPhoto(e)} mulitple={false} accept='image/*' className={error.photo ? styles.wrong_input : ''} />
                                <label htmlFor='domiciliu' className={styles.button_file_input} onClick={() => error.photo = false }>Adaugă poza</label>
                                <Image src={photo.photo ? photo.photo : '/'} width={100} height={100} /> 
                            </div>

                        </div>

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