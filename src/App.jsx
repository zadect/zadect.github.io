import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import StoryGallery from './pages/StoryGallery'
import StoryPage from './pages/StoryPage'

export default function App(){
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="container">
          <h1 className="brand"><Link to="/">The Good & The Bad</Link></h1>
          <nav>
            <Link to="/good">Good</Link>
            <Link to="/bad">Bad</Link>
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/good" element={<StoryGallery kind="good"/>} />
          <Route path="/bad" element={<StoryGallery kind="bad"/>} />
          <Route path="/story/:id" element={<StoryPage/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
