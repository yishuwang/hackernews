import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
// 模块热替换，无需刷新浏览器页面，帮助保证应用的状态
if (module.hot) {
  module.hot.accept();
}
