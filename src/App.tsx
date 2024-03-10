import React, { useEffect, useState } from 'react';
import './App.scss';
import Movies from './components/movies/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import { ToastContainer } from 'react-toastify';

let timeoutId: NodeJS.Timeout;

const App: React.FC = () => {
	const [tabIndex, setTabIndex] = useState<number>(0);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [debounceValue, setDebounceValue] = useState<string>('');
	const [listView, setListView] = useState<boolean>(false);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleTabChange = (index: number) => {
		setTabIndex(index);
		setSearchTerm('');
	};

	const toggleListView = () => setListView((prev: boolean) => !prev);

	useEffect(() => {
		timeoutId = setTimeout(() => setDebounceValue(searchTerm), 300);
		return () => clearTimeout(timeoutId);
	}, [searchTerm]);


	return (
		<div className="app">
			<h1>Movies List</h1>
			<input className="app__search" type="text" onChange={handleSearchChange} value={searchTerm} />
			<input type="checkbox" name="view" id="viewType" checked={listView} onChange={toggleListView} />
			<label htmlFor="viewType">List View</label>
			{
				debounceValue
				? <>
					<h2>Search result for: {debounceValue}</h2>
					<Movies type={'search'} searchTerm={debounceValue} listView={listView} />
				</>
				:
				<Tabs selectedIndex={tabIndex} onSelect={handleTabChange}>
					<TabList>
						<Tab>Now Playing</Tab>
						<Tab>Top Rated</Tab>
					</TabList>
					<TabPanel>
						<h2>Now Playing</h2>
						<Movies type={'playing'} listView={listView} />
					</TabPanel>
					<TabPanel>
						<h2>Top Rated</h2>
						<Movies type={'top'} listView={listView} />
					</TabPanel>
				</Tabs>
			}
			<ToastContainer autoClose={3000} />
		</div>
	);
};

export default App;
