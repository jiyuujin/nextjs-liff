import React from 'react'
import { signOut } from '../plugins/firebase'

type Props = {
  //
}

export const SignOutButton = (props: Props) => {
  const handleClick = () => {
    signOut()
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign Out
    </button>
  )
}
