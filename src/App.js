import React, { Component } from 'react';
import './App.css';

// react拥抱不可变
const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectId: 0 // key属性，列表变化时识别成员状态，提升性能
//   },
//   {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectId: 1
//   }
// ];
  // 接受searchTerm并返回一个函数，因为所有filter函数都接受一个函数作为它的输入，返回的函数可以访问列表项目对象。返回的函数将根据函数定义的条件对列表进行过滤
  // function isSearched(searchTerm) {
  //   return function (item) {
  //     return item.title.toLowerCase().includes(searchTerm.toLowerCase()); //ES5 str.indexOf(pattern)!==-1
  //   }
  // }
  // ES6 高阶函数 一个函数返回另一个函数
const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
const largeColumn = {width: '40%'};
const midColumn = {width: '30%'};
const smallColumn = {width: '10%'};
// 通过继承类的方式声明组件，公共接口render必须被重写，他定义了一个react组件的输出  需要使用内部状态才使用ES6类组件，其余组件使用函数式无状态组件
class App extends Component {
  // 构造函数中初始化组件的状态  
  constructor(props) {
    super(props); // 会在构造函数中设置this.props以供在构造函数中访问他们
    this.state = { //state使用this绑定在类上，整个组件可以访问到,每次修改组件内部状态，render会再次运行
      result: null,  //list:list 属性名变量名相同时简写
      searchTerm: DEFAULT_QUERY, //初始搜索词是空
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this); //类方法 this是类的实例
    this.onSearchChange = this.onSearchChange.bind(this); // 表单搜索
  }
  setSearchTopStories(result) {
    this.setState({result});
  }
  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }
  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }
  onDismiss(id) {
    const isNotId = item => item.objectID !== id; // 判断结果是true保存，返回一个新数组
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      // result:Object.assign({},this.state.result,{hits:updatedHits}) //后面对象会复写先前对象的该属性
      result: {...this.state.result, hits:updatedHits}
    });
  }
  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }
  onClickMe = ()=>{
    console.log(this)
  }
  //  <button onClick={this.onClickMe} type="button">类方法可以通过箭头函数自动绑定</button>
  // 确保列表每个成员的关键字key属性是稳定的标识符，而不是使用不稳定的数组索引，唯一key帮助react识别具体成员的增删改，以提升性能。
  // ES6 箭头函数 省略了函数声明表达式、花括号和返回声明，JSX简洁可读。
  //           注意：普通函数表达式会定义自己的this对象，但箭头函数仍使用包含它的语境下的this对象；
  //           函数只有一个参数时，可以省去括号；
  //           简洁函数体替代块状函数体，简洁函数体的返回不用显示声明，可移除return表达式。
  // 此前在render方法中映射一个在组件外定义静态列表。现在可以在组件中使用state里的list了
  // 增加组件的交互，增加dismiss按钮，使用 this.onDismiss 并不够,因为这个类方法需要接收 item.objectID 属性来识别那个将要被忽略的项,
  // 这就是为什么它需要被封装到另一个函数中来传递这个属性。这个概念在 JavaScript 中被称为高阶函数
  render() {
    console.log(this.state)
    const {searchTerm, result} = this.state;
    if(!result) {return null;}
    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}> Search </Search>
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}/>
        </div>
      </div>
    );
  }
}
const Search = ({value, onChange, children}) => 
  <form>
    {children}<input type="text"
      value={value}
      onChange={onChange}/>
  </form>
const Table = ({list, pattern, onDismiss}) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item=>
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
            Dissmiss
          </Button>
        </span>
      </div>
    )}
  </div>
const Button = ({onClick, className='', children}) =>
  <button 
    onClick = {onClick}
    className = {className}
    type="button">
    {children}
  </button>
export default App;
