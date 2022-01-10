import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import '../static/globals.css'

const MyApp = ({ Component, pageProps }) => {
  const [liffObject, setLiffObject] = useState<any>(null)

  const [profileName, setProfileName] = useState<string>('')

  useEffect(() => {
    import('@line/liff').then((liff: any) => {
      liff
        .init({ liffId: process.env.NEXT_APP_LIFF_ID })
        .then(() => {
          if (!liff.isLoggedIn()) {
            liff.login({})
          }
          setLiffObject(liff)
          liff
            .getProfile()
            .then((profile: any) => {
              setProfileName(profile.displayName)
            })
            .catch((err: any) => {
              console.error({ err })
            })
        })
        .catch((err) => {
          console.error({ err })
        })
    })
  }, [])

  pageProps.liff = liffObject
  pageProps.profileName = profileName

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
