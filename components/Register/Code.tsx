import { FC, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'

import styles from '../../styles/scss/Authentication/Registration.module.scss'
import overrideStyles from '../../styles/scss/Authentication/ForgotPassword.module.scss'

const Code: FC = () => {
    const router = useRouter()

    const [ code, setCode ] = useState('')
    const [ codeError, setCodeError ] = useState(false)

    const handleSubmitCode = async (e: any) => {
        e.preventDefault()

        const codeValue = code

        if(code === '') {
            setCodeError(true)
            return;
        }

        const result = await axios.post('http://localhost:9999/api/register/code-validation', { codeValue }, { withCredentials: true })
                        .then(res => res.data)

        if(result === 'Utilizator creat') {
            router.push('/')
        }
    }

    return (
        <form className={styles.form}>
            <h2 style={{ textAlign: 'center', marginBottom: 10, marginTop: 10 }}>Verifică-ți inboxul</h2>
            <p className={overrideStyles.additional_info}>Verifică-ți inboxul emailului și o să vezi că ai primit un mail cu un cod. Introdu-l mai jos pentru a finaliza crearea noului tău cont. Dacă nu îl găsești, verifică secțiunea spam.</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20}}>
                <Image src='https://res.cloudinary.com/media-cloud-dw/image/upload/v1647622544/FIICODE/mail-letter-3021_yzhd1o.svg' width={120} height={120} />
            </div>
            <div className={`${styles.input_d} ${codeError ? styles.wrong_input : ''}`}>
                <label htmlFor='code'>Cod</label>
                <input type="text" id='code' name='code' value={code} maxLength={6} onChange={e => { setCode(e.target.value); setCodeError(false) }} />
            </div>
            <div className={overrideStyles.button_sub}>
                     <button type="submit" onClick={e => handleSubmitCode(e)}>Trimite</button>
            </div>
        </form>
    )
}

export default Code;