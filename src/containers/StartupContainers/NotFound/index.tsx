import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Text, View } from 'src/components/common';
import { IRootState } from 'src/redux/rootReducer';

const NotFound: React.FC<Props> = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <View
      style={{ width: '100vw', height: '100vh', marginBottom: 64 }}
      className="flex-center justify-center full-width full-height text-align-center "
    >
      <Text size={128} className={`fw-bold has-text-danger `}>
        404
      </Text>
      <Text
        size={32}
        className={`fw-bold text-color-black-600 py-32`}
        style={{ borderBottom: '1px solid rgba(0,0,0, 0.2)' }}
      >
        Oops! The requested URL: <span className="cmp-nav-link">{pathname}</span> was not found on
        this server.
      </Text>

      <Text size={24} className={`fw-bold text-color-black-600 my-32`}>
        Please check the URL.
      </Text>

      <Text size={24} className={`fw-bold text-color-black-600`}>
        Otherwise,{' '}
        <Link to={PATHS.root} className={`cmp-nav-link text-is-24`}>
          click here
        </Link>{' '}
        to be redirected to the homepage.
      </Text>
    </View>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
