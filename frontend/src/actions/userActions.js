import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_LIST_RESET,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_REQUEST,
  USER_FOLLOW_REQUEST,
  USER_FOLLOW_SUCCESS,
  USER_UNFOLLOW_FAIL,
  USER_UNFOLLOW_SUCCESS,
  USER_UNFOLLOW_REQUEST,
  USER_GET_NOTIF_REQUEST,
  USER_GET_NOTIF_SUCCESS,
  USER_GET_NOTIF_FAIL,
  USER_ACCEPT_NOTIF_FAIL,
  USER_ACCEPT_NOTIF_REQUEST,
  USER_ACCEPT_NOTIF_SUCCESS,
  USER_DENIE_NOTIF_REQUEST,
  USER_DENIE_NOTIF_SUCCESS,
  USER_DENIE_NOTIF_FAIL,
  USER_UPDATE_PROFILE_FAIL,
} from "../constants/userConstants";
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config,
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");

  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_PROFILE_RESET });
  dispatch({ type: USER_LIST_RESET });

  document.location.href = "/login";
};
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users",
      { name, email, password },
      config,
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserProfile = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    console.log(id);
    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      // dispatch(logout());
    }
    dispatch({
      type: USER_PROFILE_FAIL,
      payload: message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/profile`, user, config);

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });

    // dispatch({
    //   type: USER_LOGIN_SUCCESS,
    //   payload: data,
    // });

    // localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    });
  }
};

export const followUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_FOLLOW_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/users/follow/${id}`, {}, config);

    dispatch({ type: USER_FOLLOW_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_PROFILE_FAIL,
      payload: message,
    });
  }
};

export const UnfollowUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UNFOLLOW_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/users/follow/${id}`, config);

    dispatch({ type: USER_UNFOLLOW_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UNFOLLOW_FAIL,
      payload: message,
    });
  }
};

export const getUserNotif = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_GET_NOTIF_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/notif`, config);

    dispatch({ type: USER_GET_NOTIF_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_GET_NOTIF_FAIL,
      payload: message,
    });
  }
};

export const acceptNotif = (id, followRequest) => async (
  dispatch,
  getState,
) => {
  try {
    dispatch({ type: USER_ACCEPT_NOTIF_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/users/notif/${id}`,
      followRequest,
      config,
    );

    dispatch({ type: USER_ACCEPT_NOTIF_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_ACCEPT_NOTIF_FAIL,
      payload: message,
    });
  }
};

export const denieNotif = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DENIE_NOTIF_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(
      `/api/users/notif/${id}`,

      config,
    );

    dispatch({ type: USER_DENIE_NOTIF_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_DENIE_NOTIF_FAIL,
      payload: message,
    });
  }
};

export const sendNotif = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "USER_SEND_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    console.log(userInfo);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/test/notif/${id}`, {}, config);

    dispatch({ type: "USER_SEND_SUCCESS", payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
    }
    dispatch({
      type: "USER_SEND_FAIL",
      payload: message,
    });
  }
};
