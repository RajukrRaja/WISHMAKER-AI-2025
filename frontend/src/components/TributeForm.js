import { useState } from 'react';
import axios from 'axios';

const TributeForm = () => {
  const [friendName, setFriendName] = useState('');
  const [memory, setMemory] = useState('');
  const [tribute, setTribute] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tributes', { friend_name: friendName, memory });
      setTribute(response.data.tribute);
    } catch (error) {
      console.error('Error generating tribute:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">💖 Friendship Tribute</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">Friend's Name</label>
          <input
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Memory</label>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Generate Tribute
        </button>
      </form>
      {tribute && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg italic">{tribute}</p>
        </div>
      )}
    </div>
  );
};

export default TributeForm;