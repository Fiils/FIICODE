import type { NextPage, GetServerSideProps} from 'next'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'


import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/Posts/PostsSection.module.scss'
import Post from '../../../components/MyAccount/Post'
import { server } from '../../../config/server'
import { NoSSR } from '../../../utils/NoSsr'

const SideMenu = dynamic(() => import('../../../components/MyAccount/SideMenu'), { ssr: false })
const SideMenuMobile = dynamic(() => import('../../../components/MyAccount/SideMenuMobile'), { ssr: false })


interface InitialFetchProps { 
    favoritePosts: {
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

const Posts: NextPage<InitialFetchProps> = ({ favoritePosts }) => {
    const isSmallScreen = useMediaQuery({ query: '(max-width: 900px)'})

    const maxSize = favoritePosts.posts.length > 5 ? 5 : favoritePosts.posts.length 
    const iterations: number[] = []
    for(let i = 0; i < maxSize; i++) {
        if(maxSize <= 0) {
            break;
        } else {
            iterations.push(i)
        }
    }
    return (
        <NoSSR fallback={<div style={{ height: '100vh'}}></div>}>
            <div className={gridStyles.container_grid}>
                {!isSmallScreen ?
                    <SideMenu active={4} />
                :
                    <SideMenuMobile active={4} />
                }
                
                <div className={gridStyles.container_options}>
                    {favoritePosts.posts.length > 0 ?
                        <>
                            <div className={styles.title}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648564953/FIICODE/favorite-folder-11495_aphhy7.svg' alt='Icon' width={50} height={50} priority/>
                                <h1>
                                    Favorite
                                </h1>
                            </div>

                            <div style={{ display: 'flex', flexFlow: 'column wrap', gap: '5em'}}>
                                {iterations.map((value: number, i: number) => {
                                    return <Post key={favoritePosts.posts[i]._id} _id={favoritePosts.posts[i]._id} title={favoritePosts.posts[i].title} description={favoritePosts.posts[i].description} downVoted={favoritePosts.posts[i].downVoted} upVoted={favoritePosts.posts[i].upVoted}
                                    firstNameAuthor={favoritePosts.posts[i].firstNameAuthor} nameAuthor={favoritePosts.posts[i].nameAuthor} media={favoritePosts.posts[i].media} status={favoritePosts.posts[i].status} creationDate={favoritePosts.posts[i].creationDate}
                                    profilePicture={favoritePosts.posts[i].profilePicture} i={i}  />
                                })}
                            </div>

                            {favoritePosts.posts.length > 5 &&
                                <div className={styles.forward}>
                                    <Link href='/user/favorite'>Vezi mai multe</Link>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648562603/FIICODE/mail-2573_i6sgdl.svg' alt='Icon' width={20} height={20} />
                                </div>
                            }
                        </>
                    : 
                        <div>
                            <div className={styles.title}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648564953/FIICODE/favorite-folder-11495_aphhy7.svg' alt='Icon' width={50} height={50} priority/>
                                <h1>
                                    Favorite
                                </h1>
                            </div>

                            <div className={gridStyles.no_data}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648565768/FIICODE/warning-3092_1_yzwvzq.svg' alt='Eroare' width={120} height={120} />
                                <h1>
                                    Nicio postare nu a fost adăugată la secțiunea favorite
                                </h1>
                            </div>

                        </div>
                    }
                    </div>
            </div>
        </NoSSR>
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

    const favoritePosts = await axios.get(`${server}/api/user/favorites`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a'}} )
                        .then(res => res.data)
                        .catch(err => {
                            redirect = false;
                            console.log(err)
                        })

    return {
        props: {
            favoritePosts
        }
    }
}