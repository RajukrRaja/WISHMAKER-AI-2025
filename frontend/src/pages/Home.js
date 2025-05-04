import WishForm from '../components/WishForm';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">WishMaker AI</h1>
      <WishForm />
      <div className="mt-6 flex space-x-4">
        <Link to="/batch-card" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          View Batch Card
        </Link>
        <Link to="/tribute" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Create Tribute
        </Link>
        <Link to="/collage" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Make Collage
        </Link>
      </div>
    </div>
  );
};

export default Home;