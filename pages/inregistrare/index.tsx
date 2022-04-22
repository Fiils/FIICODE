import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Cookies from 'js-cookie'

import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import AddRoadTwoToneIcon from '@mui/icons-material/AddRoadTwoTone';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

import styles from '../../styles/scss/Authentication/Registration.module.scss';
import CodeComponent from '../../components/Register/Code'
import { server, dev } from '../../config/server'
import GoogleInput from '../../components/Register/GoogleInput'
import useWindowSize from '../../utils/useWindowSize'
import { NoSSR } from '../../utils/NoSsr'


const Inregistrare: NextPage = () => {

    const [ name, setName ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ gender, setGender ] = useState('')
    const [ cnp, setCnp ] = useState('')

    const [ city, setCity ] = useState('')
    const [ fullExactPosition, setFullExactPosition ] = useState<any>()
    const [ street, setStreet ] = useState('')
    const [ photo, setPhoto ] = useState({ domiciliu: '', buletin: '' })

    const [ showPassword, setShowPassword ] = useState(false)
    const [ nextPage, setNextPage ] = useState(false)
    const [ hideFirstPage, setHideFirstPage ] = useState(false)
    const [ showNextPage, setShowNextPage ] = useState(false)
    const [ showPrevPageAnim, setShowPrevPageAnim ] = useState(false)

    const [ width, height ] = useWindowSize()

    const [ loading, setLoading ] = useState(false)

    const [ codePage, setCodePage ] = useState(false)

    const [ fullError, setFullError ] = useState(false)
    const [ error, setError ] = useState({ name: false, firstName: false, email: false, password: false, gender: false, cnp: false, city: false, street: false, domiciliu: false, buletin: false })
    const [ errorMessages, setErrorMessages ] = useState({ name: '', firstName: '', email: '', password: '', gender: '', cnp: '', city: '', street: '', domiciliu: '', buletin: '' })
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setFullError(false)
        const domiciliu = photo.domiciliu
        const buletin = photo.buletin
        if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== city) {
            setError({ ...error, city: true })
            setErrorMessages({ ...errorMessages, city: 'Localitate invalidă'})
            setLoading(false)
            return;
        }

        let locationError = false

        let county: any = [];
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_1')) {
                    for(let j = 0; j < (fullExactPosition.address_components[i].long_name.split(' ').length > 1 ? fullExactPosition.address_components[i].long_name.split(' ').length - 1 :  fullExactPosition.address_components[i].long_name.split(' ').length); j++){
                        county = [ ...county, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    county = county.join(" ")
                    break;
                }
                if(i === fullExactPosition.address_components.length - 1) {
                    setError({ ...error, city: true })
                    setErrorMessages({ ...errorMessages, city: 'Localitate invalidă' })
                    locationError = true
                }
            }
        } else {
            setError({ ...error, city: true })
            setErrorMessages({ ...errorMessages, city: 'Localitate invalidă' })
            locationError = true
        }

        let comuna: any = [], ok = 0;
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_2')) {
                    ok = 1;
                    for(let j = 0; j < fullExactPosition.address_components[i].long_name.split(' ').length; j++){
                        comuna = [ ...comuna, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    comuna = comuna.join(" ")
                    break;
                }
            }
        }

        if(Array.isArray(comuna)) {
            comuna = ''
        }
        
        if(ok === 1 && !comuna){
            setError({ ...error, city: true })
            setErrorMessages({ ...errorMessages, city: 'Localitate invalidă' })
            locationError = true
        }

        const person = { name, firstName, email, password, comuna, gender, cnp, city, county, street, domiciliu, buletin }

        const regex = /^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i
        const cnpRegex = /^\d+$/
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        setError({ 
            name: !name.length,
            firstName: !firstName.length,
            email: !email.length ? !email.length : (!email.match(emailRegex) ? true : false ),
            password: !password.length ? !password.length : (password.length < 8 ? true : (!regex.test(password) ? true : false )),
            gender: !gender.length,
            cnp: !cnp.length ? !cnp.length : (!cnpRegex.test(cnp) ? true : (cnp.length !== 13 ? true : false )),
            city: !city.length,
            street: !street.length,
            domiciliu: !photo.domiciliu.length,
            buletin: !photo.buletin.length
        })
        setErrorMessages({
            name: !name.length ? 'Spațiul nu poate fi gol' : '',
            firstName: !firstName.length ? 'Spațiul nu poate fi gol' : '',
            email: !email.length ? 'Spațiul nu poate fi gol' : (!email.match(emailRegex) ? 'Email invalid' : '' ),
            password: !password.length ? 'Spațiul nu poate fi gol' : (password.length < 8 ? 'Parolă prea scurtă' : (!regex.test(password) ? 'Parola trebuie să conțină caractere alfanumerice' : '' )),
            gender: !gender.length ? 'Spațiul nu poate fi gol' : '',
            cnp: !cnp.length ? 'Spațiul nu poate fi gol' : (!cnpRegex.test(cnp) ? 'CNP-ul conține doar cifre' : (cnp.length !== 13 ? 'CNP-ul are doar 13 cifre' : '' )),
            city: !city.length ? 'Spațiul nu poate fi gol' : '',
            street: !street.length ? 'Spațiul nu poate fi gol' : '',
            domiciliu: !domiciliu.length ? 'Spațiul nu poate fi gol' : '',
            buletin: !buletin.length ? 'Spațiul nu poate fi gol' : '',
        })
        
        if(!name.length || !firstName.length || !email.length || !password.length || !gender.length || !cnp.length || !city.length || !county.length || !street.length || !photo.buletin.length || !photo.domiciliu.length || !email.match(emailRegex) || password.length < 8 || !cnpRegex.test(cnp) || !regex.test(password) || cnp.length !== 13 || locationError){
            setLoading(false);
            return;
        } 

        const result = await axios.post(`${server}/api/register`, person, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            setLoading(false)
                            setFullError(true)
                            if(err.response && err.response.data && err.response.data.type === 'email') {
                                setErrorMessages({ ...errorMessages, email: err.response.data.message })
                                setError({ ...error, email: true })
                            } else if(err.response && err.response.data && err.response.data.type === 'cnp') {
                                setErrorMessages({ ...errorMessages, cnp: err.response.data.message })
                                setError({ ...error, cnp: true })
                            } else console.log(err)
                        })
        
        if(result && result.message === 'Cerere acceptată'){
            Cookies.set('data-id', result.token, { expires: (1 * 1440) * 15, sameSite: dev ? 'lax' : 'none', secure: !dev })
            setCodePage(true)
            setLoading(false)
        } else {
            setLoading(false)
        }
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
                <div className={styles.go_back}>
                    <span><Link href='/'>Înapoi</Link></span>
                    <KeyboardReturnRoundedIcon />
                </div>
                <div className={styles.logo}>
                    <NoSSR fallback={null}><Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' alt='Logo' width={width > 450 ? (width < 900 ? 40 : 60) : 30} height={width > 450 ? (width < 900 ? 40 : 60) : 30} /></NoSSR>
                    <span>ROMDIG</span>
                </div>
                {!codePage ? 
                <form className={styles.form}>
                        {!hideFirstPage &&
                            <div className={`${(nextPage && !showPrevPageAnim) ? styles.animation_slide_left : ''} ${hideFirstPage ? styles.hidden : ''} ${showPrevPageAnim ? styles.animation_slide_from_left : ''}`}>
                            <h2 style={{ textAlign: 'center' }}>
                                Creează un nou cont
                            </h2>
                            <div className={styles.input_d} style={{ display: 'flex', gap: '2em', justifyContent: 'center', marginTop: 0}}>
                                <div className={`${styles.input_d} ${error.name ? styles.wrong_input : ''}`}>
                                    <label htmlFor='name'>Nume*</label>
                                    <input maxLength={50} type="text" autoComplete='name' id='name' name='name' value={name} onChange={e => { setName(e.target.value); setError({ ...error, name: false }); setErrorMessages({ ...errorMessages, name: '' }) }} />
                                    {errorMessages.name !== '' ? <label id='#wrong' style={{ color: 'red' }}>{errorMessages.name}</label> : <></> }
                                </div>
                                <div className={`${styles.input_d} ${error.firstName ? styles.wrong_input : ''}`}>
                                    <label htmlFor='firstName'>Prenume*</label>
                                    <input maxLength={50} type="text" id='firstName' autoComplete='firstName' name='firstName' value={firstName} onChange={e => { setFirstName(e.target.value); setError({ ...error, firstName: false }); setErrorMessages({ ...errorMessages, firstName: '' }) }} />
                                    {errorMessages.firstName !== ''  ? <label id='#wrong' style={{ color: 'red' }}>{errorMessages.firstName}</label> : <></> }
                                </div>
                            </div>
                            <div className={`${styles.input_d} ${error.email ? styles.wrong_input : ''}`}>
                                <label htmlFor='email'>E-mail*</label>
                                <input maxLength={255} type="text" id='email' name='email' autoComplete='email' value={email} onChange={e => { setEmail(e.target.value); setError({ ...error, email: false }); setErrorMessages({ ...errorMessages, email: ''  }) }} />
                                <div className={styles.svg_container}>
                                    <EmailIcon />
                                </div>
                                {errorMessages.email !== ''  ? <label id='#wrong' style={{ color: 'red' }}>{errorMessages.email}</label> : <></> }
                            </div>
                            <div className={`${styles.input_d} ${error.password ? styles.wrong_input : ''}`}>
                                <label htmlFor='password'>Parolă*</label>
                                <input type={!showPassword ? 'password' : 'text'} autoComplete='current-password' minLength={8} id='password' name='password' value={password} onChange={e => { setPassword(e.target.value); setError({ ...error, password: false }); setErrorMessages({ ...errorMessages, password: '' }) }} />
                                <div className={styles.svg_container}>
                                    {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                                </div>
                                {errorMessages.password !== ''  ? <label id='#wrong' style={{ color: 'red' }}>{errorMessages.password}</label> : <></> }
                            </div>
                            <div className={`${styles.buttons_gender} ${error.gender ? styles.wrong_input : ''}`}>
                                <button className={gender === 'Bărbat' ? styles.selected : ''} type="button" onClick={() => { setGender('Bărbat'); setError({ ...error, gender: false }) }}><ManIcon /></button>
                                <button className={gender === 'Femeie' ? styles.selected : ''} type="button" onClick={() => { setGender('Femeie');  setError({ ...error, gender: false }) }}><WomanIcon /></button>
                            </div>
                            <div className={styles.button_sub}>
                                <button type="button" onClick={() => setNextPage(true)}>Următorul pas</button>
                            </div>
                            </div> }
                            {showNextPage && 
                            <div className={`${nextPage ? styles.animation_slide_from_right : styles.animation_slide_right}`}>
                                <div className={styles.prev} onClick={e => previousStep(e)}>
                                    <ArrowCircleUpIcon style={{transform: 'rotate(-90deg)', color: (error.name || error.firstName || error.email || error.password || error.gender) ? 'red' : 'black' }}/>
                                    <span style={{ color: (error.name || error.firstName || error.email || error.password || error.gender) ? 'red' : 'black' }}>Pasul anterior</span>
                                </div>
                                <h2 style={{ textAlign: 'center' }}>
                                    Creează un nou cont
                                </h2>
                                <div className={`${styles.input_d} ${error.cnp ? styles.wrong_input : ''}`}>
                                    <label htmlFor='cnp'><abbr title='Cod Numeric Personal' style={{ textDecoration: 'none' }}>CNP</abbr>*</label>
                                    <input maxLength={13} minLength={13} type="text" id='cnp' name='cnp' autoComplete='CNP' value={cnp} onChange={e => { setCnp(e.target.value); setError({ ...error, cnp: false }); setErrorMessages({ ...errorMessages, cnp: '' }) }} />
                                    <div className={styles.svg_container}>
                                        <BadgeIcon />
                                    </div>
                                    {errorMessages.cnp !== ''  ? <label id='#wrong' style={{ color: 'red' }}>{errorMessages.cnp}</label> : <></> }
                                </div>
                                <div className={`${styles.input_d} ${error.city ? styles.wrong_input : ''}`} >
                                        <label htmlFor='city'>Localitate* (exactă, nu județ)</label>
                                        <GoogleInput name={'city'} setFullExactPosition={setFullExactPosition} county={city} setCounty={setCity} setError={setError} error={error} setErrorMessages={setErrorMessages} errorMessages={errorMessages} />
                                        {errorMessages.city !== ''  ? <label id='#wrong' style={{ color: 'red' }}>{errorMessages.city}</label> : <></> }
                                </div>
                                <div className={`${styles.input_d} ${error.street ? styles.wrong_input : ''}`}>
                                    <label htmlFor='street'>Strada* (buletin)</label>
                                    <input maxLength={200} type="text" id='street' name='street' value={street} autoComplete='street' onChange={e => { setStreet(e.target.value); setError({ ...error, street: false }); setErrorMessages({ ...errorMessages, street: '' }) }} />
                                    <div className={styles.svg_container}>
                                        <AddRoadTwoToneIcon />
                                    </div>
                                    {errorMessages.street !== ''  ? <label id='#wrong' style={{ color: 'red' }}>{errorMessages.street}</label> : <></> }
                                </div>
                                <div className={styles.file_upload_container}>
                                    <div className={styles.input_upload} id='file-upload'>
                                        <label htmlFor='poza' className={styles.hover_for_info} hover-info='Orice act oficial, emis de instituții oficiale române, prin care este dovedit domiciliul'>Dovada domiciliului*</label>
                                        <div className={styles.file_upload}>
                                            <input type="file" id='domiciliu' name='domiciliu' onChange={e => uploadPhoto(e, 1)} multiple={false} accept='image/*' />
                                            <label htmlFor='domiciliu' className={`${styles.button_file_input} ${photo.domiciliu !== '' ? styles.button_file_uploaded : ''} ${error.domiciliu ? styles.wrong_input : ''}`} onClick={() => setError({ ...error, domiciliu: false })}>{photo.domiciliu === ''  ? 'Adaugă poza' : 'Poză adaugată'}</label>
                                        </div>
                                    </div>
                                    <div className={styles.input_upload} id='file-upload'>
                                        <label htmlFor='poza'>Poza buletinului*</label>
                                        <div className={styles.file_upload}>
                                            <input type="file" id='buletin' name='buletin' onChange={e => uploadPhoto(e, 2)} multiple={false} accept='image/*' />
                                            <label htmlFor='buletin' className={`${styles.button_file_input} ${photo.buletin !== '' ? styles.button_file_uploaded : ''} ${error.buletin ? styles.wrong_input : ''}`} onClick={() => setError({ ...error, buletin: false })}>{photo.buletin === ''  ? 'Adaugă poza' : 'Poză adaugată'}</label>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.button_sub}>
                                    {!loading ?
                                    <button type="submit" onClick={e => handleSubmit(e)}>Trimite</button>
                                    :
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' alt='Loading...' width={150} height={150} /> }
                                </div>
                                {fullError && <label style={{ display: 'flex', justifyContent: 'center', alignContent: 'flex-end', color: 'red', fontWeight: 800 }}>Ceva neașteptat s-a întamplat </label> }
                            </div>
                            }
                </form>
                :
                <CodeComponent />
                }
            </div>
        </>
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