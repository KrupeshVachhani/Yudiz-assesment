
const ShimmerUIProducts = () => {
  return (
    <div className="container mx-auto px-16 mt-4">
      <div className="mb-4 flex space-x-2 overflow-x-auto gap-1">
        {Array(5).fill().map((_, index) => (
          <div 
            key={index} 
            className="h-10 w-28 px-4 py-2 rounded capitalize bg-gray-300 animate-pulse"
          >
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8).fill().map((_, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 animate-pulse"
          >
            <div className="h-48 bg-gray-300 mb-4"></div>
            <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShimmerUIProducts;