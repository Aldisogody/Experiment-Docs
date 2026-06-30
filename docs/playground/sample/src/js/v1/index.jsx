import { render } from 'preact';
import { mountExperiment, runScript, setupTracking } from 'create-experiment/framework';
import ExperimentButton from '@components/ExperimentButton';
import { buttonText, selectors } from '../../config';
import style from './styles.module.scss';

runScript(async () => {
    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
        className: style.root,
        dataset: { experiment: 'sample' },
    });
    if (!container) return;

    render(<ExperimentButton text={buttonText} />, container);

    setupTracking(container, {
        label: 'sample: v1 button clicked',
        selector: 'button',
    });
});
