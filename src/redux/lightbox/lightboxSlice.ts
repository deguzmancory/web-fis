/* eslint-disable security/detect-object-injection */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { LightboxType } from './type';

export interface ILightboxState {
  images: LightboxType['images'];
}

const initialState: ILightboxState = {
  images: [],
};

export const lightboxSlice = createSlice({
  name: 'lightbox',
  initialState,
  reducers: {
    hideLightbox: (state) => {
      state.images = [];
    },
    showLightbox: (state, action: PayloadAction<{ images: LightboxType['images'] }>) => {
      state.images = action.payload.images;
    },
  },
});

export const { hideLightbox, showLightbox } = lightboxSlice.actions;

export const lightboxState = lightboxSlice.getInitialState();

export default lightboxSlice.reducer;
