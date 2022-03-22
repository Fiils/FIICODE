import type { FC } from 'react';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

import styles from '../../styles/scss/Posts/Post.module.scss';

interface Post { 
    force: boolean;
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
}

const Post: FC<Post> = ({ index, _id, title, authorId, city, county, description, downVoted, upVoted, firstNameAuthor, media, status, favorites, reports, force }) => {
    const router = useRouter()

    const [ values, setValues ] = useState({ valid: false, id: '' })
    const isLoggedIn = async () => {
        const result = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true })
                        .then(res => res.data)
        if(result.data === true) return setValues({ valid: true, id: result.data });

        return setValues({ valid: true, id: result.data })
    }

    useEffect(() => {
        isLoggedIn()
    }, [])
    const [ like, setLike ] = useState(false)
    const [ dislike, setDislike ] = useState(false)
    const [ favorite, setFavorite ] = useState(false)

    const [ press, setPress ] = useState(true)

    useEffect(() => {
        if(upVoted.people.includes(values.id)) {
            setLike(true)
        } else if(downVoted.people.includes(values.id)) {
            setDislike(true)
        }
        if(favorites.people.includes(values.id)) {
            setFavorite(true)
        }
    }, [values.id])

    useEffect(() => {
        console.log('a')
    }, [force])

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
        <div key={index} className={styles.post}>
            <h3 key={index} className={styles.title}>{title}</h3>
            <div key={index + 1} className={styles.image}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647549815/FIICODE/cool-background_1_sl1c6x.png' width={600} height={400} key={index} /> 
            </div>
            <div key={index + 2} className={styles.manip_section}>
                <div key={index} className={styles.svg_container} onClick={e => LikeRequest(e)}>
                    <Image key={index} src={like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1647945967/FIICODE/heart-329_jyfoll.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1647945088/FIICODE/heart-3509_2_dwgxtk.svg'} height={25} width={25} />
                    Vreau
                </div>
                <div key={index + 1} className={styles.svg_container} onClick={e => DislikeRequest(e)}>
                    <Image key={index} src={dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1647946263/FIICODE/heart-502_2_cn0sco.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1647945619/FIICODE/broken-heart-1952_1_g2seaq.svg'} height={25} width={25} />
                    Nu vreau
                </div>
                <div key={index + 2} className={styles.svg_container} onClick={e => FavoriteRequest(e)}>
                    <Image key={index} src={favorite ? 'https://res.cloudinary.com/multimediarog/image/upload/v1647946367/FIICODE/star-346_seu2ro.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1647945887/FIICODE/star-2763_sf0qkf.svg'} height={25} width={25} />
                    Favorite
                </div>
                <div key={index + 3} className={styles.svg_container}>
                    <Image key={index} src='https://res.cloudinary.com/multimediarog/image/upload/v1647945900/FIICODE/start-flag-8252_1_v4hxrf.svg' height={25} width={25} />
                    Raportează
                </div>
            </div>
        </div>
    )
}

export default Post;