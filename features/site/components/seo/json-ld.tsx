type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>
  id?: string
}

// Characters that can break out of a <script> block: `<` `>` `&` and the
// U+2028/U+2029 line/paragraph separators (legal in JSON strings, illegal in raw
// script text). Built from a string literal so the separators stay as escape
// sequences and never appear as raw line terminators in this source file.
const SCRIPT_UNSAFE = new RegExp('[<>&\\u2028\\u2029]', 'g')

/**
 * Escape JSON so it is safe to inline in a <script> tag even if `data` carries
 * CMS/backend/user content.
 */
function escapeJsonForScript(json: string): string {
  return json.replace(SCRIPT_UNSAFE, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'))
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Schema.org JSON-LD must be inlined as a script tag; escape it defensively.
      dangerouslySetInnerHTML={{
        __html: escapeJsonForScript(JSON.stringify(data)),
      }}
    />
  )
}
