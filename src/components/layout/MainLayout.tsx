'use client'

import React, { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow pt-16">
       
      </main>
     
    </div>
  )
}
