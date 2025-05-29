import { Link } from "react-router-dom";


const ImageCard = ({ product }) => {
  const productId = product._id;
    return (
      <Link to={`/product/${productId}`}>
        <div className="bg-white cursor-pointer rounded overflow-hidden group relative before:absolute before:inset-0 before:z-10 before:bg-black before:opacity-50">
        <img src={product.productImage} alt="Blog Post 1" className="w-full h-96 object-cover group-hover:scale-110 transition-all duration-300" />
        <div className="p-6 absolute bottom-0 left-0 right-0 z-20">
          <span className="text-sm block mb-2 text-yellow-400 font-semibold">30 May 2025 | By Chetan</span>
          <h3 className="text-xl font-bold text-white">{product.name}</h3>
          <div className="mt-4">
            <p className="text-gray-200 text-sm">The "thought of product" is the core idea or vision that inspires the creation of a solution to meet a specific need or solve a problem. .</p>
          </div>
        </div>
      </div>
      </Link>
    );
};

export default ImageCard;
