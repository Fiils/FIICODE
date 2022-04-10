import type { NextPage, GetServerSideProps} from 'next'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useMediaQuery } from 'react-responsive'

import SideMenu from '../../../components/MyAccount/SideMenu'
import SideMenuMobile from '../../../components/MyAccount/SideMenuMobile'
import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/Posts/PostsSection.module.scss'
import Post from '../../../components/MyAccount/Post'
import { server } from '../../../config/server'

interface InitialFetchProps { 
    likedPosts: {
        numberOfPages: number;
        message: string;
        posts: [{
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
                creationDate: Date;
                nameAuthor: string;
                profilePicture: string;
    }]};
}

const Posts: NextPage<InitialFetchProps> = ({ likedPosts }) => {
    const isSmallScreen = useMediaQuery({ query: '(max-width: 900px)'})
    const isVerySmallScreen = useMediaQuery({ query: '(max-width: 450px)'})

    const maxSize = likedPosts.posts.length > 5 ? 5 : likedPosts.posts.length 
    const iterations = []
    for(let i = 0; i < maxSize; i++) {
        if(maxSize <= 0) {
            break;
        } else {
            iterations.push(i)
        }
    }
    return (
        <div className={gridStyles.container_grid}>
            {!isSmallScreen ?
                <SideMenu active={2} />
            :
                <SideMenuMobile active={2} />
            }
            
            <div className={gridStyles.container_options}>
                {likedPosts.posts.length > 0 ?
                <>  
                    <div className={styles.title}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648561628/FIICODE/folder-and-heart-11496_bybyn1.svg' width={!isVerySmallScreen ? 50 : 35} height={!isVerySmallScreen ? 50 : 35} priority/>
                        <h1>
                            Postări apreciate
                        </h1>
                    </div>
                        <div style={{ display: 'flex', flexFlow: 'column wrap', gap: '5em'}}>
                            {iterations.map((value: any, i: number) => {
                                return <Post key={likedPosts.posts[i]._id} _id={likedPosts.posts[i]._id} title={likedPosts.posts[i].title} description={likedPosts.posts[i].description} downVoted={likedPosts.posts[i].downVoted} upVoted={likedPosts.posts[i].upVoted}
                                firstNameAuthor={likedPosts.posts[i].firstNameAuthor} nameAuthor={likedPosts.posts[i].nameAuthor} media={likedPosts.posts[i].media} status={likedPosts.posts[i].status} creationDate={likedPosts.posts[i].creationDate}
                                profilePicture={likedPosts.posts[i].profilePicture}  />
                            })}
                        </div>

                        {likedPosts.posts.length > 5 &&
                            <div className={styles.forward}>
                                <Link href='/user/pozitiv'>Vezi mai multe</Link>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648562603/FIICODE/mail-2573_i6sgdl.svg' width={20} height={20} />
                            </div>
                        }
                    </>
                    :
                    <div>
                        <div className={styles.title}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648561628/FIICODE/folder-and-heart-11496_bybyn1.svg' width={50} height={50} priority/>
                            <h1>
                                Postări votate pozitiv
                            </h1>
                        </div>

                        <div className={gridStyles.no_data}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648565768/FIICODE/warning-3092_1_yzwvzq.svg' width={120} height={120} />
                            <h1>
                                Nicio postare nu a fost apreciată pozitiv
                            </h1>
                        </div>

                    </div>
                }
                </div>
        </div>
    )
}

export default Posts;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies['x-access-token']
    let redirect = true

    if(!token) {
        return {
            redirect: {
                destination: '/date-personale',
                permanent: false
            }
        }
    }

    const user = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
        .then(res => res.data)
        .catch(err => {
            console.log(err);
            redirect = false
    })

    if(!redirect) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    }

    if(user.active === false) {
        return {
            redirect: {
                permanent: false,
                destination: '/contul-meu/date-personale'
            },
            props: {}
        }
    }

    const likedPosts = await axios.get(`${server}/api/user/upvotes`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a'}} )
                        .then(res => res.data)
                        .catch(err => {
                            redirect = false;
                            console.log(err)
                        })

    return {
        props: {
            likedPosts,
        }
    }
}