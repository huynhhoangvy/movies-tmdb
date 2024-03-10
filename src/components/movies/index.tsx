import { useInfiniteQuery } from 'react-query';
import Item, { IMovie } from '../movies/Item';
import './styles.scss';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner';
import CardSkeleton from '../../components/Skeleton/CardSkeleton';

const API_DOMAIN: string = 'https://api.themoviedb.org/3';

enum EndPoint {
	TOP = '/movie/top_rated?',
	PLAYING = '/movie/now_playing?',
	SEARCH = '/search/movie?include_adult=false&'
}

enum SearchType {
	TOP = 'top',
	PLAYING = 'playing',
	SEARCH = 'search'
}

const SUFFIX: string = 'language=en-US';
const API_TOKEN: string = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjViOWQ2ODkxZjRmMThiZjc2YTMyYmUwODVlYTExNCIsInN1YiI6IjVjZWY3NzNiYzNhMzY4NGU0MzFlMjIxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2P6y-dB4wNui3GGyuEYF4X5AsE8H9kZhj_HxjGipbqw';

// interface MoviesResponse {
// 	page: number;
// 	result: IMovie[];
// 	total_pages: number;
// 	total_results: number;
// }

interface MoviesProps {
	searchTerm?: string;
	type: string;
	listView: boolean;
}

export const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${API_TOKEN}`,
	},
};

const Movies = ({ searchTerm = '', type, listView }: MoviesProps) => {
	let url: string = '';
	const { ref, inView } = useInView();
	const notifyError = (text: string) => toast.error(text);

	switch ( type ) {
		case SearchType.PLAYING:
			url = `${API_DOMAIN}${EndPoint.PLAYING}${SUFFIX}`;
			break;
		case SearchType.TOP:
			url = `${API_DOMAIN}${EndPoint.TOP}${SUFFIX}`;
			break;
		case SearchType.SEARCH:
			url = `${API_DOMAIN}${EndPoint.SEARCH}${SUFFIX}&query=${searchTerm}`;
			break;
		default:
			break;
	}

	const fetchMovies = async ({ pageParam }: { pageParam: number }) => {
		try {
			const response = await fetch(url + `&page=${pageParam}`, options);
			const responseData = await response.json();
			return responseData.results;
		}
		catch ( e ) {
			notifyError((e as Error).message);
			throw new Error((e as Error).message);
		}
	};


	const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
		useInfiniteQuery({
			queryKey: ['movies', searchTerm],
			queryFn: ({ pageParam = 1 }) => fetchMovies({ pageParam }),
			getNextPageParam: (lastPage, allPages) => {
				return lastPage.length ? allPages.length + 1 : undefined;
			},
		});

	const content = data?.pages.map((movies: IMovie[]) => {
		return movies.map((item: IMovie, index: number) => {
			return <Item isListView={listView} key={index} data={item} />;
		});
	});

	useEffect(() => {
		if ( inView && hasNextPage ) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	if ( error instanceof Error ) {
		return <h1>An error has occurred: {error.message}</h1>;
	}

	// const randomNum = Math.floor(Math.random() * 20)
	// const path = data?.pages[0][randomNum]?.backdrop_path

	return (
		<>
			{/*<CustomImage*/}
			{/*	className="app__backdrop"*/}
			{/*	src={`https://image.tmdb.org/t/p/w1280/${path}`}*/}
			{/*	alt='Backdrop'*/}
			{/*/>*/}
			<div className={`movies ${listView ? ' movies--list' : ''}`}>
				{isFetching && !isFetchingNextPage
				 ? <CardSkeleton count={20} />
				 : null
				}
				{content}
			</div>
			{/*{!isFetching && isFetchingNextPage*/}
			{isFetchingNextPage
			 ? <div style={{ textAlign: 'center' }}><Spinner /></div>
			 : <div className="placeholder" ref={ref}></div>
			}
		</>
	);
};

export default Movies;
