<template>
  <figure class="mount-position-diagram" aria-labelledby="mount-position-title" aria-describedby="mount-position-description">
    <figcaption id="mount-position-title">Where the experiment wrapper is inserted</figcaption>

    <div class="mount-position-diagram__stage" aria-hidden="true">
      <div class="mount-position-diagram__slot mount-position-diagram__slot--outer">
        <code>beforebegin</code>
        <span>Before the target</span>
      </div>

      <div class="mount-position-diagram__target">
        <div class="mount-position-diagram__target-label">Matched target element</div>
        <div class="mount-position-diagram__slot">
          <code>afterbegin</code>
          <span>First child</span>
        </div>
        <div class="mount-position-diagram__content">Existing target content</div>
        <div class="mount-position-diagram__slot">
          <code>beforeend</code>
          <span>Last child</span>
        </div>
      </div>

      <div class="mount-position-diagram__slot mount-position-diagram__slot--outer">
        <code>afterend</code>
        <span>After the target</span>
      </div>
    </div>

    <p id="mount-position-description" class="docs-visually-hidden">
      beforebegin inserts the wrapper before the target element. afterbegin inserts it as the target's first child.
      beforeend inserts it as the target's last child. afterend inserts it after the target element.
    </p>
  </figure>
</template>
