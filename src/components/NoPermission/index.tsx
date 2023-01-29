import { Box } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button, Text, View } from 'src/components/common';
import { IRootState } from 'src/redux/rootReducer';
import LockedPage from './LockedPage';
import './styles.scss';

const NoPermission: React.FC<Props> = ({
  title = `You don't have permission to view this document`,
  buttonTitle = 'Go to Main Menu',
  buttonLink = PATHS.dashboard,
}) => {
  return (
    <View flexGrow={1} justify="center" align="center" className="my-32">
      <Box>
        <LockedPage />
      </Box>
      <Text size={20} className="my-24 text-color-primary-700 text-align-center">
        {title}
      </Text>
      <Link to={buttonLink}>
        <Button>{buttonTitle}</Button>
      </Link>
    </View>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    title?: string;
    buttonTitle?: string;
    buttonLink?: string;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NoPermission);
