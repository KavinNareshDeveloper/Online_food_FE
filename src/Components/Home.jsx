import React from 'react'
import Wallpaper from './Wallpaper'
import QuickSearch from './QuickSearch'


const Home = () => {
  return (
    <div className='homepage'>
      <Wallpaper />
      <br />
      <QuickSearch />
    </div>
  )
}

export default Home