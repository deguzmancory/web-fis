import { Box, useMediaQuery } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { muiResponsive } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import EmptyTable from 'src/components/EmptyTable';
import { getFileName, handleParseAndDownloadFile } from 'src/components/FilePreview/helper';
import { LoadingCommon, Table } from 'src/components/common';
import LoadingContainer from 'src/containers/StartupContainers/LoadingContainer';
import { useCreatePOPayment } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import {
  PURCHASE_ORDER_KEY,
  PurchaseOrderItem,
  usePatchPurchaseOrderPrinted,
  useViewFinalPdf,
} from 'src/queries/PurchasingListing';
import { useGetAllPurchasingList } from 'src/queries/PurchasingListing/useGetAllPurchasingListing';
import { GetPropertiesParams } from 'src/queries/helpers';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_LIST_QUERY_KEY, PURCHASING_LIST_WORK_FLOW_STATUS_KEY } from '../enum';
import {
  allApprovedColumns,
  allColumnsPendingReviewApprove,
  allCreateChangePOColumns,
  allOutstandingColumns,
} from './allColumns';
import HeaderTable from './header';

const PDFView = React.lazy(() => import('src/components/common/PDFView'));

const TablePurchasingOrderList: React.FC<Props> = () => {
  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);

  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;

  const workFlowTypeStatus = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.WORKFLOW_STATUS) || undefined,
    [query]
  );
  const poNumberSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PO_NUMBER) || undefined,
    [query]
  );
  const projectNumberSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PROJECT_NUMBER) || undefined,
    [query]
  );
  const vendorNameSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.VENDOR_NAME) || undefined,
    [query]
  );
  const faReviewerSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.FA_REVIEWER) || undefined,
    [query]
  );
  const piNameSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PI_NAME) || undefined,
    [query]
  );
  const modifiedStartDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.MODIFIED_START_DATE) || undefined,
    [query]
  );
  const modifiedEndDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.MODIFIED_END_DATE) || undefined,
    [query]
  );

  const paymentRequestNumberSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PAYMENT_REQUEST_NUMBER) || undefined,
    [query]
  );

  const checkNumberSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PAYMENT_REQUEST_NUMBER) || undefined,
    [query]
  );

  const checkStartDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.CHECK_START_DATE) || undefined,
    [query]
  );

  const checkEndDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.CHECK_END_DATE) || undefined,
    [query]
  );

  const finalApprovedStartDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.FINAL_APPROVED_START_DATE) || undefined,
    [query]
  );

  const finalApprovedEndDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.FINAL_APPROVED_END_DATE) || undefined,
    [query]
  );

  const printedStartDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PRINTED_START_DATE) || undefined,
    [query]
  );
  const printedEndDateSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PRINTED_END_DATE) || undefined,
    [query]
  );

  const documentTypeFilter = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.DOCUMENT_TYPE) || undefined,
    [query]
  );
  const statusFilter = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.STATUS) || undefined,
    [query]
  );

  const paymentTypeFilter = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.PAYMENT_TYPE) || undefined,
    [query]
  );

  const searchValues = React.useMemo(() => {
    return {
      number: poNumberSearch,
      projectNumber: projectNumberSearch,
      vendorName: vendorNameSearch,
      faReviewer: faReviewerSearch,
      piName: piNameSearch,
      modifiedStartDate: modifiedStartDateSearch,
      modifiedEndDate: modifiedEndDateSearch,
      paymentRequestNumber: paymentRequestNumberSearch,
      checkNumber: checkNumberSearch,
      checkStartDate: checkStartDateSearch,
      checkEndDate: checkEndDateSearch,
      finalApprovedStartDate: finalApprovedStartDateSearch,
      finalApprovedEndDate: finalApprovedEndDateSearch,
      printedStartDate: printedStartDateSearch,
      printedEndDate: printedEndDateSearch,
      documentType: documentTypeFilter,
      status: statusFilter,
      paymentType: paymentTypeFilter,
    };
  }, [
    poNumberSearch,
    projectNumberSearch,
    vendorNameSearch,
    faReviewerSearch,
    piNameSearch,
    modifiedStartDateSearch,
    modifiedEndDateSearch,
    paymentRequestNumberSearch,
    checkNumberSearch,
    checkStartDateSearch,
    checkEndDateSearch,
    finalApprovedStartDateSearch,
    finalApprovedEndDateSearch,
    printedStartDateSearch,
    printedEndDateSearch,
    documentTypeFilter,
    statusFilter,
    paymentTypeFilter,
  ]);

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

  const { createPOPayment, isLoading: isCreatePOPaymentLoading } = useCreatePOPayment({
    onError: (error) => {
      handleShowErrorMsg(error);
    },
  });

  const {
    purchases,
    totalRecords,
    isFetching,
    setParams,
    onGetPurchasing,
    handleInvalidateAllPurchases,
  } = useGetAllPurchasingList({
    onError: (error) => handleShowErrorMsg(error),
  });

  const handleGetPurchasing = React.useCallback(
    (params: GetPropertiesParams) => {
      let newParams = {
        ...params,
        ...searchValues,
        workflowStatus: workFlowTypeStatus,
      };

      const sort = params?.sort;
      if (sort) {
        newParams = {
          ...newParams,
          order: `${newParams.sort}:${newParams.order}`,
        };
        delete newParams.sort;
      }
      setParams(newParams);
    },
    [searchValues, workFlowTypeStatus, setParams]
  );

  React.useEffect(() => {
    handleInvalidateAllPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  const handleViewFinalPDF = React.useCallback(
    (rowData: PurchaseOrderItem) => {
      const id = rowData?.id;
      getFinalPdf({ id: id });
    },
    [getFinalPdf]
  );

  const handlePrintedId = React.useCallback(
    (rowData: PurchaseOrderItem) => {
      const id = rowData?.id;
      patchPrintedId({ id: id });
    },
    [patchPrintedId]
  );

  const columns = React.useMemo(() => {
    switch (workFlowTypeStatus) {
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.ALL_PO_DOCUMENTS:
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PENDING_PO_DOCUMENTS:
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_PO_DOCUMENTS:
        return allColumnsPendingReviewApprove();
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.APPROVED_PO_DOCUMENTS:
        return allApprovedColumns({
          handleViewFinalPDF: (rowData) => handleViewFinalPDF(rowData),
          handlePrintedId: (rowData) => handlePrintedId(rowData),
        });
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_CHANGE:
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_PAYMENT:
        return allCreateChangePOColumns({
          typeStatus: workFlowTypeStatus,
          onCreatePOPayment: (poId) => {
            createPOPayment(
              {
                id: poId,
              },
              {
                onSuccess: ({ data }) => {
                  Navigator.navigate(`${PATHS.poPaymentForm}/${data.id}`);
                },
              }
            );
          },
        });
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.OUTSTANDING_PO_DOCUMENTS:
        return allOutstandingColumns();
      default:
        return null;
    }
  }, [createPOPayment, handlePrintedId, handleViewFinalPDF, workFlowTypeStatus]);

  const tableOptions: MUIDataTableOptions = React.useMemo(
    () => ({
      count: totalRecords,
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
      {isCreatePOPaymentLoading && <LoadingContainer hideBackdropPageContent={false} />}
      <Suspense fallback={<LoadingCommon />}>
        {!isEmpty(pdfUrl) && (
          <PDFView
            url={pdfUrl}
            title={getFileName(pdfUrl)}
            isVisible={!isEmpty(pdfUrl)}
            onClose={() => setPdfUrl(null)}
            onDownload={() => handleParseAndDownloadFile(pdfUrl)}
          />
        )}
      </Suspense>
      <HeaderTable searchValues={searchValues} />
      <Table
        title={''}
        onAction={handleGetPurchasing}
        isLoading={isFetching}
        data={purchases}
        defaultSortOrder={
          workFlowTypeStatus === PURCHASING_LIST_WORK_FLOW_STATUS_KEY.APPROVED_PO_DOCUMENTS
            ? { name: PURCHASE_ORDER_KEY.FINAL_APPROVED_DATE, direction: 'desc' }
            : { name: PURCHASE_ORDER_KEY.MODIFIED_DATE, direction: 'desc' }
        }
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
