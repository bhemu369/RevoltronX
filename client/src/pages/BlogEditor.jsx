import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBlogById, saveDraft, publishBlog, deleteBlog } from '../utils/api'
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
  const [debouncing, setDebouncing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Refs for tracking changes
  const isModified = useRef(false)
  const hasInitialContent = useRef(false)
  const originalBlogData = useRef(null)
  const saveTimeoutRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Fetch blog if editing existing
  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchBlogById(id)
        .then(res => {
          const blogData = res.data
          const formattedBlog = {
            ...blogData,
            tags: blogData.tags.join(', ') // Convert array to comma-separated string
          }
          setBlog(formattedBlog)
          originalBlogData.current = JSON.stringify(formattedBlog)
          hasInitialContent.current = true
        })
        .catch(err => {
          console.error('Error fetching blog:', err)
          toast.error('Failed to load blog')
        })
        .finally(() => setLoading(false))
    }
  }, [id])
  
  // Create save draft function with useCallback to avoid recreations
  const handleSaveDraft = useCallback(async (showToast = true) => {
    if ((!blog.title && !blog.content) || saving) return
    
    // Skip save if content hasn't changed
    if (originalBlogData.current && 
        JSON.stringify({...blog, _id: undefined}) === originalBlogData.current) {
      return
    }
    
    try {
      setSaving(true)
      setDebouncing(false)
      isModified.current = false
      
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
      if (!id && response.data && response.data._id) {
        navigate(`/editor/${response.data._id}`, { replace: true })
      }
      
      setLastSaved(new Date())
      originalBlogData.current = JSON.stringify({...blog, _id: undefined})
      
      if (showToast) {
        toast.success('Draft saved')
      }
    } catch (err) {
      console.error('Error saving draft:', err)
      if (showToast) {
        toast.error('Failed to save draft')
      }
      isModified.current = true
    } finally {
      setSaving(false)
    }
  }, [blog, id, navigate, saving])
  
  // Enhanced debounced save with visual feedback
  const debouncedSave = useCallback(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    // Set debouncing state for UI feedback
    setDebouncing(true)
    
    // Create new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      if (isModified.current) {
        handleSaveDraft(false) // Don't show toast for auto-saves
      } else {
        setDebouncing(false)
      }
    }, 1000) // Reduced to 1 second for more responsive feedback
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [handleSaveDraft])
  
  // Set up auto-save interval (every 15 seconds)
  useEffect(() => {
    // Clear any existing interval
    if (saveTimeoutRef.current) {
      clearInterval(saveTimeoutRef.current)
    }
    
    // Only set up interval if we have a blog with content
    if (hasInitialContent.current || blog.title || blog.content) {
      saveTimeoutRef.current = setInterval(() => {
        if (isModified.current && !saving) {
          handleSaveDraft(false) // Don't show toast for interval saves
        }
      }, 15000) // 15s interval
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearInterval(saveTimeoutRef.current)
      }
    }
  }, [handleSaveDraft, saving])
  
  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])
  
  // Set up beforeunload handler to save before navigating away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isModified.current) {
        const message = 'You have unsaved changes. Are you sure you want to leave?'
        e.returnValue = message
        return message
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setBlog(prev => ({
      ...prev,
      [name]: value
    }))
    
    isModified.current = true
    debouncedSave()
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
  
  // Delete blog
  const handleDelete = async () => {
    if (!id) return
    
    try {
      setSaving(true)
      await deleteBlog(id)
      toast.success('Blog deleted successfully')
      navigate('/')
    } catch (err) {
      console.error('Error deleting blog:', err)
      toast.error('Failed to delete blog')
    } finally {
      setSaving(false)
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
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? 'Edit Blog' : 'Create New Blog'}
        </h1>
        
        <div className="flex items-center">
          {saving ? (
            <span className="text-sm text-blue-500 flex items-center">
              <div className="w-3 h-3 mr-2 rounded-full border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin"></div>
              Saving...
            </span>
          ) : debouncing ? (
            <span className="text-sm text-gray-500 flex items-center">
              <div className="w-2 h-2 mr-2 rounded-full bg-gray-400 animate-pulse"></div>
              Auto-saving...
            </span>
          ) : lastSaved ? (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
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
        <div className="flex justify-between mt-6">
          {id && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Blog
            </button>
          )}
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleSaveDraft(true)}
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
    </div>
  )
}

export default BlogEditor 