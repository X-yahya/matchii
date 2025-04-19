import { Link } from 'react-router-dom';

const GigCard = ({ item }) => {
  return (

    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <img 
        src={item.cover} 
        alt={item.title} 
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={item.pp} 
          alt={item.username} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{item.username}</h3>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-sm text-gray-600">{item.star}</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{item.title}</h2>
      
      <ul className="mb-6 space-y-2">
        {item.features?.slice(0, 3).map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">From</span>
            <p className="text-xl font-bold text-gray-800">${item.price}</p>
          </div>
          <Link 
            to={`/gig/${item.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>

  );
};

export default GigCard;