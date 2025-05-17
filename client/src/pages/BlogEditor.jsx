import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBlogById, saveDraft, publishBlog } from '../utils/api'
import { debounce } from '../utils/debounce'
import toast from 'react-hot-toast'

const BlogEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Blog state
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'draft'
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  
  // Refs for tracking changes
  const isEditing = useRef(false)
  const intervalRef = useRef(null)
  
  // Fetch blog if editing existing
  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchBlogById(id)
        .then(res => {
          const blogData = res.data
          setBlog({
            ...blogData,
            tags: blogData.tags.join(', ') // Convert array to comma-separated string
          })
        })
        .catch(err => {
          console.error('Error fetching blog:', err)
          toast.error('Failed to load blog')
        })
        .finally(() => setLoading(false))
    }
  }, [id])
  
  // Set up auto-save interval (every 30 seconds)
  useEffect(() => {
    // Only set up interval if we have a blog loaded
    if (blog.title || blog.content) {
      intervalRef.current = setInterval(() => {
        if (isEditing.current) {
          handleSaveDraft()
        }
      }, 30000) // 30 seconds interval
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [blog])
  
  // Debounced save function (after 5 seconds of inactivity)
  const debouncedSave = debounce(() => {
    if (isEditing.current && (blog.title || blog.content)) {
      handleSaveDraft()
    }
  }, 5000) // 5 seconds debounce
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setBlog(prev => ({
      ...prev,
      [name]: value
    }))
    
    isEditing.current = true
    debouncedSave()
  }
  
  // Save draft
  const handleSaveDraft = async () => {
    if (!blog.title && !blog.content) return
    
    try {
      setSaving(true)
      isEditing.current = false
      
      // Format blog data
      const blogData = {
        ...blog,
        tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        status: 'draft'
      }
      
      // If blog has an id, we're updating an existing draft
      if (id) {
        blogData._id = id
      }
      
      const response = await saveDraft(blogData)
      
      // If this is a new blog, update URL with new ID
      if (!id && response.data._id) {
        navigate(`/editor/${response.data._id}`, { replace: true })
      }
      
      setLastSaved(new Date())
      toast.success('Draft saved')
    } catch (err) {
      console.error('Error saving draft:', err)
      toast.error('Failed to save draft')
      isEditing.current = true
    } finally {
      setSaving(false)
    }
  }
  
  // Publish blog
  const handlePublish = async () => {
    if (!blog.title) {
      toast.error('Please add a title before publishing')
      return
    }
    
    if (!blog.content) {
      toast.error('Please add content before publishing')
      return
    }
    
    try {
      setSaving(true)
      
      // Format blog data
      const blogData = {
        ...blog,
        tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        status: 'published'
      }
      
      // If blog has an id, we're updating an existing blog
      if (id) {
        blogData._id = id
      }
      
      await publishBlog(blogData)
      
      toast.success('Blog published successfully')
      navigate('/')
    } catch (err) {
      console.error('Error publishing blog:', err)
      toast.error('Failed to publish blog')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? 'Edit Blog' : 'Create New Blog'}
        </h1>
        
        {lastSaved && (
          <span className="text-sm text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            placeholder="Blog Title"
            className="w-full px-4 py-3 text-xl font-semibold border-b focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Content */}
        <div className="editor-container">
          <textarea
            name="content"
            value={blog.content}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            className="w-full h-64 p-3 focus:outline-none resize-y"
          ></textarea>
        </div>
        
        {/* Tags */}
        <div>
          <input
            type="text"
            name="tags"
            value={blog.tags}
            onChange={handleChange}
            placeholder="Add tags (comma-separated)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="btn btn-secondary"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || !blog.title || !blog.content}
            className="btn btn-primary"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogEditor 