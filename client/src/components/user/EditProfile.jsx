import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'; // Your private interceptor hook
import axios from 'axios';

const  EditProfile =()=> {
  const axiosPrivate = useAxiosPrivate();
  
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = '';

    // If the user selected a new profile picture
    if (image) {
        const ONE_MEGABYTE = 1 * 1024 * 1024; // 1,048,576 bytes
      
        if (image.size > ONE_MEGABYTE) {
          alert("File is too large! Please choose an image smaller than 1MB.");
          return; // Stop the upload sequence completely
        }
      try {
        // STEP 1: Get the secure upload signature from your backend
        // axiosPrivate automatically injects your Access Token and handles refreshes!
        const sigResponse = await axiosPrivate.get('/user/generate-upload-signature');
        const { signature, timestamp, apiKey, cloudName } = sigResponse.data;
        console.log(sigResponse.data);
        // Package up the image alongside the signature parameters
        const formData = new FormData();
        formData.append('file', image);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', 'mini-social-avatars'); // Must match backend folder key exactly
        formData.append('transformation', 'w_400,c_limit');//set image width as 400 px
        // STEP 2: Send file directly to Cloudinary using raw unintercepted axios
        const cloudResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        
        uploadedImageUrl = cloudResponse.data.secure_url;

      } catch (err) {
        console.error('File storage upload failed:', err);
        setLoading(false);
        return;
      }
    }

    // STEP 3: Send text data and the newly acquired Cloudinary URL back to your backend
    try {
      await axiosPrivate.patch('/user/UpdateProfile', {
        bio: bio,
        avatarUrl: uploadedImageUrl || undefined // Only update if a new image was generated
      });

      alert('Profile updated and synchronized successfully!');
    } catch (err) {
      console.error('Failed to sync data fields with the backend database:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h3>Edit Portfolio Details</h3>
      <textarea 
        value={bio} 
        onChange={(e) => setBio(e.target.value)} 
        placeholder="Write your bio details..." 
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setImage(e.target.files[0])} 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Save Changes'}
      </button>
    </form>
  );
}

export default EditProfile