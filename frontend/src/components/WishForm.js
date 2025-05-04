import { useState } from 'react';
import axios from 'axios';

const WishForm = () => {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('Web Dev');
  const [vibe, setVibe] = useState('Funny');
  const [wish, setWish] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/wishes', { name, theme, vibe });
      setWish(response.data.wish);
    } catch (error) {
      console.error('Error generating wish:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">🎓 Generate Wish</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tech Interest</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-2 border rounded">
            <option value="Web Dev">Web Dev</option>
            <option value="AI">AI</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Backend">Backend</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Vibe</label>
          <select value={vibe} onChange={(e) => setVibe(e.target.value)} className="w-full p-2 border rounded">
            <option value="Funny">Funny</option>
            <option value="Poetic">Poetic</option>
            <option value="Witty">Witty</option>
            <option value="Formal">Formal</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Generate Wish
        </button>
      </form>
      {wish && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg italic">{wish}</p>
        </div>
      )}
    </div>
  );
};

export default WishForm;