import axios from "axios";

import {
  ARTICLE_LIST_REQUEST,
  ARTICLE_LIST_SUCCESS,
  ARTICLE_LIST_FAIL,
  ARTICLE_DETAILS_REQUEST,
  ARTICLE_DETAILS_SUCCESS,
  ARTICLE_DETAILS_FAIL,
  ARTICLE_CLAP_REQUEST,
  ARTICLE_CLAP_SUCCESS,
  ARTICLE_CLAP_FAIL,
  ARTICLE_CREATE_REQUEST,
  ARTICLE_CREATE_SUCCESS,
  ARTICLE_CREATE_FAIL,
  ARTICLE_UPDATE_REQUEST,
  ARTICLE_UPDATE_SUCCESS,
  ARTICLE_UPDATE_FAIL,
  ARTICLE_CREATE_REVIEW_REQUEST,
  ARTICLE_CREATE_REVIEW_SUCCESS,
  ARTICLE_CREATE_REVIEW_FAIL,
  ARTICLE_DELETE_FAIL,
  ARTICLE_DELETE_REQUEST,
  ARTICLE_DELETE_SUCCESS,
} from "../constants/articleConstats";

export const listArticle = (keyword = "", pageNumber = "") => async (
  dispatch,
) => {
  try {
    dispatch({ type: ARTICLE_LIST_REQUEST });

    const { data } = await axios.get(
      `/api/articles?keyword=${keyword}&pageNumber=${pageNumber}`,
    );
    dispatch({ type: ARTICLE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ARTICLE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const detailArticle = (id) => async (dispatch) => {
  try {
    dispatch({ type: ARTICLE_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/articles/${id}`);

    dispatch({ type: ARTICLE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ARTICLE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const clapArticle = (id) => async (dispatch) => {
  try {
    dispatch({ type: ARTICLE_CLAP_REQUEST });

    const { data } = await axios.post(`/api/articles/${id}/clap`);

    dispatch({ type: ARTICLE_CLAP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ARTICLE_CLAP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createArticle = (article) => async (dispatch, getState) => {
  try {
    dispatch({ type: ARTICLE_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/articles/add`, article, config);

    dispatch({ type: ARTICLE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ARTICLE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateArticle = (article) => async (dispatch, getState) => {
  try {
    dispatch({ type: ARTICLE_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/articles/${article._id}`,
      article,
      config,
    );

    dispatch({ type: ARTICLE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ARTICLE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createArticleReview = (articleId, review) => async (
  dispatch,
  getState,
) => {
  try {
    dispatch({ type: ARTICLE_CREATE_REVIEW_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/articles/${articleId}/review`,
      review,
      config,
    );

    dispatch({ type: ARTICLE_CREATE_REVIEW_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ARTICLE_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteArticle = (articleId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ARTICLE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/articles/${articleId}`, config);

    dispatch({ type: ARTICLE_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ARTICLE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
