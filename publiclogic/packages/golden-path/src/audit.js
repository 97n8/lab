// The closed audit-event FAMILY list — the vocabulary the seal commits.
//
// The Bookend Rule: a closing seal must validate the *family* of every record
// it commits. That is a Repository guarantee, so the thing that seals (this
// runtime) must be the thing that enumerates. `packages/core` in the product
// repo imports this list; it does not declare its own `AuditEventFamily`.
//
// Ordered to match the `audit_events` CHECK constraint (puddlejumper migration
// 001): CHECK (event_family IN ('process','transition','role','auth',
// 'divergence','system')). A closed list is a PROMISE — additions are versioned
// canon changes, never silent. Six today.
//
// Subtypes are deliberately NOT enumerated here. They are open (overlays
// register more at runtime) and unbounded; puddlejumper publishes subtypes
// keyed by family, and its own CI checks that every subtype maps to one of
// THESE families via `isKnownFamily`. The seal needs to know the family; it
// does not need to know the subtype.
export const AUDIT_EVENT_FAMILIES = Object.freeze([
  "process",
  "transition",
  "role",
  "auth",
  "divergence",
  "system",
]);

/**
 * True iff `family` is one of the closed, sealable families. This is the
 * primitive the cross-repo mapping check is built on: puddlejumper's CI asserts
 * `isKnownFamily(familyOf(subtype))` for every declared subtype, so a subtype
 * whose family is not sealable (e.g. a dormant `ai_assist.*`) fails there.
 * @param {string} family
 * @returns {boolean}
 */
export function isKnownFamily(family) {
  return AUDIT_EVENT_FAMILIES.includes(family);
}
