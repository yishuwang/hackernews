import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import {sortBy} from 'lodash';
import PropTypes from 'prop-types';
import './App.css';

// react拥抱不可变
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};
// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectId: 0 // key属性，列表变化时识别成员状态，提升性能
//   }
// ];
  // 接受searchTerm并返回一个函数，因为所有filter函数都接受一个函数作为它的输入，返回的函数可以访问列表项目对象。返回的函数将根据函数定义的条件对列表进行过滤
  // function isSearched(searchTerm) {
  //   return function (item) {
  //     return item.title.toLowerCase().includes(searchTerm.toLowerCase()); //ES5 str.indexOf(pattern)!==-1
  //   }
  // }
  // ES6 高阶函数 一个函数返回另一个函数
// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
const largeColumn = {width: '40%'};
const midColumn = {width: '30%'};
const smallColumn = {width: '10%'};
// 通过继承类的方式声明组件，公共接口render必须被重写，他定义了一个react组件的输出  需要使用内部状态才使用ES6类组件，其余组件使用函数式无状态组件
class App extends Component {
  // 构造函数中初始化组件的状态  
  constructor(props) {
    super(props); // 会在构造函数中设置this.props以供在构造函数中访问他们
    this.state = { //state使用this绑定在类上，整个组件可以访问到,每次修改组件内部状态，render会再次运行  //list:list 属性名变量名相同时简写
      results: null,  
      searchKey: '', //储存单个result,searchTerm是动态变量，这里需要稳定的变量，保存最近提交给API的关键词，也可以用它检索结果集中的某个结果
      searchTerm: DEFAULT_QUERY, //初始搜索词
      error: null,
      isLoading:false,
      sortKey: 'NONE',
      isSortReverse: false,
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this); // 填充数据
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this); // 抓取数据
    this.onDismiss = this.onDismiss.bind(this); //类方法 this是类的实例
    this.onSearchChange = this.onSearchChange.bind(this); // 表单搜索
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSort = this.onSort.bind(this); //排序
  }
  onSort(sortKey) {
    const isSortReverse = this.state.sortKey == sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse});
  }
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }
  setSearchTopStories(result) {
    const {hits, page} =result;
    const {searchKey, results} = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    // 以搜索词为键名，所有结果储存起来，接下来根据searchKey从resluts集中检索result
    this.setState({
      results: {
        ...results, // 用对象扩展运算符将所有其他包含在results集中的searchKey展开，否则将失去之前所有存储过的results
        [searchKey]: { hits: updatedHits, page} // searchKey(键名，在componentDidMount 和 onSearchSubmit设置的)保存更新后的hits和page 
        // [searchKey]是通过计算得到属性名， 实现动态分配对象的值
      },
      isLoading: false
    });
  }
  fetchSearchTopStories(searchTerm, page=0) {
    this.setState({isLoading: true});
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({error: e}));
  }
  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }
  onDismiss(id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    const isNotId = item => item.objectID !== id; // 判断结果是true保存，返回一个新数组
    const updatedHits = hits.filter(isNotId);
    this.setState({
      // result:Object.assign({},this.state.result,{hits:updatedHits}) //后面对象会复写先前对象的该属性
      // result: {...this.state.result, hits:updatedHits}
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }
  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
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
    const {searchTerm, results, searchKey, error, isLoading, sortKey, isSortReverse} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || []; //节省Table组件的条件渲染，没有结果就得到空列表 且传给More用searchTerm
    // if(!result) {return null;}
    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}> Search </Search>
          {error
          ? <div className="interactions">
              <p>出错了</p>
            </div>
          : <Table
              list={list}
              sortKey={sortKey}
              isSortReverse={isSortReverse}
              onSort={this.onSort}
              onDismiss={this.onDismiss}
            />
          }
          <div className="interactions">
            <ButtonWithLoading
              isLoading={isLoading}
              onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                More
            </ButtonWithLoading> 
          </div>
        </div>
      </div>
    );
  }
}
// ES6 this对象可通过ref引用DOM节点
class Search extends Component {
  componentDidMount() {
    if(this.input) {
      this.input.focus();
    }
  }
  render() {
    const {value, onChange, onSubmit, children} = this.props;
    return (
      <form onSubmit={onSubmit}>
      <input type="text"
        value={value}
        onChange={onChange}
        ref={(node) => {this.input = node;}}
      />
        <button type="submit"> {children} </button>
      </form>
    )
  }
}
 
const Table = ({list, sortKey,isSortReverse ,onSort, onDismiss}) =>{
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;
  return (
  <div className="table">
    <div className="table-header">
      <span style={{ width: '40%' }}>
        <Sort
          sortKey={'TITLE'}
          onSort={onSort}
          activeSortKey={sortKey}
        > Title
        </Sort>
      </span>
      <span style={{ width: '30%' }}>
        <Sort
          sortKey={'AUTHOR'}
          onSort={onSort}
          activeSortKey={sortKey}
        >
          Author
        </Sort>
      </span>
      <span style={{ width: '10%' }}>
        <Sort
          sortKey={'COMMENTS'}
          onSort={onSort}
          activeSortKey={sortKey}
        > Comments
        </Sort>
      </span>
      <span style={{ width: '10%' }}>
        <Sort
          sortKey={'POINTS'}
          onSort={onSort}
          activeSortKey={sortKey}
        >
          Points
        </Sort>
      </span>
      <span style={{ width: '10%' }}>
        Archive
      </span>
    </div>
    {reverseSortedList.map(item=>
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
  );
}
  Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func,
};
const Button = ({onClick, className, children}) =>
  <button 
    onClick = {onClick}
    className = {className}
    type="button">
    {children}
  </button>
  Button.defaultProps = {
    className: '',
  };
  Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
const Sort = ({sortKey,activeSortKey,onSort,children}) => {
  const sortClass = ['button-inline'];
  if(sortKey === activeSortKey) {
    sortClass.push('button-active');
  }
  return (
  <Button onClick={()=>onSort(sortKey)}
      className={sortClass.join(' ')}>
    {children}
  </Button> ); 
}
const Loading = () => 
  <div>Loading...</div>
  // with前缀命名HOC 条件渲染
const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading
  ?<Loading/>
  :<Component {...rest}/>
const ButtonWithLoading = withLoading(Button);
// function withFoo = (Component) => (props) =>
//   <Component {...props} />
export default App;
export {
  Button,
  Search,
  Table
};
