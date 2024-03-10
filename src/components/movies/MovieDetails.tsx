import 'react-responsive-modal/styles.css';
import { options } from '../../components/movies';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import '../movies/details.scss';
import CustomImage from '../../components/Image';
import ModalSkeleton from '../../components/Skeleton/ModalSkeleton';

interface Props {
	id: number;
	isListView: boolean
}

const MovieDetails = ({ id, isListView }: Props) => {
	const notifyError = (text: string) => toast.error(text);

	const fetchMovieDetails = async () => {
		try {
			const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
			return response.json();
		}
		catch ( e ) {
			notifyError((e as Error).message);
			throw new Error((e as Error).message);
		}
	};

	const fetchMovieCredit = async () => {
		try {
			const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options);
			return response.json();
		}
		catch ( e ) {
			notifyError((e as Error).message);
			throw new Error((e as Error).message);
		}
	};

	const {
		isFetching: detailsLoading,
		error: detailsError,
		data: detailsData,
	} = useQuery('details', fetchMovieDetails);
	const {
		isFetching: creditLoading,
		error: creditsError,
		data: creditData,
	} = useQuery('credit', fetchMovieCredit);

	// if ( detailsLoading || creditLoading ) {
	// 	return <Spinner />;
	// }

	if ( detailsError instanceof Error ) {
		return <h1>An error has occurred: {detailsError.message}</h1>;
	}

	if ( creditsError instanceof Error ) {
		return <h1>An error has occurred: {creditsError.message}</h1>;
	}

	return (
		<>
			{
				(detailsLoading || creditLoading)
				? <ModalSkeleton isListView={isListView} />
				:
				<div className={`details ${isListView ? 'details--list-view' : ''}`}>
					<CustomImage
						className="details__backdrop"
						src={`https://image.tmdb.org/t/p/w1280/${detailsData?.backdrop_path}`}
						alt={`${detailsData?.original_title} Poster`}
					/>
					<div className="background"></div>
					<div className="details__content">
						<CustomImage
							className="details__poster"
							src={`https://image.tmdb.org/t/p/w500/${detailsData?.poster_path}`}
							alt={`${detailsData?.original_title} Poster`}
						/>
						<div className="details__info">
							<h3>{detailsData?.original_title}</h3>
							<div className="details__group">
								<div>{detailsData?.release_date}</div>
								<div>{`${Math.floor(detailsData?.runtime / 60)
								         ? Math.floor(detailsData.runtime / 60) + 'h '
								         : ''}${detailsData.runtime % 60 ? detailsData.runtime % 60 + 'm' : ''}`}</div>
								<div>{Math.round(detailsData?.vote_average * 10)}/100</div>
							</div>
							<div><b>Genres:</b> <span>{detailsData?.genres?.map((item: { name: string }) => item?.name)
							                                      .join(', ')}</span></div>
							<div><b>Director: </b>
								<span>{creditData?.crew?.filter((item: { job: string }) => item.job === 'Director')[0]?.name}</span>
							</div>
							<div className="tagline">{detailsData?.tagline}</div>
							<div><b>Overview:</b> {detailsData?.overview}</div>
							<div><b>Cast:</b> {creditData?.cast?.slice(0, 5).map((item: { name: string }) => item?.name).join(', ')}
							</div>
						</div>
					</div>
				</div>
			}
		</>
	);
};

export default MovieDetails;

