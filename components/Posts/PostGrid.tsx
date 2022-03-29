import type { FC } from 'react';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
import Link from 'next/link'

import styles from '../../styles/scss/Posts/Post.module.scss';
import { useAuth } from '../../utils/useAuth'
import formatDate from '../../utils/formatDate'

interface Post { 
    index: number;
    _id: string;
    title: string;
    authorId: string;
    nameAuthor: string;
    city: string;
    county: string;
    description: string;
    downVoted: {
        count: number;
        people: Array<any>
    },
    upVoted: {
        count: number;
        people: Array<any>
    },
    reports: {
        count: number,
        people: Array<any>
    };
    favorites: {
        count: number,
        people: Array<any>
    };
    firstNameAuthor: string;
    media: Array<any>;
    status: string;
    views: {
        count: number;
        people: Array<any>;
    };
    creationDate: Date;
    profilePicture: string;
}

const Post: FC<Post> = ({ _id, title, description, downVoted, upVoted, firstNameAuthor, media, status, favorites, reports, views, creationDate, nameAuthor, profilePicture }) => {
    const router = useRouter()

    const user = useAuth()

    const [ like, setLike ] = useState(false)
    const [ dislike, setDislike ] = useState(false)
    const [ favorite, setFavorite ] = useState(false)

    const [ press, setPress ] = useState(true)

    useEffect(() => {
        if(upVoted.people.includes(user.user.userId)) {
            setLike(true)
        } else if(downVoted.people.includes(user.user.userId)) {
            setDislike(true)
        }
        if(favorites.people.includes(user.user.userId)) {
            setFavorite(true)
        }

        return () => {

        }
    }, [])

    const LikeRequest = async (e: any) => {
        e.preventDefault()
        if(press) {
            setPress(false)
            if(!like || dislike) {
                setLike(!like); 
                setDislike(false)
                const result = await axios.patch(`http://localhost:9999/api/post/upvote/${_id}`, {}, { withCredentials: true })
            } else {
                setLike(!like); 
                const result = await axios.patch(`http://localhost:9999/api/post/upvote/un/${_id}`, {}, { withCredentials: true })   
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
                const result = await axios.patch(`http://localhost:9999/api/post/downvote/${_id}`, {}, { withCredentials: true })
            } else {
                setDislike(!dislike); 
                const result = await axios.patch(`http://localhost:9999/api/post/downvote/un/${_id}`, {}, { withCredentials: true })   
            }
            setPress(true)
        }
    }

    const FavoriteRequest = async (e: any) => {
        e.preventDefault()
        if(press) {
            setPress(false)
            if(favorite) {
                setFavorite(!favorite)
                const result = await axios.patch(`http://localhost:9999/api/post/favorite/un/${_id}`, {}, { withCredentials: true })
            } else {
                setFavorite(!favorite)
                const result = await axios.patch(`http://localhost:9999/api/post/favorite/${_id}`, {}, { withCredentials: true })
            }
            setPress(true)
        }
    }

    const ReportRequest = async () => {
        const result = await axios.patch(`http://localhost:9999/api/post/report/${_id}`, {}, { withCredentials: true })
    }

    return (
        <Link href={`/postari/${_id}`}>
        <div key={_id} className={styles.post}>
            <div key={'k' + _id} className={styles.image} style={{ border: !media[0] ? '2px solid rgb(220, 220, 220)' : '0px' }}>
                {media[0] && <Image src={media[0]} layout='fill' key={'l' + _id} /> }
                {!media[0] && 
                    <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ marginTop: 95}}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647938098/FIICODE/no-image-6663_bwocug.svg' height={120} width={120} />
                            <h3 style={{ color: 'rgb(186, 186, 186)'}}>Nicio imagine de afișat</h3>
                        </div>
                    </div>
                }
            </div>
            <div>
                <div className={styles.post_info}>
                    <Image src={user.user.profilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : user.user.profilePicture } width={40} height={40} />
                    <div>
                        <span>{nameAuthor} {firstNameAuthor}</span>
                        <br />
                        <span>{formatDate(creationDate)}</span>
                    </div>
                </div>
                <h3 key={'j' + _id} className={styles.title}>{title}</h3>
                    <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center' }} key={description}>
                        <div key={'a' + _id} className={styles.manip_section}>
                            <Link href={`/postari/${_id}`}>
                                <div className={styles.manip_item}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474271/FIICODE/hearts-7890_2_maukcl.svg' width={20} height={20} />
                                    <span>{upVoted.count + downVoted.count} voturi</span>
                                </div>
                            </Link>
                            <Link href={`/postari/${_id}`}>
                                <div className={styles.manip_item}>
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474242/FIICODE/support-1091_1_smleyp.svg' width={20} height={20} />
                                        <span>{upVoted.count} comentarii</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
        </div>
        </Link>
    )
}

export default Post;