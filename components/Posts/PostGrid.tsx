import type { FC } from 'react';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

import styles from '../../styles/scss/Posts/Post.module.scss';
import { useAuth } from '../../utils/useAuth'

interface Post { 
    index: number;
    _id: string;
    title: string;
    authorId: string;
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
    }
}

const Post: FC<Post> = ({ index, _id, title, authorId, city, county, description, downVoted, upVoted, firstNameAuthor, media, status, favorites, reports, views }) => {
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
        <div key={_id} className={styles.post}>
            <h3 key={'j' + _id} className={styles.title}> upVotes: {upVoted.count} downVotes: {downVoted.count} views: {views.count}</h3>
            <div key={'k' + _id} className={styles.image}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647549815/FIICODE/cool-background_1_sl1c6x.png' width={500} height={300} key={'l' + _id} /> 
            </div>
                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center' }} key={description}>
                    <div key={'a' + _id} className={styles.manip_section}>
                        <div key={'b' + _id} className={styles.svg_container} onClick={e => LikeRequest(e)}>
                            <Image key={'c' + _id} src={like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1647945967/FIICODE/heart-329_jyfoll.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1647945088/FIICODE/heart-3509_2_dwgxtk.svg'} height={25} width={25} />
                            Vreau
                        </div>
                        <div key={'d' + _id} className={styles.svg_container} onClick={e => DislikeRequest(e)}>
                            <Image key={'e' + _id} src={dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1647946263/FIICODE/heart-502_2_cn0sco.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1647945619/FIICODE/broken-heart-1952_1_g2seaq.svg'} height={25} width={25} />
                            Nu vreau
                        </div>
                        <div key={'f' + _id} className={styles.svg_container} onClick={e => FavoriteRequest(e)}>
                            <Image key={'g' + _id} src={favorite ? 'https://res.cloudinary.com/multimediarog/image/upload/v1647946367/FIICODE/star-346_seu2ro.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1647945887/FIICODE/star-2763_sf0qkf.svg'} height={25} width={25} />
                            Favorite
                        </div>
                        <div key={'h' + _id} className={styles.svg_container}>
                            <Image key={'i' + _id} src='https://res.cloudinary.com/multimediarog/image/upload/v1647945900/FIICODE/start-flag-8252_1_v4hxrf.svg' height={25} width={25} />
                            Raportează
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Post;