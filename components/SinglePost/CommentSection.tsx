import type { FC } from 'react';
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'

import styles from '../../styles/scss/SinglePost/CommentSection.module.scss'
import { useAuth } from '../../utils/useAuth'
import Comment from './Comment'
import { server } from '../../config/server'
import useWindowSize from '../../utils/useWindowSize'
import { NoSSR } from '../../utils/NoSsr'


interface Comments {
    comments: {
        comments : [{
            _id: string;
            repliedToCommentId: string;
            repliedToId: string;
            originalPostId: string
            originalPosterId: string;
            nameAuthor: string;
            firstNameAuthor: string;
            authorId: any;
            text: string;
            upVoted: {
                count: number
                people: Array<string>
            },
            downVoted: {
                count: number;
                people: Array<string>
            },
            reported: {
                count: number;
                people: Array<string>;
                reasons: Array<string>
            };
            lowCommentLevel: boolean;
            hasReplies: boolean;
            profilePicture: string;
            creationDate: Date;
            deletedUser: boolean;
        }]
    }
}

const CommentSection: FC<Comments> = ({ comments }) => {
    const router = useRouter()

    const [ data, setData ] = useState(comments.comments)
    const user = useAuth()

    const [ width, height ] = useWindowSize()

    const [ comment, setComment ] = useState('')
    const [ error, setError ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const handleSubmit = async (e: any) => {
        if(user.user.active) {
            e.preventDefault()
            setLoading(true)
            setError(false)

            if(comment === '') {
                setError(true)
                setLoading(false)
                return;
            }

            const text = comment
            const result = await axios.post(`${server}/api/comment/commentonpost/${router.query.id}`, { text }, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setError(true)
                                        setLoading(false)
                                    })

            if(result && result.message === 'Comentariu postat') {
                setLoading(false)
                setComment('')
                router.reload()
            } else {
                setLoading(false)
            }
        }
    }

    
    return (
        <NoSSR fallback={null}>
            <div className={styles.container}>
                <h1 className={styles.title}>Comentarii  {data.length}</h1>
                <form className={styles.form_comment}>
                    <div className={`${styles.add_comment} ${error ? styles.wrong_input : '' }`}>
                        <Image src={user.user.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : user.user.profilePicture } alt='Poza Profil' width={70} height={70} />
                        <textarea maxLength={500} placeholder='Adaugă un comentariu...' value={comment} onChange={e => { setComment(e.target.value); setError(false) } } />
                    </div>  
                    {!loading ?
                        <div style={{ alignSelf: 'flex-end'}}>
                            {!user.user.active && <span style={{ color: 'red', marginRight: 20, fontSize: width < 500 ? '.7rem' : '1rem'}}>Contul nu a fost încă activat</span> }
                            <button type="submit" onClick={e => handleSubmit(e)}>Adaugă</button>
                        </div>
                    :
                    <div className={styles.loading}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' alt='Loading' width={70} height={70} />
                    </div>
                    }
                </form>
                {data.length > 0 &&
                    <div style={{ display: 'flex', flexFlow: 'column wrap', gap: '1.5em'}}>
                        {data.map((comment: any, i: number) => {
                            return <Comment key={comment._id} comment={comment} />
                        })}
                    </div>
                }
            </div>
        </NoSSR>
    )
}

export default CommentSection;