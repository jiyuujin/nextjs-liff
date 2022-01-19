import React from 'react'
import { SendMessagesButton } from '../components/SendMessagesButton'

export default function Home(props) {
  const { liff, profileName, pictureUrl } = props

  const sendMessages = async () => {
    await liff.sendMessages([
      {
        type: 'text',
        text: 'Hello World',
      },
    ])
  }

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            {liff?.isLoggedIn() && (
              <img className="mx-auto h-12 w-auto" src={pictureUrl} alt={`${profileName} logo`} />
            )}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {!liff?.isLoggedIn() ? (
                <>{'Sign in to your account'}</>
              ) : (
                <>{'You are signed to your account'}</>
              )}
            </h2>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {liff?.isLoggedIn() && <SendMessagesButton sendMessages={sendMessages} />}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              <a
                href="https://github.com/jiyuujin/nextjs-liff"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                please check the repository
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div>{liff?.isLoggedIn() && <>{`${profileName} (${liff?.getVersion()})`}</>}</div>
          </form>
        </div>
      </div>
    </>
  )
}
