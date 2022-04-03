import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import '../styles/scss/globals.scss'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { AuthProvider } from '../utils/useAuth'


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const pathname = router.pathname

  const [ showLayout, setShowLayout ] = useState(true)

  useEffect(() => {
    if(pathname === '/inregistrare' || pathname === '/autentificare') {
      setShowLayout(false)
    } else {
      setShowLayout(true)
    }
  }, [pathname])


  return(
    <AuthProvider>
      <div>
        <Head>
          <title>ROMDIG</title>
          <meta name="description" content="O aplicatie pentru administrarea noilor idei oferite de catre oameni dintr-o anumita comuna/localitate/judet pentru imbunatatirea acesteia" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0" />
          <meta charSet="utf-8" />
          <link rel="canonical" href="http://localhost:3000" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        {showLayout ? <Header /> : <></> }
        <Component {...pageProps} />
        {showLayout ? <Footer /> : <></> }
      </div>
    </AuthProvider>
  )
}

export default MyApp
