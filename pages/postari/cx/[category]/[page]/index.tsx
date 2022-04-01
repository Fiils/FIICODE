import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import styles from '../../../../../styles/scss/Posts/SideMenu.module.scss'
import gridStyles from '../../../../../styles/scss/Posts/Grid.module.scss'
import PostGrid from '../../../../../components/Posts/PostGrid'
import Pagination from '../../../../../components/Posts/Pagination'
import StatusSelect from '../../../../../components/Posts/StatusSelect'


interface ListItems {
    text: string;
    index: number;
    category: string;
}

interface InitialFetchProps { 
    pages: number;
    data: {
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
    }
}


const Postari: NextPage<InitialFetchProps> = () => {
    const router = useRouter()
     
    const [ posts, setPosts ] = useState({ numberOfPages: 0, posts: []})
    const [ status, setStatus ] = useState<string[]>([])
    const categoriesAllowed = [ 'apreciate', 'popular', 'vizionate', 'comentarii', 'noi' ]

    const chooseCategoryServer = (categ: string | undefined | string[]) => {
        switch(categ) {
            case 'apreciate':
                return '/mupvotes';
            case 'vizionate':
                return '/mviews';
            case 'popular':
                return '/popular';
            case 'comentarii':
                return '/mcomments';
            case 'noi':
                return '/age';
            default:
                return '/popular'
        }
    }

    const [ old, setOld ] = useState(false)

    const [ loading, setLoading ] = useState(false)

    const changePage = async (category: string | undefined | string[]) => {
        if(Array.isArray(category) || !categoriesAllowed.includes(category || 'a')){
            router.push('/404')
        }
        if(!router.query.page) {
            router.push('/404')
        }

        const page = router.query.page!.toString().split('')
        let number = '';

        if(page.length > 1) {
            page.map((value: string) => {
                if(value !== 'p'){
                    number += value
                }
            })
        }

        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        const result = await axios.get(`http://localhost:9999/api/post/show${chooseCategoryServer(category)}?page=${parseInt(number) - 1}`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            return;
                        })

        if(!result) {
            router.replace({
                pathname: router.pathname,
                query: { ...router.query, page: 'p1' }
            })
        }

        if(result.posts.length === 0) {
            setLoading(false)
            return router.replace({
                pathname: router.pathname,
                query: { ...router.query, page: 'p1' }
            })
        } else {
            setLoading(false)
            setPosts({
                numberOfPages: result.numberOfPages,
                posts: result.posts
            })
        }
    }

    const changeCategory = async (category: string) => {
        if(category === router.query.category) return;
        router.push({
            pathname: router.pathname,
            query: { category: category, page: 'p1' }
        })
        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        if(status.length > 0) {
            setStatus([])
        }
        const result = await axios.get(`http://localhost:9999/api/post/show${chooseCategoryServer(category)}?page=0`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            return;
                        })
                        setLoading(false)
        if(!result) {
            router.replace({
                pathname: router.pathname,
                query: { ...router.query, page: 'p1' }
            })
        }
        setPosts({
            numberOfPages: result ? result.numberOfPages : 0,
            posts: result ? result.posts : []
        })
    }

    const changeStatus = async (status: string[]) => {
        if(Array.isArray(router.query.category) || !categoriesAllowed.includes(router.query.category || 'a')){
            router.push('/404')
        }
        if(!router.query.page) {
            router.push('/404')
        }


        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        let urlPart = '';
        router.replace({
            pathname: router.pathname,
            query: { ...router.query, page: 'p1' }
        })

        status.map((value: string, index: number) => {
                if(index === 0) {
                    urlPart += `/${value}`
                } else if(index === 1) {
                    urlPart += `/${value}`
                } else if(index === 2) {
                    urlPart += `/${value}`
                } else if(index === 3) {
                    urlPart += `/${value}`
                }
        })

        const result = await axios.get(`http://localhost:9999/api/post/show${chooseCategoryServer(router.query.category)}${urlPart}?page=0`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            return;
                        })
        setLoading(false)
        setPosts({
            numberOfPages: result ? result.numberOfPages : 1,
            posts: result ? result.posts : []
        })
    }

    useEffect(() => {
        changePage(router.query.category)
    }, [router.query.page])

    const ListItem = ({ text, category, index, }: ListItems) => {
        const active = index === 1 ? router.query.category === 'popular' : ( index === 2 ? router.query.category === 'apreciate' : ( index === 3 ? router.query.category === 'vizionate' : ( index === 4 ? router.query.category === 'comentarii' : router.query.category === 'noi')))
        
                
        return (
                <li key={index} className={active ? styles.active : ''} onClick={() => changeCategory(category)}>
                    <p key={index}>
                        {text}
                    </p>
                </li>
        )
    }
    

    const handleChange = async (event: any) => {
        if(!status.includes(event.target.value)) {
            setStatus([ ...status, event.target.value ])
        } else {
            setStatus(status.filter(status => !status.includes(event.target.value)))
        }
    };

    useEffect(() => {
        changeStatus(status)
    }, [status])

    return (
        <>
        <StatusSelect status={status} handleChange={handleChange} />

        <div style={{ display: 'flex', flexFlow: 'row nowrap'}}>
            <div className={`${styles.container_sm}`}>
                <div className={styles.list_cat}>
                    <ul>
                        <ListItem text='Populare' category='popular' index={1} />
                        <ListItem text='Cele mai apreciate' category='apreciate' index={2} />
                        <ListItem text='Cele mai vizionate' category='vizionate' index={3} />
                        <ListItem text='Cele mai multe comentarii' category='comentarii' index={4} />
                        <ListItem text='Cele mai noi' category='noi' index={5} />
                    </ul>
                </div>
            </div>

            <div className={gridStyles.grid_posts}>
                    {posts.numberOfPages !== 0 ?
                        posts.posts.map((value: any, key: number) => {
                            return (
                                <PostGrid key={value._id} index={key} _id={value._id} title={value.title} authorId={value.authorId} city={value.city} county={value.county} 
                                        description={value.description} downVoted={value.downVoted} upVoted={value.upVoted} firstNameAuthor={value.firstNameAuthor} 
                                        media={value.media} status={value.status} reports={value.reports} views={value.views} favorites={value.favorites} creationDate={value.creationDate} 
                                        nameAuthor={value.nameAuthor} authorProfilePicture={value.authorProfilePicture} comments={value.comments} />
                            )
                    })
                        : 
                        <> {!loading &&
                            <div style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center'}}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg' width={200} height={200} />
                                <h2 style={{ width: '100%', color: '#808080'}}>Nicio postare nu a fost găsită. Fii primul care face una.</h2>
                            </div>
                            }
                        </>
                    }
                   {loading && <div className={gridStyles.loader}></div> }
                   <div>
                        {posts.numberOfPages !== 0 &&
                            <Pagination numberOfPages={posts.numberOfPages} />
                        }
                    </div>
            </div>

            
        </div>
        </>
    )
}

export default Postari;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies['x-access-token']
    let redirect = false

    if(!token) {
        return {
            redirect: {
                permanent: false,
                destination: '/autentificare'
            },
            props: {}
        }
    }

    const user = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err);
                            redirect = true
                        })

    if(redirect)  {
        return {
            redirect: {
                permanent: false,
                destination: '/autentificare'
            },
            props: {}
        }
    }

    return {
        props: {}
    }
}