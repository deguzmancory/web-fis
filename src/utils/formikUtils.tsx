/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import Tree from 'react-animated-tree-v2';
import { GoSettings } from 'react-icons/go';
import { Tag, View } from 'src/components/common';
import { useInterval } from 'src/hooks';
import { isEmpty } from 'src/validations';
import { CommonFormikProps } from './commonTypes';

import './formikUtils.scss';

type Props = {
  formik: CommonFormikProps<any>;
  paddingRoot?: boolean;
};

const COUNT_MAX = 5;

export const FormikHelper: React.FC<Props> = ({ formik, paddingRoot = false }) => {
  const [collapse, setCollapse] = useState(true);
  const [_rerender, triggerRerender] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const isProduction = process.env.NODE_ENV === 'production';

  // Because formik ref doesn't rerender
  // => need this interval to trigger rerender every second to check new value from formik
  useInterval(() => {
    triggerRerender((prev) => !prev);
  }, 1000);

  useEffect(() => {
    if (paddingRoot) {
      if (collapse) {
        const $root = document.getElementById('root');
        $root.setAttribute('style', 'padding-left: 0; transition: 0.4s');
      } else {
        const $root = document.getElementById('root');
        $root.setAttribute('style', 'padding-left: 200px; transition: 0.4s');
      }
    }
  }, [collapse]);

  const renderTrueFalse = (value: boolean) => {
    if (value) return <Tag variant="is-success">TRUE</Tag>;

    return <Tag variant="is-danger">FALSE</Tag>;
  };

  const renderContent = (key, value) => {
    if (!!value && typeof value === 'object' && !(value instanceof Date)) return key;
    return `${key}: ${JSON.stringify(value)}`;
  };

  const renderValue = (value: any) => {
    if (!value) return null;
    if (typeof value === 'object' && !(value instanceof Date)) return renderObject(value);

    return null;
  };

  const renderObject = (values: Record<string, any>) => {
    if (isEmpty(values)) return <div className="ml-8">{'{}'}</div>;

    const keys = Object.keys(values).sort();

    return keys.map((key) => (
      <>
        <Tree key={key} content={renderContent(key, values[key])} visible />
        {renderValue(values[key])}
      </>
    ));
  };

  const toggleCollapse = () => {
    if (isProduction) {
      if (clickCount >= COUNT_MAX) {
        setCollapse((prev) => !prev);
      } else {
        setClickCount((prev) => prev + 1);
      }
    } else {
      setCollapse((prev) => !prev);
    }
  };

  return (
    <View
      id="formik-helper"
      className={cn('formik-helper panel is-primary is-hidden-touch', {
        collapse: collapse,
      })}
    >
      <button
        className={cn('formik-helper__button has-text-info', {
          'hide-production': isProduction,
          'show-production': clickCount >= COUNT_MAX,
        })}
        onClick={toggleCollapse}
      >
        <GoSettings size={24} />
      </button>

      <p className="panel-heading">Formik Helper</p>

      <div className="formik-helper__body">
        <View className="p-4">
          <View className="mb-24">
            <h4>Values</h4>
            {renderObject(formik.values)}
          </View>

          <View className="mb-24 has-text-danger">
            <h4>Errors</h4>
            {renderObject(formik.errors)}
          </View>

          <View className="mb-24">
            <h4>Touched</h4>
            {renderObject(formik.touched)}
          </View>

          {/* <View className="mb-24">
            <View isRow justify="space-between" align="center" className="mb-16">
              <h4>isValid</h4> {renderTrueFalse(formik.current?.isValid)}
            </View>
            <View isRow justify="space-between" align="center" className="mb-16">
              <h4>isSubmitting</h4> {renderTrueFalse(formik.current?.isSubmitting)}
            </View>
            <View isRow justify="space-between" align="center" className="mb-16">
              <h4>validateOnChange</h4> {renderTrueFalse(formik.current?.validateOnChange)}
            </View>
            <View isRow justify="space-between" align="center" className="mb-16">
              <h4>validateOnMount</h4> {renderTrueFalse(formik.current?.validateOnMount)}
            </View>
          </View> */}
        </View>
      </div>
    </View>
  );
};
