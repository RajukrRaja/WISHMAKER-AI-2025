import { useState } from 'react';
import axios from 'axios';

const CollageForm = () => {
  const [images, setImages] = useState([]);
  const [collage, setCollage] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(imagePromises).then(setImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/collages', { images });
      setCollage(response.data.collage);
    } catch (error) {
      console.error('Error generating collage:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">📸 Photo Collage</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">Upload Photos (3-5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Generate Collage
        </button>
      </form>
      {collage && (
        <div className="mt-4">
          <img src={collage} alt="Collage" className="w-full rounded" />
        </div>
      )}
    </div>
  );
};

export default CollageForm;