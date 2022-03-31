import type { NextPage } from 'next'
import { useState } from 'react'
import Image from 'next/image'

import styles from '../../styles/scss/CreatePost/FormContainer.module.scss'
import ImageOverlayed from '../../components/CreatePost/ImageOverlayed'
import { style } from '@mui/material/node_modules/@mui/system'


const CreatePost: NextPage = () => {
    const [ title, setTitle ] = useState('')
    const [ files, setFiles ] = useState<Array<string>>([])
    const [ video, setVideo ] = useState('')
    const [ description, setDescription ] = useState('')


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

    const uploadPhoto = async (e: any) => {
        Array.from(e.target.files).forEach(
            async (file: any) => {
                const base64: string = await convertToBase64(file)
                setFiles([ ...files, base64 ])
            })
    }


   const uploadVideo = async (e: any) => {
        if(e.target.files[0]) {
            console.log(e.target.files[0])
            const base64: string = await convertToBase64(e.target.files[0])
            setVideo(base64)
        }
   }

    return (
        <div>
            <div className={styles.heading}>
                {/* <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648723146/FIICODE/pencil-9435_6_vy4qhc.svg' height={70} width={70} /> */}
                <h1>Creează o nouă postare:</h1>
            </div>
            {/* <div className={styles.informative}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648735273/FIICODE/news-4309_kvmcvx.svg' width={200} height={200} />
                <p>Completează spațiile de mai jos, iar apoi postează-ți, după care doar așteaptă ca aceasta să fie și ceilalți locuitori care ți-o vor vota.</p>
            </div> */}
            <form className={styles.form}>
                <div className={styles.background_make}>
                    <div className={styles.input} style={{ width: '100%' }}>
                        <label htmlFor='title'>Titlu</label>
                        <input id='title' name='title' value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                </div>
                <div className={styles.flex_add}>
                    <div style={{ width: '70%' }}>
                        <div className={`${styles.input}`}>
                            <label htmlFor='file'>Media</label>
                            <div className={styles.image_container}>
                                {files.length > 0 ?
                                <>
                                    {files.map((img: string, i: number) => {
                                        return <ImageOverlayed key={img + i} img={img} i={i} files={files} setFiles={setFiles} />
                                    })}
                                </>
                                : 
                                    <div className={styles.no_content}>
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648634881/FIICODE/no-image-6663_1_j2edue.svg' width={100} height={100} />
                                        <p>Nicio poză selectată</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.input} ${styles.input_upload}`}> 
                        <label htmlFor='file'>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648737190/FIICODE/add-button-12004_2_wykdch.svg' width={100} height={100} />
                        </label>
                        <input type='file' id='file' name='file' onChange={uploadPhoto} onClick={e => e.target.value = '' } accept='image/*' />
                    </div>
                </div>
                <div className={styles.flex_add}>
                    <div className={`${styles.input} ${styles.input_upload}`} style={{ width: '50%'}}>
                        <label htmlFor='video'>Video</label>
                        <div className={styles.container_video}>
                            {(!video || video === '') ? 
                            <div className={`${styles.no_content} ${styles.video_nc}`}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648724416/FIICODE/movie-2801_1_xbdtxt.svg' width={100} height={100} />
                                <p>Niciun video selectat</p>
                            </div>
                            : 
                                <div className={styles.video}>
                                    <video
                                        className="VideoInput_video"
                                        width="100%"
                                        height={'100%'}
                                        controls
                                        src={video}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                    <div className={`${styles.input} ${styles.input_upload}`} style={{ gap: '5em'}}> 
                        <div>
                            <label htmlFor='video'>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648724485/FIICODE/add-button-12016_c7lysa.svg' width={100} height={100} />
                            </label>
                            <input type='file' id='video' name='video' onChange={uploadVideo} onClick={e => e.target.value = '' } accept="video/mp4,video/x-m4v,video/*" />
                        </div>
                        <Image onClick={() => setVideo('')} src='https://res.cloudinary.com/multimediarog/image/upload/v1648734543/FIICODE/cancel-close-10371_t58cgj.svg' width={100} height={100} />
                    </div>
                </div>
                <div className={styles.input}>
                    <label htmlFor='description'>Descriere</label>
                    <textarea id='description' name='description' value={description} placeholder='Descrie mai pe larg ideea...' onChange={e => setDescription(e.target.value)}/>
                </div>
            </form>
        </div>
    )
}

export default CreatePost;