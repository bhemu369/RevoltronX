import { Routes, Route } from 'react-router-dom'
import BlogEditor from './pages/BlogEditor'
import BlogList from './pages/BlogList'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/editor" element={<BlogEditor />} />
          <Route path="/editor/:id" element={<BlogEditor />} />
        </Routes>
      </main>
    </div>
  )
}

export default App 