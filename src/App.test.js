import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, {Search, Button, Table} from './App';

describe('App', () => {
	it('renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<App />, div);
	  ReactDOM.unmountComponentAtNode(div);
	});
	test('has a valid snapshot', () => {
		const component = renderer.create(
			<App />);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
describe('Search', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Search>Search</Search>, div);
	});
	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Search>Search</Search>
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	})
});
describe('Button', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Button>Button</Button>, div);
	});
	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Button>Button</Button>
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	})
});
describe('Table', () => {
	const props = {
		list: [
		{title: '1', author:'1',num_comments:1,points:2,objectID:'x'}],
	};
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Table {...props}/>, div);
	});
	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Table {...props}/>
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	})
});