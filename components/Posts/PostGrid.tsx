import type { FC } from 'react';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
import Link from 'next/link'

import styles from '../../styles/scss/Posts/Post.module.scss';
import { useAuth } from '../../utils/useAuth'

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
}

const Post: FC<Post> = ({ index, _id, title, authorId, city, county, description, downVoted, upVoted, firstNameAuthor, media, status, favorites, reports, views, creationDate, nameAuthor }) => {
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

    const switchMonth = (month: number) => {
        switch (month) {
            case 0: 
                return 'Ian';
            case 1: 
                return 'Feb';
            case 2: 
                return 'Mar';
            case 3: 
                return 'Apr';
            case 4: 
                return 'Mai';
            case 5: 
                return 'Iun';
            case 6: 
                return 'Iul';
            case 7: 
                return 'Aug';
            case 8: 
                return 'Sep';            
            case 9: 
                return 'Oct';
            case 10: 
                return 'Noi';
            case 11: 
                return 'Dec';
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

    const date = new Date(creationDate)
    const formattedDate = `${date.getDate()} ${switchMonth(date.getMonth())} ${date.getFullYear()}`

    return (
        <div key={_id} className={styles.post}>
            <div key={'k' + _id} className={styles.image}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647549815/FIICODE/cool-background_1_sl1c6x.png' layout='fill' key={'l' + _id} /> 
            </div>
            <div className={styles.post_info}>
                <span>{nameAuthor}</span>
                <br />
                <span>{formattedDate}</span>
            </div>
            <h3 key={'j' + _id} className={styles.title}> upVotes: {upVoted.count} downVotes: {downVoted.count} views: {views.count}</h3>
                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center' }} key={description}>
                    <div key={'a' + _id} className={styles.manip_section}>
                        <Link href={`/postari/${_id}`}>
                            <div className={styles.manip_item}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474271/FIICODE/hearts-7890_2_maukcl.svg' width={20} height={20} />
                                <span>{upVoted.count} voturi</span>
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
    )
}

export default Post;