import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBlog, likeBlog, deleteBlog } from '../redux/slices/blogSlice';
import { getComments, addComment } from '../redux/slices/commentSlice';
import Spinner from '../components/Spinner';
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const BlogDetail = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { blog, isLoading } = useSelector((state) => state.blogs);
  const { comments, isLoading: commentsLoading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(getBlog(id));
    dispatch(getComments(id));
  }, [dispatch, id]);
  
  const isLiked = user && blog ? blog.likes.includes(user.id) : false;
  const isAuthor = user && blog ? user.id === blog.author._id : false;
  
  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(likeBlog(id));
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      dispatch(deleteBlog(id));
      navigate('/');
    }
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    dispatch(addComment({ blogId: id, content: commentText }));
    setCommentText('');
  };
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading || !blog) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-lg shadow-md mb-8"
        />
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {blog.category}
            </span>
            <span className="ml-4 text-gray-500">{formatDate(blog.createdAt)}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              disabled={!user}
            >
              {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
              <span>{blog.likesCount}</span>
            </button>
            
            {isAuthor && (
              <>
                <Link
                  to={`/edit-blog/${blog._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={20} />
                </button>
              </>
            )}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
        
        <div className="flex items-center mb-8">
          <Link to={`/profile/${blog.author._id}`} className="flex items-center space-x-3">
            <img
              src={blog.author.profilePicture}
              alt={blog.author.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{blog.author.username}</p>
              <p className="text-sm text-gray-500">{blog.author.bio || 'Author'}</p>
            </div>
          </Link>
        </div>
        
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        <div id="comments" className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                required
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg mb-8">
              <p>
                Please{' '}
                <Link to="/login" className="text-blue-500 hover:underline">
                  log in
                </Link>{' '}
                to leave a comment.
              </p>
            </div>
          )}
          
          {commentsLoading ? (
            <Spinner />
          ) : comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Link to={`/profile/${comment.user._id}`} className="flex items-center space-x-2">
                      <img
                        src={comment.user.profilePicture}
                        alt={comment.user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{comment.user.username}</span>
                    </Link>
                    <span className="text-sm text-gray-500 ml-auto">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;