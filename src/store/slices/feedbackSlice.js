import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  feedbacks: [],
  isLoading: false,
  error: null,
};

export const createFeedback = createAsyncThunk(
  'feedback/create',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/feedback', feedbackData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create feedback');
    }
  }
);

export const getFeedbacks = createAsyncThunk(
  'feedback/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/feedback');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedbacks');
    }
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'feedback/updateStatus',
  async ({ feedbackId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/feedback/${feedbackId}`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update feedback status');
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/delete',
  async (feedbackId, { rejectWithValue }) => {
    try {
      await axios.delete(`/feedback/${feedbackId}`);
      return feedbackId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete feedback');
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getFeedbacks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload;
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateFeedbackStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.feedbacks.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
      })
      .addCase(updateFeedbackStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = state.feedbacks.filter(
          feedback => feedback._id !== action.payload
        );
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer; 