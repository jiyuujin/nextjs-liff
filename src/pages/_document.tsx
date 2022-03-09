import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

type Props = {}

class MyDocument extends NextDocument<Props> {
  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
