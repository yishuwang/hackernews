import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// react拥抱不可变
const user1 = {
  firstName: '健康',
  lastName: '平安'
}
// 模拟API获取到数据
const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectId: 0 // key属性，列表变化时识别成员状态，提升性能
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectId: 1
  }
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello, 祝你{user1.firstName + ' ' + user1.lastName}</h1>
        </header>
        <p>确保列表每个成员的关键字key属性是稳定的标识符，而不是使用不稳定的数组索引，唯一key帮助react识别具体成员的增删改，以提升性能。</p>
        {list.map(function (item) {
          return (
            <div key={item.objectId}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
            </div>
          );
        })}
        <p>ES6 箭头函数
            注意：普通函数表达式会定义自己的this对象，但箭头函数仍使用包含它的语境下的this对象；
            函数只有一个参数时，可以省去括号；
            简洁函数体替代块状函数体，简洁函数体的返回不用显示声明，可移除return表达式。
            </p>
        {list.map(item => 
          <div key={item.objectId}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
