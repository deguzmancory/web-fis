import { Box, Tab, Tabs, SxProps } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Text, View } from 'src/components/common';
import { Callback } from 'src/redux/types';
import './styles.scss';

export interface TabList {
  label: React.ReactNode;
  value: string;
  hidden?: boolean;
  count?: number;
  sx?: SxProps;
}

const TabsBar: React.FC<Props> = ({
  value,
  tabsList,
  buttons,
  color = 'primary',
  orientation = 'horizontal',
  variant = 'scrollable',
  sx,
  onChange,
  ...props
}) => {
  return (
    <Box display={'flex'} justifyContent={'space-between'}>
      <Tabs
        value={value || false}
        indicatorColor={color}
        textColor={color}
        onChange={onChange}
        variant={variant}
        orientation={orientation}
        scrollButtons="auto"
        sx={{
          maxWidth: '92vw',
          maxHeight: '70vh',
          ...sx,
        }}
        TabIndicatorProps={{
          sx: {
            display: 'none',
          },
        }}
      >
        {tabsList.map((tab, _index) => {
          if (tab.hidden) return null;

          return (
            <Tab
              label={
                !!tab.count ? (
                  <View isRow>
                    {React.isValidElement(tab.label) ? (
                      tab.label
                    ) : (
                      <Text className={``}>{tab.label} </Text>
                    )}
                    <View style={tagStyles}>{tab.count}</View>
                  </View>
                ) : (
                  tab.label
                )
              }
              value={tab.value}
              sx={{
                fontSize: '16px',
                textTransform: 'capitalize',
                padding: '16px 12px',
                fontWeight: 'bold',
                borderBottom: orientation === 'vertical' && COLOR_CODE.DEFAULT_BORDER,
                '&.Mui-selected': {
                  color: COLOR_CODE.WHITE,
                  bgcolor: COLOR_CODE.PRIMARY,
                },
                ...tab.sx,
              }}
              key={`tab-${tab.value}`}
            />
          );
        })}
      </Tabs>

      {buttons}
    </Box>
  );
};

const tagStyles = {
  borderRadius: '16px',
  color: COLOR_CODE.WHITE,
  background: COLOR_CODE.DANGER,
  fontSize: 12,
  alignSelf: 'center',
  padding: '0px 4px',
  marginLeft: '4px',
};

type Props = {
  value: string;
  tabsList: TabList[];
  buttons?: React.ReactNode;
  color?: 'primary' | 'secondary';
  dataLength?: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'scrollable' | 'standard';
  sx?: SxProps;
  onChange: Callback;
};

export default TabsBar;
