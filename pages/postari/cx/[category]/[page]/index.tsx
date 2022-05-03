import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import styles from '../../../../../styles/scss/Posts/SideMenu.module.scss'
import gridStyles from '../../../../../styles/scss/Posts/Grid.module.scss'
import PostGrid from '../../../../../components/Posts/PostGrid'
import StatusSelect from '../../../../../components/Posts/StatusSelect'
import { server } from '../../../../../config/server'
import { useAuth } from '../../../../../utils/useAuth'
import useWindowSize from '../../../../../utils/useWindowSize'
import { NoSSR } from '../../../../../utils/NoSsr'


const Pagination  = dynamic(() => import('../../../../../components/Posts/Pagination'), { ssr: false })
const MobilePagination  = dynamic(() => import('../../../../../components/Posts/MobilePagination'), { ssr: false })
const MobileCategories  = dynamic(() => import('../../../../../components/Posts/MobileCategories'), { ssr: false })


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

    const [ width, height ] = useWindowSize()
     
    const [ posts, setPosts ] = useState({ numberOfPages: numberOfPages ? numberOfPages : 0, posts: _posts ? _posts: []})
    const [ status, setStatus ] = useState<string[]>([])



    const [ executeChangeCategory, setExecuteChangeCategory ] = useState(false)
    const [ executeChangeStatus, setExecuteChangeStatus ] = useState<null | boolean>(null)
    const [ executeChangePage, setExecuteChangePage ] = useState(false)

    useEffect(() => {
        if(executeChangeStatus !== null) return;
        const statuses = []
        if(router.query.statusa === 'Trimis') {
            status.push('Trimis')
        } else if(router.query.statusb === 'Vizionat') {
            status.push('Vizionat')
        } else if(router.query.statusc === 'În lucru') {
            status.push('În lucru')
        } else if(router.query.statusd === 'Efectuat') {
            status.push('Efectuat')
        }
        
        setStatus([ ...statuses ])
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
        const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(category)}?page=${parseInt(number) - 1}&level=tot&age=${category === 'vechi' ? '1' : '-1'}`, { withCredentials: true })
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
            query: { category: category, page: 'p1' }
        })
        setLoading(true)
        setPosts({ numberOfPages: 0, posts: []})
        if(status.length > 0) {
            setStatus([])
        }
        const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(category)}?page=0&level=tot&age=${category === 'vechi' ? '1' : '-1'}`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            setLoading(false)
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

    

    useEffect(() => {
        changePage(router.query.category)
    }, [router.query.page])

    const [ specialIndex, setSpecialIndex ] = useState(1)
    const ListItem = ({ text, category, index, }: ListItems) => {
        const active = index === 1 ? router.query.category === 'popular' : ( index === 2 ? router.query.category === 'apreciate' : ( index === 3 ? router.query.category === 'vizionate' : ( index === 4 ? router.query.category === 'comentarii' : (index === 5 ? router.query.category === 'noi' : router.query.category === 'vechi' ))))
                
        useEffect(() => {
            if(specialIndex === index) {
                changeCategory(category)
            }
        }, [executeChangeCategory])

        return (
                <li key={index} className={active ? styles.active : ''} onClick={() => { setExecuteChangeCategory(true); setSpecialIndex(index)  } }>
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
        const changeStatus = async (status: any[]) => {
            if(!executeChangeStatus) return;
            setExecuteChangeStatus(false)
    
            if(!router.query.page) {
                router.push('/404')
            }
    
    
            setLoading(true)
            setPosts({ numberOfPages: 0, posts: []})
            let urlPart = '';
            
            // router.replace({
            //     pathname: router.pathname,
            //     query: { ...router.query, page: 'p1' }
            // })
    
    
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
    
            if(status.includes('Trimis')) {            
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, page: 'p1', statusa: encodeURI('Trimis') }
                })
            } else if(!status.includes('Trimis') && router.query.statusa) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, statusa: undefined }
                })
            }
            
            if(status.includes('Vizionat')) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, statusb: encodeURI('Vizionat') }
                })
            } else if(!status.includes('Vizionat') && router.query.statusa) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, statusb: undefined }
                })
            }
    
            if(status.includes('În lucru')) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, statusc: encodeURI('În lucru') }
                })
            } if(!status.includes('În lucru') && router.query.statusa) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, statusc: undefined }
                })
            }
    
            if(status.includes('Efectuat')) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, statusd: encodeURI('Efectuat') }
                })
            } else if(!status.includes('Efectuat') && router.query.statusa) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, statusd: undefined }
                })
            }
    
            const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(router.query.category)}${urlPart}?page=0&level=tot&age=${router.query.category === 'vechi' ? '1' : '-1'}`, { withCredentials: true })
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

        changeStatus(status)
    }, [status])

    console.log(router.query, status)

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
                    <div style={{ position: 'relative', width: '100%' }}>
                        {(auth.user.comuna && auth.user.comuna !== '') ? 
                            <div className={gridStyles.special_categories}>
                                <span onClick={() => { if(router.pathname !== '/postari/cx/[category]/[page]') router.push(`/postari/cx/${router.query.category}/p1`) }} className={router.pathname === '/postari/cx/[category]/[page]' ? gridStyles.inactive_cat : ''}>Toate</span>
                                <span onClick={() => { if(router.query.level !== 'judet') router.push(`/postari/cx/${router.query.category}/p1/judet`) }} className={router.query.level === 'judet' ? gridStyles.inactive_cat : ''}>Județ</span>
                                <span onClick={() => { if(router.query.level !== 'comuna') router.push(`/postari/cx/${router.query.category}/p1/comuna`) }} className={router.query.level === 'comuna' ? gridStyles.inactive_cat : ''}>Comuna</span>
                                <span onClick={() => { if(router.query.level !== 'sat') router.push(`/postari/cx/${router.query.category}/p1/sat`) }} className={router.query.level === 'sat' ? gridStyles.inactive_cat : ''}>Sat</span>
                            </div>
                            :
                            <div className={gridStyles.special_categories}>
                                <span onClick={() => { if(router.pathname !== '/postari/cx/[category]/[page]') router.push(`/postari/cx/${router.query.category}/p1`) }} className={router.pathname === '/postari/cx/[category]/[page]' ? gridStyles.inactive_cat : ''}>Toate</span>
                                <span onClick={() => { if(router.query.level !== 'judet') router.push(`/postari/cx/${router.query.category}/p1/judet`) }} className={router.query.level === 'judet' ? gridStyles.inactive_cat : ''}>Județ</span>
                                <span onClick={() => { if(router.query.level !== 'oras') router.push(`/postari/cx/${router.query.category}/p1/oras`) }} className={router.query.level === 'oras' ? gridStyles.inactive_cat : ''}>Oraș</span>
                            </div>
                        }
                        </div>
                        {width <= 1399 &&
                            <MobileCategories changeCategory={changeCategory} status={status} handleChange={handleChange} />
                        }
                        {posts.numberOfPages > 0 ?
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
                                <div style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', mixBlendMode: 'multiply' }}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg' alt='Fara Postari' width={200} height={200} />
                                    <h2 style={{ width: '100%', color: '#808080', textAlign: 'center' }}>Nicio postare nu a fost găsită. Fii primul care face una.</h2>
                                </div>
                                }
                            </>
                        }
                    {loading && <div className={gridStyles.loader}></div> }
                        <div>
                            {width >= 480 ?
                                    <>
                                        {(posts.numberOfPages > 0  && posts.posts.length > 0) &&
                                            <Pagination setExecuteChangePage={setExecuteChangePage} numberOfPages={posts.numberOfPages} />
                                        }
                                    </>
                                :
                                    <>
                                        {(posts.numberOfPages > 0 && posts.posts.length > 0) &&
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

    const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(ctx.query.category)}/${ctx.query.statusa ? ctx.query.statusa : 'a'}/${ctx.query.statusb ? ctx.query.statusb : 'b'}/${ctx.query.statusc ? ctx.query.statusc : 'c'}/${ctx.query.statusd ? ctx.query.statusd : 'd'}?page=${parseInt(ctx.query.page.split('p')[1]) - 1}&age=${ctx.query.category === 'vechi' ? '1' : '-1'}&level=tot`,  { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                    .then(res => res.data)
                    .catch(err => {
                        console.log(err); 
                        return;
                    })
    return {
        props: {
            _posts: result.posts,
            numberOfPages: result.numberOfPages
        }
    }
}