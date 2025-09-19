import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Spinner from '../components/Spinner';
import { FaSearch } from 'react-icons/fa';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const dispatch = useDispatch();
  const { blogs, pagination, isLoading } = useSelector((state) => state.blogs);
  
  useEffect(() => {
    const queryParams = {
      page: currentPage,
      limit: 9
    };
    
    if (searchTerm) {
      queryParams.search = searchTerm;
    }
    
    if (category) {
      queryParams.category = category;
    }
    
    dispatch(getBlogs(queryParams));
  }, [dispatch, currentPage, searchTerm, category]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1); // Reset to first page on category change
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Blogging Platform</h1>
        <p className="text-xl text-gray-600">Discover stories, ideas, and expertise from writers on any topic</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Search
            </button>
          </div>
        </form>
        
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Business">Business</option>
          <option value="Health">Health</option>
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">No blogs found</h2>
          <p className="mt-2 text-gray-500">Try a different search term or category</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
          
          {pagination && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                {pagination.prev && (
                  <button
                    onClick={() => handlePageChange(pagination.prev.page)}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                
                <span className="px-4 py-2 border border-gray-300 rounded-md bg-blue-500 text-white">
                  {currentPage}
                </span>
                
                {pagination.next && (
                  <button
                    onClick={() => handlePageChange(pagination.next.page)}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </button>
                )}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;