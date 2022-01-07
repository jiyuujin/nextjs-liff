import React, { useEffect, useReducer } from 'react'
import Head from 'next/head'
import { authState } from '../plugins/firebase'
import AuthContext from '../lib/AuthContext'
import authReducer from '../lib/AuthReducer'

import '../static/globals.css'

const MyApp = ({ Component, pageProps }) => {
  const [state, dispatch] = useReducer(authReducer.reducer, authReducer.initialState)

  useEffect(() => {
    return authState(dispatch)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <AuthContext.Provider value={state}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </>
  )
}

export default MyApp
