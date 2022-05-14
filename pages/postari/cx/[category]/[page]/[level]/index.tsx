import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import styles from '../../../../../../styles/scss/Posts/SideMenu.module.scss'
import gridStyles from '../../../../../../styles/scss/Posts/Grid.module.scss'
import PostGrid from '../../../../../../components/Posts/PostGrid'
import StatusSelect from '../../../../../../components/Posts/StatusSelect'
import { server } from '../../../../../../config/server'
import { useAuth } from '../../../../../../utils/useAuth'
import useWindowSize from '../../../../../../utils/useWindowSize'
import { NoSSR } from '../../../../../../utils/NoSsr'


const Pagination  = dynamic(() => import('../../../../../../components/Posts/Pagination'), { ssr: false })
const MobilePagination  = dynamic(() => import('../../../../../../components/Posts/MobilePagination'), { ssr: false })
const MobileCategories  = dynamic(() => import('../../../../../../components/Posts/MobileCategories'), { ssr: false })

interface ListItems {
    text: string;
    index: number;
    category: string;
}

interface Posts {
    _posts: any;
    numberOfPages: number;
}


const Postari: NextPage<Posts> = ({ _posts, numberOfPages }) => {
    const router = useRouter()

    const auth = useAuth()

    const village = router.query.level === 'sat' ? '&village=sat' : (router.query.level === 'comuna' ? '&village=comuna' : '')
    const county = router.query.level === 'judet' ? '&county=judet' : (router.query.level === 'oras' ? '&county=oras' : '')
     
    const [ posts, setPosts ] = useState({ numberOfPages: numberOfPages ? numberOfPages : 0, posts: _posts ? _posts: []})
    const [ status, setStatus ] = useState<string[]>([])
    const categoriesAllowed = [ 'apreciate', 'popular', 'vizionate', 'comentarii', 'noi', 'vechi' ]

    const [ width, height ] = useWindowSize()

    const [ executeChangeCategory, setExecuteChangeCategory ] = useState(false)
    const [ executeChangeStatus, setExecuteChangeStatus ] = useState<null | boolean>(null)
    const [ executeChangePage, setExecuteChangePage ] = useState(false)

    useEffect(() => {
        if(router.query.status && router.query.status !== '' && executeChangeStatus === null) {
            const statuses = router.query.status.toString().split(',')
            
            setStatus([ ...statuses ])
        }
    }, [])

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
            case 'vechi':
                return '/age';
            default:
                return '/popular'
        }
    }

    const [ loading, setLoading ] = useState(false)

    const changePage = async (category: string | undefined | string[]) => {
        if(!executeChangePage) return;
        setExecuteChangePage(false)

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
        const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(category)}?page=${parseInt(number) - 1}${village}${county}&age=${category === 'vechi' ? '1' : '-1'}`, { withCredentials: true })
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
        if(category === router.query.category || !executeChangeCategory) return;
        setExecuteChangeCategory(false)

        router.push({
            pathname: router.pathname,
            query: { ...router.query, category: category, page: 'p1', status: undefined }
        })
        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        if(status.length > 0) {
            setStatus([])
        }
        const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(category)}?page=0${village}${county}&age=${category === 'vechi' ? '1' : '-1'}`, { withCredentials: true })
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
        if(!executeChangeStatus) return;
        setExecuteChangeStatus(false)

        if(Array.isArray(router.query.category) || !categoriesAllowed.includes(router.query.category || 'a')){
            router.push('/404')
        }
        if(!router.query.page) {
            router.push('/404')
        }


        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        let urlPart = '';

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

        let statuses = ''
        for(let i = 0; i < status.length; i++) {
            statuses += `${status[i]}${status.length > i + 1 ? ',' : ''}`
        }

        router.replace({
            pathname: router.pathname,
            query: { ...router.query, page: 'p1', status: statuses.length > 0 ? statuses : undefined  }
        })

        const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(router.query.category)}${urlPart}?page=0${village}${county}&age=${router.query.category === 'vechi' ? '1' : '-1'}`, { withCredentials: true })
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
    }, [router.query.page, router.query.level, executeChangePage])

    const [ specialIndex, setSpecialIndex ] = useState(router.query.category === 'popular' ? 1 : (router.query.category === 'apreciate' ? 2 : (router.query.category === 'vizionate' ? 3 : (router.query.category === 'comentarii' ? 4 : (router.query.category === 'noi' ? 5 : (router.query.category === 'vechi' ? 6 : 1))))))
    const ListItem = ({ text, category, index, }: ListItems) => {
        const active = index === 1 ? router.query.category === 'popular' : ( index === 2 ? router.query.category === 'apreciate' : ( index === 3 ? router.query.category === 'vizionate' : ( index === 4 ? router.query.category === 'comentarii' : (index === 5 ? router.query.category === 'noi' : router.query.category === 'vechi' ))))
        
        useEffect(() => {
            if(specialIndex === index) {
                changeCategory(category)
            }
        }, [executeChangeCategory])

        
        return (
                <li key={index} className={active ? styles.active : ''} onClick={() => { setExecuteChangeCategory(true); setSpecialIndex(index) } }>
                    <p key={index}>
                        {text}
                    </p>
                </li>
        )
    }
    

    const handleChange = async (event: any) => {
        setExecuteChangeStatus(true)
        if(!status.includes(event.target.value)) {
            setStatus([ ...status, event.target.value ])
        } else {
            setStatus(status.filter(status => !status.includes(event.target.value)))
        }
    };

    useEffect(() => {
        changeStatus(status)
    }, [status, executeChangePage])

    return (
        <NoSSR fallback={<div style={{ height: '100vh'}}></div>}>
            <Head>
    
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
    
            {(width >= 1400) && <StatusSelect status={status} handleChange={handleChange} /> }
    
            <div style={{ display: 'flex', flexFlow: 'row nowrap', marginTop: 0}}>
            {(width >= 1400) &&
                <div className={`${styles.container_sm}`}>
                    <div className={styles.list_cat}>
                        <ul>
                            <ListItem text='Populare' category='popular' index={1} />
                            <ListItem text='Cele mai apreciate' category='apreciate' index={2} />
                            <ListItem text='Cele mai vizionate' category='vizionate' index={3} />
                            <ListItem text='Cele mai multe comentarii' category='comentarii' index={4} />
                            <ListItem text='Cele mai noi' category='noi' index={5} />
                            <ListItem text='Cele mai vechi' category='vechi' index={6} />
                        </ul>
                    </div>
                </div>
            }
                <div className={gridStyles.grid_posts}>
                        <div style={{ position: 'relative', width: '100%'}}>
                            {(auth.user.comuna && auth.user.comuna !== '') ? 
                                <div className={gridStyles.special_categories}>
                                    <a href={router.pathname !== '/postari/cx/[category]/[page]' ? `/postari/cx/${router.query.category}/p1` : ''} className={router.pathname === '/postari/cx/[category]/[page]' ? gridStyles.inactive_cat : ''}>Toate</a>
                                    <a href={router.query.level !== 'judet' ? `/postari/cx/${router.query.category}/p1/judet` : ''} className={router.query.level === 'judet' ? gridStyles.inactive_cat : ''}>Județ</a>
                                    <a href={router.query.level !== 'comuna' ? `/postari/cx/${router.query.category}/p1/comuna` : ''} className={router.query.level === 'comuna' ? gridStyles.inactive_cat : ''}>Comuna</a>
                                    <a href={router.query.level !== 'sat' ? `/postari/cx/${router.query.category}/p1/sat` : ''} className={router.query.level === 'sat' ? gridStyles.inactive_cat : ''}>Sat</a>
                                </div>
                                :
                                <div className={gridStyles.special_categories}>
                                    <a href={router.pathname !== '/postari/cx/[category]/[page]' ? `/postari/cx/${router.query.category}/p1` : ''} className={router.pathname === '/postari/cx/[category]/[page]' ? gridStyles.inactive_cat : ''}>Toate</a>
                                    <a href={router.query.level !== 'judet' ? `/postari/cx/${router.query.category}/p1/judet` : ''} className={router.query.level === 'judet' ? gridStyles.inactive_cat : ''}>Județ</a>
                                    <a href={router.query.level !== 'oras' ? `/postari/cx/${router.query.category}/p1/oras` : ''} className={router.query.level === 'oras' ? gridStyles.inactive_cat : ''}>Oraș</a>
                                </div>
                            }
                        </div>
                        {(width < 1400) &&
                            <MobileCategories changeCategory={changeCategory} status={status} handleChange={handleChange} />
                        }
                        {posts.numberOfPages !== 0 ?
                            posts.posts.map((value: any, key: number) => {
                                return (
                                    <PostGrid key={value._id} index={key} _id={value._id} title={value.title} authorId={value.authorId} city={value.city} county={value.county} 
                                            description={value.description} downVoted={value.downVoted} upVoted={value.upVoted} firstNameAuthor={value.firstNameAuthor} 
                                            media={value.media} status={value.status} reports={value.reports} views={value.views} favorites={value.favorites} creationDate={value.creationDate} 
                                            nameAuthor={value.nameAuthor} authorProfilePicture={value.authorProfilePicture} comments={value.comments} deletedUser={value.deletedUser} />
                                )
                        })
                            : 
                            <> {!loading &&
                                <div style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', mixBlendMode: 'multiply' }} className={gridStyles.not_found}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg' width={200} height={200} alt='Fara Postari' />
                                    <h2 style={{ width: '100%', color: '#808080', textAlign: 'center' }}>Nicio postare nu a fost găsită. Fii primul care face una.</h2>
                                </div>
                                }
                            </>
                        }
                        {loading && <div className={gridStyles.loader}></div> }
                        <div>
                            {(width >= 480) ?
                                <>
                                    {posts.numberOfPages !== 0 &&
                                        <Pagination setExecuteChangePage={setExecuteChangePage} numberOfPages={posts.numberOfPages} />
                                    }
                                </>
                            :
                                <>
                                    {posts.numberOfPages !== 0 &&
                                        <MobilePagination setExecuteChangePage={setExecuteChangePage} numberOfPages={posts.numberOfPages} />
                                    }
                                </>
                        }
                        </div>
                </div>
    
                
            </div>
        </NoSSR>
    )
}

export default Postari;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const { req } = ctx
    const token = req.cookies['x-access-token']
    let redirect = false
    const allowedValues = [ 'comuna', 'sat', 'judet', 'oras' ]

    if(Array.isArray(ctx.query.level) || !allowedValues.includes(ctx.query.level)) {
        return {
            notFound: true
        }
    }

    const categoriesAllowed = [ 'apreciate', 'popular', 'vizionate', 'comentarii', 'noi', 'vechi' ]

    if(Array.isArray(ctx.query.category) || !categoriesAllowed.includes(ctx.query.category)) {
        return {
            notFound: true
        }
    }

    if(!ctx.query.page || Array.isArray(ctx.query.page)) {
        return {
            notFound: true
        }
    }

    if(!token) {
        return {
            redirect: {
                permanent: false,
                destination: '/autentificare'
            },
            props: {}
        }
    }

    const user = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
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

    if(user && user.comuna !== '' && ctx.query.level === 'oras') {
        return {
            redirect: {
                permanent: false,
                destination: '/postari/cx/popular/p1'
            },
            props: {}
        }
    } else if(user && user.comuna === '' && (ctx.query.level === 'sat' || ctx.query.level === 'comuna')) {
        return {
            redirect: {
                permanent: false,
                destination: '/postari/cx/popular/p1'
            },
            props: {}
        }
    }

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
            case 'vechi':
                return '/age';
            default:
                return '/popular'
        }
    }

    let statuses = ''
    if(ctx.query.status && ctx.query.status !== '') {
        for(let i = 0; i < ctx.query.status.toString().split(',').length; i++) {
            statuses += `${ctx.query.status.toString().split(',')[i]}${ctx.query.status.toString().split(',').length > i + 1 ? ',' : ''}`
        }
    }

    const statusa = `${(statuses.split(',')[0] && statuses.split(',')[0] !== '') ? `/${statuses.split(',')[0]}` : ''}`
    const statusb = `${(statuses.split(',')[1] && statuses.split(',')[1] !== '') ? `/${statuses.split(',')[1]}` : ''}`
    const statusc = `${(statuses.split(',')[2] && statuses.split(',')[2] !== '') ? `/${statuses.split(',')[2]}` : ''}`
    const statusd = `${(statuses.split(',')[3] && statuses.split(',')[3] !== '') ? `/${statuses.split(',')[3]}` : ''}`

    const village = ctx.query.level === 'sat' ? '&village=sat' : (ctx.query.level === 'comuna' ? '&village=comuna' : '')
    const county = ctx.query.level === 'judet' ? '&county=judet' : (ctx.query.level === 'oras' ? '&county=oras' : '')

    const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(ctx.query.category)}${statusa}${statusb}${statusc}${statusd}?page=${parseInt(ctx.query.page.split('p')[1]) - 1}&age=${ctx.query.category === 'vechi' ? '1' : '-1'}${village}${county}`,  { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                    .then(res => res.data)
                    .catch(err => {
                        console.log(err); 
                        return;
                    })
    return {
        props: {
            _posts: result ? result.posts : [],
            numberOfPages: result ? result.numberOfPages : 0
        }
    }
}