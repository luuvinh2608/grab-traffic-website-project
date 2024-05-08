import './App.css'
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/Map'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<Navigate to="/map" />} index />
        <Route element={<Home />} path="/map" />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
