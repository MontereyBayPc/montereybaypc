import type { ComponentType } from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome.tsx'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
import { template as trackingLinks } from './tracking-links.tsx'
import { template as reviewRequest } from './review-request.tsx'
import { template as quoteSaved } from './quote-saved.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'tracking-links': trackingLinks,
  'review-request': reviewRequest,
  'quote-saved': quoteSaved,
}
