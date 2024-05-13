import React from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'

function Layout({ children }) {
  return (
    <div class="flex flex-col h-screen">
      <Navbar />
      <main class="mb-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout