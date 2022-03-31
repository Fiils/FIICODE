import type { NextPage, GetServerSideProps} from 'next'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

import SideMenu from '../../../components/MyAccount/SideMenu'
import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/Posts/PostsSection.module.scss'
import Post from '../../../components/MyAccount/Post'

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
    console.log(likedPosts)
    return (
        <div className={gridStyles.container_grid}>
            <SideMenu active={2} />
            
            <div className={gridStyles.container_options}>
                {likedPosts.posts.length > 0 ?
                <>  
                    <div className={styles.title}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648561628/FIICODE/folder-and-heart-11496_bybyn1.svg' width={50} height={50} priority/>
                        <h1>
                            Postări votate pozitiv
                        </h1>
                    </div>
                        <div style={{ display: 'flex', flexFlow: 'column wrap', gap: '5em'}}>
                            {likedPosts.posts.map((value: any, i: number) => {
                                return <Post key={value._id} _id={value._id} title={value.title} description={value.description} downVoted={value.downVoted} upVoted={value.upVoted}
                                firstNameAuthor={value.firstNameAuthor} nameAuthor={value.nameAuthor} media={value.media} status={value.status} creationDate={value.creationDate}
                                profilePicture={value.profilePicture}  />
                            })}
                        </div>

                        {likedPosts.posts.length > 5 &&
                            <div className={styles.forward}>
                                <Link href='/posts/user/pozitiv'>Vezi mai multe</Link>
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

    const user = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
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

    const likedPosts = await axios.get('http://localhost:9999/api/user/upvotes', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a'}} )
                        .then(res => res.data)
                        .catch(err => {
                            redirect = false;
                            console.log(err)
                        })

    const dislikedPosts = await axios.get('http://localhost:9999/api/user/downvotes', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a'}} )
                        .then(res => res.data)  
                        .catch(err => {
                            redirect = false;
                            console.log(err)
                        })

    const commentedPosts = await axios.get('http://localhost:9999/api/user/comments', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a'}} )
                        .then(res => res.data)
                        .catch(err => {
                            redirect = false;
                            console.log(err)
                        })

    return {
        props: {
            likedPosts,
            dislikedPosts,
            commentedPosts
        }
    }
}