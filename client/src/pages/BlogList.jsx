import { useState, useEffect } from 'react'
import { fetchBlogs } from '../utils/api'
import BlogCard from '../components/BlogCard'

const BlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true)
        const response = await fetchBlogs()
        setBlogs(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getBlogs()
  }, [])

  // Filter for drafts and published blogs
  const drafts = blogs.filter(blog => blog.status === 'draft')
  const published = blogs.filter(blog => blog.status === 'published')

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Blogs</h1>
      
      {/* Published Blogs Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Published ({published.length})</h2>
        {published.length === 0 ? (
          <p className="text-gray-500">No published blogs yet. Publish your first blog!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
      
      {/* Drafts Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Drafts ({drafts.length})</h2>
        {drafts.length === 0 ? (
          <p className="text-gray-500">No drafts yet. Start writing!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default BlogList 