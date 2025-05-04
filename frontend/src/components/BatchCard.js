import { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'confetti-js';

const BatchCard = () => {
  const [batchWish, setBatchWish] = useState('');
  const [signatures, setSignatures] = useState([]);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confettiSettings = { target: 'confetti-canvas' };
    const confetti = new Confetti(confettiSettings);
    confetti.render();

    fetchBatchCard();
    return () => confetti.clear();
  }, []);

  const fetchBatchCard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/batch-card');
      setBatchWish(response.data.batch_wish);
      setSignatures(response.data.signatures);
    } catch (error) {
      console.error('Error fetching batch card:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/batch-card/sign', { name, emoji, message });
      setName('');
      setEmoji('');
      setMessage('');
      fetchBatchCard();
    } catch (error) {
      console.error('Error adding signature:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <canvas id="confetti-canvas" className="absolute top-0 left-0 w-full h-full" />
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">🎓 Class of 2025</h1>
        <p className="text-xl italic mt-4">{batchWish}</p>
        <p className="text-sm mt-2">— WishMaker AI</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => alert('Downloading...')}
        >
          Download Card
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white">Signature Wall</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {signatures.map((sig, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p>
                <strong>{sig.name}</strong> {sig.emoji}
              </p>
              <p className="text-sm">{sig.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="Emoji (e.g., 🎉)"
              className="p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              className="p-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Sign the Card
          </button>
        </form>
      </div>
    </div>
  );
};

export default BatchCard;
