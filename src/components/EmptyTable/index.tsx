import React from 'react';
import { connect } from 'react-redux';
import { IMAGES } from 'src/appConfig/images';
import { Image, Text, View } from 'src/components/common';
import { IRootState } from 'src/redux/rootReducer';
import './styles.scss';

const EmptyTable: React.FC<Props> = ({ title = 'No records', style }) => {
  return (
    <View
      flexGrow={1}
      justify="center"
      align="center"
      className="my-32"
      {...(style && {
        style: style,
      })}
    >
      <Image src={IMAGES.documentView} width="120" className="mb-8" />
      <Text size={20} className="text-color-primary-700 text-align-center">
        {title}
      </Text>
    </View>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    title?: string;
    style?: React.CSSProperties;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EmptyTable);
