import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ImageData {
  id: string;
  path: string;
  name: string;
  uploadDate: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/images`);
      setImages(response.data.data || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;
    setError(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    if (!selectedFile.type.match(/^image\/(jpeg|png|gif|jpg)$/)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF)');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await axios.post(`${API_URL}/admin/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)));
        }
      });
      setImages((prevImages) => [response.data, ...prevImages]);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      fetchImages();
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    try {
      await axios.delete(`${API_URL}/admin/images/${imageName}`);
      setImages((prevImages) => prevImages.filter((img) => img.name !== imageName));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Image Gallery</h2>
      <div className="bg-gray-50 p-6 rounded-lg shadow mb-8">
        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-input" disabled={isUploading} />
        <label htmlFor="file-input" className="block w-full bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100">
          {selectedFile ? selectedFile.name : 'Choose an image'}
        </label>
        {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 max-h-48 rounded border" />}
        <button onClick={handleUpload} disabled={!selectedFile || isUploading} className="mt-4 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {isUploading && <div className="mt-4 text-center">{uploadProgress}%</div>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
      <div className="mt-8">
        {isLoading ? (
          <div className="text-center text-gray-500 py-12">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-500 italic py-12">No images uploaded yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={image.path} alt={image.name} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <p className="font-medium text-gray-800 truncate">{image.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(image.uploadDate).toLocaleDateString()}</p>
                  <button
                    onClick={() => handleDeleteImage(image.name)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
