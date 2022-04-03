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

          <link
            rel="preload"
            href="/fonts/Roboto/Roboto.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Roboto/Roboto.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/Roboto/Roboto.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous" 
          />
          
          <link
            rel="preload"
            href="/fonts/LibreBaskerville/LibreBaskerville.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/LibreBaskerville/LibreBaskerville.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/LibreBaskerville/LibreBaskerville.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous" 
          />

          <link
            rel="preload"
            href="/fonts/BalooTamma2/BalooTamma2.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/BalooTamma2/BalooTamma2.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/BalooTamma2/BalooTamma2.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous" 
          />

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
        {showLayout ? <Header /> : <></> }
        <Component {...pageProps} />
        {showLayout ? <Footer /> : <></> }
      </div>
    </AuthProvider>
  )
}

export default MyApp
