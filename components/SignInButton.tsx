import React from 'react'

interface SignInButtonProps {
  login: () => void
}

export const SignInButton = ({ login }: SignInButtonProps) => {
  return (
    <button
      onClick={login}
      type="button"
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign In With Google
    </button>
  )
}
