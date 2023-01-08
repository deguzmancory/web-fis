import { Route } from 'react-router-dom';

// https://stackoverflow.com/questions/56017523/withrouter-with-connect-is-not-working-in-v5-0-0

const withRouter = (ConnectedComponent) => {
  const witRouterComponent = (props) => (
    <Route render={(routeProps) => <ConnectedComponent {...routeProps} {...props} />} />
  );
  return witRouterComponent;
};

export default withRouter;
