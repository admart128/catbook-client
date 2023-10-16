import axios from 'axios';

export const setUserId = (userId) => ({
  type: 'SET_USER_ID',
  payload: userId
});

export const setProfilePhoto = (profilePhoto) => ({
  type: 'SET_PROFILE_PHOTO',
  payload: profilePhoto
});

export const setUsername = (username) => ({
  type: 'SET_USERNAME',
  payload: username
});

export const setRealName = (realName) => ({
  type: 'SET_REALNAME',
  payload: realName
});

export const setBio = (bio) => ({
  type: 'SET_BIO',
  payload: bio
});

export const setLocation = (location) => ({
  type: 'SET_LOCATION',
  payload: location
});

export const setFollowersAtLogin = (followers) => ({
  type: 'SET_FOLLOWERS_AT_LOGIN',
  payload: followers
});

export const setFollowingAtLogin = (following) => ({
  type: 'SET_FOLLOWING_AT_LOGIN',
  payload: following
});

export const checkPersistedUser = () => (dispatch) => {
  const storedData = localStorage.getItem('CatbookToken');
  if (storedData) {
    try {
      const { username, realName, userId, profilePhoto, bio, location, followers, following } = JSON.parse(storedData);

      dispatch(setUsername(username));
      dispatch(setRealName(realName));
      dispatch(setUserId(userId));
      dispatch(setProfilePhoto(profilePhoto));
      dispatch(setBio(bio));
      dispatch(setLocation(location));
      dispatch(setFollowersAtLogin(followers));
      dispatch(setFollowingAtLogin(following));
    } catch (e) {
      console.error('Invalid JSON', e);
      localStorage.removeItem('CatbookToken');
    }
  }
};





export const followUser = (username, profileUsername) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/auth/${username}/follow`,

      { profileUsername },
      { withCredentials: true }
    );

    dispatch({
      type: 'FOLLOW_USER',
      payload: response.data
    });

    const storedData = localStorage.getItem('CatbookToken');
    let updatedData = {};

    if (storedData) {
      updatedData = JSON.parse(storedData);
    }

    updatedData.following = response.data.following;

    localStorage.setItem(
      'CatbookToken',
      JSON.stringify(updatedData)
    );

  } catch (error) {
    console.error('Error following the user:', error);
  }
};

export const unfollowUser = (username, profileUsername) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/auth/${username}/unfollow`,

      {
        data: { profileUsername },
        withCredentials: true
      }
    );

    dispatch({
      type: 'UNFOLLOW_USER',
      payload: response.data
    });
    
    
    
    const storedData = localStorage.getItem('CatbookToken');
    let updatedData = {};

    if (storedData) {
      updatedData = JSON.parse(storedData);
    }

    updatedData.following = response.data.following;

    localStorage.setItem(
      'CatbookToken',
      JSON.stringify(updatedData)
    );


  } catch (error) {
    console.error('Error unfollowing the user:', error);
  }
};

export const followUser2 = (username, a) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/auth/${username}/follow`,

      { a },
      { withCredentials: true }
    );

    dispatch({
      type: 'FOLLOW_USER_2',
      payload: response.data
    });
  } catch (error) {
    console.error('Error following the user:', error);
  }
};

export const unfollowUser2 = (username, a) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/auth/${username}/unfollow`,

      {
        data: { a },
        withCredentials: true
      }
    );

    dispatch({
      type: 'UNFOLLOW_USER_2',
      payload: response.data
    });
  } catch (error) {
    console.error('Error unfollowing the user:', error);
  }
};

export const setFollowers = (username) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/auth/${username}/followers`,
      { withCredentials: true }
    );

    dispatch({
      type: 'SET_FOLLOWERS',
      payload: response.data
    });
  } catch (error) {
    console.error('Error getting followers:', error);
  }
};

export const setFollowing = (username) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/auth/${username}/following`,
      { withCredentials: true }
    );

    dispatch({
      type: 'SET_FOLLOWING',
      payload: response.username.following
    });
  } catch (error) {
    console.error('Error getting following:', error);
  }
};

export const setLocalToken = (userInfo) => {
  localStorage.setItem(
    'CatbookToken',
    JSON.stringify({
      username: userInfo.username,
      realName: userInfo.realName,
      userId: userInfo._id,
      profilePhoto: userInfo.profilePhoto,
      bio: userInfo.bio,
      location: userInfo.location,
      followers: userInfo.followers,
      following: userInfo.following
    })
  );
  return {
    type: SET_LOCAL_TOKEN,
    payload: userInfo,
  };
};
