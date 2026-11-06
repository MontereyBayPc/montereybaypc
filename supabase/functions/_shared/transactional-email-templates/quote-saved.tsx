import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, button, container, h1, main, muted, text } from './tracking-links.tsx'

interface Props { buildUrl?: string; total?: number }

const Email = ({ buildUrl = 'https://montereybaypcs.com/quote', total }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your custom PC build is saved</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>MONTEREY BAY PCS</Text>
        <Heading style={h1}>Your build is saved</Heading>
        <Text style={text}>Here is the custom PC you put together{total ? ` (estimate $${Math.round(total).toLocaleString()})` : ''}. Open it anytime to pick up where you left off. Prices refresh to today's parts pricing when you open it.</Text>
        <Button href={buildUrl} style={button}>Open my build</Button>
        <Text style={muted}>Questions about parts? Reply to this email or call (831) 718-7730.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your custom PC build is saved',
  displayName: 'Saved quote link',
  previewData: { total: 1850 },
} satisfies TemplateEntry
