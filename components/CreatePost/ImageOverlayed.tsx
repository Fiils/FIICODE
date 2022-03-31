import type { FC, Dispatch, SetStateAction } from 'react';
import { useState } from 'react'
import Image from 'next/image'

import styles from '../../styles/scss/CreatePost/FormContainer.module.scss';

interface ImageOverlayProps {
    img: string;
    i: number;
    setFiles: Dispatch<SetStateAction<any>>;
    files: any;
}

const ImageOverlayed: FC<ImageOverlayProps> = ({ img, i, setFiles, files }) => {

    const [ deleteImage, setDeleteImage ] = useState(false)

    const handleDeleteImage = (e: any) => {
        e.preventDefault();
        const newFiles = [...files]
        newFiles.splice(i, 1)
        setFiles(newFiles)
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

    const uploadPhoto = async (e: any) => {
        if(e.target.files[0] && e.target.files[0].size / 1000000 < 5) {
            const base64: string = await convertToBase64(e.target.files[0])
            setFiles([ ...files, base64 ])
        }
    }

    return (
        <div className={styles.image_lay} onMouseEnter={() => setDeleteImage(true)} onMouseLeave={() => setDeleteImage(false)}>
            {img ?
            <>
                    <div className={styles.img_replace} style={{ padding: 0}}>
                        <Image src={img.toString()} width={150} height={150} />
                        {deleteImage &&
                            <div className={styles.delete_photo}>
                                <button onClick={e => handleDeleteImage(e)}>Elimină</button>
                            </div>
                        }
                    </div>
            </>
            :
            <>
                <input type='file' id='file' name='file' onChange={uploadPhoto} style={{ display: 'none' }} onClick={e => { const target = e.target as HTMLInputElement; target.value = '' } } accept='image/*' />
                <label htmlFor='file'>
                    <div className={`${styles.img_replace} ${i === 0 ? styles.first_element : ''}`}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648634881/FIICODE/no-image-6663_1_j2edue.svg' width={50} height={50} />
                    </div>
                </label>
            </>
        }
        </div>
    )
}

export default ImageOverlayed