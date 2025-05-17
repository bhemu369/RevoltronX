import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">Blog Editor</Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">My Blogs</Link>
          <Link to="/editor" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            New Blog
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 