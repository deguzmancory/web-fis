import { FormikProps } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';

const TotalCancellation: React.FC<Props> = () => {
  return null;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    disabled: boolean;
    formRef: RefObject<FormikProps<any>>;
    documentId: string;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TotalCancellation);
