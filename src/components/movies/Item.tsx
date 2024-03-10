import { useState } from 'react';
import Modal from 'react-responsive-modal';
import MovieDetails from '../../components/movies/MovieDetails';
import CustomImage from '../../components/Image';

export interface IMovie {
	release_date: string;
	original_title: string;
	vote_average: number;
	poster_path: string;
	backdrop_path: string;
	id: number;
	overview: string;
}

interface Props {
	data: IMovie;
	isListView: boolean;
}

const Item = ({ data, isListView }: Props) => {
	const { release_date, id, original_title, poster_path, vote_average, overview } = data;

	const [open, setOpen] = useState<boolean>(false);

	const onOpenModal = () => setOpen(true);
	const onCloseModal = () => setOpen(false);

	return (
		<>
			<button className="movie__card" onClick={onOpenModal}>
				<CustomImage
					className="movie__poster"
					src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
					alt={`${original_title} Poster`}
				/>
				<div className="movie__info">
					<h3>{original_title}</h3>
					<div><b>Release Date:</b> {release_date}</div>
					<div><b>Rating:</b> {Math.round(vote_average * 10)}</div>
					<div><b>Overview:</b> {overview}</div>
				</div>
			</button>
			<Modal
				open={open}
				onClose={onCloseModal}
				center
				classNames={{
					overlay: 'custom-overlay',
					modal: 'custom-modal',
					modalContainer: 'custom-container',
				}
				}
			>
				<MovieDetails isListView={isListView} id={id} />
			</Modal>
		</>
	);
};

export default Item;
