import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  setRealName as setUserRealName,
  setBio as setUserBio,
  setLocation as setUserLocation,
  setProfilePhoto as setUserProfilePhoto,
  followUser,
  unfollowUser
} from '../userActions';

import MeowFeed from './MeowFeed';

import axios from 'axios';
import Navigation from './Navigation';

import backIcon from '../img/angle-pointing-to-left.png';
import saveIcon from '../img/correct-symbol.png';
import cancelIcon from '../img/remove-symbol.png';

const Profile = () => {
  const urlLocation = useLocation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.userId);

  const { username: profileUsername } = useParams();

  const [userData, setUserData] = useState(null);
  const [realName, setRealName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [dateJoined, setDateJoined] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [newRealName, setNewRealName] = useState('');
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [newBio, setNewBio] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const [filterCriteria, setFilterCriteria] = useState('Meows');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/${profileUsername}`
        );
        console.log('fetchUserData:', userDataResponse);
        setUserData(userDataResponse.data);
        setRealName(userDataResponse.data.realName);
        setProfilePhoto(userDataResponse.data.profilePhoto);
        setBio(userDataResponse.data.bio);
        setLocation(userDataResponse.data.location);
        setDateJoined(new Date(userDataResponse.data.dateJoined));
        setFollowing(userDataResponse.data.following);
        setFollowers(userDataResponse.data.followers);
      } catch (error) {
        console.log('fetchUserData:', error);
      }
    };
    fetchUserData();
  }, [urlLocation]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePhoto(file);
    setSelectedFile(file);
  };

  const handleEditProfileClick = () => {
    setNewRealName(realName);
    setNewBio(bio);
    setNewLocation(location);
    setNewProfilePhoto(profilePhoto);
    setIsEditingProfile(true);
  };

  const handleFollow = () => {
    if (profileUsername !== username) {
      if (!followers.some((follower) => follower._id === userId)) {
        dispatch(followUser(username, profileUsername));
        setFollowers([...followers, { _id: userId }]);
      } else if (followers.some((follower) => follower._id === userId)) {
        dispatch(unfollowUser(username, profileUsername));
        const newFollowers = followers.filter((follower) => follower._id !== userId);
        setFollowers(newFollowers);
      }
    }
  };

  const handleSaveClick = async () => {
    if (!newRealName) {
      setNewRealName(realName);
    } else
      try {
        const realNameResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editRealName`,
          { realName: newRealName },
          { withCredentials: true }
        );
        if (realNameResponse.status === 200) {
          console.log('realName updated succesfully:', realNameResponse.data);
          dispatch(setUserRealName(realNameResponse.data.realName));
        }
      } catch (error) {
        console.log('realName failed to update:', error);
      }

    if (!newProfilePhoto) {
      setNewProfilePhoto(profilePhoto);
    } else if (newProfilePhoto) {
      const formData = new FormData();
      formData.append('profilePhoto', newProfilePhoto);
      try {
        const profilePhotoResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editProfilePhoto`,
          formData,
          { withCredentials: true }
        );
        if (profilePhotoResponse.status === 200) {
          console.log('profilePhoto updated successfully:', profilePhotoResponse.data);
          dispatch(setUserProfilePhoto(profilePhotoResponse.data.profilePhoto));
        }
      } catch (error) {
        console.log('profilePhoto failed to update:', error);
      }
    }

    if (!newBio) {
      setNewBio(bio);
    } else
      try {
        const bioResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editBio`,
          { bio: newBio },
          { withCredentials: true }
        );

        if (bioResponse.status === 200) {
          console.log('bio updated successfully:', bioResponse.data);
          dispatch(setUserBio(bioResponse.data.bio));
        }
      } catch (error) {
        console.log('bio failed to update:', error);
      }

    if (!newLocation) {
      setLocation(location);
    } else
      try {
        const locationResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editLocation`,
          { location: newLocation },
          { withCredentials: true }
        );
        if (locationResponse.status === 200) {
          console.log('location updated successfully:', locationResponse.data);
          dispatch(setUserLocation(locationResponse.data.location));
        }
      } catch (error) {
        console.log('location failed to update:', error);
      }
    setIsEditingProfile(false);
  };

  function formatDate(dateJoined) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const month = months[dateJoined.getMonth()];
    const year = dateJoined.getFullYear();
    return `${month} ${year}`;
  }
  console.log('userId:', userId);

  const handleShowMeows = () => {
    setFilterCriteria('Meows');
  };

  const handleShowReplies = () => {
    setFilterCriteria('Replies');
  };

  const handleShowMedia = () => {
    setFilterCriteria('Media');
  };

  const handleShowLikes = () => {
    setFilterCriteria('Likes');
  };

  // prettier-ignore
  return (
    
      <div>
        <Navigation />
{!isEditingProfile ? (
         <button className='p-4' onClick={() => navigate(-1)}>
          <img src={backIcon} alt="Back" className='w-8'/>
          </button>
) : null}
        {isEditingProfile ? (

        <div className='p-2'>
          
          <div className='p-2'>
          <div className='text-slate-600'>Name</div>
          <div><input className='border-b-2 border-slate-200 focus:outline-none' type="text" value={newRealName} onChange={(e) => setNewRealName(e.target.value)}/></div>
          </div>
          <div className='p-2'>
          <div className='text-slate-600'>Bio</div>
          <div><input className='border-b-2 border-slate-200 focus:outline-none' type="text" value={newBio} onChange={(e) => setNewBio(e.target.value)} /></div>
          </div>

          <div className='p-2'>
          <div className='text-slate-600'>Location</div>
          <div><input className='border-b-2 border-slate-200 focus:outline-none' type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)}/></div>
          </div>

          <div className='relative cursor-pointer p-4'>
            { profilePhoto ? (
            <img src={ previewUrl ? previewUrl : profilePhoto }
            alt="Profile Photo" 
            className="border-4 border-slate-200 rounded-full w-42"
            />
            ) : (
              <img src={ previewUrl ? previewUrl : 'https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png' }
            alt="Profile Photo" 
            className="border-4 border-slate-200 rounded-full w-42"
            />
            )}
            <input type="file" 
            style={{ opacity: 0, position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
            onChange={handleFileChange}/>
          </div>

          <div className="flex p-3 justify-evenly">
           
          <button onClick={() => setIsEditingProfile(false)} 
          className="bg-purple-400 text-white 
          rounded-full px-4 py-2 m-2
          hover:scale-110 transition-all ease-in-out duration-200"
          >
          {/* <img src={cancelIcon} alt="Cancel" className='w-5'/> */}
            Cancel
            </button>  

            <button onClick={handleSaveClick} 
            className="bg-purple-400 text-white 
            rounded-full px-4 py-2 m-2
            hover:scale-110 transition-all ease-in-out duration-200"
            >
              {/* <img src={saveIcon} alt="Save" className='w-5'/> */}
              Save Changes
            </button>
            
            </div>

        </div>

        ) : (
        <div className='user-profile'>
          
          <div className='flex p-2'>
            
            <div className='p-2'>
              { profilePhoto ? (
              <img src={profilePhoto} 
              className='rounded-full h-28 w-28'
              alt="Profile Photo" />
              ) : (
                <img src='https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png'
                className='rounded-full h-28 w-28'
                />
              )}
              </div>
            
            <div className='p-2 self-end'>
              {username === profileUsername ? 
              (<button 
                className="bg-purple-400 text-white 
                rounded-full px-4 py-2 m-2
                hover:scale-110 transition-all ease-in-out duration-200" 
              onClick={handleEditProfileClick}>Edit Profile</button>) : null}
              {profileUsername !== username && followers.some(follower => follower._id === userId) ? (<button  className="bg-purple-400 text-white 
                rounded-full px-4 py-2 m-2
                hover:scale-110 transition-all ease-in-out duration-200" onClick={handleFollow}>Following</button>) : null}
              {profileUsername !== username && !followers.some(follower => follower._id === userId) ? (<button  className="bg-purple-400 text-white 
                rounded-full px-4 py-2 m-2
                hover:scale-110 transition-all ease-in-out duration-200" onClick={handleFollow}>Follow</button>) : null}
            </div>
          
          </div>
          
          <div>
          
            <div className='px-4 text-3xl break-all'>{realName ? realName : ''}</div>
            <div className='px-4 text-slate-600 break-all'>@{profileUsername}</div>
            <div className='p-4 break-all'>{bio ? bio : ''}</div>
              <div className='px-4  text-slate-600  break-all'> {location ? `🌏 ${location}` : ''}</div>
              <div className='px-4  text-slate-600  break-all'>{dateJoined ? `Joined ${formatDate(dateJoined)}` : ''}</div>

            <div className="flex flex-row justify-evenly p-4">
              <div><Link to={`/${profileUsername}/following`}><div className="flex flex-row gap-2"><p className='font-bold'>{following?.length ?? 0}</p> Following</div></Link></div>
              <div><Link to={`/${profileUsername}/followers`}><div className="flex flex-row gap-2"><p className='font-bold'>{followers?.length ?? 0}</p> Followers</div></Link></div>
            </div>
           <div>

           <div className='flex justify-evenly p-2 border-b-4 border-slate-200'>
      <button 
      className={filterCriteria == "Meows" ? "border-b-4 border-green-400 px-2 py-2" : "px-2 py-2 text-slate-600"}
      onClick={handleShowMeows}>
        Meows
      </button>
      <button 
      className={filterCriteria == "Replies" ? "border-b-4 border-green-400 px-2 py-2" : "px-2 py-2 text-slate-600"}
      onClick={handleShowReplies}>

        Replies
      </button>
      <button 
      className={filterCriteria == "Media" ? "border-b-4 border-green-400 px-2 py-2" : "px-2 py-2 text-slate-600"}
      onClick={handleShowMedia}>

        Media
      </button>
      <button 
      className={filterCriteria == "Likes" ? "border-b-4 border-green-400 px-2 py-2" : "px-2 py-2 text-slate-600"}
      onClick={handleShowLikes}>

        Likes
      </button>
</div>

      </div>
        
        </div>
        
        
        <MeowFeed filterCriteria={filterCriteria} username={username} userId={userId} />
      
      </div>
      )}
    </div>
  );
};

export default Profile;
