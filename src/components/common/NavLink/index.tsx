import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import { connect } from 'react-redux';
import { IRootState } from 'src/redux/rootReducer';
import './styles.scss';

const CNavView: React.FC<Props> = ({
  children,
  className,
  renderIf = true,
  disabled,
  showWaving = false,
  label,
  ...props
}) => {
  if (!renderIf) return null;

  return (
    <NavLink
      strict
      className={(isActive) =>
        'cmp-nav-link' + (disabled ? 'cmp-nav-link--disabled' : '') + className
      }
      {...props}
    >
      {showWaving && <WaveIndicator />}
      {children || label}
    </NavLink>
  );
};

export type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  NavLinkProps & {
    label?: string;
    disabled?: boolean;
    showWaving?: boolean;
    renderIf?: boolean | null;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CNavView);

const WaveIndicator = () => {
  return (
    <div className="wrapper">
      <div className="blob" />
    </div>
  );
};
