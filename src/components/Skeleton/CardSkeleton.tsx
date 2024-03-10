import Skeleton from 'react-loading-skeleton';
import React from 'react';

interface Props {
	count: number;
}

const CardSkeleton: React.FC<Props> = ({ count }: Props) => {
	const array = new Array(count).fill(0);
	return (
		<>
			{
				array.map((_, index: number) => (
					<button disabled={true} className="movie__card movie__card--skeleton" key={index}>
						<Skeleton height={420} />
						<div className="movie__info">
							<Skeleton className="movie__title" height={33} />
							<Skeleton height={15} count={2} />
							<Skeleton height={45} />
						</div>
					</button>
				))
			}
		</>
	);
};

export default CardSkeleton;
