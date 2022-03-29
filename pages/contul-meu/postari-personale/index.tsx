import type { NextPage, GetServerSideProps} from 'next'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

import SideMenu from '../../../components/MyAccount/SideMenu'
import gridStyles from '../../../styles/scss/MyAccount/GridContainer.module.scss'
import styles from '../../../styles/scss/MyAccount/Posts/PostsSection.module.scss'
import Post from '../../../components/MyAccount/Post'

interface InitialFetchProps { 
    personalPosts: {
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

const Posts: NextPage<InitialFetchProps> = ({ personalPosts }) => {
    return (
        <div className={gridStyles.container_grid}>
            <SideMenu active={3} />
            
            <div className={gridStyles.container_options}>
                {personalPosts.posts.length > 0 ?
                    <>
                        <div className={styles.title}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648566527/FIICODE/user-profile-folder-11497_jbfkto.svg' width={50} height={50} priority/>
                            <h1>
                                Postările Mele
                            </h1>
                        </div>

                        <div style={{ display: 'flex', flexFlow: 'column wrap', gap: '5em'}}>
                            {personalPosts.posts.map((value: any, i: number) => {
                                return <Post key={value._id} _id={value._id} title={value.title} description={value.description} downVoted={value.downVoted} upVoted={value.upVoted}
                                firstNameAuthor={value.firstNameAuthor} nameAuthor={value.nameAuthor} media={value.media} status={value.status} creationDate={value.creationDate}
                                profilePicture={value.profilePicture}  />
                            })}
                        </div>

                        {personalPosts.posts.length > 5 &&
                            <div className={styles.forward}>
                                <Link href='/posts/user/pozitiv'>Vezi mai multe</Link>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648562603/FIICODE/mail-2573_i6sgdl.svg' width={20} height={20} />
                            </div>
                        }
                    </>
                : 
                    <div>
                        <div className={styles.title}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648566527/FIICODE/user-profile-folder-11497_jbfkto.svg' width={50} height={50} priority/>
                            <h1>
                                Postările Mele
                            </h1>
                        </div>

                        <div className={gridStyles.no_data}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648565768/FIICODE/warning-3092_1_yzwvzq.svg' width={120} height={120} />
                            <h1>
                                Nu ați publicat nicio postare până acum. Apăsați pe butonul de mai jos pentru a posta una.
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

    const personalPosts = await axios.get('http://localhost:9999/api/user/personal', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a'}} )
                        .then(res => res.data)
                        .catch(err => {
                            redirect = false;
                            console.log(err)
                        })

    return {
        props: {
            personalPosts
        }
    }
}