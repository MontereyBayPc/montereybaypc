import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props { builds?: { name: string; url: string }[] }

const Email = ({ builds = [] }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your private Monterey Bay PCs build tracking link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>MONTEREY BAY PCS</Text>
        <Heading style={h1}>Your build tracking link</Heading>
        <Text style={text}>You asked for your private tracking link. Open it to see your build stage, workbench photos, and carrier scans.</Text>
        {builds.map((b) => (
          <Section key={b.url} style={{ margin: '20px 0' }}>
            <Text style={label}>{b.name}</Text>
            <Button href={b.url} style={button}>Track my build</Button>
          </Section>
        ))}
        <Text style={muted}>Keep this link private. If you did not request it, you can ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Monterey Bay PCs tracking link',
  displayName: 'Tracking link recovery',
  previewData: { builds: [{ name: 'Custom gaming PC', url: 'https://montereybaypcs.com/build/abc' }] },
} satisfies TemplateEntry

export const main = { backgroundColor: '#ffffff', fontFamily: 'Manrope, Arial, sans-serif' }
export const container = { padding: '32px 28px', maxWidth: '560px' }
export const brand = { fontSize: '12px', letterSpacing: '3px', color: '#f26b1d', fontWeight: 700 }
export const h1 = { fontFamily: 'Sora, Arial, sans-serif', fontSize: '24px', color: '#0a0a0a', margin: '12px 0' }
export const text = { fontSize: '15px', lineHeight: '24px', color: '#333333' }
export const label = { fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 8px' }
export const muted = { fontSize: '12px', color: '#888888', marginTop: '28px' }
export const button = { backgroundColor: '#0a0a0a', color: '#ffffff', borderRadius: '999px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }
