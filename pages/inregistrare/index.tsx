import type { NextPage } from 'next';
import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import AddRoadTwoToneIcon from '@mui/icons-material/AddRoadTwoTone';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

import styles from '../../styles/scss/Authentication/Registration.module.scss';


const Inregistrare: NextPage = () => {

    const [ name, setName ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ gender, setGender ] = useState('')
    const [ cnp, setCnp ] = useState('')

    const [ city, setCity ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ photo, setPhoto ] = useState({ domiciliu: '', buletin: '' })

    const [ showPassword, setShowPassword ] = useState(false)
    const [ nextPage, setNextPage ] = useState(false)
    const [ hideFirstPage, setHideFirstPage ] = useState(false)
    const [ showNextPage, setShowNextPage ] = useState(false)
    const [ showPrevPageAnim, setShowPrevPageAnim ] = useState(false)

    const [ error, setError ] = useState({ name: false, firstName: false, email: false, password: false, gender: false, cnp: false, city: false, street: false, domiciliu: false, buletin: false })
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const domiciliu = photo.domiciliu
        const buletin = photo.buletin
        const person = { name, firstName, email, password, gender, cnp, city, street, domiciliu, buletin }

        setError({
            name: !name.length,
            firstName: !firstName.length,
            email: !email.length,
            password: !password.length,
            gender: !gender.length,
            cnp: !cnp.length,
            city: !city.length,
            street: !street.length,
            domiciliu: !photo.domiciliu.length,
            buletin: !photo.buletin.length
        })
        if( name === '' || firstName === '' || email === '' || password === '' || gender === '' || city === '' || street === '' || photo.domiciliu === '' || photo.buletin === '' || cnp === '') return;

        const result = await axios.post('http://localhost:9999/api/register', person, { withCredentials: true })
                        .then(res => res.data)
    }

    // const validateNotEmpty = (value) => {
    //     return !value.length;
    // }
    
    // const validatePassword = (value) => {
    //     return value.length > 8;
    // }
    
    // const validateField = (rules, value) => {
    //     for (rule in rules) {
    //         if (!rule(value)) return false;
    //     }
    // }
    
    // setError({
    //     password: validateField([validateNotEmpty, validatePassword], password)
    // })

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

    const convertToBase64 = (file: any): any => {
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

    const uploadPhoto = async (e: any, i: number) => {
        if(e.target.files[0]) { 
            const base64: string = await convertToBase64(e.target.files[0])
            if(i === 1) {
                setPhoto({ ...photo, domiciliu: base64 })
            } else if(i === 2) {
                setPhoto({ ...photo, buletin: base64 })
            }
        }
    }


    console.log(error)

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
            <form className={styles.form}>
                
                {!hideFirstPage &&
                    <div className={`${(nextPage && !showPrevPageAnim) ? styles.animation_slide_left : ''} ${hideFirstPage ? styles.hidden : ''} ${showPrevPageAnim ? styles.animation_slide_from_left : ''}`}>
                    <h2 style={{ display: 'flex', alignItems: 'center'}}>
                        <div>
                            <AccountBoxOutlinedIcon />
                        </div>
                        Creează un nou cont
                    </h2>
                    <div className={styles.input_d} style={{ display: 'flex', gap: '2em', justifyContent: 'center'}}>
                        <div className={`${styles.input_d} ${error.name ? styles.wrong_input : ''}`}>
                            <label htmlFor='name'>Nume*</label>
                            <input type="text" id='name' name='name' value={name} onChange={e => { setName(e.target.value); setError({ ...error, name: false }) }} />
                        </div>
                        <div className={`${styles.input_d} ${error.firstName ? styles.wrong_input : ''}`}>
                            <label htmlFor='name'>Prenume*</label>
                            <input type="text" id='name' name='name' value={firstName} onChange={e => { setFirstName(e.target.value); setError({ ...error, firstName: false }) }} />
                        </div>
                    </div>
                    <div className={`${styles.input_d} ${error.email ? styles.wrong_input : ''}`}>
                        <label htmlFor='email'>E-mail*</label>
                        <input type="email" id='email' name='email' value={email} onChange={e => { setEmail(e.target.value); setError({ ...error, email: false }) }} />
                        <div className={styles.svg_container}>
                            <EmailIcon />
                        </div>
                    </div>
                    <div className={`${styles.input_d} ${error.password ? styles.wrong_input : ''}`}>
                        <label htmlFor='password'>Parolă*</label>
                        <input type={!showPassword ? 'password' : 'text'} minLength={8} id='password' name='password' value={password} onChange={e => { setPassword(e.target.value); setError({ ...error, password: false }) }} />
                        <div className={styles.svg_container}>
                            {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                        </div>
                    </div>
                    <div className={`${styles.buttons_gender} ${error.gender ? styles.wrong_input : ''}`}>
                        <button className={gender === 'barbat' ? styles.selected : ''} type="button" onClick={() => { setGender('barbat'); setError({ ...error, gender: false }) }}><ManIcon /></button>
                        <button className={gender === 'femeie' ? styles.selected : ''} type="button" onClick={() => { setGender('femeie');  setError({ ...error, gender: false }) }}><WomanIcon /></button>
                    </div>
                    <div className={styles.button_sub}>
                        <button type="button" onClick={() => setNextPage(true)}>Următorul pas</button>
                    </div>
                    </div> }
                    {showNextPage && 
                    <div className={`${nextPage ? styles.animation_slide_from_right : styles.animation_slide_right}`}>
                        <div className={styles.prev} onClick={e => previousStep(e)}>
                            <ArrowCircleUpIcon style={{transform: 'rotate(-90deg)' }}/>
                            <span>Pasul anterior</span>
                        </div>
                        <h2>Creează un nou cont</h2>
                        <div className={`${styles.input_d} ${error.city ? styles.wrong_input : ''}`}>
                            <label htmlFor='cnp'><abbr title='Cod Numeric Personal' style={{ textDecoration: 'none' }}>CNP</abbr>*</label>
                            <input type="text" id='cnp' name='cnp' value={cnp} onChange={e => { setCnp(e.target.value); setError({ ...error, cnp: false }) }} />
                            <div className={styles.svg_container}>
                                <BadgeIcon />
                            </div>
                        </div>
                        <div className={`${styles.input_d} ${error.city ? styles.wrong_input : ''}`}>
                            <label htmlFor='provenience'>Localitate*</label>
                            <input type="text" id='provenience' name='provenience' value={city} onChange={e => { setCity(e.target.value); setError({ ...error, city: false }) }} />
                            <div className={styles.svg_container}>
                                <LocationCityRoundedIcon />
                            </div>
                        </div>
                        <div className={`${styles.input_d} ${error.street ? styles.wrong_input : ''}`}>
                            <label htmlFor='street'>Strada*</label>
                            <input type="text" id='street' name='street' value={street} onChange={e => { setStreet(e.target.value); setError({ ...error, street: false }) }} />
                            <div className={styles.svg_container}>
                                <AddRoadTwoToneIcon />
                            </div>
                        </div>
                        <div className={styles.file_upload_container}>
                            <div className={styles.input_upload} id='file-upload'>
                                <label htmlFor='poza'>Dovada domiciliului*</label>
                                <div className={styles.file_upload}>
                                    <input type="file" id='domiciliu' name='domiciliu' onChange={e => uploadPhoto(e, 1)} multiple={false} accept='image/*' />
                                    <label htmlFor='domiciliu' className={`${styles.button_file_input} ${error.domiciliu ? styles.wrong_input : ''}`} onClick={() => setError({ ...error, domiciliu: false })}>{photo.domiciliu === ''  ? 'Adaugă poza' : 'Poză adaugată'}</label>
                                </div>
                            </div>
                            <div className={styles.input_upload} id='file-upload'>
                                <label htmlFor='poza'>Poza buletinului*</label>
                                <div className={styles.file_upload}>
                                    <input type="file" id='buletin' name='buletin' onChange={e => uploadPhoto(e,2 )} multiple={false} accept='image/*' />
                                    <label htmlFor='buletin' className={`${styles.button_file_input} ${error.buletin ? styles.wrong_input : ''}`} onClick={() => setError({ ...error, buletin: false })}>{photo.buletin === ''  ? 'Adaugă poza' : 'Poză adaugată'}</label>
                                </div>
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