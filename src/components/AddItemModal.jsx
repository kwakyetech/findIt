import React, { useState } from 'react';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';

const AddItemModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB limit
        alert("File is too large. Please upload an image under 500KB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // If there's an image preview (Base64), use that.
    // Note: In a real app with backend storage, you'd upload the file and get a URL.
    // Here we are storing the Base64 string directly in Firestore (limited size).

    onSubmit({
      type: formData.get('type'),
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      category: formData.get('category'),
      contact: formData.get('contact'),
      date: formData.get('date'),
      image: imagePreview, // Use the Base64 string
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Report Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select name="type" className="w-full p-2.5 rounded-lg border border-slate-300 bg-white" required>
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="category" className="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Keys">Keys</option>
                <option value="Wallet">Wallet/ID</option>
                <option value="Pets">Pets</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input name="title" type="text" className="w-full p-2.5 rounded-lg border border-slate-300" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" rows="3" className="w-full p-2.5 rounded-lg border border-slate-300" required></textarea>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image (Optional)</label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer relative">
                <ImageIcon size={32} className="mb-2" />
                <span className="text-sm">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-slate-200">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-600 hover:bg-white shadow-sm transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input name="location" type="text" className="w-full p-2.5 rounded-lg border border-slate-300" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input name="date" type="date" className="w-full p-2.5 rounded-lg border border-slate-300" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info</label>
            <input name="contact" type="text" className="w-full p-2.5 rounded-lg border border-slate-300" required />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
