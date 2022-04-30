import type { FC } from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'

import styles from '../../styles/scss/SinglePost/Comment.module.scss'
import { useAuth  } from '../../utils/useAuth'
import { server } from '../../config/server'
import useWindowSize from '../../utils/useWindowSize'
import ReportModal from './ReportModalComment'


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


const CommentOnComment: FC<Comment> = ({ comment }) => {
    const router = useRouter()
    const [ data, setData ] = useState(comment)
    const user = useAuth()

    const [ width, height ] = useWindowSize()

    const [ like, setLike ] = useState(false)
    const [ dislike, setDislike ] = useState(false)
    const [ reported, setReported ] = useState(false)

    const [ buttonBox, setButtonBox ] = useState(false)

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
        if(press && user.user.active) {
            setPress(false)
            if(!like || dislike) {
                setLike(!like); 
                setDislike(false)
                if(dislike) {
                    data.downVoted.count--;
                }
                data.upVoted.count++;
                const result = await axios.patch(`${server}/api/comment/upvote/${router.query.id}/${comment._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setLike(!like); 
                data.upVoted.count--;
                const result = await axios.patch(`${server}/api/comment/upvote/un/${router.query.id}/${comment._id}`, {}, { withCredentials: true })   
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }

    const DislikeRequest = async (e: any) => {
        e.preventDefault()
        if(press && user.user.active) {
            setPress(false)
            if(!dislike || like) {
                setDislike(!dislike); 
                setLike(false)
                if(like) {
                    data.upVoted.count--;
                }
                data.downVoted.count++;
                const result = await axios.patch(`${server}/api/comment/downvote/${router.query.id}/${comment._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setDislike(!dislike); 
                data.downVoted.count--;
                const result = await axios.patch(`${server}/api/comment/downvote/un/${router.query.id}/${comment._id}`, {}, { withCredentials: true })   
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }

    const [ createReport, setCreateReport ] = useState(false)

    return (
        <>
            <div className={styles.info}>
                <Image src={comment.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : comment.profilePicture } alt='Poza Profil' width={30} height={30} />
                <span id='#name'>{comment.nameAuthor} {comment.firstNameAuthor}</span>
            </div>
            
            <div className={styles.border_left_more}>
                <div className={styles.comment_text}>
                    <p style={{ marginTop: 5, marginBottom: 10 }}>{comment.text}</p>
                </div>
                {width >= 700 ?
                        <div className={styles.manip_sec}>
                            <div className={`${styles.option}`} onClick={e => LikeRequest(e)}>
                                <Image src={!like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643733/FIICODE/heart-492_3_lf3zdy.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648630120/FIICODE/heart-329_1_o8ehwn.svg' } alt='Icon' width={15} height={15} />
                                <span id='#text'>{data.upVoted.count}</span>
                            </div>
                            <div className={styles.option} onClick={e => DislikeRequest(e)}>
                                <Image src={!dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643730/FIICODE/broken-heart-2940_2_vqhdks.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648631540/FIICODE/broken-heart-2943_s0ap3p.svg' } alt='Icon' width={15} height={15} />
                                <span id='#text'>{data.downVoted.count}</span>
                            </div>
                            <div className={styles.option} onClick={() => { if(!reported) { setCreateReport(!createReport); } }}>
                                <Image src={!reported ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643727/FIICODE/start-flag-8252_2_q5ai3q.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648654972/FIICODE/start-flag-8253_2_so1lkv.svg' } alt='Icon' width={15} height={15} />
                                <span id='#text'>Semnalează</span>
                            </div>
                        </div>
                    :
                        <div style={{ display: 'flex', gap: '.5em' }}>
                            <div className={styles.options_box_button}>
                                <Image onClick={() => setButtonBox(!buttonBox)} src='https://res.cloudinary.com/multimediarog/image/upload/v1649346820/FIICODE/more-7660_xvyrhj.svg' height={15} width={15} alt='Icon' />
                            </div>
                            {buttonBox &&
                                <div className={styles.options_box}>
                                    <ul>
                                        <li onClick={e => { setButtonBox(false); LikeRequest(e) }}>
                                            <Image src={!like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643733/FIICODE/heart-492_3_lf3zdy.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648630120/FIICODE/heart-329_1_o8ehwn.svg' } alt='Icon' width={width < 500 ? 10 : 20} height={width < 500 ? 10 : 20} />
                                            <span>Apreciază</span>
                                        </li>
                                        <li onClick={e => { setButtonBox(false); DislikeRequest(e) }}>
                                            <Image src={!dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643730/FIICODE/broken-heart-2940_2_vqhdks.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648631540/FIICODE/broken-heart-2943_s0ap3p.svg' } alt='Icon' width={width < 500 ? 10 : 20} height={width < 500 ? 10 : 20} />
                                            <span>Dezapreciază</span>
                                        </li>
                                        <li onClick={e => { setButtonBox(false); if(!reported) { setCreateReport(!createReport); } }}>
                                            <Image src={!reported ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648643727/FIICODE/start-flag-8252_2_q5ai3q.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648654972/FIICODE/start-flag-8253_2_so1lkv.svg' } alt='Icon' width={width < 500 ? 10 : 20} height={width < 500 ? 10 : 20} />
                                            <span id='#text'>Semnalează</span>
                                        </li>
                                    </ul>
                                </div>
                            }
                        </div>
                    }
                    {(createReport && !reported) && 
                        <ReportModal originalPostId={data.originalPostId} commentId={data._id} setReportModal={setCreateReport} setReport={setReported} />
                    }
                </div>
        </>
    )
}

export default CommentOnComment;