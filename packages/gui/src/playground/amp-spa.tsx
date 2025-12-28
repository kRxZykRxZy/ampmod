import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect, Link, useLocation, Router } from 'wouter';
import render from "./app-target";
import styles from "./amp-spa.css";
import "./import-first";
import "../lib/themes/fonts/inter";
import { APP_NAME } from "@ampmod/branding";
import { applyGuiColors } from '../lib/themes/guiHelpers';
import { detectTheme } from '../lib/themes/themePersistance';
import ErrorBoundary from '../containers/error-boundary';
import Header from '../website/components/header/header';
import Footer from '../website/components/footer/footer';
import Spinner from '../components/tw-loading-spinner/spinner';

const Interface = lazy(() => import(/* webpackChunkName: "interface" */ './render-interface'));
const Embed = lazy(() => import(/* webpackChunkName: "embed" */ './embed'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '../website/home/home'));
const Credits = lazy(() => import(/* webpackChunkName: "credits" */ '../website/credits/credits'));
const FAQ = lazy(() => import(/* webpackChunkName: "faq" */ '../website/faq/faq'));
const Examples = lazy(() => import(/* webpackChunkName: "examples-landing" */ '../website/examples/examples'));
const AddonSettings = lazy(() => import(/* webpackChunkName: "addon-settings" */ './addon-settings'));

const MinorPages = {
  privacy: lazy(() => import(/* webpackChunkName: "pages-privacy" */ '../website/minor-pages/privacy')),
  newcompiler: lazy(() => import(/* webpackChunkName: "pages-new-compiler" */ '../website/minor-pages/new-compiler')),
};

applyGuiColors(detectTheme());

const NotFound: React.FC = () => {
  React.useEffect(() => {
    document.title = `Not Found - ${APP_NAME}`;
  }, []);

  return (
    <div className={styles.launching}>
      <h1>That page doesn't exist. :(</h1>
      <br />
      <div>
        <Link to="/editor">Use {APP_NAME}</Link>,{' '}
        <Link to="/examples">check example projects</Link> or{' '}
        <Link to="/">go to the homepage</Link>.
      </div>
    </div>
  );
};

const RedirectWithParams: React.FC<{ to: string }> = ({ to }) => {
  const location = useLocation();
  return <Redirect to={`${to}${location.search}${location.hash}`} replace />;
};

render(
  <ErrorBoundary>
    <Router base={process.env.ROOT}>
      <Suspense fallback={
        <div className={styles.launching}>
          <Spinner bare isWhite />
          {process.env.ampmod_mode === "canary" && "Canary: expect bugs. Most features here will eventually be on the main site."}
        </div>
      }>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/examples" component={Examples} />
          <Route path="/credits" component={Credits} />
          <Route path="/faq" component={FAQ} />
          <Route path="/editor" component={Interface} />
          <Route path="/player" component={() => <RedirectWithParams to="/editor" />} />
          <Route path="/fullscreen" component={() => <Interface isFullScreen />} />
          <Route path="/addons" component={AddonSettings} />
          <Route path="/embed" component={Embed} />
          <Route path="/new-compiler" component={() => <><Header /><MinorPages.newcompiler /><Footer /></>} />
          <Route path="/privacy" component={() => <><Header /><MinorPages.privacy /><Footer /></>} />
          <Route path="/index.html" component={() => <RedirectWithParams to="/" />} />
          <Route path="/examples.html" component={() => <RedirectWithParams to="/examples" />} />
          <Route path="/credits.html" component={() => <RedirectWithParams to="/credits" />} />
          <Route path="/faq.html" component={() => <RedirectWithParams to="/faq" />} />
          <Route path="/editor.html" component={() => <RedirectWithParams to="/editor" />} />
          <Route path="/player.html" component={() => <RedirectWithParams to="/editor" />} />
          <Route path="/fullscreen.html" component={() => <RedirectWithParams to="/fullscreen" />} />
          <Route path="/addons.html" component={() => <RedirectWithParams to="/addons" />} />
          <Route path="/embed.html" component={() => <RedirectWithParams to="/embed" />} />
          <Route path="/privacy.html" component={() => <RedirectWithParams to="/privacy" />} />
          <Route path="/new-compiler.html" component={() => <RedirectWithParams to="/new-compiler" />} />
          <Route path="*"><NotFound /></Route>
        </Switch>
      </Suspense>
    </Router>
  </ErrorBoundary>
);