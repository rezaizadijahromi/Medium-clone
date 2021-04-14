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
} from "../constants/articleConstats";

export const listArticle = () => async (dispatch) => {
  try {
    dispatch({ type: ARTICLE_LIST_REQUEST });

    const { data } = await axios.get(`/api/articles`);

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
