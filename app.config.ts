const webpack = require('webpack');
const SystemModulePlugin = require('@ali/saas-webpack-system-module');

module.exports = {
  // 模板类型 pc | h5
  viewType: 'pc',
  componentId: "593",
  componentType: "koubei-b-pc-ts",
  runtime: {
    heads: [
      `
      <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antd/3.25.2/dist/antd.min.css">

      <script src="https://gw.alipayobjects.com/os/lib/core-js-bundle/3.1.4/minified.js" crossorigin="anonymous"></script>
      <script src="https://gw.alipayobjects.com/os/lib/regenerator-runtime/0.13.3/runtime.js" crossorigin="anonymous"></script>
      <script src="https://gw.alipayobjects.com/os/lib/systemjs/6.1.4/dist/system.min.js" crossorigin="anonymous"></script>
      <script src="https://gw.alipayobjects.com/os/lib/systemjs/6.1.4/dist/extras/named-register.min.js" crossorigin="anonymous"></script>
      <script src="https://gw.alipayobjects.com/os/lib/moment/2.24.0/min/moment.min.js" crossorigin="anonymous"></script>
      <script src="https://gw.alipayobjects.com/os/lib/moment/2.24.0/locale/zh-cn.js" crossorigin="anonymous"></script>
      <script src="https://gw.alipayobjects.com/os/lib/antd/3.25.2/dist/antd-with-locales.min.js" crossorigin="anonymous"></script>
      `,
      `
      <script>
      window.MICRO_APPNAME = '';
      </script>
      `,
      `
      <style>
        html,body {
          height: 100%;
          background: #f5f5f5;
        }
        .microfe-layout {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .microfe-menu {
          height: 100%;
        }
        .microfe-body {
          flex: 1;
          height: 100%;
          overflow: auto;
          display: flex;
        }
        .microfe-wrapper {
          flex: 1;
          overflow: auto;
        }
        .microfe-root-body {
          position: relative;
          height: 100%;
          min-width: 1060px;
        }
        body.body-min .microfe-root-body {
          min-width: 1180px;
        }
        .microfe-root-content {
          height: 100%;
        }
        .microfe-module,
        .microfe-module>div {
          height: 100%;
        }
      </style>
      `
    ],
    bodies: [
      `
      <script type="systemjs-importmap">
        {
          "imports": {
            "singleSpa": "https://gw.alipayobjects.com/os/lib/single-spa/4.3.5/lib/system/single-spa.min.js",
            "AntDesignIcons": "https://gw.alipayobjects.com/os/lib/ant-design/icons/2.1.1/lib/umd.js",
            "saas-fetch": "https://gw.alipayobjects.com/os/mentor/saas-fetch/2.0.6/umd/saas-fetch-min.js",
            "saas-fetch-mtop": "https://gw.alipayobjects.com/os/mentor/saas-fetch-mtop/1.0.9/umd/saas-fetch-mtop.js"
          }
        }
      </script>

      <div id="microfe-layout" class="microfe-layout">
        <div class="microfe-navbar" id="bcommon__navbar"></div>
        <div class="microfe-body">
          <div class="microfe-menu" id="bcommon__menu"></div>
          <div class="microfe-wrapper">
            <div class="microfe-root-body">
              <div class="microfe-root-content" id="__microfe-root-content"></div>
            </div>
          </div>
        </div>
      </div>

      <script>
      System.register('React', [], function(exports) {
        return {
          execute: function() {
            exports(window.React);
          }
        };
      });
      System.register('ReactDOM', ['React'], function(exports) {
        return {
          setters: [
            function(m) {},
          ],
          execute: function() {
            exports(window.ReactDOM);
          }
        };
      });
      System.register('antd', ['React', 'ReactDOM'], function(exports) {
        return {
          setters: [
            function(m) {},
          ],
          execute: function() {
            exports(window.antd);
          }
        };
      });
      </script>
      `
    ],
    antd: {
      cdn: true,
    },
  },
  // 本地开发调试配置
  webpack: {
    // 主题配置
    themes: {},
    // devServer配置
    devServer: {
      host: 'local.koubei.test',
      port: 8000,
    },
  },
  // 组件发布前编译配置
  compile: {
    cdn: true, // 是否需要将编译结果发布到CDN
    filename: 'choice-we-app-loader', // 模块打包后的文件名前缀（需要自定义！！！）
    library: 'MicroAppLoader', // 模块名字（需要自定义！！！）
    config: (compileConfig) => {
      // console.log(JSON.stringify(compileConfig));
      // 自定义umd compile配置
      return {
        ...compileConfig,
        module: {
          rules: [
            { parser: { system: false } },
            ...compileConfig.module.rules,
          ],
        },
        plugins: [
          new SystemModulePlugin(),
          new webpack.DefinePlugin({
            'MICRO_APPNAME': JSON.stringify(''),
          }),
        ],
        devtool: 'cheap-source-map',
      };
    },
  },
};
