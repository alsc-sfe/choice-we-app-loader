---
order: 1
title: demo1
---

PC模板

````jsx
import MicroAppLoader from "@alife/choice-we-app-loader";

MicroAppLoader.start({
  router: {
    routerType: MicroAppLoader.RouterType.hash,
    basename: '/boh',
  },
  getMicroAppConfigPath: (microAppConfigPath) => {
    if (!microAppConfigPath) {
      throw new Error('Please specify microAppConfigPath.');
    }
    if (microAppConfigPath.lastIndexOf('app-config.js') > -1) {
      return microAppConfigPath;
    }
    return `//g.alicdn.com/${microAppConfigPath}/app-config.js`;
  },
  microApps: [
    {
      microAppConfigPath: 'alsc-saas/web-boh-common/1.2.7',
      
      getModules: function(modules) {
        const module = modules.find(({ moduleName }) => moduleName === 'menu');
        module.afterRouteDiscover = (match) => {
          document.querySelector('#microfe-layout').classList[match ? 'remove' : 'add']('microfe-layout--nomenu');
        };
        return modules;
      },
      
    },
    {
      microAppConfigPath: 'alsc-saas/web-boh-dish/1.0.3',      
    },
    {
      microAppConfigPath: 'alsc-saas/web-crm-member/1.3.2',
    },
  ]
});
````
