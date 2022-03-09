import React from 'react'
import { signIn } from '../plugins/firebase'

export const SignInButton = () => {
  const handleClick = () => {
    signIn()
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign In With Google
    </button>
  )
}
