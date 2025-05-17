import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchBlogById, deleteBlog } from '../utils/api'
import toast from 'react-hot-toast'

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  const handleDelete = async () => {
    try {
      await deleteBlog(id)
      toast.success('Blog deleted successfully')
      navigate('/')
    } catch (err) {
      console.error('Error deleting blog:', err)
      toast.error('Failed to delete blog')
    } finally {
      setShowDeleteConfirm(false)
    }
  }

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
        <div className="space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
          <Link to={`/editor/${blog._id}`} className="text-blue-600 hover:underline">
            Edit
          </Link>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default BlogDetail 