import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../styles/scss/CreatePost/FormContainer.module.scss'
import { server } from '../../config/server'
import ImageOverlayed from '../../components/CreatePost/ImageOverlayed'
import { useAuth } from '../../utils/useAuth'

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from "@mui/material/styles";


import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)



const CreatePost: NextPage = () => {
    const router = useRouter()

    const user = useAuth()

    const greenTheme = createTheme({
        palette: {
            primary: {
                main: '#94C294'
            }
        },
    });

    const [ title, setTitle ] = useState('')
    const [ files, setFiles ] = useState<Array<string>>([])
    const [ video, setVideo ] = useState('')
    const [ description, setDescription ] = useState(EditorState.createEmpty())
    const [ village, setVillage ] = useState('false')


    const mapOut = [ 0, 1, 2, 3, 4, 5, 6, 7 ]


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


   const uploadVideo = async (e: any) => {
        if(e.target.files[0] && e.target.files[0].size / 1000000 < 100) {
            console.log(e.target.files[0])
            const base64: string = await convertToBase64(e.target.files[0])
            setVideo(base64)
        }
   }

   const [ loading, setLoading ] = useState(false)
   const [ error, setError ] = useState({ title: false, description: false })
   const [ errorMessages, setErrorMessages ] = useState({ title : '', description : '' })
   const [ fullError, setFullError ] = useState(false)

    const handleSubmit = async (e: any) => {
        if(user.user.active) {
            e.preventDefault()

            const descriptionText = draftToHtml(convertToRaw(description.getCurrentContent()))
            setFullError(false)
            setLoading(true)
            
            let numberOfChars = 0;
            for(const letter in convertToRaw(description.getCurrentContent()).blocks){
                for(let i = 0; i < convertToRaw(description.getCurrentContent()).blocks[letter].text.split('').length; i++){
                    if(convertToRaw(description.getCurrentContent()).blocks[letter].text.split('')[i] !== '' && convertToRaw(description.getCurrentContent()).blocks[letter].text.split('')[i] !== ' '){
                        numberOfChars++;
                    }
                }
            }

            setError({
                title: title.split('').length < 15 ? true : false,
                description: numberOfChars < 50 ? true : false
            })

            setErrorMessages({
                title: title.split('').length < 15 ? 'Titlu prea scurt' : '',
                description: numberOfChars < 50 ? 'Descriere prea scurtă' : ''
            })

            if(title.split('').length < 15 || numberOfChars < 50) {
                setLoading(false)
                return;
            }

            const result = await axios.post(`${server}/api/post/create`, { descriptionText, title, files, video, village }, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            setFullError(true)
                                            setLoading(false)
                                            console.log(err)
                                        })        

            if(result && result.message === 'Postare afișată'){
                setLoading(false)
                setTitle('')
                setFiles([])
                setVideo('')
                setVillage('false')
                setDescription(EditorState.createEmpty())

                router.push(`/postari/${result._id}`)
            }
        }                        
    }

    function wrongInput() {
        if (error.description) {
          return 'wrong_input';
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
            
            <div>
                <div className={styles.heading}>
                    <h1>Creează o nouă postare:</h1>
                </div>
                <form className={styles.form}>
                    <div className={styles.background_make} style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'flex-start'}}>
                        <div className={`${styles.input} ${error.title ? styles.wrong_input : ''}`} style={{ width: '100%' }}>
                            <label htmlFor='title'>Titlu</label>
                            <p>Oferă cât mai multe informații, în cât mai puține cuvinte <span style={{ color : '#8BBD8B'}}>(minimum 15 caractere)</span></p>
                            <input id='title' maxLength={150} minLength={15} name='title' value={title} onChange={e => { setError({ ...error, title: false }); setTitle(e.target.value) }} />
                            <p style={{ alignSelf: 'flex-end', marginRight: '30%', marginTop: 0 }}>{title.split('').length}/150</p>
                        </div>
                        {(user.user.comuna && user.user.comuna !== '') &&
                            <div className={styles.input} style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: '2em'}}>
                                <label>Nivel: </label>
                                <div>
                                    <ThemeProvider theme={greenTheme}>
                                        <FormControl variant='standard' sx={{ minWidth: 120}}>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={village}
                                                onChange={e => setVillage(e.target.value)}
                                                label="Tip"
                                            >
                                            <MenuItem value={'false'}>Comunal</MenuItem>
                                            <MenuItem value={'true'}>Sătesc</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </ThemeProvider>
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.background_make_photos}>
                        <div className={styles.flex_add}>
                            <div className={`${styles.input}`}>
                                <label id='#photo' htmlFor='file'>Imagini</label>
                                <p>Adaugă poze ca lumea să fie mai tentați să apese pe postarea ta <span style={{ color : '#8BBD8B'}}>(o imagine nu trebuie să aibă mai mult de 5mb)</span></p>
                                <div className={styles.image_container}>
                                        {mapOut.map((index: number) => {
                                            return <ImageOverlayed key={index} img={files[index]} i={index} files={files} setFiles={setFiles} />
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.background_make_video}>
                            <div style={{ width: '100%' }}>
                                        <div className={styles.input}>
                                            <label>Video</label>
                                            <p>Adaugă poze ca lumea să fie mai tentați să apese pe postarea ta <span style={{ color : '#8BBD8B'}}>(videoul nu trebuie să aibă mai mult de 100mb)</span></p>
                                            <div className={styles.flex_add}>
                                                <div className={styles.container_video}>
                                                    {(!video || video === '') ? 
                                                    <label htmlFor='video' className={styles.no_content}>
                                                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648724416/FIICODE/movie-2801_1_xbdtxt.svg' width={100} height={100} />
                                                            <p>Niciun video selectat</p>
                                                            <input type='file' style={{ display: 'none' }} id='video' name='video' onChange={uploadVideo} onClick={e => { const target = e.target as HTMLInputElement; target.value = '' } } accept="video/mp4,video/x-m4v,video/*" />
                                                    </label>
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
                                                <div className={styles.delete_icon}>
                                                    <Image onClick={() => setVideo('')} src='https://res.cloudinary.com/multimediarog/image/upload/v1648741801/FIICODE/close-x-10324_qtbbzj.svg' width={30} height={30} />
                                                </div>
                                            </div>
                                        </div>
                                    
                            </div>
                    </div>
                    <div className={styles.background_make_description}>
                        <div style={{ width: '100%' }}>
                            <div className={styles.description}>
                                <label htmlFor='description'>Descriere</label>
                                <p>Descrie cât mai pe larg ideea ta și încearcă să-i atragi cât mai bine, dând detalii multe <span style={{ color : '#8BBD8B'}}>(minimum 50 de caractere valide)</span></p>
                                <div style={{ width: '80%' }} className={error.description ? styles.wrong_input : ''}>
                                    <Editor
                                        wrapperClassName="wrapper-class"
                                        editorClassName="editor-class"
                                        toolbarClassName="toolbar-class"
                                        defaultEditorState={description}
                                        onEditorStateChange={setDescription}
                                        onChange={() => setError({ ...error, description: false })}
                                        toolbar={{
                                            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                                            fontSize: {
                                                options: [8, 9, 10, 11, 12, 14, 16, 18, 24]
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.background_make_button}>
                        {!loading ?
                            <>
                                {fullError && <span style={{ color: 'red', marginRight: 10 }}>Ceva neașteptat s-a întâmplat</span>}
                                {!user.user.active && <span style={{ color: 'red', marginRight: 10 }}>Contul nu a fost încă activat</span>}
                                <button type='submit' onClick={handleSubmit} disabled={!user.user.active}>Postează</button>
                            </>
                        :
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' width={60} height={60} /> 
                        }
                    </div>

                </form>
            </div>
        </>
    )
}

export default CreatePost;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies['x-access-token']
    let redirect = false

    if(!token) {
        return {
            redirect: {
                permanent: false,
                destination: '/autentificare'
            },
            props: {}
        }
    }

    const user = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err);
                            redirect = true
                        })

    if(redirect)  {
        return {
            redirect: {
                permanent: false,
                destination: '/autentificare'
            },
            props: {}
        }
    }

    return {
        props: {}
    }
}