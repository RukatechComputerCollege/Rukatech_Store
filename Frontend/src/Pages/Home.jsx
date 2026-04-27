import React from 'react'
import Adsbar from '../components/Adsbar'
import Tagnav from '../components/Tagnav'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import BreadCrumb from '../components/BreadCrumb'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div>
      <Adsbar />
      <Tagnav />
      <Navbar />
      <BreadCrumb />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Home