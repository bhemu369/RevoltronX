import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBlogById } from '../utils/api'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true)
        const response = await fetchBlogById(id)
        setBlog(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch blog details. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      getBlog()
    }
  }, [id])

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

  if (!blog) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to blog list
        </Link>
      </div>
    )
  }

  // Format date
  const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to blogs
      </Link>
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-4">
          <span className="mr-4">{formattedDate}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            blog.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {blog.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      <div className="prose prose-lg max-w-none text-gray-800">
        {blog.content.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
        ))}
      </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between">
        <Link to="/" className="text-blue-600 hover:underline">
          Back to blogs
        </Link>
        <Link to={`/editor/${blog._id}`} className="text-blue-600 hover:underline">
          Edit this blog
        </Link>
      </div>
    </article>
  )
}

export default BlogDetail 