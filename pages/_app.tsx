import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useLayoutEffect, useState } from 'react'

import '../styles/scss/globals.scss'
import Header from '../components/Layout/Header'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const pathname = router.pathname

  const [ showHeader, setShowHeader ] = useState(true)

  useLayoutEffect(() => {
    if(pathname === '/inregistrare') {
      setShowHeader(false)
    } else {
      setShowHeader(true)
    }
  }, [pathname])


  return(
    <>
      <Head>
        <title>FIICODE</title>
        <meta name="description" content="O aplicatie pentru administrarea noilor idei oferite de catre oameni dintr-o anumita comuna/localitate/judet pentru imbunatatirea acesteia" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="http://localhost:3000" />
      </Head>
      {showHeader ? <Header /> : <></> }
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
