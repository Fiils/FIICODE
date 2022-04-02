import { FC, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'

import styles from '../../styles/scss/Authentication/Registration.module.scss'
import overrideStyles from '../../styles/scss/Authentication/ForgotPassword.module.scss'
import { server } from '../../config/server'


const Code: FC = () => {
    const router = useRouter()

    const [ code, setCode ] = useState('')
    const [ codeError, setCodeError ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    

    const handleSubmitCode = async (e: any) => {
        e.preventDefault()

        setLoading(true)
        const codeValue = code

        if(code === '') {
            setCodeError(true)
            setLoading(false)
            return;
        }

        const result = await axios.post(`${server}/api/register/code-validation`, { codeValue }, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err)
                            setCodeError(true)
                        })
        
        if(result && result.message === 'Utilizator creat') {
            router.reload()
            setLoading(false)
        } else {
            setLoading(false)
            setCodeError(true)
        }
    }

    return (
        <form className={styles.form}>
            <h2 style={{ textAlign: 'center', marginBottom: 0, marginTop: 10 }}>Verifică-ți inboxul!</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20}}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648464445/FIICODE/mail-142_2_ouytab.svg' width={120} height={120} />
            </div>
            <p className={overrideStyles.additional_info}>Verifică-ți inboxul emailului și o să vezi că ai primit un mail cu un cod. Introdu-l mai jos pentru a finaliza crearea noului tău cont. Dacă nu îl găsești, verifică secțiunea spam.</p>
            <div className={`${styles.input_d} ${codeError ? styles.wrong_input : ''}`}>
                <label htmlFor='code'>Cod</label>
                <input type="text" autoComplete='code' id='code' name='code' value={code} maxLength={6} onChange={e => { setCode(e.target.value); setCodeError(false) }} />
                {codeError && <label style={{ color: 'red' }}>Cod incorect</label> }
             </div>
            <div className={overrideStyles.button_sub}>
                    {!loading ?
                    <button type="submit" onClick={e => handleSubmitCode(e)}>Trimite</button>
                    :
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' width={150} height={150} /> }
            </div>
        </form>
    )
}

export default Code;