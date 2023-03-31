import {
  Box,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { ACCEPT_FILE_TYPE, COLOR_CODE } from 'src/appConfig/constants';
import CircularProgressWithLabel from 'src/components/CircularProgressWithLabel';
import { Accordion, Button, FileUpload, TextareaAutosize } from 'src/components/common';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import FilePreview from 'src/components/FilePreview';
import { DateFormatDisplayMinute } from 'src/utils';
import { localTimeToHawaii } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CommonFileAttachment } from './types';

const FileAttachmentsSection: React.FC<Props> = ({
  fileAttachments,
  disabled = false,
  loading,
  showUploadProgress = false,
  uploadProgress,
  allowUploadFile = true,
  allowRemoveFile = true,
  defaultExpandedAccordion = true,
  fileSelected,
  onFileSelect,
  onDescriptionInputChange,
  onRemoveSelectedFile,
  onGetDecodeUrl,
  onUploadFile,
  onDeleteAttachment,
}) => {
  return (
    <Accordion title="File Attachments" id="file-attachments" isExpanded={defaultExpandedAccordion}>
      {allowUploadFile && (
        <>
          <FileUpload
            acceptFileType={ACCEPT_FILE_TYPE}
            onChange={(value: File[]) => onFileSelect(value)}
          />

          <Stack direction={'row'} justifyContent="flex-end" mt={2} mb={1}>
            <Typography variant="body2" fontStyle={'italic'} color={COLOR_CODE.PRIMARY_500}>
              Please click Upload to save your document.
            </Typography>
          </Stack>
        </>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                {
                  label: 'File Attachments Name',
                  width: '20%',
                },
                {
                  label: 'Description',
                  width: '20%',
                },
                {
                  label: 'Upload Date',
                  width: '20%',
                },
                {
                  label: 'Size',
                  width: '10%',
                },
                {
                  label: ' ',
                  width: '30%',
                },
              ].map((item) => (
                <StyledTableCell key={item.label} width={item.width}>
                  {item.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              border: COLOR_CODE.DEFAULT_BORDER,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
          >
            {/* Upload file */}
            {allowUploadFile && fileSelected && (
              <StyledTableRow>
                <StyledTableCell width={'20%'}>
                  <FilePreview.LocalFilePreview file={fileSelected.file} />
                </StyledTableCell>
                <StyledTableCell width={'20%'}>
                  <TextareaAutosize onChange={onDescriptionInputChange} />
                </StyledTableCell>
                <StyledTableCell width={'20%'}>
                  {dayjs().format(DateFormatDisplayMinute)}
                </StyledTableCell>
                <StyledTableCell width={'10%'}>{fileSelected.size}</StyledTableCell>
                <StyledTableCell width={'30%'}>
                  <Stack direction="row" justifyContent={'flex-end'}>
                    {/* {(!!uploadProgress || isLoadingGetPresignedUrl) && ( */}
                    {showUploadProgress && (
                      <CircularProgressWithLabel
                        variant="determinate"
                        value={uploadProgress}
                        size={32}
                      />
                    )}
                    <Button className="mx-8" disabled={loading} onClick={onUploadFile}>
                      Upload
                    </Button>
                    <Button variant="outline" onClick={onRemoveSelectedFile}>
                      Remove
                    </Button>
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            )}

            {/* View files */}
            {isEmpty(fileAttachments) ? (
              <StyledTableRow>
                <StyledTableCell width={'100%'} colSpan={5}>
                  <Box minHeight={'40px'}>&nbsp;</Box>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              fileAttachments.map((attachment) => (
                <StyledTableRow key={attachment.id}>
                  <StyledTableCell width={'20%'}>
                    <FilePreview.DecodePreview
                      fileUrl={attachment.url}
                      getDecodeUrl={() =>
                        onGetDecodeUrl({ attachmentId: attachment.id, fileUrl: attachment.url })
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCell width={'20%'}>{attachment.description}</StyledTableCell>
                  <StyledTableCell width={'20%'}>
                    {localTimeToHawaii(attachment.uploadDate)}
                  </StyledTableCell>
                  <StyledTableCell width={'10%'}>{attachment.size}</StyledTableCell>
                  <StyledTableCell width={'30%'}>
                    <Stack direction="row" justifyContent={'flex-end'}>
                      {allowRemoveFile && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            onDeleteAttachment(attachment);
                          }}
                          disabled={disabled || loading}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Accordion>
  );
};
type Props = {
  fileAttachments: Partial<CommonFileAttachment>[];
  disabled: boolean;
  loading: boolean;
  uploadProgress: number;
  showUploadProgress: boolean;
  allowUploadFile: boolean;
  allowRemoveFile: boolean;
  defaultExpandedAccordion: boolean;
  fileSelected: Partial<CommonFileAttachment>;
  onFileSelect: (files: File[]) => void;
  onDescriptionInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onRemoveSelectedFile: () => void;
  onUploadFile: () => void;
  onDeleteAttachment: (attachment: Partial<CommonFileAttachment>) => void;
  onGetDecodeUrl: ({
    attachmentId,
    fileUrl,
  }: {
    attachmentId: string;
    fileUrl: string;
  }) => Promise<string>;
};

export default React.memo(FileAttachmentsSection);
