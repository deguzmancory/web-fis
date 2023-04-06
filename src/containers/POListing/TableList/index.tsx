import { Box, useMediaQuery } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { muiResponsive } from 'src/appConfig/constants';
import EmptyTable from 'src/components/EmptyTable';
import { getFileName, handleParseAndDownloadFile } from 'src/components/FilePreview/helper';
import { LoadingCommon, Table } from 'src/components/common';
import {
  PURCHASE_ORDER_KEY,
  PurchaseOrderItem,
  usePatchPurchaseOrderPrinted,
  useViewFinalPdf,
} from 'src/queries/PurchasingListing';
import { useGetAllPurchasingList } from 'src/queries/PurchasingListing/useGetAllPurchasingListing';
import { GetPropertiesParams } from 'src/queries/helpers';
import { IRootState } from 'src/redux/rootReducer';
import { handleShowErrorMsg } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PURCHASING_LIST_WORK_FLOW_STATUS_KEY, PO_LIST_QUERY_KEY } from '../enum';
import {
  allApprovedColumns,
  allColumnsPendingReviewApprove,
  allCreateChangePOColumns,
  allOutstandingColumns,
} from './allColumns';
import HeaderTable from './header';
import { RoleService } from 'src/services';
import { ROLE_NAME } from 'src/queries/Profile/helpers';

const PDFView = React.lazy(() => import('src/components/common/PDFView'));

const TablePurchasingOrderList: React.FC<Props> = () => {
  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;

  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const workFlowTypeStatus = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.WORKFLOW_STATUS) || undefined,
    [query]
  );
  const poNumberSearch = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.NUMBER) || undefined,
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
    () => query.get(PO_LIST_QUERY_KEY.DOCUMENT_TYPE) || undefined,
    [query]
  );

  const {
    purchases,
    totalRecords,
    setParams,
    isFetching,
    onGetPurchasing,
    handleInvalidateAllPurchases,
  } = useGetAllPurchasingList({
    onError: (error) => handleShowErrorMsg(error),
  });

  const handleGetPurchasing = React.useCallback(
    (params: GetPropertiesParams) => {
      let newParams = {
        ...params,
        workflowStatus: workFlowTypeStatus,
        documentType: searchPurchasingDocument,
        number: poNumberSearch,
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
    [workFlowTypeStatus, searchPurchasingDocument, poNumberSearch, setParams]
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
        });
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.OUTSTANDING_PO_DOCUMENTS:
        return allOutstandingColumns();
      default:
        return null;
    }
  }, [handlePrintedId, handleViewFinalPDF, workFlowTypeStatus]);

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
