import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../../utils/useAuth'


const Postari: NextPage = () => {
    const router = useRouter()

    const user = useAuth()

    useEffect(() => {
        if(!user.user.isLoggedIn) {
            router.push('/autentificare')
        } else if (router.pathname === '/postari'){
            router.push('/postari/cx/p1')
        }
    }, [])
    return (
        <div>

        </div>
    )
}

export default Postari