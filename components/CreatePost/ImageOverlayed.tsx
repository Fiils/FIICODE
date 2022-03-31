import type { FC, Dispatch, SetStateAction } from 'react';
import { useState } from 'react'

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

    return (
        <div className={styles.image_lay}  onMouseEnter={() => setDeleteImage(true)} onMouseLeave={() => setDeleteImage(false)}>
            <img src={img.toString()} width={300} height={200} />
            {deleteImage &&
                <div className={styles.delete_photo}>
                    <button onClick={e => handleDeleteImage(e)}>Elimină</button>
                </div>
            }
        </div>
    )
}

export default ImageOverlayed