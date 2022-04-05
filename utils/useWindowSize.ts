import { useState, useEffect } from 'react'

export default function useWindowSize(){
    const [ size, setSize ] = useState<number[]>([typeof window !== 'undefined' ? window.innerWidth : 1220, typeof window !== 'undefined' ? window.outerHeight : 1225]);
    useEffect(() => {
      const handleResize = () => {
        setSize([window && window.innerWidth, window && window.outerHeight])
      }
      window.addEventListener('resize', handleResize);
      return () => { window.removeEventListener('resize', handleResize); }
    }, [])
    return size;
  }