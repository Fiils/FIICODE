import type { NextPage } from 'next';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'


import styles from '../../../../styles/scss/Posts/SideMenu.module.scss'
import gridStyles from '../../../../styles/scss/Posts/Grid.module.scss'
import PostGrid from '../../../../components/Posts/PostGrid'
import Pagination from '../../../../components/Posts/Pagination'
import StatusSelect from '../../../../components/Posts/StatusSelect'
import { useAuth } from '../../../../utils/useAuth'


interface User {
    user: {
        isLoggedIn: boolean;
        userId: string;
    }
    setUser: any;
}

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
    }
}
const Postari: NextPage<InitialFetchProps> = () => {
    const router = useRouter()

    const user: User = useAuth()

    useEffect(() => {
        if(!user.user.isLoggedIn) {
            router.push('/autentificare')
        }
    }, [])
     
    const [ force, setForce ] = useState(false)
    const [ posts, setPosts ] = useState({ numberOfPages: 0, posts: []})
    const [ status, setStatus ] = useState<string[]>([])
    const [ pref, setPref ] = useState('/mupvotes')

    const [ categories, setCategories ] = useState({
        popular: false,
        upvotes: true,
        views: false,
        comments: false,
        downvotes: false
    })
    const [ loading, setLoading ] = useState(false)

    const changeCategory = async (category: string) => {
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

        if(result.posts.length === 0) {
            router.replace({
                query: { page: 'p1' }
            })

            const res = await axios.get(`http://localhost:9999/api/post/show${category}?page=${number}`, { withCredentials: true })
                             .then(res => res.data)
            setPosts({
                numberOfPages: res.numberOfPages,
                posts: res.posts
            })
            setPref(category)
            setLoading(false)
            setForce(!force)
            return;
        }
        setPosts({
            numberOfPages: result.numberOfPages,
            posts: result.posts
        })
        setPref(category)
        setForce(!force)
        setLoading(false)
    }

    useEffect(() => {
        changeCategory(pref)
    }, [router.query.page])

    const ListItem = ({ text, category, index }: ListItems) => {
        const active = index === 1 ? categories.popular : ( index === 2 ? categories.upvotes : ( index === 3 ? categories.views : ( index === 4 ? categories.comments : categories.downvotes)))
        const onClick= (e: any) => {
            if(!active) {
                switch(index) {
                case 1:
                    setCategories({ popular: true, upvotes: false, views: false, comments: false, downvotes: false })
                    break;
                case 2:
                    setCategories({ popular: false, upvotes: true, views: false, comments: false, downvotes: false })
                    break;            
                case 3:
                    setCategories({ popular: false, upvotes: false, views: true, comments: false, downvotes: false })
                    break;            
                case 4:
                    setCategories({ popular: false, upvotes: false, views: false, comments: true, downvotes: false })
                    break;
                case 5:
                    setCategories({ popular: false, upvotes: false, views: false, comments: false, downvotes: true })
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

        // await changeCategory(pref, `&status_a=${status[0] ? status[0] : ''}&status_b=${status[1] ? status[1] : ''}&status_c=${status[2] ? status[2] : ''}status_d=${status[3] ? status[3] : ''}`)
    };

    return (
        <>
        {/* <StatusSelect status={status} handleChange={handleChange} /> */}
        <div style={{ display: 'flex', flexFlow: 'row nowrap', gap: '4em'}}>
            <div className={styles.container_sm}>
                <div className={styles.list_cat}>
                    <ul>
                        <ListItem text='Populare' category='/popular' index={1} />
                        <ListItem text='Cele mai apreciate' category='/mupvotes' index={2} />
                        <ListItem text='Cele mai vizionate' category='/mviews' index={3} />
                        <ListItem text='Cele mai multe comentarii' category='/mcomments' index={4} />
                        <ListItem text='Cele mai puțin apreciate' category='/mdownvotes' index={5} />
                    </ul>
                </div>
            </div>

            <div className={gridStyles.grid_posts}>
                    {posts.numberOfPages !== 0 &&
                        posts.posts.map((value: any, key: number) => {
                            return (
                                <PostGrid key={value._id} index={key} _id={value._id} title={value.title} authorId={value.authorId} city={value.city} county={value.county} 
                                        description={value.description} downVoted={value.downVoted} upVoted={value.upVoted} firstNameAuthor={value.firstNameAuthor} 
                                        media={value.media} status={value.status} reports={value.reports  } favorites={value.favorites} />
                            )
                    })}
                   {loading && <div className={gridStyles.loader}></div> }
                    {posts.numberOfPages !== 0 &&
                        <Pagination numberOfPages={posts.numberOfPages} />
                    }
            </div>

            
        </div>
        </>
    )
}

export default Postari;