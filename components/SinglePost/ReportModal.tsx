import axios from 'axios'
import { useRouter } from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import { useState } from 'react'

import { server } from '../../config/server'
import styles from '../../styles/scss/SinglePost/ReportModal.module.scss'


const ReportModal = ({ id, setReport, setReportModal }: { id: string, setReport: Dispatch<SetStateAction<boolean>>, setReportModal: Dispatch<SetStateAction<boolean>> }) => {
    const router = useRouter()
    const [ text, setText ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    const ReportRequest = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        const reason = text

        if(reason === '') {
            setLoading(false)
            setError(true)
            return
        }

        const result = await axios.patch(`${server}/api/post/report/${id}`, { reason }, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err);
                                        setLoading(false)
                                        setError(true)
                                    })

        if(result && result.message === 'Postare raportată') {
            setReport(true)
            setReportModal(false)
            setLoading(false)
        }
    }

    const ReasonButton = ({ reason }: { reason: string }) => {

        return (
            <button type="button" className={`${text === reason ? styles.selected : ''} ${error ? styles.error : ''}`} onClick={e => { setError(false); setText(e.currentTarget.innerText) } }>{reason}</button>
        )
    }

    return (
        <>
            <div className={styles.overlay}></div>
            <div className={styles.modal_container}>
                <div style={{ marginInline: 10, marginTop: -12 }}>
                    <div className={styles.icon_modal}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648826940/FIICODE/start-flag-8253_3_bhujpa.svg' width={30} height={30} />
                    </div>
                    <div className={styles.close_image}>
                        <h2 className={styles.title_modal}>Raportează</h2>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649333841/FIICODE/x-10327_1_larnxj.svg' width={20} height={20} onClick={e => setReportModal(false) } />
                    </div>
                </div>
                <div className={styles.reasons_box}>
                    <ReasonButton reason={'Localizare greșită'} />
                    <ReasonButton reason={'Conținut irelevant'} />
                    <ReasonButton reason={'Dezinformare'} />
                    <ReasonButton reason={'Ilegal'} />
                    <ReasonButton reason={'Conținut ireverențios'} />
                    <ReasonButton reason={'Altceva'} />
                </div>

                <div className={styles.send}>
                    {!loading ?
                        <button onClick={e => ReportRequest(e)}>Trimite</button>
                    :
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648889925/FIICODE/Spin-1s-213px_y6wmrs.svg' alt='Loading...' width={50} height={50} />
                    }
                </div>
            </div>
        </>
    )
}

export default ReportModal;