import React from 'react'

interface SignOutButtonProps {
  logout: () => void
}

export const SignOutButton = ({ logout }: SignOutButtonProps) => {
  return (
    <button
      onClick={logout}
      type="button"
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign Out
    </button>
  )
}
