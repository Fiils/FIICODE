import type { FC } from 'react';
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

import { useAuth } from '../../utils/useAuth'
import styles from '../../styles/scss/SinglePost/Comment.module.scss'
import CommentOnComment from './CommentOnComment'

interface Comment {
    comment: {
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
        creationDate: Date
    }
}


const Comment: FC<Comment> = ({ comment }) => {
    const router = useRouter()
    const [ data, setData ] = useState(comment)
    const [ showMore, setShowMore ] = useState(false)
    const [ moreComments, setMoreComments ] = useState([{
        _id: '',
        repliedToCommentId: '',
        repliedToId: '',
        originalPostId: '',
        originalPosterId: '',
        nameAuthor: '',
        firstNameAuthor: '',
        authorId: '',
        text: '',
        upVoted: {
            count: 0,
            people: [' ']
        },
        downVoted: {
            count: 0,
            people: [' ']
        },
        reported: {
            count: 0,
            people: [' '],
            reasons: [' ']
        },
        lowCommentLevel: false,
        hasReplies: false,
        profilePicture: '/',
        creationDate: ''
    }])

    useEffect(() => {
        const getComments = async () => {
            const result = await axios.get(`http://localhost:9999/api/comment/show-commentoncomment/${router.query.id}/${comment._id}`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => console.log(err))

            if(result) {
                setMoreComments(result.comments)

            }
        }
        if(comment.hasReplies) {
            getComments()
        }
    }, [])

    const user = useAuth()

    const [ like, setLike ] = useState(false)
    const [ dislike, setDislike ] = useState(false)
    const [ reported, setReported ] = useState(false)

    const [ press, setPress ] = useState(true)

    useEffect(() => {
        if(data.upVoted.people.includes(user.user.userId)) {
            setLike(true)
        } else if(data.downVoted.people.includes(user.user.userId)) {
            setDislike(true)
        }
        if(data.reported.people.includes(user.user.userId)) {
            setReported(true)
        }
    }, [user])

    const LikeRequest = async (e: any) => {
        e.preventDefault()
        if(press) {
            setPress(false)
            if(!like || dislike) {
                setLike(!like); 
                setDislike(false)
                if(dislike) {
                    data.downVoted.count--;
                }
                data.upVoted.count++;
                const result = await axios.patch(`http://localhost:9999/api/comment/upvote/${router.query.id}/${comment._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setLike(!like); 
                data.upVoted.count--;
                const result = await axios.patch(`http://localhost:9999/api/comment/upvote/un/${router.query.id}/${comment._id}`, {}, { withCredentials: true })   
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }

    const DislikeRequest = async (e: any) => {
        e.preventDefault()
        if(press) {
            setPress(false)
            if(!dislike || like) {
                setDislike(!dislike); 
                setLike(false)
                if(like) {
                    data.upVoted.count--;
                }
                data.downVoted.count++;
                const result = await axios.patch(`http://localhost:9999/api/comment/downvote/${router.query.id}/${comment._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setDislike(!dislike); 
                data.downVoted.count--;
                const result = await axios.patch(`http://localhost:9999/api/comment/downvote/un/${router.query.id}/${comment._id}`, {}, { withCredentials: true })   
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }


    const [ createComment, setCreateComment ] = useState(false)

    const [ textComment, setTextComment ] = useState('')
    const [ error, setError ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setError(false)

        if(textComment === '') {
            setError(true)
            setLoading(false)
            return;
        }
        const text = textComment
        const result = await axios.post(`http://localhost:9999/api/comment/commentoncomment/${data.originalPostId}/${data._id}`, { text }, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoading(false)
                                })

        if(result && result.message === 'Comentariu postat') {
            setLoading(false)
            setCreateComment(false)
            setTextComment('')
            router.reload()
        } else {
            setLoading(false)
        }
    }



    const [ createReport, setCreateReport ] = useState(false)

    const [ textReport, setTextReport ] = useState('')
    const [ errorReport, setErrorReport ] = useState(false)
    const [ loadingReport, setLoadingReport ] = useState(false)

    const handleSubmitReport = async (e: any) => {
        e.preventDefault()
        setLoadingReport(true)
        setErrorReport(false)

        if(textReport === '') {
            setErrorReport(true)
            setLoadingReport(false)
            return;
        }

        const reason = textReport
        const result = await axios.patch(`http://localhost:9999/api/comment/report/${data.originalPostId}/${data._id}`, { reason }, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setErrorReport(true)
                                    setLoadingReport(false)
                                })
        
        if(result && result.message === 'Comentariu raportat') {
            console.log('res')
            setLoadingReport(false)
            setCreateReport(false)
            setTextReport('')
            router.reload()
        } else {
            setLoadingReport(false)
        }
    }

    return (
        <>
            <div className={styles.info}>
                <Image src={comment.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : comment.profilePicture } width={30} height={30} />
                <span id='#name'>{comment.nameAuthor} {comment.firstNameAuthor}</span>
            </div>
            <div className={styles.border_left}>
                <div className={styles.comment_text}>
                    <p style={{ marginTop: 5, marginBottom: 10 }}>{comment.text}</p>
                </div>
                <div className={styles.manip_sec}>
                    <div className={`${styles.option}`} onClick={e => LikeRequest(e)}>
                        <Image src={!like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643733/FIICODE/heart-492_3_lf3zdy.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648630120/FIICODE/heart-329_1_o8ehwn.svg' } width={15} height={15} />
                        <span id='#text'>{data.upVoted.count}</span>
                    </div>
                    <div className={styles.option} onClick={e => DislikeRequest(e)}>
                        <Image src={!dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643730/FIICODE/broken-heart-2940_2_vqhdks.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648631540/FIICODE/broken-heart-2943_s0ap3p.svg' } width={15} height={15} />
                        <span id='#text'>{data.downVoted.count}</span>
                    </div>
                    <div className={styles.option} onClick={() => { if(!reported) { setCreateComment(false); setCreateReport(!createReport); } }}>
                        <Image src={!reported ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643727/FIICODE/start-flag-8252_2_q5ai3q.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648654972/FIICODE/start-flag-8253_2_so1lkv.svg' } width={15} height={15} />
                        <span id='#text'>Semnalează</span>
                    </div>
                    <div className={styles.option} onClick={() => { setCreateReport(false); setCreateComment(!createComment); }}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648644549/FIICODE/text-message-4653_uwewtq.svg' width={15} height={15} />
                        <span id='#text'>Comentează</span>
                    </div>
                    {comment.hasReplies &&
                        <div className={styles.option}>
                            {!showMore ?
                                <span id='#text' onClick={() => setShowMore(true)}>Mai mult...</span>
                            :
                                <span id='#text' onClick={() => setShowMore(false)}>Mai puțin...</span>
                            }
                        </div>
                    }
                </div>
                {createReport &&
                    <form className={styles.form_comment}>
                        <div className={`${styles.add_comment} ${errorReport ? styles.wrong_input : '' }`}>
                            <textarea placeholder='Semnalează...' value={textReport} onChange={e => { setTextReport(e.target.value); setErrorReport(false) } } />
                        </div>  
                        {!loadingReport ?
                            <button type="submit" onClick={e => handleSubmitReport(e)}>Trimite</button>
                        :
                            <div className={styles.loading}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' width={30} height={30} />
                            </div>
                        }
                    </form>
                }
                {createComment &&
                            <form className={styles.form_comment}>
                                <div className={`${styles.add_comment} ${error ? styles.wrong_input : '' }`}>
                                    <textarea placeholder='Adaugă un comentariu...' value={textComment} onChange={e => { setTextComment(e.target.value); setError(false) } } />
                                </div>  
                                {!loading ?
                                    <button type="submit" onClick={e => handleSubmit(e)}>Adaugă</button>
                                :
                                    <div className={styles.loading}>
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' width={30} height={30} />
                                    </div>
                                }
                            </form>
                }
            {(comment.hasReplies && showMore) &&
                    <div className={`${styles.comment} ${styles.deep_level} ${styles.border_left_more}`}>
                    {moreComments.map((comment: any, i: number) => {
                        return  <CommentOnComment comment={comment} />
                    })}
                </div>
            }
            
        </div>
        </>
    )
}

export default Comment;