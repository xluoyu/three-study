import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom"
import Home from './views'
// import Car from './views/car'

const Car = lazy(() => import('./views/car'))
const Video = lazy(() => import('./views/video'))

function Loading() {
  return (
    <div>loading...</div>
  )
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/car" element={<Car />}></Route>
          <Route path="/video" element={<Video />}></Route>
      </Routes>
    </Suspense>
  )
}

export default App