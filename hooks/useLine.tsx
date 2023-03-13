import { useEffect, useState } from 'react'

export type Status = 'signin' | 'inited'

export const useLine = () => {
  const [liffObject, setLiffObject] = useState<any | null>(null)
  const [status, setStatus] = useState<Status>('signin')

  const login = () => {
    liffObject?.login({})
  }

  const logout = () => {
    liffObject?.logout()
  }

  useEffect(() => {
    if (status === 'inited') return

    import('@line/liff').then((liff: any) => {
      liff
        .init({ liffId: process.env.NEXT_APP_LIFF_ID })
        .then(() => {
          setLiffObject(liff)
          if (liff.isLoggedIn()) setStatus('inited')
        })
        .catch((err: any) => {
          console.error({ err })
        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    liffObject,
    status,
    login,
    logout,
  }
}
