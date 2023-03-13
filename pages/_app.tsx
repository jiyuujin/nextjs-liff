import Head from 'next/head'
import { useLine } from '../hooks/useLine'

import '../styles/globals.css'

const MyApp = ({ Component, pageProps }) => {
  const { liffObject, status } = useLine()

  pageProps.liffObject = liffObject
  pageProps.status = status

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
