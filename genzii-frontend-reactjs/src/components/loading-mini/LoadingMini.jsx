
import styles from './LoadingMini.module.scss';
import classnames from 'classnames/bind';
const cn = classnames.bind(styles);

export default function LoadingMini() {
    return (
        <div className={cn('loading-mini')}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}