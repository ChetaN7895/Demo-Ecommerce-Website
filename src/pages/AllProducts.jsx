import { Button, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/card/ProductCard';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AllProducts = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(9);
  const [totalPages, setTotalPages] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Voice recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || 'uncategorized';

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });

    const fetchProducts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`https://e-commerce-app-pearl-six.vercel.app/api/product/getProducts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.totalProducts / perPage));
      setLoading(false);
    };

    fetchProducts();
  }, [location.search]);

  // Automatically update search from transcript
  useEffect(() => {
    if (transcript) {
      const updatedSidebar = {
        ...sidebarData,
        searchTerm: transcript,
      };
      setSidebarData(updatedSidebar);

      const urlParams = new URLSearchParams();
      urlParams.set('searchTerm', transcript);
      urlParams.set('sort', updatedSidebar.sort);
      urlParams.set('category', updatedSidebar.category);
      navigate(`/search?${urlParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen pt-18 dark:bg-gray-900'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          {/* Search field with mic */}
          <div className='relative'>
            <label className='font-semibold block mb-1'>Search Term:</label>
            <TextInput
              placeholder='Search by voice or text...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className='w-full pr-10'
            />
            <button
              type='button'
              onClick={() => {
                resetTranscript();
                SpeechRecognition.startListening({ continuous: false });
              }}
              className='absolute top-[2.6rem] right-3 text-gray-600 hover:text-blue-500 text-lg'
              title={listening ? 'Listening...' : 'Start voice input'}
            >
              🎙️
            </button>
            {!browserSupportsSpeechRecognition && (
              <p className='text-sm text-red-500 mt-1'>Voice input not supported in your browser.</p>
            )}
          </div>

          {/* Sort */}
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>

          {/* Category */}
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='uncategorized'>Uncategorized</option>
              <option value='Shirt'>Shirt</option>
              <option value='Hoodie'>Hoodie</option>
              <option value='Panjabi'>Panjabi</option>
              <option value='Jacket'>Jacket</option>
              <option value='Skirts'>Skirts</option>
              <option value='Gown'>Gown</option>
              <option value='T-shirt'>T-Shirt</option>
              <option value='Trouser'>Sports Trouser</option>
            </Select>
          </div>

          {/* Button */}
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Products results:
        </h1>
        <div className='p-7 flex flex-wrap justify-evenly gap-4'>
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && products.length === 0 && (
            <p className='text-xl text-gray-500'>No products found.</p>
          )}
          {!loading &&
            products
              .slice((currentPage - 1) * perPage, currentPage * perPage)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-5">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
