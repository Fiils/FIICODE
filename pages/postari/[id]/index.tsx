import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper'
import { useRouter } from 'next/router'

import styles from '../../../styles/scss/SinglePost/Post.module.scss'
import { useAuth } from '../../../utils/useAuth'
import formatDate from '../../../utils/formatDate'
import CommentSection from '../../../components/SinglePost/CommentSection'

interface Post {
    post: {
        post: {
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
            };
            comments: {
                count: number;
                people: Array<any>;
            };
            creationDate: Date;
            nameAuthor: string;
            authorProfilePicture: string;
        }
    };
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
            creationDate: Date;
            profilePicture: string;
        }]
    }
}

const Page: NextPage<Post> = ({ post, comments }) => {
    const [ data, setData ] = useState(post.post)
    const router = useRouter()

    const user = useAuth()

    const [ like, setLike ] = useState(false)
    const [ dislike, setDislike ] = useState(false)
    const [ favorite, setFavorite ] = useState(false)

    const [ press, setPress ] = useState(true)

    useEffect(() => {
        if(data.upVoted.people.includes(user.user.userId)) {
            setLike(true)
        } else if(data.downVoted.people.includes(user.user.userId)) {
            setDislike(true)
        }
        if(data.favorites.people.includes(user.user.userId)) {
            setFavorite(true)
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
                const result = await axios.patch(`http://localhost:9999/api/post/upvote/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setLike(!like); 
                data.upVoted.count--;
                const result = await axios.patch(`http://localhost:9999/api/post/upvote/un/${data._id}`, {}, { withCredentials: true })   
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
                const result = await axios.patch(`http://localhost:9999/api/post/downvote/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setDislike(!dislike); 
                data.downVoted.count--;
                const result = await axios.patch(`http://localhost:9999/api/post/downvote/un/${data._id}`, {}, { withCredentials: true })   
                                            .catch(err => console.log(err))
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
                data.favorites.count--;
                const result = await axios.patch(`http://localhost:9999/api/post/favorite/un/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setFavorite(!favorite)
                data.favorites.count++;
                const result = await axios.patch(`http://localhost:9999/api/post/favorite/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }

    const ReportRequest = async () => {
        const result = await axios.patch(`http://localhost:9999/api/post/report/${data._id}`, {}, { withCredentials: true })
                                    .catch(err => console.log(err))
    }

    return (
        <div className={styles.container}>
            <div className={styles.image_section}>
                <div className={styles.swiper_limit}>
                    <h1>{data.title}</h1>
                    <div className={styles.post_info}>
                    <Image src={data.authorProfilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : data.authorProfilePicture } width={50} height={50} />
                        <div>
                            <span>{data.nameAuthor} {data.firstNameAuthor}</span>
                            <br />
                            <span>{formatDate(data.creationDate)}</span>
                        </div>
                        <div className={styles.status}>
                            <Image src={data.status === 'Trimis' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648628565/FIICODE/paper-plane-2563_dlcylv.svg' : (data.status === 'Vizionat' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713682/FIICODE/check-7078_v85jcm.svg' : (data.status === 'În lucru' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713958/FIICODE/time-management-9651_fywiug.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648714033/FIICODE/wrench-and-screwdriver-9431_hf7kve.svg' )) } height={120} width={30} />
                            <p>{data.status}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1em', marginLeft: -55 }} className={styles.img_full}>
                    <div className={styles.manip_sec}>
                        <div className={`${styles.option} ${(data.media.length >= 2) ? styles.big_icon : ''}`}>
                            <Image src={!like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648629762/FIICODE/heart-492_2_bul5uk.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648630120/FIICODE/heart-329_1_o8ehwn.svg' } width={30} height={30} onClick={e => LikeRequest(e)} />
                            <span id='#text'>{data.upVoted.count}</span>
                        </div>
                        <div className={styles.option}>
                            <Image src={!dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648630460/FIICODE/broken-heart-2940_1_pfnst7.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648631540/FIICODE/broken-heart-2943_s0ap3p.svg' } width={30} height={30} onClick={e => DislikeRequest(e)} />
                            <span id='#text'>{data.downVoted.count}</span>
                        </div>
                        <div className={styles.option}>
                            <Image src={!favorite ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648632020/FIICODE/favourite-2765_1_bmyyrq.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648632018/FIICODE/star-346_2_tczou4.svg'} width={30} height={30} onClick={e => FavoriteRequest(e)} />
                            <span id='#text'>{data.favorites.count}</span>
                        </div>  
                    </div>
                    <Swiper
                    modules={[ Navigation ]}
                    spaceBetween={50}
                    slidesPerView={1}
                    centeredSlides
                    navigation
                    >
                        {data.media.length > 0 ?
                        <>
                            {data.media.map((img: string, i: number) => {
                                return <SwiperSlide  key={i}>
                                            <Image key={i} src={img} width={950} height={600} />
                                        </SwiperSlide>
                            })}
                        </>
                        : 
                        <>
                            <SwiperSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column wrap', width: 950, height: 650, border: '2px solid black', borderRadius: 3 }}>
                                <Image src={'https://res.cloudinary.com/multimediarog/image/upload/v1648634881/FIICODE/no-image-6663_1_j2edue.svg'} width={250} height={300} />
                                <h1 className={styles.no_image}>Nicio imagine</h1>
                            </SwiperSlide>
                        </>
                        }
                       
                    </Swiper>
                    </div>
                </div>
            </div>
            <div className={styles.description}>
                <p>
                    {data.description}
                </p>
            </div>

            <CommentSection key={router.query.id?.toString()} comments={comments} />
        </div>
    )
}

export default Page;


export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const token = ctx.req.cookies['x-access-token']
    let redirect = false
    
    if(!token) {
        return { props: {} }
    }

    const user = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err.response);
                            redirect = true
                        })

    if(redirect) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    }

    const post = await axios.get(`http://localhost:9999/api/post/show/specific/${ctx.query.id}`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err.response) 
                            redirect = true
                        })

    const comments = await axios.get(`http://localhost:9999/api/comment/show-commentonpost/${ctx.query.id}`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                            .then(res => res.data)
                            .catch(err => console.log(err))


    if(redirect) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    }

    return { props: {
        post,
        comments
        } 
    }
}