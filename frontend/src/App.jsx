import React from 'react'
import Face from './features/expression/components/Face'
import {  RouterProvider } from 'react-router'
import BrowserRouter from './app.routes'
import { AuthProvider } from './features/auth/auth.context'
import { SOngContextProvider } from './features/home/song.context'


const App = () => {
  return (
    <AuthProvider>
      <SOngContextProvider>
      <RouterProvider router={BrowserRouter}/>
      </SOngContextProvider>
    </AuthProvider>

  )
}

export default App