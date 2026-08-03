import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequestGet } from '../functions/feedback.js'

const FRAMEWORK_FEEDBACK_URL =
  'https://github.com/Sogody/experiment-framework/issues/new?template=framework-feedback.yml'

test('redirects feedback clicks to the framework issue form without caching', () => {
  const response = onRequestGet()

  assert.equal(response.status, 302)
  assert.equal(response.headers.get('location'), FRAMEWORK_FEEDBACK_URL)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})
