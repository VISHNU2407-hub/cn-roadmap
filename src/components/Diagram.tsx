import type { DiagramKind } from '../types'
import type { ReactNode } from 'react'

interface Props {
  kind: DiagramKind
}

const OSI_LAYERS = [
  ['7 · Application', 'HTTP, SMTP, DNS — user-facing protocols'],
  ['6 · Presentation', 'Format, encoding, encryption (TLS often sits here)'],
  ['5 · Session', 'Dialog setup, management, termination'],
  ['4 · Transport', 'End-to-end delivery · TCP / UDP · ports'],
  ['3 · Network', 'IP addressing · routing between networks'],
  ['2 · Data Link', 'Frames · MAC addressing · Ethernet, switches'],
  ['1 · Physical', 'Bits on the wire, radio, fibre, cabling'],
]

const TCPIP_LAYERS: [string, string, string][] = [
  ['Application', 'HTTP · DNS · SMTP · TLS (OSI 5–7)', 'Session + Presentation + Application'],
  ['Transport', 'TCP · UDP (OSI 4)', 'Transport'],
  ['Internet', 'IP · ICMP (OSI 3)', 'Network'],
  ['Network Access', 'Ethernet · Wi-Fi (OSI 1–2)', 'Data Link + Physical'],
]

function Box({ title, sub, tag, first }: { title: string; sub?: string; tag?: string; first?: boolean }) {
  return (
    <div className={`diagram-box ${first ? 'first' : ''}`}>
      <div>
        <span className="diagram-title">{title}</span>
        {sub && <span className="diagram-sub">{sub}</span>}
      </div>
      {tag && <span className="diagram-tag">{tag}</span>}
    </div>
  )
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="diagram-arrow" aria-hidden="true">
      <span className="diagram-arrow-line" />
      {label && <span className="diagram-arrow-label">{label}</span>}
    </div>
  )
}

export function Diagram({ kind }: Props) {
  const body: ReactNode = (() => {
    switch (kind) {
      case 'osi':
        return OSI_LAYERS.map(([t, s], i) => <Box key={t} title={t} sub={s} first={i === 0} />)
      case 'tcpip':
        return TCPIP_LAYERS.map(([t, s, mapping], i) => (
          <Box key={t} title={t} sub={s} tag={mapping} first={i === 0} />
        ))
      case 'encapsulation':
        return (
          <>
            <Box title="HTTP request" sub="application data" />
            <Arrow label="+ TCP header → segment" />
            <Box title="TCP segment" sub="ports · seq/ack · window" />
            <Arrow label="+ IP header → packet" />
            <Box title="IP packet" sub="source/destination IP · TTL" />
            <Arrow label="+ Ethernet header/trailer → frame" />
            <Box title="Ethernet frame" sub="src/dst MAC · EtherType · FCS" />
            <Arrow label="bits transmitted on the wire" />
            <p className="diagram-note">At each hop the frame is rebuilt, but the IP packet rides unchanged end to end.</p>
          </>
        )
      case 'handshake':
        return (
          <>
            <div className="diagram-seq">
              <div className="diagram-party">Client</div>
              <div className="diagram-line" aria-hidden="true" />
              <div className="diagram-party">Server</div>
            </div>
            <div className="diagram-msg">
              <span className="msg-from-left">1 · SYN — seq = x (random ISN)</span>
            </div>
            <div className="diagram-msg">
              <span className="msg-from-right">2 · SYN-ACK — seq = y · ack = x + 1</span>
            </div>
            <div className="diagram-msg">
              <span className="msg-from-left">3 · ACK — ack = y + 1 (may carry data)</span>
            </div>
            <p className="diagram-note">After step 3 both sides are ESTABLISHED. Random ISNs resist sequence-guessing attacks.</p>
          </>
        )
      case 'termination':
        return (
          <>
            <div className="diagram-seq">
              <div className="diagram-party">Closing side</div>
              <div className="diagram-line" aria-hidden="true" />
              <div className="diagram-party">Peer</div>
            </div>
            <div className="diagram-msg">
              <span className="msg-from-left">1 · FIN — “no more data from me”</span>
            </div>
            <div className="diagram-msg">
              <span className="msg-from-right">2 · ACK — half-close: peer may still send</span>
            </div>
            <div className="diagram-msg">
              <span className="msg-from-right">3 · FIN — peer finished too</span>
            </div>
            <div className="diagram-msg">
              <span className="msg-from-left">4 · ACK — closer enters TIME_WAIT (2×MSL)</span>
            </div>
          </>
        )
      case 'dns':
        return (
          <>
            <Box title="Your device" sub="checks its own DNS cache first" first />
            <Arrow label="1 · query" />
            <Box title="Recursive resolver" sub="your ISP's or 1.1.1.1 / 8.8.8.8 — caches answers" />
            <Arrow label="2 · “where is .com?”" />
            <Box title="Root servers" sub="13 identities, anycast — answer with the TLD servers" />
            <Arrow label="3 · “who serves example.com?”" />
            <Box title="TLD servers (.com)" sub="answer with the zone's authoritative nameservers" />
            <Arrow label="4 · final answer + TTL" />
            <Box title="Authoritative nameserver" sub="holds the real A / AAAA records for the zone" />
          </>
        )
      case 'webflow':
        return (
          <>
            <Box title="1 · Type google.com" sub="browser checks its caches (DNS, HSTS)" first />
            <Arrow label="2 · DNS" />
            <Box title="2 · IP resolved" sub="resolver → root → TLD → authoritative (cached)" />
            <Arrow label="3 · TCP" />
            <Box title="3 · TCP connection" sub="SYN → SYN-ACK → ACK, via routing hops + NAT" />
            <Arrow label="4 · TLS" />
            <Box title="4 · TLS handshake" sub="certificate verified · session keys (TLS 1.3 ≈ 1 RTT)" />
            <Arrow label="5 · HTTP" />
            <Box title="5 · Request & response" sub="GET / → 200 OK + HTML (+ headers, cookies)" />
            <Arrow label="6 · render" />
            <Box title="6 · Page renders" sub="browser fetches JS/CSS/images, builds DOM, paints" />
          </>
        )
    }
  })()

  return (
    <figure className="diagram" aria-label="Concept diagram">
      {body}
      <figcaption className="sr-only">Simplified diagram of {kind}</figcaption>
    </figure>
  )
}
