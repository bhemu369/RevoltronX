import { Link } from 'react-router-dom'

const BlogCard = ({ blog }) => {
  const { _id, title, content, tags, status, updatedAt } = blog
  
  // Format date
  const formattedDate = new Date(updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  // Truncate content for preview
  const truncatedContent = content.length > 120 
    ? content.substring(0, 120) + '...' 
    : content

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/blog/${_id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600">
            {title || 'Untitled'}
          </Link>
          <span className={`px-2 py-1 text-xs rounded-full ${
            status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{truncatedContent}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-500 text-sm">{formattedDate}</span>
          <div className="space-x-3">
            <Link 
              to={`/blog/${_id}`} 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Read
            </Link>
            <Link 
              to={`/editor/${_id}`} 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard 