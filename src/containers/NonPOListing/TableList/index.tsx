import { Box, useMediaQuery } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import { FC, Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { muiResponsive } from 'src/appConfig/constants';
import EmptyTable from 'src/components/EmptyTable';
import { getFileName, handleParseAndDownloadFile } from 'src/components/FilePreview/helper';
import { LoadingCommon, Table } from 'src/components/common';
import {
  NON_PO_PAYMENT_DOCUMENT_TYPE,
  useViewAuthorizationPaymentFinalPdf,
  useViewNonEmployeeTravelFinalPdf,
  useViewPersonalAutoFinalPdf,
  useViewPettyCashFinalPdf,
} from 'src/queries';
import {
  NON_PO_LISTING_ITEM_KEY,
  NonPOListingItem,
  useGetAllNonPOListing,
} from 'src/queries/NonPOListing';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { GetPropertiesParams } from 'src/queries/helpers';
import { IRootState } from 'src/redux/rootReducer';
import { RoleService } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import { isEmpty } from 'src/validations';
import { NON_PO_LISTING_QUERY_KEY, NON_PO_LISTING_WORK_FLOW_STATUS_KEY } from '../enum';
import { allApprovedColumns, allColumnsPendingReviewApprove } from './allColumns';
import HeaderTable from './header';

const PDFView = lazy(() => import('src/components/common/PDFView'));

const TableNonPOOrderList: FC<Props> = () => {
  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location]);

  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;

  const workFlowTypeStatus = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.WORKFLOW_STATUS) || undefined,
    [query]
  );
  const projectNumberSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.LISTED_PROJECT_NUMBER) || undefined,
    [query]
  );
  const vendorNameSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.VENDOR_NAME) || undefined,
    [query]
  );
  const faReviewerSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.FA_STAFF_REVIEWER) || undefined,
    [query]
  );
  const piNameSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.PI_NAME) || undefined,
    [query]
  );
  const modifiedStartDateSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.MODIFIED_START_DATE) || undefined,
    [query]
  );
  const modifiedEndDateSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.MODIFIED_END_DATE) || undefined,
    [query]
  );

  const requestNumberSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.REQUEST_NUMBER) || undefined,
    [query]
  );

  const checkNumberSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.CHECK_NUMBER) || undefined,
    [query]
  );

  const checkStartDateSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.CHECK_START_DATE) || undefined,
    [query]
  );

  const checkEndDateSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.CHECK_END_DATE) || undefined,
    [query]
  );

  const finalApprovedStartDateSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_START_DATE) || undefined,
    [query]
  );

  const finalApprovedEndDateSearch = useMemo(
    () => query.get(NON_PO_LISTING_QUERY_KEY.FINAL_APPROVED_END_DATE) || undefined,
    [query]
  );

  const documentTypeFilter = useMemo(
    () => query.getAll(NON_PO_LISTING_QUERY_KEY.DOCUMENT_TYPE) || undefined,
    [query]
  );
  const statusFilter = useMemo(
    () => query.getAll(NON_PO_LISTING_QUERY_KEY.STATUS) || undefined,
    [query]
  );

  const paymentMethodFilter = useMemo(
    () => query.getAll(NON_PO_LISTING_QUERY_KEY.PAYMENT_METHOD) || undefined,
    [query]
  );

  const searchValues = useMemo(() => {
    return {
      requestNumber: requestNumberSearch,
      listedProjectNumber: projectNumberSearch,
      vendorName: vendorNameSearch,
      faStaffReviewer: faReviewerSearch,
      piName: piNameSearch,
      modifiedStartDate: modifiedStartDateSearch,
      modifiedEndDate: modifiedEndDateSearch,
      checkNumber: checkNumberSearch,
      checkStartDate: checkStartDateSearch,
      checkEndDate: checkEndDateSearch,
      finalApprovedStartDate: finalApprovedStartDateSearch,
      finalApprovedEndDate: finalApprovedEndDateSearch,
      documentType: documentTypeFilter,
      status: statusFilter,
      paymentMethod: paymentMethodFilter,
    };
  }, [
    requestNumberSearch,
    projectNumberSearch,
    vendorNameSearch,
    faReviewerSearch,
    piNameSearch,
    modifiedStartDateSearch,
    modifiedEndDateSearch,
    checkNumberSearch,
    checkStartDateSearch,
    checkEndDateSearch,
    finalApprovedStartDateSearch,
    finalApprovedEndDateSearch,
    documentTypeFilter,
    statusFilter,
    paymentMethodFilter,
  ]);

  const [pdfUrl, setPdfUrl] = useState(null);

  const { getFinalPdfNonEmployeeTravel } = useViewNonEmployeeTravelFinalPdf({
    onSuccess(_data) {
      const url = _data.data.url;

      setPdfUrl(url);
    },
    onError(error: Error) {
      handleShowErrorMsg(error);
    },
  });

  const { getFinalPdfAuthorizationPayment } = useViewAuthorizationPaymentFinalPdf({
    onSuccess(_data) {
      const url = _data.data.url;

      setPdfUrl(url);
    },
    onError(error: Error) {
      handleShowErrorMsg(error);
    },
  });

  const { getPersonalAutoFinalPdf } = useViewPersonalAutoFinalPdf({
    onSuccess(_data) {
      const url = _data.data.url;

      setPdfUrl(url);
    },
    onError(error: Error) {
      handleShowErrorMsg(error);
    },
  });

  const { getFinalPdfPettyCash } = useViewPettyCashFinalPdf({
    onSuccess(_data) {
      const url = _data.data.url;

      setPdfUrl(url);
    },
    onError(error: Error) {
      handleShowErrorMsg(error);
    },
  });

  const { nonPOListing, totalRecords, isFetching, setParams, handleInvalidateAllNonPOListing } =
    useGetAllNonPOListing({
      onError: (error) => handleShowErrorMsg(error),
    });

  const handleGetNonPOListing = useCallback(
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

  useEffect(() => {
    handleInvalidateAllNonPOListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  const handleViewFinalPDF = useCallback(
    (rowData: NonPOListingItem) => {
      const id = rowData?.id;
      switch (rowData?.documentType as NON_PO_PAYMENT_DOCUMENT_TYPE) {
        case NON_PO_PAYMENT_DOCUMENT_TYPE.AUTHORIZATION_PAYMENT:
          getFinalPdfAuthorizationPayment({ id: id });
          return;
        case NON_PO_PAYMENT_DOCUMENT_TYPE.NON_EMPLOYEE_TRAVEL_PAYMENT:
          getFinalPdfNonEmployeeTravel({ id: id });
          return;
        case NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT:
          getPersonalAutoFinalPdf({ id: id });
          return;
        case NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT:
          getFinalPdfPettyCash({ id: id });
          return;
        default:
          return;
      }
    },
    [
      getFinalPdfNonEmployeeTravel,
      getFinalPdfAuthorizationPayment,
      getPersonalAutoFinalPdf,
      getFinalPdfPettyCash,
    ]
  );

  const columns = useMemo(() => {
    switch (workFlowTypeStatus) {
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.ALL_DOCUMENT:
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.PENDING_DOCUMENTS:
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_DOCUMENTS:
        return allColumnsPendingReviewApprove();
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.APPROVED_DOCUMENTS:
        return allApprovedColumns({
          handleViewFinalPDF: (rowData) => handleViewFinalPDF(rowData),
        });

      default:
        return null;
    }
  }, [handleViewFinalPDF, workFlowTypeStatus]);

  const tableOptions: MUIDataTableOptions = useMemo(
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
        onAction={handleGetNonPOListing}
        isLoading={isFetching}
        data={nonPOListing}
        defaultSortOrder={
          workFlowTypeStatus === NON_PO_LISTING_WORK_FLOW_STATUS_KEY.APPROVED_DOCUMENTS
            ? { name: NON_PO_LISTING_ITEM_KEY.ACCEPTED_DATE, direction: 'desc' }
            : { name: NON_PO_LISTING_ITEM_KEY.UPDATED_AT, direction: 'desc' }
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

export default connect(mapStateToProps, mapDispatchToProps)(TableNonPOOrderList);
