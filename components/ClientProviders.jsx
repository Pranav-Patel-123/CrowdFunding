// src/components/ClientProviders.jsx

'use client'

import React from 'react'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { Sepolia } from '@thirdweb-dev/chains'
import { StateContextProvider } from '../context/index'

export default function ClientProviders({ children }) {
  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <StateContextProvider>{children}</StateContextProvider>
    </ThirdwebProvider>
  )
}
