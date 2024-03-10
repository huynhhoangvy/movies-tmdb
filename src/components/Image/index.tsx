import { useEffect, useRef, useState } from 'react';
import './styles.scss';

interface Props {
	alt: string;
	src: string;
	className?: string;
}

const CustomImage = (props: Props) => {
	const { alt, className, src } = props;
	const imgRef = useRef<HTMLImageElement>(null);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	useEffect(() => {
		let img: HTMLImageElement;
		const handleOnLoad = () => {
			setIsLoaded(true);
		};
		if ( imgRef.current ) {
			const imgEl = imgRef.current;
			const imgSrc = imgEl.getAttribute('src');
			img = new window.Image();
			img.addEventListener('load', handleOnLoad);
			img.src = imgSrc || '';
			return () => {
				img.removeEventListener('load', handleOnLoad);
			};
		}
	}, [src]);

	return (
		<img
			ref={imgRef} {...props}
			className={`${className} image ${isLoaded ? 'image--loaded' : 'image--loading'}`}
			alt={alt}
			loading="lazy"
		/>
	);
};

export default CustomImage;
