/**
 * Number controls (`control: 'number'`) apply their value on Enter or blur, not on every keystroke.
 *
 * Storybook's built-in number control updates the arg as you type and clamps to `min` straight away,
 * so typing 48 into a field with min 12 turns the "4" into 12 before the "8" arrives. Here, typing
 * edits only the field; on Enter or blur the value is clamped to the input's `min` and `max` and
 * applied. The spinner arrows are hidden.
 *
 * Imported by manager.ts (Controls panel) and preview.tsx (Controls table on docs pages).
 */
const SELECTOR = 'input[type="number"][id^="control-"]'
const COMMIT = Symbol('keel-commit')

type CommitEvent = Event & { [COMMIT]?: true }

const setNativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!

function commit(input: HTMLInputElement) {
  if (input.value.trim() === '') return
  let n = Number(input.value)
  if (Number.isNaN(n)) return
  if (input.min !== '') n = Math.max(Number(input.min), n)
  if (input.max !== '') n = Math.min(Number(input.max), n)
  setNativeValue.call(input, String(n))
  const event: CommitEvent = new Event('input', { bubbles: true })
  event[COMMIT] = true
  input.dispatchEvent(event)
}

export function commitNumberControls(doc: Document = document) {
  const style = doc.createElement('style')
  style.textContent = `
    ${SELECTOR} { -moz-appearance: textfield; appearance: textfield; }
    ${SELECTOR}::-webkit-inner-spin-button,
    ${SELECTOR}::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  `
  doc.head.appendChild(style)

  // Capture phase on window runs before React's listeners on its root, so typing never reaches Storybook.
  const isControl = (t: EventTarget | null): t is HTMLInputElement => t instanceof HTMLInputElement && t.matches(SELECTOR)
  for (const type of ['input', 'change']) {
    doc.defaultView!.addEventListener(
      type,
      (e: CommitEvent) => {
        if (isControl(e.target) && !e[COMMIT]) e.stopImmediatePropagation()
      },
      true,
    )
  }
  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isControl(e.target)) commit(e.target)
  })
  // Capture phase too: Storybook's own blur handler resets the field to the current arg.
  doc.defaultView!.addEventListener(
    'focusout',
    (e) => {
      if (isControl(e.target)) commit(e.target)
    },
    true,
  )
  // Scrolling over a focused field would otherwise change the number by accident.
  doc.addEventListener('wheel', (e) => { if (isControl(e.target) && e.target === doc.activeElement) e.preventDefault() }, { passive: false })
}
