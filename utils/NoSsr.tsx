import { Fragment, useEffect, useState } from 'react'

interface NoSSRProps { 
    children: any;
    fallback: null;
}

export const NoSSR = ({children, fallback = null} : NoSSRProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return <Fragment>{isMounted ? children : fallback}</Fragment>
}