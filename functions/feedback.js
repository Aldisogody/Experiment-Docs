const FRAMEWORK_FEEDBACK_URL =
  'https://github.com/Sogody/experiment-framework/issues/new?template=framework-feedback.yml'

export function onRequestGet() {
  return new Response(null, {
    status: 302,
    headers: {
      'Cache-Control': 'no-store',
      Location: FRAMEWORK_FEEDBACK_URL,
    },
  })
}
