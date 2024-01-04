
import styles from './LoadingFullScreen.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function LoadingFullScreen() {
    return (
        <div className={cn('loading')}>
            
        </div>
    );
}