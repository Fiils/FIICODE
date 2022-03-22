import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


const Postari: NextPage = () => {
    const router = useRouter()

    useEffect(() => {
        if(router.pathname === '/postari'){
            router.push('/postari/cx/p1')
        }
    }, [])
    return (
        <div>

        </div>
    )
}

export default Postari