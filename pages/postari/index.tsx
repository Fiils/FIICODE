import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios'
import { useState, useEffect } from 'react'

import styles from '../../styles/scss/Posts/SideMenu.module.scss'
import gridStyles from '../../styles/scss/Posts/Grid.module.scss'
import PostGrid from '../../components/Posts/PostGrid'
import Pagination from '../../components/Posts/Pagination'

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
const Postari: NextPage<InitialFetchProps> = ({ pages, data }) => {

    const [ posts, setPosts ] = useState({ numberOfPages: pages, posts: [data]})

    const [ categories, setCategories ] = useState({
        popular: false,
        upvotes: false,
        views: false,
        comments: false,
        downvotes: false
    })
    const [ loading, setLoading ] = useState(false)

    const changeCategory = async (e: any, category: string) => {
        e.preventDefault()
        setLoading(true)
        const result = await axios.get(`http://localhost:9999/api/post/show${category}`, { withCredentials: true })
                        .then(res => res.data)
        
        setPosts({
            numberOfPages: result.numberOfPages,
            posts: result.posts
        })
        setLoading(false)
    }

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
                changeCategory(e, category)
            }
        }

        return (
                <li className={active ? styles.active : ''} onClick={(e) => onClick(e)}>
                    <p>
                        {text}
                    </p>
                </li>
        )
    }

    return (
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
                                <PostGrid key={key} _id={value._id} title={value.title} authorId={value.authorId} city={value.city} county={value.county} 
                                        description={value.description} downVoted={value.downVoted} upVoted={value.upVoted} firstNameAuthor={value.firstNameAuthor} 
                                        media={value.media} status={value.status} reports={value.reports  } favorites={value.favorites} />
                            )
                    })}
                    {/* <div className={gridStyles.loader}></div> */}
                    {posts.numberOfPages !== 0 &&
                        <Pagination numberOfPages={posts.numberOfPages} />
                    }
            </div>

            
        </div>
    )
}

export default Postari

export const getStaticProps = async () => {
    try {
        console.log('a')
        const result: any = await axios.get('http://localhost:9999/api/post/show/mupvotes', { withCredentials: true })
                        .then(res => console.log(res.data))
        console.log(result)
        
        return {
            props: {
                pages: result.numberOfPages,
                data: result.posts
            }
        }
    } catch(err) {
        console.log(err)
        return {
            props: {
                pages: 0,
                data: []
            }
        }
    }
}