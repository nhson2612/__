import React, {Suspense} from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from '@assets/loadables/Home/Home';
import NotFound from '@assets/loadables/NotFound/NotFound';
import Settings from '@assets/loadables/Settings/Settings';
import {isEmbeddedApp, routePrefix} from '@assets/config/app';
import Loading from '@assets/components/Loading';
import Notifications from '@assets/loadables/Notifications/Notifications';
import Analytics from '@assets/loadables/Analytics/Analytics';

// eslint-disable-next-line react/prop-types
const Routes = ({prefix = routePrefix}) => (
  <Suspense fallback={<Loading />}>
    <Switch>
      {isEmbeddedApp && <Route exact path="/" component={Home} />}
      {isEmbeddedApp && <Route exact path={prefix} component={Home} />}
      <Route exact path={prefix + '/'} component={Home} />
      <Route exact path={prefix + '/settings'} component={Settings} />
      <Route exact path={prefix + '/notifications'} component={Notifications} />
      <Route exact path={prefix + '/analytics'} component={Analytics} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Suspense>
);

export default Routes;
