import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, button, container, h1, main, muted, text } from './tracking-links.tsx'

interface Props { name?: string; buildName?: string; reviewUrl?: string }

const Email = ({ name, buildName, reviewUrl = 'https://www.google.com/maps/search/?api=1&query=Monterey+Bay+PCs' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>How is your new PC running?</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>MONTEREY BAY PCS</Text>
        <Heading style={h1}>How is your new PC running?</Heading>
        <Text style={text}>{name ? `Hi ${name},` : 'Hi there,'} your {buildName || 'PC'} arrived about a week ago. We hope it is running great.</Text>
        <Text style={text}>If you have a minute, an honest Google review helps other local gamers find a builder they can trust.</Text>
        <Button href={reviewUrl} style={button}>Leave a Google review</Button>
        <Text style={muted}>Something not right? Just reply or call (831) 718-7730 and our team will help.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'How is your new PC running?',
  displayName: 'Review request (7 days after delivery)',
  previewData: { name: 'Alex', buildName: 'Custom gaming PC' },
} satisfies TemplateEntry
