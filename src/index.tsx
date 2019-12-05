import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { microAppLoaderCreator } from '@saasfe/we-app-loader';
import { Router, Route, RouterType } from '@saasfe/we-app-react-router';
import { LoaderConfig } from '@saasfe/we-app-loader/es/props-type';
import { Route as TRoute } from '@saasfe/we-app-react-router/es/util/route';
import { ChoiceLayout } from 'choice-cbm';
import createLoading from './loading';

declare global {
  interface Window {
    MicroAppLoader: any;
    System: any;
  }
}

// @ts-ignore
// eslint-disable-next-line
const defaultConfig = {
  router: {
    routerType: RouterType.browser,
    basename: '',
  },
  getModuleId(...args) {
    return args.join('__');
  },
  getModuleContainer(moduleId, { module }) {
    const { isStatic } = module;
    let container = document.querySelector(`#${moduleId}`);
    if (!container) {
      container = document.createElement('div');
      container.id = moduleId;
      container.className = `${moduleId} ${isStatic ? '' : 'microfe-module'}`;

      const elContent = document.querySelector('#__microfe-root-content');
      elContent && elContent.appendChild(container);
    }
    return container;
  },
  lifecycleTemplateFunction({
    module,
    microAppConfig,
    loaderConfig,
    getModule,
    getModuleContainer,
  }) {
    let appPromise: Promise<any>;
    const { noLoading, route, routeIgnore, unmountRemoveContainer = true, layout = {} } = module;
    const loading = createLoading();

    return {
      bootstrap: () => {
        // @ts-ignore
        const moduleContainer: HTMLElement = getModuleContainer();
        !noLoading && loading.show(moduleContainer);
        appPromise = getModule();
        return Promise.resolve(appPromise);
      },
      mount: () => Promise.all([window.System.import('antd'), appPromise])
        .then(([antd, App]) => {
          const { ConfigProvider, locales } = antd.default || antd;
          // @ts-ignore
          const moduleContainer: HTMLElement = getModuleContainer();
          !noLoading && loading.show(moduleContainer);

          ReactDOM.render(
            <ConfigProvider locale={locales.zh_CN}>
              <Router
                microAppName={microAppConfig.microAppName}
                {...loaderConfig.router}>
                <Route
                  route={route as TRoute}
                  routeIgnore={routeIgnore as TRoute}
                >
                  <ChoiceLayout {...layout} emptyLayout={!layout}>
                    <App />
                  </ChoiceLayout>
                </Route>
              </Router>
            </ConfigProvider>,
            moduleContainer,
            () => {
              !noLoading && loading.hide(moduleContainer);
            },
          );
        }),
      unmount: () => {
        const moduleContainer = getModuleContainer();

        ReactDOM.unmountComponentAtNode(moduleContainer);

        // @ts-ignore
        loading.hide(moduleContainer);

        unmountRemoveContainer && moduleContainer.parentNode && moduleContainer.parentNode.removeChild(moduleContainer);

        return Promise.resolve();
      },
    };
  },
} as LoaderConfig;

const MicroAppLoader = microAppLoaderCreator(defaultConfig);
MicroAppLoader.version = '1.1.4';

export default MicroAppLoader;

window.MicroAppLoader = MicroAppLoader;
