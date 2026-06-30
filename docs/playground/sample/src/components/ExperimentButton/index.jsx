import style from './styles.module.scss';

const ExperimentButton = ({ text }) => (
    <button className={style.button} type="button">
        {text}
    </button>
);

export default ExperimentButton;
