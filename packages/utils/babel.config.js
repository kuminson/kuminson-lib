module.exports = {
  "presets": [
    [
      "@babel/env",
      {
        // 对类库项目来说，targets不做配置。（相当于全部语法都转为es5）
        useBuiltIns: false, // 对类库项目来说，这里不要打开,以免污染全局
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2, // 在代码模块中注入 局部的core-js polyfill。2表示使用 @babel/runtime-corejs2 这个polyfill包
        "helpers": true, // true则表示把模块中babel转换后的helper函数改成 require @babel/runtime 下的helper 避免重复打包
        "regenerator": true, // true则表示进行 regenerator的polyfill   不污染全局
        "useESModules": false // 是否转换代码中的esmodule(如果代码后续还要webpack来打包，则不需要处理)
      }
    ]
  ]
}