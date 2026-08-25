import { render } from 'preact';
import { mountExperiment, runScript, setupTracking, trackInView } from '@sogody/experiment-framework/framework';
import ExperimentButton from '@components/ExperimentButton';
import { buttonText, selectors } from '../../config';
import { getTrackingLabel } from '../../helpers';
import style from './styles.module.scss';

runScript(async () => {
  const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
    dataset: { experiment: 'sample' },
  });
  if (!container) return;

  render(<ExperimentButton text={buttonText} />, container);

  trackInView(container.querySelector('button'), {
    label: getTrackingLabel('v', 'scrolled into view'),
    onceKey: 'sample:v1:button-impression',
  });

  setupTracking(container, {
    label: getTrackingLabel('v', 'cta clicked'),
    selector: 'button',
  });
});
