import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createBlog, updateBlog } from '../redux/slices/blogSlice';
import Spinner from './Spinner';

const BlogForm = ({ blog = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    coverImage: null,
    content: ''
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  
  const { title, category, content } = formData;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.blogs
  );
  
  useEffect(() => {
    if (isEditing && blog) {
      setFormData({
        title: blog.title,
        category: blog.category,
        content: blog.content
      });
      setPreviewImage(blog.coverImage);
    }
  }, [isEditing, blog]);
  
  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard');
    }
  }, [isSuccess, navigate]);
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  
  const onContentChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      content: value
    }));
  };
  
  const onImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      coverImage: file
    }));
    
    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    const blogData = new FormData();
    blogData.append('title', title);
    blogData.append('category', category);
    blogData.append('content', content);
    
    if (formData.coverImage) {
      blogData.append('coverImage', formData.coverImage);
    }
    
    if (isEditing) {
      dispatch(updateBlog({ id: blog._id, blogData }));
    } else {
      dispatch(createBlog(blogData));
    }
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Blog' : 'Create New Blog'}
      </h2>
      
      {isError && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{message}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="coverImage">
            Cover Image
          </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={onImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="content">
            Content
          </label>
          <ReactQuill
            value={content}
            onChange={onContentChange}
            className="h-64 mb-12"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          {isEditing ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;