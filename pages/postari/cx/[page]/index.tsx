import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useInView } from 'react-intersection-observer';

import styles from '../../../../styles/scss/Posts/SideMenu.module.scss'
import gridStyles from '../../../../styles/scss/Posts/Grid.module.scss'
import PostGrid from '../../../../components/Posts/PostGrid'
import Pagination from '../../../../components/Posts/Pagination'
import StatusSelect from '../../../../components/Posts/StatusSelect'


interface ListItems {
    text: string;
    category: string;
    index: number;
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
        }
    }
}


const Postari: NextPage<InitialFetchProps> = () => {
    const router = useRouter()

    const { ref, inView, entry } = useInView({
        threshold: 0,
      });

    const [ fixed, setFixed ] = useState(true)
    useEffect(() => {
        if(inView){
            setFixed(false)
        } else {
            setFixed(true)
        }
    }, [inView])
    
     
    const [ posts, setPosts ] = useState({ numberOfPages: 0, posts: []})
    const [ status, setStatus ] = useState<string[]>([])
    const [ pref, setPref ] = useState('/mupvotes')

    const [ old, setOld ] = useState(false)

    const [ categories, setCategories ] = useState({
        popular: false,
        upvotes: true,
        views: false,
        comments: false,
        downvotes: false,
        age: false
    })
    const [ loading, setLoading ] = useState(false)

    const changePage = async (category: string) => {
        const page = router.query.page ? router.query.page.toString().split('') : ['p', '1']
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
        const result = await axios.get(`http://localhost:9999/api/post/show${category}?page=${parseInt(number) - 1}`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            return;
                        })

        if(!result) {
            router.replace({
                pathname: router.pathname,
                query: { page: 'p1' }
            })
        }

        if(result.posts.length === 0) {
            setLoading(false)
            return router.replace({
                pathname: router.pathname,
                query: { page: 'p1' }
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
        router.replace({
            pathname: router.pathname,
            query: { page: 'p1' }
        })
        setPref(category)
        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        const result = await axios.get(`http://localhost:9999/api/post/show${category}?page=0`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            return;
                        })
        setLoading(false)
        if(!result) {
            router.replace({
                pathname: router.pathname,
                query: { page: 'p1' }
            })
        }
        setPosts({
            numberOfPages: result.numberOfPages,
            posts: result.posts
        })
    }

    const changeStatus = async (status: string[]) => {
        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        let urlPart = '';
        router.replace({
            pathname: router.pathname,
            query: { page: 'p1' }
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
        const result = await axios.get(`http://localhost:9999/api/post/show${pref}${urlPart}?page=0`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            return;
                        })
        setLoading(false)
        setPosts({
            numberOfPages: result.numberOfPages,
            posts: result.posts
        })
    }

    useEffect(() => {
        changePage(pref)
    }, [router.query.page])

    const ListItem = ({ text, category, index }: ListItems) => {
        const active = index === 1 ? categories.popular : ( index === 2 ? categories.upvotes : ( index === 3 ? categories.views : ( index === 4 ? categories.comments : categories.downvotes)))
        const onClick= (e: any) => {
            if(!active) {
                switch(index) {
                case 1:
                    setCategories({ popular: true, upvotes: false, views: false, comments: false, downvotes: false, age: false })
                    break;
                case 2:
                    setCategories({ popular: false, upvotes: true, views: false, comments: false, downvotes: false, age: false })
                    break;            
                case 3:
                    setCategories({ popular: false, upvotes: false, views: true, comments: false, downvotes: false, age: false })
                    break;            
                case 4:
                    setCategories({ popular: false, upvotes: false, views: false, comments: true, downvotes: false, age: false })
                    break;
                case 5:
                    setCategories({ popular: false, upvotes: false, views: false, comments: false, downvotes: true, age: false })
                    break;
                case 6:
                    setCategories({ popular: false, upvotes: false, views: false, comments: false, downvotes: false, age: true })
                    break;
                }
                changeCategory(category)
            }
        }

        return (
                <li key={index} className={active ? styles.active : ''} onClick={(e) => onClick(e)}>
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

        <div style={{ display: 'flex', flexFlow: 'row nowrap', gap: '4em'}}>
            <div className={`${styles.container_sm}`}>
                <div className={styles.list_cat}>
                    <ul>
                        <ListItem text='Populare' category='/popular' index={1} />
                        <ListItem text='Cele mai apreciate' category='/mupvotes' index={2} />
                        <ListItem text='Cele mai vizionate' category='/mviews' index={3} />
                        <ListItem text='Cele mai multe comentarii' category='/mcomments' index={4} />
                        {/* <ListItem text='Cele mai puțin apreciate' category='/mdownvotes' index={5} /> */}
                        <ListItem text='Cele mai noi' category='/age' index={5} />
                    </ul>
                </div>
            </div>

            <div className={gridStyles.grid_posts}>
                    {posts.numberOfPages !== 0 ?
                        posts.posts.map((value: any, key: number) => {
                            return (
                                <PostGrid key={value._id} index={key} _id={value._id} title={value.title} authorId={value.authorId} city={value.city} county={value.county} 
                                        description={value.description} downVoted={value.downVoted} upVoted={value.upVoted} firstNameAuthor={value.firstNameAuthor} 
                                        media={value.media} status={value.status} reports={value.reports} views={value.views} favorites={value.favorites} />
                            )
                    })
                    :
                        <div>
                            
                        </div>
                    }
                   {loading && <div className={gridStyles.loader}></div> }
                   <div ref={ref}>
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
                            console.log(err.response);
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