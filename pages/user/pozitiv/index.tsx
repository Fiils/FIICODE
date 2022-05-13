import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'

import gridStyles from '../../../styles/scss/UserPosts/Grid.module.scss';
import PostGrid from '../../../components/UserPosts/PostGrid'
import { server } from '../../../config/server'


interface InitialFetchProps { 
    posts: {
        numberOfPages: number;
        posts: [{
            key: number;
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
        }];
    }
}


const Positive: NextPage<InitialFetchProps> = ({ posts }) => {
    const [ data, setData ] = useState<any>(posts.posts)
    const [ numberOfPages, setNumberOfPages ] = useState(posts.numberOfPages)
    const [ addPosts, setAddPosts ] = useState(0)
    const [ error, setError ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    
    useEffect(() => {
        const getMorePosts = async () => {
            setLoading(true)
            const result = await axios.get(`${server}/api/user/upvotes?page=${addPosts}`, { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => {
                                console.log(err)
                                setError(true)
                                setLoading(false)
                            })

            setLoading(false)
            const newPosts =  [...data, ...result.posts ]
            setData(newPosts)
        }   
        if(addPosts >= 1){
            getMorePosts()
        }
    }, [addPosts])

    return (
        <>  
            <Head>
          
                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />

                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />

            </Head>
            
            <div>
                <div className={gridStyles.title}>
                    <h1>Postări apreciate</h1>
                </div>
                {data.length > 0 ?
                    <>
                        <div className={gridStyles.grid_posts}>
                                    {data.map((value: any, key: number) => {
                                        return (
                                            <PostGrid key={value._id + key} index={key} _id={value._id} title={value.title} authorId={value.authorId} city={value.city} county={value.county} 
                                                    description={value.description} downVoted={value.downVoted} upVoted={value.upVoted} firstNameAuthor={value.firstNameAuthor} 
                                                    media={value.media} status={value.status} reports={value.reports} views={value.views} favorites={value.favorites} creationDate={value.creationDate} 
                                                    nameAuthor={value.nameAuthor} authorProfilePicture={value.authorProfilePicture} comments={value.comments} />
                                        )
                                    })}
                        </div>
                        {numberOfPages - 1 > addPosts &&
                        <div className={gridStyles.more_button}>
                            {!loading ?
                                <button onClick={() => setAddPosts(prevState => prevState + 1)}>Mai multe...</button>
                            :
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' alt='Loading...' width={100} height={100} loading='eager' priority/>
                            }
                        </div>
                        }
                    </>
                :
                    <div className={gridStyles.no_data}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648565768/FIICODE/warning-3092_1_yzwvzq.svg' alt='Eroare' width={120} height={120} />
                        <h1>
                            Nicio postare nu a fost apreciată pozitiv
                        </h1>
                    </div>
                }
            </div>
        </>
    )
}

export default Positive;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const token = ctx.req.cookies['x-access-token']
    let redirect = false
    
    if(!token) {
        return { props: {} }
    }

    const user = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err);
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

    const posts = await axios.get(`${server}/api/user/upvotes`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err) 
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

    return { props: {
        posts
        } 
    }
}