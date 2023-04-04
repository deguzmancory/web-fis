import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PO_ACTION } from 'src/queries';

export interface IFormState<T = any> {
  formData: T | null;
  activeStep: number;
  maxValidStep: number;
  formSteps: Array<T>;
  isImmutableFormData: boolean;
  hrefNavigateAdditionalForm: string;
  poFormAction: PO_ACTION;
}
export const FIRST_STEP = 0;

const initialState: IFormState = {
  activeStep: FIRST_STEP,
  maxValidStep: 0,
  formData: null,
  formSteps: [],
  isImmutableFormData: false,
  hrefNavigateAdditionalForm: '',
  poFormAction: null,
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: <T>(state, action: PayloadAction<T>) => {
      state.formData = action.payload;
    },
    setFormSteps: <T>(state, action: PayloadAction<Array<T>>) => {
      state.formSteps = action.payload;
    },
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
      if (state.maxValidStep < action.payload) {
        state.maxValidStep = action.payload;
      }
    },
    clearFormSteps: <T>(state, action: PayloadAction<T>) => {
      state.activeStep = initialState.activeStep;
      state.maxValidStep = initialState.maxValidStep;
      state.formData = action.payload;
    },
    setMaxValidStep: (state, action: PayloadAction<number>) => {
      state.maxValidStep = action.payload;
      if (state.activeStep > action.payload) {
        state.activeStep = action.payload;
      }
    },
    // for keep form data immutable between pages and components
    setIsImmutableFormData: (state, action: PayloadAction<boolean>) => {
      state.isImmutableFormData = action.payload;
    },
    setHrefNavigateAdditionalForm: (state, action: PayloadAction<string>) => {
      state.hrefNavigateAdditionalForm = action.payload;
    },
    setPoFormAction: (state, action: PayloadAction<PO_ACTION>) => {
      state.poFormAction = action.payload;
    },
    clearFormState: (state) => {
      state.activeStep = initialState.activeStep;
      state.formSteps = initialState.formSteps;
      state.maxValidStep = initialState.maxValidStep;
      state.formData = initialState.formData;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setFormData,
  setActiveStep,
  setFormSteps,
  clearFormState,
  setMaxValidStep,
  clearFormSteps,
  setIsImmutableFormData,
  setHrefNavigateAdditionalForm,
  setPoFormAction,
} = formSlice.actions;

export const formState = formSlice.getInitialState();

export default formSlice.reducer;
