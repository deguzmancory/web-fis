import { Box, useMediaQuery } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { muiResponsive } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { LoadingCommon, Table } from 'src/components/common';
import EmptyTable from 'src/components/EmptyTable';
import { getFileName, handleParseAndDownloadFile } from 'src/components/FilePreview/helper';
import { GetPropertiesParams } from 'src/queries/helpers';
import {
  PurchaseOrdersList,
  usePatchPurchaseOrderPrinted,
  useViewFinalPdf,
} from 'src/queries/PurchasingListing';
import { useGetAllPurchasingList } from 'src/queries/PurchasingListing/useGetAllPurchasingListing';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import { isEmpty } from 'src/validations';
import {
  allApprovedColumns,
  allColumnsPendingReviewApprove,
  allCreateChangePOColumns,
  allOutstandingColumns,
} from './allColumns';
import HeaderTable from './header';
import { SELECT_CHANGE_FORM_TYPE_QUERY_KEY } from 'src/containers/POChange/SelectChangeFormType/enums';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { QUERY_KEY } from '../enum';

const PDFView = React.lazy(() => import('src/components/common/PDFView'));

const TablePurchasingOrderList: React.FC<Props> = () => {
  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const workFlowTypeStatus = React.useMemo(
    () => query.get(QUERY_KEY.WORKFLOW_STATUS) || undefined,
    [query]
  );

  const [pdfUrl, setPdfUrl] = React.useState(null);

  const { getFinalPdf } = useViewFinalPdf({
    onSuccess(_data) {
      const url = _data.data.url;

      setPdfUrl(url);
    },
    onError(error: Error) {
      handleShowErrorMsg(error);
    },
  });

  const { patchPrintedId } = usePatchPurchaseOrderPrinted({
    onSuccess() {
      onGetPurchasing();
    },
    onError(error: Error) {
      handleShowErrorMsg(error);
    },
  });

  const searchPurchasingDocument = React.useMemo(
    () => query.get(QUERY_KEY.DOCUMENT_TYPE) || undefined,
    [query]
  );

  const { purchases, totalRecords, setParams, isFetching, onGetPurchasing } =
    useGetAllPurchasingList({
      onError: (error) => handleShowErrorMsg(error),
    });

  const handleGetPurchasing = React.useCallback(
    (params: GetPropertiesParams) => {
      let newParams = {
        ...params,
        workflowStatus: workFlowTypeStatus,
        documentType: searchPurchasingDocument,
      };

      const sort = params?.sort;
      if (sort) {
        newParams = {
          ...newParams,
          order: `${newParams.sort}:${newParams.order}`,
        };
        delete newParams.sort;
      }

      onGetPurchasing();
      setParams(newParams);
    },
    [onGetPurchasing, searchPurchasingDocument, workFlowTypeStatus, setParams]
  );

  const handleViewFinalPDF = React.useCallback(
    (rowData: PurchaseOrdersList) => {
      const id = rowData?.id;
      getFinalPdf({ id: id });
    },
    [getFinalPdf]
  );

  const handlePrintedId = React.useCallback(
    (rowData: PurchaseOrdersList) => {
      const id = rowData?.id;
      patchPrintedId({ id: id });
    },
    [patchPrintedId]
  );

  const handlePODetailClick = React.useCallback((rowData: PurchaseOrdersList) => {
    const id = rowData?.id;
    Navigator.navigate(`${PATHS.purchaseOrderDetail}/${id}`);
  }, []);

  const handlePOChangeOrPaymentDetailClick = React.useCallback((rowData: any) => {
    const id = rowData?.id;
    switch (rowData.documentType) {
      case PO_DOCUMENT_TYPE.PO_CHANGE:
        Navigator.navigate(
          `${PATHS.poChangeOptions}?${SELECT_CHANGE_FORM_TYPE_QUERY_KEY.DOCUMENT_ID}=${id}`
        );
        return;
      // TODO: Tuyen Tran Update Path
      case PO_DOCUMENT_TYPE.PO_PAYMENT:
        Navigator.navigate(
          `${PATHS.poChangeOptions}?${SELECT_CHANGE_FORM_TYPE_QUERY_KEY.DOCUMENT_ID}=${id}`
        );
        return;
    }
  }, []);

  const columns = React.useMemo(() => {
    switch (workFlowTypeStatus) {
      case 'all':
      case 'pending':
      case 'review':
        return allColumnsPendingReviewApprove({
          handleGetPurchaseOrderDetail: (rowData) => handlePODetailClick(rowData),
        });
      case 'approved':
        return allApprovedColumns({
          handleViewFinalPDF: (rowData) => handleViewFinalPDF(rowData),
          handlePrintedId: (rowData) => handlePrintedId(rowData),
          handleGetPurchaseOrderDetail: (rowData) => handlePODetailClick(rowData),
        });
      case 'poChange':
      case 'poPayment':
        return allCreateChangePOColumns({
          handlePOChangeOrPaymentDetailClick: (rowData) =>
            handlePOChangeOrPaymentDetailClick(rowData),
          typeStatus: workFlowTypeStatus,
        });
      case 'outstanding':
        return allOutstandingColumns({
          handleGetPurchaseOrderDetail: (rowData) => handlePODetailClick(rowData),
        });
      default:
        return null;
    }
  }, [
    handlePODetailClick,
    handlePOChangeOrPaymentDetailClick,
    handlePrintedId,
    handleViewFinalPDF,
    workFlowTypeStatus,
  ]);

  const tableOptions: MUIDataTableOptions = React.useMemo(
    () => ({
      count: totalRecords,
      // onRowClick: handleViewVendorDetail,
      rowHover: true,
      filter: false,
      searchAlwaysOpen: false,
      searchOpen: false,
      search: false,
      tableBodyMaxHeight: isTabletScreen ? '100%' : 'calc(100vh - 314px)', // content height
    }),
    [isTabletScreen, totalRecords]
  );

  return (
    <Box>
      <Suspense fallback={<LoadingCommon />}>
        <PDFView
          url={pdfUrl}
          title={getFileName(pdfUrl)}
          isVisible={!isEmpty(pdfUrl)}
          onClose={() => setPdfUrl(null)}
          onDownload={() => handleParseAndDownloadFile(pdfUrl)}
        />
      </Suspense>
      <HeaderTable />
      <Table
        title={''}
        onAction={handleGetPurchasing}
        isLoading={isFetching}
        data={purchases}
        tableOptions={tableOptions}
        columns={columns}
        emptyComponent={<EmptyTable />}
      />
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TablePurchasingOrderList);
