import { Box, Container } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'src/components/common';
import LockedPage from 'src/components/NoPermission/LockedPage';
import { IRootState } from 'src/redux/rootReducer';

const EmptyScreen: React.FC<Props> = ({
  title = `You don't have permission to view this document`,
}) => {
  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="sm">
        <View flexGrow={1} justify="center" align="center" className="my-32">
          <Box>
            <LockedPage />
          </Box>
          <Text size={20} className="my-24 text-color-primary-700 text-align-center">
            {title}
          </Text>
        </View>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    title?: string;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EmptyScreen);
