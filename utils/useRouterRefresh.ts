import { useCallback } from 'react'
import { useRouter } from 'next/router'

const { asPath, replace } = useRouter()
export default function useRouterRefresh () {

  return useCallback(() => replace(asPath), [asPath])
}