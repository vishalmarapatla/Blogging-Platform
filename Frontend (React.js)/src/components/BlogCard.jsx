import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likeBlog } from '../redux/slices/blogSlice';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';

const BlogCard = ({ blog }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const isLiked = user ? blog.likes.includes(user.id) : false;
  
  const handleLike = () => {
    if (!user) return;
    dispatch(likeBlog(blog._id));
  };
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Truncate content for preview
  const truncateContent = (content) => {
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 150
      ? textContent.substring(0, 150) + '...'
      : textContent;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/blogs/${blog._id}`}>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-600 font-semibold">{blog.category}</span>
          <span className="text-sm text-gray-500">{formatDate(blog.createdAt)}</span>
        </div>
        
        <Link to={`/blogs/${blog._id}`}>
          <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition duration-200">
            {blog.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-4">{truncateContent(blog.content)}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              disabled={!user}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              <span>{blog.likesCount}</span>
            </button>
            
            <Link to={`/blogs/${blog._id}#comments`} className="flex items-center space-x-1 text-gray-500">
              <FaComment />
              <span>{blog.comments ? blog.comments.length : 0}</span>
            </Link>
          </div>
          
          <Link to={`/profile/${blog.author._id}`} className="flex items-center space-x-2">
            <img
              src={blog.author.profilePicture}
              alt={blog.author.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{blog.author.username}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;