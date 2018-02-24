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
  // 接受searchTerm并返回一个函数，因为所有filter函数都接受一个函数作为它的输入，返回的函数可以访问列表项目对象。返回的函数将根据函数定义的条件对列表进行过滤
  // function isSearched(searchTerm) {
  //   return function (item) {
  //     return item.title.toLowerCase().includes(searchTerm.toLowerCase()); //ES5 str.indexOf(pattern)!==-1
  //   }
  // }
  // ES6 高阶函数 一个函数返回另一个函数
const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
// 通过继承类的方式声明组件，公共接口render必须被重写，他定义了一个react组件的输出  需要使用内部状态才使用ES6类组件，其余组件使用函数式无状态组件
class App extends Component {
  // 构造函数中初始化组件的状态  
  constructor(props) {
    super(props); // 会在构造函数中设置this.props以供在构造函数中访问他们
    this.state = { //state使用this绑定在类上，整个组件可以访问到,每次修改组件内部状态，render会再次运行
      list,  //list:list 属性名变量名相同时简写
      searchTerm: '' //初始搜索词是空
    };
    this.onDismiss = this.onDismiss.bind(this); //类方法 this是类的实例
    this.onSearchChange = this.onSearchChange.bind(this); // 表单搜索
  }
  onDismiss(id) {
    const isNotId = item => item.objectId !== id; // 判断结果是true保存，返回一个新数组
    const updatedList = this.state.list.filter(isNotId);
    console.log(updatedList)
    this.setState({list:updatedList});
  }
  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }
  onClickMe = ()=>{
    console.log(this)
  }
  //  <button onClick={this.onClickMe} type="button">类方法可以通过箭头函数自动绑定</button>
  render() {
    const {list, searchTerm} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello, 祝你{user1.firstName + ' ' + user1.lastName}</h1>
        </header>
        <p>确保列表每个成员的关键字key属性是稳定的标识符，而不是使用不稳定的数组索引，唯一key帮助react识别具体成员的增删改，以提升性能。</p>
        <p>ES6 箭头函数 省略了函数声明表达式、花括号和返回声明，JSX简洁可读。
            注意：普通函数表达式会定义自己的this对象，但箭头函数仍使用包含它的语境下的this对象；
            函数只有一个参数时，可以省去括号；
            简洁函数体替代块状函数体，简洁函数体的返回不用显示声明，可移除return表达式。
            </p>
        <p>此前在render方法中映射一个在组件外定义静态列表。现在可以在组件中使用state里的list了</p>
        <p>增加组件的交互，增加dismiss按钮，使用 this.onDismiss 并不够,因为这个类方法需要接收 item.objectID 属性来识别那个将要被忽略的项,
        这就是为什么它需要被封装到另一个函数中来传递这个属性。这个概念在 JavaScript 中被称为高阶函数</p>
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange}> Search </Search>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}/>
      </div>
    );
  }
}
function Search(props) {
    const {value, onChange,children} = this.props;
    return (
      <form>
        {children}<input type="text"
          value={value}
          onChange={onChange}/>
      </form>
    );
}
class Table extends Component {
  render() {
    const {list, pattern, onDismiss} = this.props;
    return (
      <div>
        {list.filter(isSearched(pattern)).map(item=>
          <div key={item.objectId}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <Button onClick={() => onDismiss(item.objectId)}>
                Dissmiss
              </Button>
            </span>
          </div>
        )}
      </div>
    )
  }
}
class Button extends Component {
  render() {
    const {onClick,className='',children} = this.props;
    return (
      <button 
        onClick = {onClick}
        className = {className}
        type="button">
        {children}
      </button>
    );
  }
}
export default App;
