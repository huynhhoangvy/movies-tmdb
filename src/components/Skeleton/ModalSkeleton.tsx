import Skeleton from 'react-loading-skeleton';
import './styles.scss';
import React from 'react';

interface Props {
	isListView: boolean;
}

const ModalSkeleton: React.FC<Props> = ({isListView}: Props) => {

	return (
		<div className="details details--skeleton">
			<div className="details__content">
				<Skeleton className="details__poster" width={320} height={480} />
				<div className="details__info">
					<Skeleton className="details__title" height={38} />
					<div className="details__group">
						<Skeleton className="block" height={21} width={80} count={3} inline={true} />
					</div>
					<Skeleton className="block" height={21} count={2} />
					<Skeleton className="block" height={32} />
					<Skeleton className="block" height={64} />
					<Skeleton className="block" height={42} />
				</div>
			</div>
		</div>
	);
};

export default ModalSkeleton;
