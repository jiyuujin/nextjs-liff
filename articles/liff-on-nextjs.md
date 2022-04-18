---
title: 'もし LIFF アプリを Next.js で作っていたなら'
emoji: '🥷'
type: 'tech' # tech: 技術記事 / idea: アイデア
topics: ['zenn', 'nextjs', 'react', 'liff', 'line'] # 5 つまで
publish-on: 2022-04-18
published: true # 下書きは false
---

# 前置き

2022 年 3 月 3 日に [LINE Developer コミュニティ](https://linedevelopercommunity.connpass.com/) 主催の下 [React](https://ja.reactjs.org/) ([Vite](https://ja.vitejs.dev/)) × [LIFF](https://developers.line.biz/ja/docs/liff/overview/) ハンズオンを実施いたしました。

https://linedevelopercommunity.connpass.com/event/237619/

教材は [Zenn book](https://zenn.dev/books) を利用して書いています。

https://zenn.dev/jiyuujin/books/react-x-vite-x-liff

ハンズオンではビルドツール [Vite](https://ja.vitejs.dev/) を利用して LIFF アプリを製作しました。

この代わりに [Next.js](https://nextjs.org/) を利用して LIFF アプリを製作するために、何に対して注意するべきか書かせていただきます。

- Next.js とは
- Next.js プロジェクトを作成する
  - カスタマイズ
  - ファイル構成
- SDK をインストールする
- LINE ログイン
- Bot よりカスタムメッセージを返す

## Next.js とは

まず Next.js は React をベースに開発されているフロントエンド・フレームワークです。

https://nextjs.org/

実際に Next.js を導入して得られるメリットは SSR や SSG としての利用が挙げられます。

ハンズオンのアンサー記事でも書かせていただいたフレームワークの選定について、候補のひとつ Next.js 大きな特徴のひとつにプレレンダリング機能が挙げられます。

https://webneko.dev/posts/the-answer-to-learn-react-with-line

初学者をターゲットに想定している以上、フレームワークに Next.js を選定するには、React のお作法だけを把握しておけば良いかと言われるとそうも行きません。

下記に示した通り、プレレンダリング機能を始め、何かと利用する場面の多い機能ばかりです。

- プレレンダリング機能
  - [Data Fetching Overview](https://nextjs.org/docs/basic-features/data-fetching/overview)
    - `getInitialProps`
    - `getStaticProps` + `getStaticPaths`
    - `getServerSideProps`
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- Next.js 12 新機能
  - ディレクトリ構成の仕様変更
  - ミドルウェア ([Middleware](https://nextjs.org/docs/middleware))

### プレレンダリング機能

では簡単にプレレンダリング機能を見ていくこととします。

代表的な API は下記 3 種類あります。

- `getInitialProps`
- `getStaticProps` + `getStaticPaths`
- `getServerSideProps`

#### `getInitialProps`

まず、Next.js 公式サイトでは Next.js 9.3 以降 `getStaticProps` と `getServerSideProps` を使うことが推奨されています。

https://nextjs.org/docs/api-reference/data-fetching/get-initial-props

:::message

なお `getInitialProps` を使えないことはありません。

:::

これより `getInitialProps` を使ってはいけない理由について。そもそも `getInitialProps` は SSR でも CSR でも、ページが表示された時に必ず実行されます。

このサーバ・クライアント双方で実行できてしまうことが、アプリケーションの複雑度を高めることに繋がってしまい、公式も積極的に推奨しないとアナウンスしている所以です。

https://github.com/vercel/next.js/discussions/13864

`getInitialProps` はサーバ・クライアント双方で実行されるため、不要なコードがクライアントにバンドルされてしまうのを防ぐ必要がありました。

下記に記した、新しい [データ取得メソッド](https://next-code-elimination.now.sh) によってサーバのコードを簡単に検出、クライアントのバンドルから削除できます。

https://next-code-elimination.now.sh

なお、リクエストを投げた場合にそれが完了するまではページ移動しない点は `getInitialProps` も `getStaticProps` と同じになります。

このようにして、クライアントにおけるローディングの利用により UX を高められます。

#### `getStaticProps`

率直に SG で利用されることを推奨しています。居酒屋に例えると、開店前予め準備したキンキンに冷えたビールを、客の注文が入り次第都度、客に提供するイメージを想像してください。

それはすなわちユーザへの提供時間が短く済む反面、ユーザの訪れたタイミングが悪い場合には、古いデータを渡してしまうことがあります。

:::message

居酒屋の例は、先日の「ジャムジャム！　 Jamstack 2」の [70 万通りの URL を持つ Web サービスを Next.js にリプレイスして高速化した話](https://speakerdeck.com/aiji42/70mo-tong-rifalseurlwochi-tuwebsabisuwo-next-dot-jsniripureisusitegao-su-hua-sitahua) で挙げられていました。

:::

よくあるブログコンテンツの取得を例に取ると、下記に示すように非同期の `fetchPosts()` というリクエストが投げられます。

```tsx:index.tsx
export const getStaticProps = async () => {
  const posts = await fetchPosts()
  return {
    props: {
      posts,
    },
  }
}
```

さらに、ユーザの訪れたタイミングが悪い場合に対処するため ISR (Incremental Static Regeneration) という考え方が登場します。

直訳すると「インクリメンタル静的再生成」で、一定時間ごとバックグラウンドでデータの再取得およびページの再レンダリングを行いながら HTML を再生成します。

居酒屋に例えると、ある一定の時間が過ぎたビールは破棄していくイメージを想像してください。

```tsx:index.tsx
export const getStaticProps = async () => {
  const posts = await getPosts()
  return {
    props: {
      posts,
    },
    revalidate: 10, // 👈 ここがポイント
  }
}
```

`revalidate` の値が、前回のフェッチから何秒間アクセスを無視するか指定します。

ここでは `revalidate` に `10` が設定されており、キャッシュが作られた後 10 秒間に限ってそのキャッシュを返すことになります。10 秒を超えると、そのキャッシュは返されません。

:::message

なお、利用するインフラに応じて ISR を実現できるか、考慮する必要があります。

Vercel 以外でそれを実現できるのか、という [議論](https://zenn.dev/catnose99/scraps/f1c9a98c5651f1) も巻き起こっているので、その動向も合わせ注視していきたい。

:::

#### `getServerSideProps`

一方 SSR を推奨する API で `getStaticProps` と同じく居酒屋に例えると、客の注文が入って初めて冷えたビールが注がれて、客に提供するイメージを想像してください。

それはすなわち、ユーザのページ遷移ごとにデータを拾ってくれるため、毎回新しいデータを渡すことになります。

よくあるブログコンテンツの取得を例に取ると、下記に示すようにユーザがページにアクセスした際、非同期の `fetchPosts()` というリクエストが投げられます。

```tsx:index.tsx
export const getServerSideProps = async () => {
  const posts = await fetchPosts()
  return {
    props: {
      posts,
    },
  }
}
```

### API Routes

`pages/api` ディレクトリ下に API のコードを書くことで、クライアントから呼び出せる API を定義できます。

```tsx:pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Response = {
name: string
}

export default (req: NextApiRequest, res: NextApiResponse<Response>) => {
  res.status(200).json({ name: 'Hello, API Routes' })
}
```

下記のように記述しても OK です。

```tsx:pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Response = {
name: string
}

export default (req: NextApiRequest, res: NextApiResponse<Response>) => {
  res.statusCode = 200
  res.json({ name: 'Hello, API Routes' })
}
```

このコードはサーバ上で実行されるため、API Routes 機能を使用するには Web サイトのホスティング時に `next start` が必要となります。

主に下記のような用途に使用することを想定しています。

- フォームに入力された値が POST された際、サーバに構築されている DB に保存する
- サードパーティ製の Web API の呼出を中継する

### ディレクトリ構成の仕様変更

アイコンなどに代表される static なファイルの置き場所が変更されている。

- 変更前 `/public`
- 変更後 `/public/static`

:::message

Next.js 12 以降でディレクトリ構成が変更されています。

:::

### ミドルウェア (Middleware)

`pages/_middleware.js(ts)` ディレクトリ下に middleware のコードを書くことで、全てのページ (routes) にて実行できます。

複数の middleware のコードが配置されている場合は、階層の浅い方から順に実行されます。

:::message

Next.js 12 以降で [Middleware](https://nextjs.org/docs/advanced-features/middleware) を利用できます。

:::

具体的なソースコードの例を見ていくことにします。

まずは、ヘッダを追加します。

```tsx:pages/_middleware.ts
import { NextResponse } from 'next/server'

export function middleware() {
  const response = NextResponse.next()

  // ヘッダを設定する
  response.headers.set('x-modified-edge', 'true')

  return response
}
```

続いて、クエリパタメータをチェックし、許可されていない場合はリダイレクトします。

```tsx:pages/_middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const allowedParams = ['hoge']

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  let changed = false

  url.searchParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  })

  // 許可されていない場合はリダイレクト
  if (changed) {
    return NextResponse.redirect(url)
  }
}
```

<!-- Next.js の環境構築 -->

## Next.js プロジェクトを作成する

:::message

Gitpod 実行用 URL より始められた方は、既に環境構築を済ませているため、こちらをスキップいただいて構いません。

あらかじめ Github にログインしますと、こちら [GitPod 実行用 URL](https://github.com/jiyuujin/template-nextjs/tree/feature/line-event_2022.2) からも進められます。

:::

`npx create-next-app` コマンドで Next.js プロジェクトを作成します。

TypeScript で書くため `--template typescript` オプションを選択します。

```bash
# create-next-app with JavaScript
npx create-next-app <アプリ名>

# create-next-app with TypeScript
npx create-next-app <アプリ名> --template typescript
```

#### 依存関係をインストールする

:::message

Gitpod は Web ブラウザ上で開発するため、事前の Node.js 環境構築は不要です。

:::

```bash
npm install
yarn install
```

#### localhost で起動する

[http://localhost:3000](http://localhost:3000) が Web ブラウザで開けば OK です。

```bash
# next dev
npm run dev
yarn dev
```

<!-- Web ページが開けるようになる --->

| Gitpod                               | Localhost                            |
| :----------------------------------- | :----------------------------------- |
| ![](https://i.imgur.com/e0hWkET.png) | ![](https://i.imgur.com/M2vTNQq.png) |

### カスタマイズ

ルート直下に next.config.js を作成します。ここで大体カスタマイズできます。

```js:next.config.js
module.exports = {
  //
}
```

#### HTTPS 環境を作る

:::message

Gitpod 実行用 URL より始められた方は、既に環境構築を済ませているため、こちらをスキップいただいて構いません。

あらかじめ Github にログインしますと、こちら [GitPod 実行用 URL](https://github.com/jiyuujin/template-nextjs/tree/feature/line-event_2022.2) からも進められます。

:::

Web ブラウザ上で挙動を確認するため HTTPS の環境にデプロイする必要があります。もちろん [Vercel](https://vercel.com/) に代表されるホスティングサービスを利用しても構いません。しかし、いちいちビルドしてから挙動を確認するのも大変面倒臭いので、今回は localhost で HTTPS の環境を準備します。

その環境を構築するため、オレオレ証明書 (certificates) を生成する必要があります。

```bash:bash
openssl req \
   -newkey rsa:2048 \
   -x509 \
   -nodes \
   -keyout localhost-key.pem \
   -new \
   -out localhost.pem \
   -subj /CN=localhost \
   -reqexts SAN \
   -extensions SAN \
   -config <(cat /etc/ssl/openssl.cnf \
       <(printf '[SAN]\nsubjectAltName=DNS:localhost,IP:192.168.0.1')) \
   -sha256 \
   -days 3650
```

これをもってプロジェクトルート直下に下記 2 ファイルが生成されます。

- localhost.pem
- localhost-key.pem

新たに certificates ディレクトリを切ってそこに移動させます。

```bash:bash
mkdir certificates
mv localhost-key.pem localhost.pem certificates
```

Node.js 標準で入っている fs の機能と合わせ Next.js の [カスタムサーバ](https://nextjs.org/docs/advanced-features/custom-server) を使うことで Express + HTTPS モジュールで HTTPS サーバを立てられる。

```js:server.js
const express = require('express')
const next = require('next')
const https = require('https')
const fs = require('fs')

const port = parseInt(process.env.PORT || '3000')
const host = '0.0.0.0'

const app = next({
  dev: process.env.NODE_ENV !== 'production',
})
const handle = app.getRequestHandler()

;(async () => {
  await app.prepare()

  const expressApp = express()
  expressApp.get('*', (req, res) => handle(req, res))

  const hasCertificates =
    fs.existsSync('./certificates/localhost-key.pem') && fs.existsSync('./certificates/localhost.pem')
  const useHttps = process.env.HTTPS === 'true' && hasCertificates

  if (useHttps) {
    const options = {
      cert: fs.readFileSync('./certificates/localhost.pem'),
      key: fs.readFileSync('./certificates/localhost-key.pem'),
    }

    const server = https.createServer(options, expressApp)
    server.listen(port, host)
    console.log(`> Ready on https://localhost:${port}`)
  } else {
    expressApp.listen(port, host)
    console.log(`> Ready on http://localhost:${port}`)
  }
})()
```

あとは LINE Developers のコンソールにある `Endpoint URL` で `https://localhost:3000` を設定します。

最終的に `HTTPS=true node ./server.js` を実行して Web サーバが起動することを確認してください。

<!-- Web ページが開けるようになる --->

| Localhost                            |
| :----------------------------------- |
| ![](https://i.imgur.com/M2vTNQq.png) |

<!-- ファイル構成 -->

### ファイル構成

tree コマンドを利用して、ファイル構成を示します。

```
# tree -a -I "\.DS_Store|\.git|\.github|\.idea|\.next|articles|books|out|node_modules|vendor\/bundle" -N

.
├── .env
├── certificates
│    ├── localhost-key.pem
│    └── localhost.pem
├── components
│    ├── Loading.tsx
│    ├── SendMessagesButton.tsx
│    ├── SignInButton.tsx
│    └── SignOutButton.tsx
├── lib
│    ├── AuthContext.tsx
│    └── AuthReducer.tsx
├── next-env.d.ts
├── next.config.js
├── package.json
├── package-lock.json
├── pages
│    ├── _app.tsx
│    ├── _document.tsx
│    └── index.tsx
├── public
├── static
│    ├── Home.module.css
│    ├── globals.css
│    └── tailwind.css
├── tsconfig.json
└── yarn.lock
```

今回のポイントは下記 3 つ、ローカル環境で開発する場合は 4 つです。

- TypeScript で書くため `tsconfig.json` が必要
- Next.js で設定をカスタマイズするため `next.config.js` が必要
- LINE ユーザ情報を保持するため `lib` が必要
- (ローカル環境で開発する場合) オレオレ証明書 (`certificates`) が必要

なお、ファイル構成は特異なものを採用していません。

一般的に React や Vue などフロントエンドで用いられているファイル構成を採用しています。

#### モノレポを考慮する

ソースコードを平置きにしても特に問題はありません。

しかし `/src` に配置した方が都合の良くなる可能性があります。

```
# tree -a -I "\.DS_Store|\.git|\.github|\.idea|\.next|articles|books|out|node_modules|vendor\/bundle" -N

.
├── .env
├── certificates
│    ├── localhost-key.pem
│    └── localhost.pem
├── next-env.d.ts
├── next.config.js
├── package.json
├── package-lock.json
├── public
├── src
│    ├── components
│    │    ├── Loading.tsx
│    │    ├── SendMessagesButton.tsx
│    │    ├── SignInButton.tsx
│    │    └── SignOutButton.tsx
│    ├── lib
│    │    ├── AuthContext.tsx
│    │    └── AuthReducer.tsx
│    ├── pages
│    │    ├── _app.tsx
│    │    ├── _document.tsx
│    │    └── index.tsx
│    └── static
│         ├── Home.module.css
│         ├── globals.css
│         └── tailwind.css
├── tsconfig.json
└── yarn.lock
```

モノレポとしてフロント・サーバをひとつのリポジトリ内に管理する場合などで効果的と考えられ、このような設計方法があることも合わせて認識しておきたい。

詳細は [`next1.1`](https://github.com/jiyuujin/nextjs-liff/tree/next1.1) ブランチをご確認いただければ幸いです。

## SDK をインストールする

と、ここで SDK を使う前に Vite を利用して製作した LIFF アプリでは、ルーティングに [react-router](https://reactrouter.com/) を使用していました。

https://reactrouter.com/

と言うのも LIFF 初期化の一環で `liff.login()` をかける前に URL がエンコードされており、そのままでルーティングされることはありません。

Router の外側で LIFF の初期化を行った上で URL をデコードするとルーティングされます。

今回の Next.js では `pages` ディレクトリ下に pages コンポーネントを配置するだけで、自動的にルーティングを反映させられます。

想定していないパスにアクセスした場合は `404.tsx` の内容が表示されます。

```tsx:pages/404.tsx
import React from 'react'

export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}
```

それも踏まえつつ LINE Front-end Framework (LIFF) を使うために [`@line/liff`](https://www.npmjs.com/package/@line/liff) をインストールします。

```bash
# @line/liff
npm i @line/liff
yarn add @line/liff
```

https://www.npmjs.com/package/@line/liff

### 環境変数を設定する

ルート直下の `next.config.js` でカスタマイズします。

LINE Developers のコンソールで作成した LIFF ID を `NEXT_APP_LIFF_ID` に設定します。

```shell:.env
NEXT_APP_LIFF_ID="YOUR_NEXT_APP_LIFF_ID"
```

環境変数 `NEXT_APP_LIFF_ID` を `next.config.js` の `env` プロパティで読み込みます。

```js:next.config.js
module.exports = {
  env: {
    NEXT_APP_LIFF_ID: process.env.NEXT_APP_LIFF_ID,
  },
}
```

## LINE ログイン

Root に近い \_app コンポーネントで `liff.init()` を利用することで LIFF を初期化します。

Next.js では全てのページにおいてページを初期化するために、この \_app コンポーネントを使用しています。 `pages/_app.jsx(tsx)` でオーバーライドすることによって、ページを初期化できるようになります。

具体的に以下の設定が可能となります。

- ページ移動における固定レイアウト
- `componentDidCatch` を使用したエラーハンドリング
- 状態管理ライブラリとの結合
  - Redux を利用した際に `<Provider>` を使ってラップする

:::message

全体の文書構造、特に SEO などをカスタマイズする場合は `pages/_document.jsx(tsx)` で Document コンポーネントを拡張してください。

:::

今回は `useEffect` の第 2 引数である依存関係の配列に何も渡されない場合、コンポーネントの初期レンダリング時に実行されることを利用します。

ここでポイントは 2 つです。

- 初期レンダリング時に `liff.init()` が呼び出されます
- 先と同じタイミングに LIFF が保持されます

そして `liff.isLoggedIn()` を使った判定により、既に LINE ログインを果たしていた場合は、再度 `liff.init()` しないようにします。

ソースコードは下記の通りです。

```tsx:src/pages/_app.tsx
import React, { useState, useEffect } from 'react'
...
const MyApp = () => {
  const [liffObject, setLiffObject] = useState<any>(null)

  useEffect(() => {
    import('@line/liff').then((liff: any) => {
      liff
        .init({ liffId: import.meta.env.VITE_APP_LIFF_ID })
        .then(() => {
          setLiffObject(liff)
          if (liff.isLoggedIn()) {
            // ログインの確認を取れたら
          }
        })
        .catch((err: any) => {
          console.error({ err })
        })
    })
  }, [])
  ...
```

また LIFF がちゃんと初期化できているかを判定してくれる API があります。

`ready` とそれに伴うコールバック関数を利用してください。
[公式ドキュメント](https://developers.line.biz/ja/reference/liff/#ready)

```tsx:example
useEffect(() => {
  liff.ready.then(() => {
    if (liff.isLoggedIn()) {
      const context = liff.getContext()
      const liffToken = liff.getAccessToken()
      setUid(context.userId)
      setAccessToken(liffToken)
    }
  })
}, [])
```

あとは Vite を利用して製作した LIFF アプリと同様に、Next.js でも製作していただければ幸いです。

## Bot よりカスタムメッセージを返す

:::message

Next.js ならでは、の機能 [API Routes](https://nextjs.org/docs/api-routes/introduction) を利用して、応用編にチャレンジしてみましょう。

:::

Bot よりメッセージを返すために [`@line/bot-sdk`](https://www.npmjs.com/package/@line/bot-sdk) をインストールします。

```bash
# @line/bot-sdk
npm i @line/bot-sdk
yarn add @line/bot-sdk
```

https://www.npmjs.com/package/@line/bot-sdk

### 環境変数を設定する

ルート直下の `next.config.js` でカスタマイズします。

LINE Developers のコンソールで作成したアクセストークンとシークレットを `NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN` 並びに `NEXT_APP_LIFF_CHANNEL_SECRET` に設定します。

```shell:.env
NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN="YOUR_NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN"
NEXT_APP_LIFF_CHANNEL_SECRET="YOUR_NEXT_APP_LIFF_CHANNEL_SECRET"
```

環境変数 `NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN` 並びに `NEXT_APP_LIFF_CHANNEL_SECRET` を `next.config.js` の `env` プロパティで読み込みます。

```js:next.config.js
module.exports = {
  env: {
    NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN: process.env.NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN,
    NEXT_APP_LIFF_CHANNEL_SECRET: process.env.NEXT_APP_LIFF_CHANNEL_SECRET,
  },
}
```

### ミドルウェアを利用する

`config` と `runMiddleware` は [API Middlewares](https://nextjs.org/docs/api-routes/api-middlewares) を利用します。

```ts:lib/line.ts
import { middleware as lineMiddleware, MiddlewareConfig } from '@line/bot-sdk'

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.NEXT_APP_LIFF_CHANNEL_SECRET || '',
}

export const middleware = lineMiddleware(middlewareConfig)
```

```tsx:pages/api/webhook.tsx
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { Middleware } from '@line/bot-sdk/lib/middleware'
import * as line from '../../lib/line'

export const config = { api: { bodyParser: false } }

async function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Middleware) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)))
  })
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, line.middleware)
  res.status(200).end()
}

export default handler
```

`event.type` に `message` を受け取った場合に `liff.getProfile()` を実行して得られた表示名を返します。

```ts:lib/line.ts
import { ClientConfig, Client } from '@line/bot-sdk'

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.NEXT_APP_LIFF_CHANNEL_SECRET,
}

export const client = new Client(clientConfig)
```

```tsx:pages/api/webhook.tsx
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { Middleware } from '@line/bot-sdk/lib/middleware'
import { WebhookRequestBody } from '@line/bot-sdk'
import * as line from '../../lib/line'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, line.middleware)

  const body: WebhookRequestBody = req.body
  await Promise.all(
    body.events.map((event) =>
      (async () => {
        if (event.mode === 'active') {
          if (event.type == 'message') {
            const name = event.source.userId
              ? (await line.client.getProfile(event.source.userId)).displayName
              : 'User'
            await line.client.replyMessage(event.replyToken, {
              type: 'text',
              text: `Hello, ${name}!`,
            })
          } else if (event.type == 'follow') {
            //
          }
        }
      })(),
    ),
  )
  res.status(200).end()
}

export default handler
```

## 参照リポジトリ

下記リポジトリをご確認いただければ幸いです。

https://github.com/jiyuujin/template-nextjs/tree/feature/line-event_2022.2

### 今回のゴール

今回のゴールとして LINE Front-end Framework を Next.js 上で使えることを目指します。

https://github.com/jiyuujin/nextjs-liff

なお、上記リポジトリで [Tailwind CSS](https://tailwindcss.com/) を利用してスタイルを装飾、またホスティングには [Firebase Hosting](https://firebase.google.com/docs/hosting) を利用しています。

#### [`ver.2022.5` branch](https://github.com/jiyuujin/nextjs-liff/tree/ver.2022.5)

React 18 (Next.js 12) に対応している。

#### [`ver.2022.4.2` branch](https://github.com/jiyuujin/nextjs-liff/tree/ver.2022.4.2)

`shareTargetPicker` を利用して外部ブラウザで LINE にメッセージを送信する。

#### [`ver.2022.4.1` branch](https://github.com/jiyuujin/nextjs-liff/tree/ver.2022.4.1)

LIFF ブラウザでメッセージを送信する。

#### [`ver.2022.3` branch](https://github.com/jiyuujin/nextjs-liff/tree/ver.2022.3)

LINE ログイン時にアイコン画像を表示している。

#### [`ver.2022.2` branch](https://github.com/jiyuujin/nextjs-liff/tree/ver.2022.2)

LINE Front-end Framework を利用して LINE 認証を実装している。

#### [`ver.2022.1` branch](https://github.com/jiyuujin/nextjs-liff/tree/ver.2022.1)

Firebase Authentication の Google 認証を実装している。
