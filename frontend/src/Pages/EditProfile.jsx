import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaTrash, FaCamera, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';



export default function EditProfile() {
    const { id } = useParams();
    const [profileData, setProfileData] = useState({
        businessName: '',
        email: '',
        fullName: '',
        contact: '',
        zipcode: '',
        avatar: '',
        avatarPreview: '',
        coverImage: '',
        coverImagePreview: '',
        state: '',
        city: '',
        skills: '',
        professions: '',
        experience: '',
        location: '',
        availability: '',
        badges: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`/api/v1/service-providers/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`
                    }
                });
                if (response.status === 200) {
                    // console.log('Response Profile Data', response.data.data);
                    setProfileData(response.data.data);
                    setUserType(response.data.data.userType);
                } else {
                    throw new Error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError('Failed to fetch profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const previewURL = URL.createObjectURL(files[0]);
            setProfileData({
                ...profileData,
                [name]: files[0],
                [`${name}Preview`]: previewURL
            });
        }
    };

    const removeImage = (imageType) => {
        setProfileData({
            ...profileData,
            [imageType]: '',
            [`${imageType}Preview`]: ''
        });
    };

    useEffect(() => {
        return () => {
            if (profileData.avatarPreview) URL.revokeObjectURL(profileData.avatarPreview);
            if (profileData.coverImagePreview) URL.revokeObjectURL(profileData.coverImagePreview);
        };
    }, [profileData.avatarPreview, profileData.coverImagePreview]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = Cookies.get('accessToken');
            const formData = new FormData();
            Object.keys(profileData).forEach(key => {
                if (key === 'avatar' || key === 'coverImage') {
                    if (profileData[key]) {
                        formData.append(key, profileData[key]);
                    }
                } else {
                    formData.append(key, profileData[key] ?? '');
                }
            });

            // console.log('Form Data Entries:', Object.fromEntries(formData.entries()));

            if (userType === 'serviceProvider') {
                console.log('Updating Service Provider Profile', Object.fromEntries(formData.entries()));
                const response = await axios.patch(`http://localhost:8000/api/v1/service-providers/save-sp-details`, Object.fromEntries(formData.entries()), {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    toast.success('Profile updated successfully').then(() => {
                        window.location.reload();
                    });
                } else {
                    setError('Failed to update profile');
                }
            } else if (userType === 'user' || userType === 'admin') {
                console.log('Updating User Profile');
                const response = await axios.put(`http://localhost:8000/api/v1/users/update-user-details`, Object.fromEntries(formData.entries()), {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    toast.success('Profile updated successfully').then(() => {
                        window.location.reload();
                    });
                } else {
                    setError('Failed to update profile');
                }
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-stdBg to-white 
                flex items-center justify-center">
                <div className="flex items-center gap-3 text-stdBlue">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stdBlue"></div>
                    <span className="text-lg font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
        
            <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                 
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                        {/* Enhanced Header */}
                        <div className="bg-gradient-to-r from-stdBlue to-color1 p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                            <h1 className="text-4xl font-bold text-white text-center relative z-10 mb-2">
                                Edit Profile
                            </h1>
                            <p className="text-white/80 text-center relative z-10">
                                Update your professional information
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Enhanced Cover Image Section */}
                            <div className="relative w-full h-72 bg-gray-50 rounded-2xl overflow-hidden group 
                            transition-all duration-300 hover:shadow-lg">
                                {profileData.coverImagePreview || profileData.coverImage ? (
                                    <>
                                        <img
                                            src={profileData.coverImagePreview || profileData.coverImage}
                                            alt="Cover"
                                            className="w-full h-full object-cover transition-transform duration-300 
                                            group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 
                                        transition-opacity duration-300"></div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage('coverImage')}
                                            className="absolute top-4 right-4 bg-red-500 text-white p-3 
                                            rounded-full opacity-0 group-hover:opacity-100 transition-all
                                            duration-300 hover:bg-red-600 transform hover:scale-110"
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full 
                                    cursor-pointer hover:bg-gray-100 transition-all duration-300">
                                        <div className="transform transition-transform duration-300 hover:scale-110">
                                            <FaCamera className="text-4xl text-gray-400 mb-3" />
                                            <span className="text-gray-500 font-medium">Upload Cover Image</span>
                                        </div>
                                        <input
                                            type="file"
                                            name="coverImage"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Enhanced Avatar Section */}
                            <div className="flex justify-center -mt-24">
                                <div className="relative group">
                                    {profileData.avatarPreview || profileData.avatar ? (
                                        <div className="relative">
                                            <img
                                                src={profileData.avatarPreview || profileData.avatar}
                                                alt="Avatar"
                                                className="w-40 h-40 rounded-full border-4 border-white 
                                                shadow-xl object-cover transition-transform duration-300 
                                                group-hover:scale-105"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage('avatar')}
                                                className="absolute bottom-2 right-2 bg-red-500 text-white 
                                                p-3 rounded-full opacity-0 group-hover:opacity-100 
                                                transition-all duration-300 hover:bg-red-600 
                                                transform hover:scale-110 shadow-lg"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-40 h-40 
                                        rounded-full bg-gray-50 cursor-pointer hover:bg-gray-100 
                                        transition-all duration-300 border-4 border-white shadow-xl
                                        group-hover:shadow-2xl">
                                            <div className="transform transition-transform duration-300 
                                            group-hover:scale-110">
                                                <FaCamera className="text-3xl text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-500 font-medium">Upload Avatar</span>
                                            </div>
                                            <input
                                                type="file"
                                                name="avatar"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                            focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                            focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    {userType === 'serviceProvider' && (
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                            <input
                                                type="text"
                                                name="businessName"
                                                value={profileData.businessName}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                                focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                                        <input
                                            type="text"
                                            name="contact"
                                            value={profileData.contact}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                            focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="city"
                                                value={profileData.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                                focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                value={profileData.state}
                                                onChange={handleInputChange}
                                                placeholder="State"
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                                focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Zipcode</label>
                                        <input
                                            type="text"
                                            name="zipcode"
                                            value={profileData.zipcode}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                            focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        name="skillInput"
                                        value={profileData.skillInput || ''}
                                        onChange={(e) => setProfileData({ ...profileData, skillInput: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && profileData.skillInput.trim()) {
                                                e.preventDefault();
                                                if (!profileData.skills.includes(profileData.skillInput.trim())) {
                                                    setProfileData({
                                                        ...profileData,
                                                        skills: [...profileData.skills, profileData.skillInput.trim()],
                                                        skillInput: ''
                                                    });
                                                } else {
                                                    toast.error('Skill already added');
                                                }
                                            }
                                        }}
                                        placeholder="Type a skill and press Enter"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                        focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {profileData.skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-stdBlue text-white px-3 py-1 rounded-full shadow-md"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setProfileData({
                                                        ...profileData,
                                                        skills: profileData.skills.filter((_, i) => i !== index)
                                                    })
                                                }
                                                className="ml-2 text-white hover:text-red-500 transition-all duration-300"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Provider Section */}
                            {userType === 'serviceProvider' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                                        <select
                                            name="professions"
                                            value={profileData.professions}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                            focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                        >
                                            <option value="">Select Profession</option>
                                            <option value="Plumber">Web Developer</option>
                                            <option value="Graphic Designer">Graphic Designer</option>
                                            <option value="Content Writer">Content Writer</option>
                                            <option value="Digital Marketer">Digital Marketer</option>
                                            <option value="SEO Specialist">SEO Specialist</option>
                                            <option value="Photographer">Photographer</option>
                                            <option value="Videographer">Videographer</option>
                                            <option value="UI/UX Designer">UI/UX Designer</option>
                                            <option value="Mobile App Developer">Mobile App Developer</option>
                                            <option value="Data Analyst">Data Analyst</option>
                                            <option value="Project Manager">Project Manager</option>
                                            <option value="Social Media Manager">Social Media Manager</option>
                                            <option value="Virtual Assistant">Virtual Assistant</option>
                                            <option value="Translator">Translator</option>
                                            <option value="Voice Over Artist">Voice Over Artist</option>
                                            <option value="Illustrator">Illustrator</option>
                                            <option value="Game Developer">Game Developer</option>
                                            <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                                            <option value="Blockchain Developer">Blockchain Developer</option>
                                            <option value="DevOps Engineer">DevOps Engineer</option>
                                            <option value="AI/ML Engineer">AI/ML Engineer</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={profileData.experience}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                            focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                        <select
                                            name="availability"
                                            value={profileData.availability}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                            focus:ring-stdBlue focus:border-transparent transition-all duration-300"
                                        >
                                            <option value="" disabled>Select Availability</option>
                                            <option value="true">Available</option>
                                            <option value="false">Not Available</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {/* {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 text-center font-medium">{error}</p>
                                </div>
                            )} */}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-stdBlue to-color1 text-white 
                                rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all 
                                duration-300 transform hover:scale-[1.02] disabled:opacity-50 
                                disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}