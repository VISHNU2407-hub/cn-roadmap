import type { Lesson } from '../types'

export const LESSONS_PART2: Lesson[] = [
  // ------------------------------------------------ WEEK 3
  {
    id: 15,
    week: 3,
    topic: 'IPv4 and private/public IPs',
    category: 'IP & Routing',
    objective: 'Identify IPv4 structure and common address types: public, private, loopback, broadcast.',
    subtopics: [
      'IPv4 structure: 32 bits, octets, network vs host part',
      'Private ranges (RFC 1918), loopback, APIPA',
      'Public vs private and why NAT bridges them',
    ],
    checklist: [
      'Explain the 32-bit / dotted-decimal structure',
      'Recall the three private ranges from memory',
      'Explain loopback 127.0.0.1 and 0.0.0.0',
      'Explain why we ran out of IPv4 and how NAT helps',
      'Recognize an address type on sight',
    ],
    summary:
      'An IPv4 address is a 32-bit number written as four decimal octets (192.168.10.42). A subnet mask splits it into a network part (which network you belong to) and a host part (your identity within it). Addresses were once grouped into classes (A/B/C with fixed masks) but that system was abandoned for classless addressing (CIDR, next lesson).\n\nSpecial address families: private (RFC 1918) addresses — 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — are not routable on the public Internet and are reused freely inside homes/enterprises; NAT translates them to a public address for outbound traffic. Loopback 127.0.0.1 (whole 127.0.0.0/8) routes packets back to the same host for testing the TCP/IP stack. 0.0.0.0 means “all interfaces / unspecified” (used by servers binding; as a default route target it means “any network”). Link-local/APIPA 169.254.0.0/16 is self-assigned when DHCP fails. Broadcast: the all-ones host address of a subnet; the legacy global broadcast 255.255.255.255 is used by DHCP Discover.\n\nIPv4 has only ~4.3 billion addresses, and it ran out (IANA exhaustion 2011). Responses: NAT sharing one public IP among many private hosts, CIDR allocation efficiency, address markets, and long-term IPv6 (128-bit addresses, e.g. 2001:db8::1, with 2^128 space).',
    terms: [
      { term: 'Private address', def: 'RFC 1918 range not routable on the Internet; must be NATed to reach public hosts.' },
      { term: 'Loopback', def: '127.0.0.0/8 — traffic to your own host, bypassing the physical network; tests the local TCP/IP stack.' },
      { term: 'APIPA / link-local', def: '169.254.0.0/16 self-assigned address when DHCP is unavailable; hosts can only talk within the same link.' },
      { term: 'NAT', def: 'Network Address Translation — rewrites addresses/ports so many private hosts share one public IP.' },
    ],
    questions: [
      {
        q: 'What are the RFC 1918 private address ranges?',
        a: '10.0.0.0/8 (10.x.x.x), 172.16.0.0/12 (172.16.x.x – 172.31.x.x), 192.168.0.0/16 (192.168.x.x). They are reused inside organizations and never routed on the public Internet.',
        topic: 'IP & Routing',
      },
      {
        q: 'What is the loopback address and what is it used for?',
        a: '127.0.0.1 (the range 127.0.0.0/8) — traffic immediately returns to the local host without touching any physical link. Used to test the TCP/IP stack and to run local services (dev servers) addressable as “localhost”. Ping to 127.0.0.1 failing suggests a broken local network stack.',
        topic: 'IP & Routing',
      },
      {
        q: 'Why did IPv4 run out of addresses and what mitigates it today?',
        a: 'Only 2^32 (~4.3 billion) addresses for far more devices, wasted by classful allocation, and growing device counts. Mitigations: NAT (many private hosts share few public IPs), CIDR allocations, IPv6 adoption (128-bit space), and reuse/reclaim of allocated blocks.',
        topic: 'IP & Routing',
      },
      {
        q: 'Your machine shows an address starting 169.254.x.x. What does that mean?',
        a: 'APIPA/link-local self-assigned address: DHCP failed (no server, cable issue). The host can communicate only with other link-local hosts on the same segment; troubleshoot DHCP/network connectivity.',
        topic: 'IP & Routing',
      },
    ],
  },
  {
    id: 16,
    week: 3,
    topic: 'Subnetting and CIDR',
    category: 'IP & Routing',
    objective: 'Solve beginner-level subnetting questions: masks, prefixes, host ranges.',
    subtopics: [
      'CIDR notation and subnet masks',
      'Network, broadcast, usable host range',
      'Worked example calculations',
    ],
    checklist: [
      'Convert /24, /26 etc. to dotted masks',
      'Compute network and broadcast address of a subnet',
      'Count usable hosts: 2^host_bits − 2',
      'Do one worked /26 example on paper',
      'Explain why every subnet needs a router gateway',
    ],
    summary:
      'CIDR expresses the prefix length as /n: how many leading bits are the network part. /24 = mask 255.255.255.0 (24 network bits, 8 host bits). Formulae: total hosts = 2^(32−n); usable = 2^(32−n) − 2 (network and broadcast addresses are reserved). The network address has host bits all 0; broadcast has all 1s.\n\nWorked example: 192.168.1.64/26. Mask = 255.255.255.192; the block size in the last octet is 256 − 192 = 64, so subnets of the last octet start at 0, 64, 128, 192 — .64 is therefore a network address itself; usable range .65–.126 (62 hosts), broadcast .127. Next example: 10.1.1.130/28 → block size 16 → subnets …128, 144… so network = 10.1.1.128, broadcast = .143, usable .129–.142 (14 hosts).\n\nIn practice: every subnet has one router interface as its default gateway; hosts route anything outside their subnet to that gateway. Companies subnet by department/rack/team to limit broadcast domains and control access. Devs get asked: “Given 192.168.1.0/24, split into 4 equal subnets” → borrow 2 bits → /26 networks .0, .64, .128, .192.',
    terms: [
      { term: 'Prefix length /n', def: 'Number of leading network bits in CIDR (/24 = mask 255.255.255.0).' },
      { term: 'Block size', def: 'Last octet step between subnets: 256 − mask value (e.g. /26 → 64).' },
      { term: 'Usable hosts', def: '2^(32−n) − 2: total minus network and broadcast addresses.' },
      { term: 'VLSM', def: 'Variable-Length Subnet Masking — different subnet sizes within one network for efficiency.' },
    ],
    questions: [
      {
        q: 'Given 192.168.1.0/24, split it into four equal subnets. What are they?',
        a: 'Borrow 2 host bits → /26. Subnets: 192.168.1.0/26, .64/26, .128/26, .192/26 — each has 62 usable hosts (2^6 − 2), ranges like .1–.62 with broadcast .63.',
        topic: 'IP & Routing',
      },
      {
        q: 'For 192.168.1.64/26, state mask, network address, broadcast address and usable range.',
        a: 'Mask 255.255.255.192. Block size 64 → networks at .0, .64, .128, .192, so .64 is the network address; broadcast = .127; usable = .65–.126 (62 hosts).',
        topic: 'IP & Routing',
      },
      {
        q: 'How many usable hosts does a /28 subnet have? And a /30?',
        a: '/28 leaves 4 host bits → 16 − 2 = 14 usable. /30 leaves 2 bits → 4 − 2 = 2 usable — ideal for point-to-point router links (and why /31 and /127 exist for modern links).',
        topic: 'IP & Routing',
      },
      {
        q: 'What does the subnet mask actually tell a host when it sends a packet?',
        a: 'It lets the host decide destination locality: AND the destination with the mask — if the result equals its own network address, deliver directly on the link (ARP + send); otherwise send to the default gateway. Subnetting is what makes that decision possible.',
        topic: 'IP & Routing',
      },
    ],
  },
  {
    id: 17,
    week: 3,
    topic: 'ARP, NAT and DHCP',
    category: 'IP & Routing',
    objective: 'Explain how devices join a network and reach external networks (ARP, NAT, DHCP).',
    subtopics: [
      'ARP: resolving IP → MAC on a LAN',
      'NAT: how many private hosts share one public IP',
      'DHCP: dynamic address assignment',
    ],
    checklist: [
      'Explain ARP request/reply and the ARP cache',
      'Walk a packet through NAT outbound and inbound',
      'Explain port address translation (PAT)',
      'Describe DORA again and lease renewal',
      'Explain why private IPs need NAT to reach the Internet',
    ],
    summary:
      'ARP answers “who has this IP on this LAN?” — the host broadcasts an ARP Request (to FF:FF:FF:FF:FF:FF) carrying the target IP; the matching host replies with its MAC (unicast). Both sides cache the mapping in the ARP table (entries expire in minutes) so repeat traffic skips the broadcast. That is the glue between the IP layer and the Ethernet layer at every hop.\n\nNAT (specifically NAPT/PAT — the home-router kind) lets many private hosts share one public IP. Outbound: router translates source (192.168.1.20:51000 → 203.0.113.5:40001) and records the mapping in its NAT table. Return traffic to 203.0.113.5:40001 is translated back to 192.168.1.20:51000. This works because each private connection’s 4-tuple is unique. Consequence: outside hosts cannot initiate connections to private hosts — you need port forwarding, UPnP, or a reverse proxy/relay. It also breaks some protocols that embed IP addresses in payloads (legacy FTP, SIP).\n\nDHCP (day 14) assigns the IP config; note the interplay: DHCP gives the host its address, mask, gateway and DNS; the host then uses ARP to reach the gateway and NAT (at the gateway) to reach the Internet.',
    terms: [
      { term: 'ARP cache', def: 'Per-host table of IP→MAC mappings learned from ARP replies, with timeouts.' },
      { term: 'PAT / NAPT', def: 'Port-based NAT: rewrites IP+port pairs so one public IP serves many private hosts.' },
      { term: 'Port forwarding', def: 'Static NAT rule sending an external port to an internal host:port.' },
      { term: 'Default gateway', def: 'The router address a host uses for destinations outside its own subnet.' },
    ],
    questions: [
      {
        q: 'Explain what ARP does and when it is used.',
        a: 'ARP maps an IPv4 address to a MAC address on the local link. Before sending to a neighbour IP, the host broadcasts “who has 192.168.1.1?”; the owner replies with its MAC; both cache the answer. It is needed at every hop where a packet is handed to the next router or final host.',
        topic: 'IP & Routing',
      },
      {
        q: 'How does NAT allow 50 devices to share one public IP?',
        a: 'The router performs port address translation: each outgoing flow is rewritten to a unique public port and recorded in a NAT table (internal IP:port ↔ public IP:port). Replies are matched back to the originating host. It provides implicit firewalling — unsolicited inbound traffic has no table entry and is dropped unless port-forwarding is configured.',
        topic: 'IP & Routing',
      },
      {
        q: 'Walk a web request from a private host through NAT to a public server.',
        a: 'Host 192.168.1.20:51000 → server 93.184.216.34:443. router sees destination outside subnet → forwards. Router NATs source to 203.0.113.5:40001, records mapping, sends out. Server replies to 203.0.113.5:40001; router looks up 40001 → rewrote back to 192.168.1.20:51000 and delivers inside.',
        topic: 'IP & Routing',
      },
      {
        q: 'What are the DHCP message steps (DORA)?',
        a: 'Discover (client broadcasts, no address yet) → Offer (server proposes address + options) → Request (client formally asks for one offer) → Acknowledge (server confirms, lease timer starts). When 50% of the lease passes the client tries to renew with the DHCP server unicast.',
        topic: 'IP & Routing',
      },
    ],
  },
  {
    id: 18,
    week: 3,
    topic: 'Routing and forwarding',
    category: 'IP & Routing',
    objective: 'Explain how packets travel between networks: routing tables, next hops, default routes.',
    subtopics: [
      'Routing tables and longest prefix match',
      'Next hop, default gateway, default route',
      'How routers pick routes (static vs dynamic)',
    ],
    checklist: [
      'Read a routing table and pick the matching route',
      'Explain longest-prefix-match with an example',
      'Explain the default route 0.0.0.0/0',
      'Contrast static vs dynamic routing',
      'Describe TTL’s role in preventing loops',
    ],
    summary:
      'A router forwards packets hop-by-hop. For each packet it looks up the destination IP in its routing table and picks the matching entry with the longest prefix (most specific route wins: a /24 beats a /16 beats the default 0.0.0.0/0). The table says “for this network range, send to this next-hop IP via this interface”. The router rewrites the frame’s MAC addresses (its own, then the next-hop — after ARP) but keeps the IP header untouched, decrementing TTL; TTL=0 → packet discarded (ICMP Time Exceeded) — that is what traceroute measures.\n\nHosts behave like tiny routers: their table has the directly connected subnets plus a default route (the gateway). Windows `route print`, Linux `ip route`, macOS `netstat -rn`.\n\nRoutes come from two sources: static (admin-configured, predictable, manual maintenance) and dynamic (routing protocols exchanging network reachability automatically: OSPF link-state within an AS, BGP path-vector between ASes on the Internet, RIP distance-vector legacy). Interview framing: routers maintain reachability info, switches forward frames inside a segment, and BGP is the glue holding the Internet’s ASes together.',
    terms: [
      { term: 'Next hop', def: 'The immediate neighbour (router) that should receive the packet next on the path.' },
      { term: 'Longest prefix match', def: 'Algorithm that selects the routing-table entry with the most specific matching prefix.' },
      { term: 'Default route', def: '0.0.0.0/0 catch-all entry, normally pointing at your gateway/ISP.' },
      { term: 'AS / BGP', def: 'Autonomous System — a routed domain under one operator; BGP exchanges reachability between ASes.' },
      { term: 'TTL', def: 'Time To Live — decremented per hop, at 0 the packet is dropped (ICMP Time Exceeded); prevents infinite loops.' },
    ],
    questions: [
      {
        q: 'How does a router decide where to forward a packet?',
        a: 'It consults the routing table for the destination IP, chooses the longest matching prefix (most specific route), and forwards to that entry’s next hop out the listed interface, rewriting the frame MACs (via ARP) and decrementing TTL. If nothing matches except the default route, the packet goes to the gateway.',
        topic: 'IP & Routing',
      },
      {
        q: 'What is the default route and where would you find it?',
        a: '0.0.0.0/0 — the catch-all for destinations with no more specific route. Hosts point it at their local gateway; enterprise edge routers point it at the provider. Inspect it with `ip route` (Linux), `route print` (Windows), `netstat -rn` (macOS).',
        topic: 'IP & Routing',
      },
      {
        q: 'Static vs dynamic routing: when do you use each?',
        a: 'Static routes are hand-configured — predictable, no protocol overhead, good for small networks or fixed exits. Dynamic protocols (OSPF inside an AS, BGP between ASes) learn and adapt routes automatically, re-converging around failures; mandatory at Internet scale where thousands of changes occur. Most real networks combine both.',
        topic: 'IP & Routing',
      },
      {
        q: 'What does tracert/traceroute show and why does it work?',
        a: 'It sends packets with increasing TTLs (1, 2, 3…). Each hop that expires the TTL returns an ICMP Time Exceeded message revealing its address, until the destination replies. This traces the path and exposes latency per hop. (Some hops hide/deprioritize ICMP and show asterisks.)',
        topic: 'IP & Routing',
      },
    ],
  },
  {
    id: 19,
    week: 3,
    topic: 'Switching and Ethernet',
    category: 'Fundamentals',
    objective: 'Explain how switches forward frames and distinguish collision vs broadcast domains.',
    subtopics: [
      'Ethernet frames and MAC learning',
      'Forwarding, flooding, filtering decisions',
      'Collision domains vs broadcast domains',
    ],
    checklist: [
      'Describe an Ethernet frame\'s key fields',
      'Explain MAC table learning and aging',
      'Contrast flooding vs forwarding vs filtering',
      'Count collision and broadcast domains in a small topology',
      'Explain VLANs as separated broadcast domains',
    ],
    summary:
      'An Ethernet frame is the link-layer unit: destination MAC (6 B), source MAC (6 B), EtherType (which protocol, e.g. 0x0800 IPv4), payload, and a 4-byte FCS (CRC) for error detection (corrupt frames are dropped, not retransmitted — a link is assumed reliable, error recovery is upper-layer work). Switches inspect frames and build the MAC address table mapping MAC → port.\n\nSwitch behaviour: destination known → forward out exactly one port (forwarding); destination unknown or broadcast/multicast → out all other ports in the VLAN (flooding); source and destination on the same port → drop/filter to save bandwidth. Frames are forwarded at wire speed in hardware using CAM/TCAM tables; entries age out (typically 300 s).\n\nDomains: all ports of a non-managed switch live in one broadcast domain (one VLAN); every separate port is its own collision domain because full-duplex point-to-point links never collide. Routers and VLANs terminate broadcast domains. VLAN (802.1Q) labels frames with tags so one physical switch can host several logically isolated broadcast domains — the standard way to segment a LAN without adding more switches.',
    terms: [
      { term: 'FCS', def: 'Frame Check Sequence — CRC protecting frame integrity; corrupt frames are silently dropped.' },
      { term: 'CAM table', def: 'Hardware MAC address table consulted for every frame forwarding decision.' },
      { term: 'VLAN', def: 'Virtual LAN — tags frames so distinct broadcast domains share one physical switch infrastructure.' },
      { term: 'EtherType', def: 'Frame field identifying the encapsulated protocol (IPv4/IPv6/ARP…).' },
    ],
    questions: [
      {
        q: 'How does a switch decide where to send a frame?',
        a: 'On arrival it learns the source MAC → port and refreshes the entry’s age. It then looks up the destination MAC: known → forward out that one port; unknown/broadcast → flood out all other ports in the VLAN; same-port → filter. Full-duplex links per port eliminate collisions.',
        topic: 'Fundamentals',
      },
      {
        q: 'Collision domain vs broadcast domain with a concrete topology.',
        a: 'Two hosts and a hub → 1 collision domain (shared medium). Replace hub with a switch → each port is its own collision domain (full duplex). Both hub and switch topologies remain 1 broadcast domain unless segmented by VLANs or a router. Router ports always separate broadcast domains.',
        topic: 'Fundamentals',
      },
      {
        q: 'What problem do VLANs solve and how do they do it?',
        a: 'They isolate broadcast/security domains on shared hardware: 802.1Q tags frames with a VLAN ID, and a switch restricts flooding/forwarding to ports of the same VLAN; routing (L3 switch/firewall) is needed to communicate between VLANs. Result: segmentation (accounting vs guest Wi-Fi) without extra switches.',
        topic: 'Fundamentals',
      },
      {
        q: 'If the link corrupts a frame, who retransmits it?',
        a: 'Nobody on that link — Ethernet only detects via FCS and drops the frame. Reliability is upper-layer: TCP notices the missing data through missing ACKs and retransmits. Ethernet’s design assumes links error rarely and leaves loss recovery to endpoints.',
        topic: 'Fundamentals',
      },
    ],
  },
  {
    id: 20,
    week: 3,
    topic: 'TLS and network security',
    category: 'Security',
    objective: 'Explain the purpose of HTTPS security: certificates, trust, encryption, firewalls.',
    subtopics: [
      'Certificates, CAs and the chain of trust',
      'TLS handshake and symmetric session keys',
      'Firewalls and Defence in depth',
    ],
    checklist: [
      'Explain what a certificate proves and how it’s validated',
      'Sketch the TLS 1.3 handshake w/ key exchange',
      'Explain confidentiality/integrity/authentication trio',
      'Describe what a firewall inspects and where it sits',
      'Know what TLS does NOT protect (metadata, endpoints)',
    ],
    summary:
      'HTTPS = TLS. The client learns the server’s certificate during the handshake: an X.509 document binding a public key to a domain, signed by a Certificate Authority (CA). Browsers ship a store of trusted root CAs; the presented chain (leaf → intermediate → root) plus hostname match, validity dates, and revocation status (CRL/OCSP) are verified. This prevents man-in-the-middle attacks — an attacker cannot forge a certificate for example.com without a CA signing key.\n\nKey exchange (TLS 1.3, typically ECDHE) gives both sides a shared secret without sending it; Perfect Forward Secrecy means session keys are session-ephemeral, so later key compromise does not decrypt old traffic. All subsequent data is encrypted and authenticated with fast symmetric AEAD ciphers (AES-GCM, ChaCha20-Poly1305). It guarantees confidentiality + integrity + server authentication. SNI leaks the hostname pre-encryption; ECH (Encrypted Client Hello) addresses this. HSTS forces browsers to use HTTPS; mTLS extends authentication to clients (used by APIs).',
    terms: [
      { term: 'CA / X.509', def: 'Trusted authority signing certificates; the X.509 format binds identity (domain) to a public key.' },
      { term: 'PFS', def: 'Perfect Forward Secrecy — ephemeral key exchange so future key compromise doesn’t decrypt past sessions.' },
      { term: 'AEAD', def: 'Authenticated Encryption with Associated Data — cipher providing confidentiality + integrity together (AES-GCM).' },
      { term: 'mTLS', def: 'Mutual TLS — both client and server present certificates, common for service-to-service auth.' },
    ],
    questions: [
      {
        q: 'What does a TLS certificate actually prove, and how does the client verify it?',
        a: 'It binds a public key to a domain name, signed by a CA the client already trusts. The client verifies the chain to a root in its trust store, the hostname (SAN) matches, the current date falls in validity, and it isn’t revoked. Bypassing this (self-signed / expired / wrong-host) triggers browser warnings for a reason.',
        topic: 'Security',
      },
      {
        q: 'Simplify the TLS 1.3 handshake and say what is protected first.',
        a: 'ClientHello (supported ciphers, key share) → ServerHello + certificate + Finished → client Finished + first application data: roughly one round trip before encrypted data. Key exchange (ECDHE) derives session keys without transmitting them; afterwards AEAD ciphers protect content. TLS 1.2 needed two round trips.',
        topic: 'Security',
      },
      {
        q: 'What does HTTPS NOT protect against?',
        a: 'It protects data in transit only. Metadata leaks: destination IP, DNS-visible hostname (unless DoH/DoT+ECH), SNI, traffic-size/timing patterns. Endpoints: malware on either side, credential phishing, weak server-side handling. And it says nothing about the content’s correctness — a compromised server can still send malicious “valid” responses.',
        topic: 'Security',
      },
      {
        q: 'What is a firewall and where does it sit?',
        a: 'A device/software that filters traffic by rules (IPs, ports, protocols, directions, state). Perimeter firewalls sit between internal and external networks; host firewalls control per-machine; next-gen firewalls inspect applications (deep packet inspection) and identify users. Firewalls complement TLS — traffic can be inspected before encryption starts (or the organization terminates TLS at a proxy to inspect).',
        topic: 'Security',
      },
    ],
  },
  {
    id: 21,
    week: 3,
    topic: 'What happens when you type google.com?',
    category: 'Revision',
    objective: 'Deliver a clear, structured end-to-end interview answer from typing to rendering.',
    subtopics: [
      'DNS resolution chain',
      'TCP + TLS connection',
      'HTTP request, server processing, render',
    ],
    checklist: [
      'Recite the flow aloud in under two minutes',
      'Name every protocol as it appears',
      'Explain where ARP/NAT/routing fit',
      'Weave in weeks-1-and-2 details naturally',
      'Practise with follow-up questions (quiz below)',
    ],
    summary:
      'The canonical interview answer, in order: (1) Browser parses the URL and checks its caches (HSTS list, DNS cache, service worker). (2) DNS: OS resolver → recursive resolver (8.8.8.8 etc.) → root → .com TLD → google.com authoritative servers → A/AAAA record (cached per TTL). (3) The browser opens a TCP connection to that IP: 3-way handshake, SYN → SYN-ACK → ACK, possibly through NAT at the home router which translated the source address/port. (4) TLS handshake: certificate verification and key exchange (TLS 1.3 ≈ 1 RTT). (5) HTTP: browser sends GET / with headers (Host, cookies, User-Agent); server picks a backend, runs app logic, returns 200 + HTML (or 301/304). (6) Browser parses HTML, discovers resources, repeats for CSS/JS/images (HTTP/2 multiplexes them on the one connection), builds DOM/CSSOM, renders the page, fetching more data via XHR/fetch.\n\nInterviewers look for the structured skeleton (DNS → TCP → TLS → HTTP) plus one or two levels of depth on any part: ARP resolving the gateway MAC, routing tables carrying each hop, TIME_WAIT when the connection closes, HTTP/3 replacing TCP+TLS with QUIC. The strong move: state the skeleton, then say “happy to go deeper on any step”.',
    terms: [
      { term: 'Round trip', def: 'One request-and-response across the network; latency multiplies RTTs — why TLS 1.3 and HTTP/3 matter.' },
      { term: 'DOM/CSSOM', def: 'In-memory object models of HTML and CSS the renderer builds and combines into the paint tree.' },
    ],
    questions: [
      {
        q: 'Give the structured version of “what happens when you type google.com” in two minutes.',
        a: 'URL parsing → DNS (cache, recursive resolver, root/TLD/authoritative) → TCP connection (3-way handshake via routing and NAT) → TLS handshake (cert chain + key exchange) → HTTP request/response with the server → rendering (HTML parse, subresource fetches, paint) — and mention HTTP/2 multiplexing or HTTP/3/QUIC as the modern transport. Then offer depth on any step.',
        topic: 'Revision',
      },
      {
        q: 'In that flow, which steps involve broadcast traffic?',
        a: 'ARP requests to resolve the default gateway’s MAC (and the DHCP Discover if the host had no address). DNS to the resolver is unicast (already configured); the resolver’s root/TLD queries are unicast too.',
        topic: 'Revision',
      },
      {
        q: 'Where could things fail at each layer?',
        a: 'No DHCP/APIPA (link-local) → no gateway; ARP fails → link problem; no route/default gateway → “host unreachable”; TCP handshake fails → server down/firewall; TLS warning → cert/CA/clock issue; HTTP 5xx → server app failing; page loads but no styles → CDN blocked. Layered debugging is exactly why OSI is a diagnostic tool.',
        topic: 'Revision',
      },
    ],
    diagram: 'webflow',
  },

  // ------------------------------------------------ WEEK 4
  {
    id: 22,
    week: 4,
    topic: 'Revision: OSI, TCP/IP and devices',
    category: 'Revision',
    objective: 'Sharpen layer-based answers and device comparisons.',
    subtopics: [
      'Redraw OSI and TCP/IP mappings from memory',
      'Compare hub / switch / router / L3 switch',
      'Layer-based interview questions drill',
    ],
    checklist: [
      'Redraw the two stacks and map them',
      'Re-derive the encapsulation flow',
      'Do the 6-question drill below',
      'Re-explain hub vs switch vs router aloud',
      'Note remaining confusion in Notes',
    ],
    summary:
      'Week-4 drill day. Spend 35 minutes re-testing yourself: draw the OSI and TCP/IP stacks side by side, map each real protocol onto them, and re-explain the PDU names. Then run the 6-question drill below from memory and read the model answers for calibration.',
    terms: [
      { term: 'L3 switch', def: 'A switch that also routes between VLANs — combines L2 switching with L3 routing in hardware.' },
    ],
    questions: [
      {
        q: 'Quiz day — use the 6-question drill in the activity section below.',
        a: 'The drill covers layer responsibilities, device layers, PDU names, and scenario-based layer identification.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'Which OSI layer is responsible for routing, and what device works there?',
        a: 'Network layer (L3) — routers (and L3 switches) forward packets between networks using IP addresses and routing tables.',
        topic: 'Fundamentals',
      },
      {
        q: 'A user says “the internet is slow”. Which layers would you check, in order?',
        a: 'Physical (cable/Wi-Fi signal), Data link (duplex/errors), Network (routes, DNS), Transport (retransmissions, window/app limits), then server/app. Isolate bottom-up or top-down but methodically, one layer at a time.',
        topic: 'Fundamentals',
      },
      {
        q: 'What is the PDU at the data link layer and the network layer?',
        a: 'Frame (data link) and packet (network). Transport = segment.',
        topic: 'Fundamentals',
      },
      {
        q: 'Why is a switch considered more secure than a hub?',
        a: 'A hub broadcasts every bit to all ports so any host sees all traffic; a switch unicasts to the destination port, limiting exposure (plus VLANs add segmentation).',
        topic: 'Fundamentals',
      },
      {
        q: 'Which layer does TLS belong to (and why is the placement debated)?',
        a: 'Usually mapped to Presentation in OSI terms (encryption/serialization), but TLS sits between transport and application in real stacks — a good “it depends on the model” answer.',
        topic: 'Fundamentals',
      },
      {
        q: 'A new device joins a Wi-Fi network. Which layer-2 process happens first?',
        a: 'Association/auth with the AP (Wi-Fi link layer), then DHCP Discover broadcast at L2 (before it has an IP), then ARP for the gateway.',
        topic: 'Fundamentals',
      },
    ],
  },
  {
    id: 23,
    week: 4,
    topic: 'Revision: TCP, UDP and handshakes',
    category: 'Revision',
    objective: 'Drill connection establishment/termination and reliability concepts.',
    subtopics: [
      'Redraw handshake + teardown from memory',
      'Explain reliability, flow vs congestion control',
      'TCP/UDP comparison drill',
    ],
    checklist: [
      'Draw handshake AND teardown on paper',
      'Recite slow start / AIMD in 3 sentences',
      'Do the 6-question drill below',
      'Re-explain rwnd vs cwnd vs window size',
      'Note remaining confusion in Notes',
    ],
    summary:
      'Rewrite both message sequences from memory — they are the most-tested diagrams in CN interviews. Then run the drill below. If any answer surprises you, revisit the original day (8–12) before moving on.',
    terms: [
      { term: 'Drill', def: 'Short, repeated self-testing on the same core questions — the highest-yield study for interviews.' },
    ],
    questions: [
      {
        q: 'Quiz day — use the 6-question drill in the activity section below.',
        a: 'The drill compares TCP vs UDP, handshake and teardown sequences, reliability mechanisms, and flow vs congestion control.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'Which applications use UDP and why? Give 3.',
        a: 'DNS (single small query, fast), VoIP/video (latency-sensitive, tolerate loss), online gaming (state updates obsolete quickly). All monetize low latency over guaranteed delivery, or retransmit at the app level when needed.',
        topic: 'Transport',
      },
      {
        q: 'Explain the TCP handshake with actual flag names and sequence semantics.',
        a: 'SYN(ISN=x) → SYN+ACK(ISN=y, ack=x+1) → ACK(ack=y+1). Random ISNs resist spoofing; the third ACK confirms the client received the server’s ISN.',
        topic: 'Transport',
      },
      {
        q: 'Why can a TCP connection terminate with four messages while it started with three?',
        a: 'The stream is full duplex: each direction is closed independently (FIN; ACK; FIN; ACK). Establishment can piggyback because the server’s ISN and its ACK of the client’s ISN travel together in SYN-ACK.',
        topic: 'Transport',
      },
      {
        q: 'What is 2×MSL and why does the closer wait that long?',
        a: 'TIME_WAIT lasts twice the Maximum Segment Lifetime so the final ACK can be repeated if the peer’s FIN retransmission arrives, and so old duplicate segments die before the 4-tuple is reused.',
        topic: 'Transport',
      },
      {
        q: 'Contrast rwnd, cwnd and the “window” a TCP segment advertises.',
        a: 'The segment header advertises the receiver’s free buffer (rwnd — flow control). cwnd is the sender’s estimate of what the network can take (congestion control). Effective in-flight limit = min(rwnd, cwnd).',
        topic: 'Transport',
      },
      {
        q: 'TCP drops with RTO timeout vs 3 duplicate ACKs — what happens to cwnd?',
        a: 'Timeout: severe — cwnd resets to slow start (severe congestion assumed). 3 dup-ACKs: fast recovery — halve cwnd and continue (mild). This split response reflects differing confidence that loss = congestion.',
        topic: 'Transport',
      },
    ],
  },
  {
    id: 24,
    week: 4,
    topic: 'Revision: DNS, HTTP, HTTPS and TLS',
    category: 'Revision',
    objective: 'Explain DNS lookups and secure web requests fluently.',
    subtopics: [
      'DNS lookup + caching drill',
      'HTTP methods/status codes on sight',
      'Scenario-based TLS questions',
    ],
    checklist: [
      'Recite the DNS chain from memory',
      'Instant-quiz yourself on status codes',
      'Do the 6-question drill below',
      'Re-explain cert validation aloud',
      'Note remaining confusion in Notes',
    ],
    summary:
      'Drill the DNS chain and HTTPS interview lines until they are automatic. Scenario questions (browser warnings, redirect chains, CDN caching) are common — model answers below.',
    terms: [
      { term: 'DoH / DoT', def: 'DNS over HTTPS/TLS — encrypts DNS queries so local networks can’t read/possibly tamper with them.' },
    ],
    questions: [
      {
        q: 'Quiz day — use the 6-question drill in the activity section below.',
        a: 'The drill covers DNS resolution, HTTP semantics, HTTPS details and TLS trust.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'What records would a mail server admin look up and why?',
        a: 'MX (which servers receive mail for the domain, by priority) + their A/AAAA addresses; SPF/DKIM/DMARC TXT records for anti-spoofing. Senders resolve MX then A.',
        topic: 'Application',
      },
      {
        q: 'Why does the browser show “your connection is not private”? What causes it?',
        a: 'TLS certificate validation failed: wrong/expired/unknown CA (self-signed), hostname mismatch (MITM or typo), clock skew, or intercepted traffic. Browsers halt — a MITM could be reading an unauthenticated connection.',
        topic: 'Application',
      },
      {
        q: 'What’s the difference between 301 and 302 — and where does it matter?',
        a: '301 is permanent: browsers/caches may reuse and SEO transfers to the new URL. 302 is temporary: keep hitting the original. Choosing wrong can hard-cache redirect chains (“always redirect to /old”).',
        topic: 'Application',
      },
      {
        q: 'Why is DNS resolved before the TCP handshake even begins?',
        a: 'TCP connects to an IP address; DNS produces that IP. Without resolution there is no destination for the SYN. (Happy Eyeballs resolves both A and AAAA and races attempts.)',
        topic: 'Application',
      },
      {
        q: 'Explain what “stateless” means in HTTP and how state is added.',
        a: 'Each request is independent; the protocol stores no session. State is layered on: cookies, session IDs, tokens (JWT), server-side session stores, and cache_headers. Cookies + TLS are the standard pairing.',
        topic: 'Application',
      },
      {
        q: 'What happens if the certificate chain has a valid leaf but the intermediate is missing?',
        a: 'Most clients fail or warn: they cannot build a chain to a trusted root. The server must send the full chain (leaf + intermediates). Common broken-HTTPS cause after cert renewals.',
        topic: 'Security',
      },
    ],
  },
  {
    id: 25,
    week: 4,
    topic: 'Revision: IP addressing, subnetting, ARP, NAT',
    category: 'Revision',
    objective: 'Solve subnetting exercises and explain local vs external packet delivery.',
    subtopics: [
      'Subnetting drill on paper',
      'Local delivery path vs external delivery path',
      'ARP/NAT/DHCP scenario questions',
    ],
    checklist: [
      'Solve the drill\'s subnet questions on paper',
      'Walk local vs external delivery aloud',
      'Do the 6-question drill below',
      'Recall the 3 private ranges one more time',
      'Note remaining confusion in Notes',
    ],
    summary:
      'Subnetting is the classic gatekeeper question. Re-derive formulas, then do the drill on paper before checking answers. Then connect it: local delivery (same subnet: ARP → direct frame) vs external (different subnet: gateway → NAT → routing).',
    terms: [
      { term: 'Gateway delivery check', def: 'Host ANDs destination with its mask; equal to own network → local, else send to gateway.' },
    ],
    questions: [
      {
        q: 'Quiz day — use the 6-question drill in the activity section below.',
        a: 'The drill covers address classes in practice, subnet math, ARP and NAT scenarios.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'How many usable hosts in 172.16.5.100/22 network? Give the range.',
        a: '/22 → 10 host bits → 1024 total, 1022 usable. Network 172.16.4.0, broadcast 172.16.7.255, usable 172.16.4.1 – 172.16.7.254. (Third octet block size 4: 4, 8, …)',
        topic: 'IP & Routing',
      },
      {
        q: 'Why can two hosts on the same switch fail to communicate across subnets?',
        a: 'Switches forward frames only; cross-subnet traffic must be routed. Hosts send to the gateway instead of ARPing for each other directly; if the gateway/router config or host masks are wrong, routes don’t exist.',
        topic: 'IP & Routing',
      },
      {
        q: 'What breaks first when an internal server must be reachable from the Internet?',
        a: 'NAT inbound: private addresses aren’t routable publicly. Add port forwarding/NAT rule (or, better, a reverse proxy/load balancer with a public IP).',
        topic: 'IP & Routing',
      },
      {
        q: 'Which packets trigger an ARP request and which do not?',
        a: 'Any IP packet to a neighbour on the same subnet does (to learn its MAC). Packets to other subnets ARP only for the default gateway’s MAC. Frames already in the ARP cache skip the broadcast.',
        topic: 'IP & Routing',
      },
      {
        q: 'Give one real problem NAT causes and its standard workaround.',
        a: 'Peer-to-peer/inbound connections fail (no NAT entry exists). Workarounds: port forwarding, UPnP, STUN/TURN/ICE for VoIP, relays. Also breaks protocols embedding IPs in payload (legacy FTP/SIP).',
        topic: 'IP & Routing',
      },
      {
        q: 'A user reports “assigned IP 169.254.10.12, no internet”. Diagnose.',
        a: 'APIPA self-assignment = DHCP failed. Check cable/AP link, then DHCP server reachability/scope exhaustion. Restart DHCP or manual static config for triage.',
        topic: 'IP & Routing',
      },
    ],
  },
  {
    id: 26,
    week: 4,
    topic: 'Revision: routing, switching and control',
    category: 'Revision',
    objective: 'Review routing decisions, Ethernet switching, and troubleshooting scenarios.',
    subtopics: [
      'Routing table + longest prefix drill',
      'Switch behaviour + VLAN scenarios',
      'Troubleshooting methodology questions',
    ],
    checklist: [
      'Pick the matching route from a table by hand',
      'Do the 6-question drill below',
      'Re-derive MAC learning on paper',
      'Practise “user can’t reach X” debugging aloud',
      'Note remaining confusion in Notes',
    ],
    summary:
      'Final revision before the mock. Routing and switching appear in troubleshooting format (“the user can reach internal servers but not the internet — where do you look?”). Practise the drills below and then the mock interview.',
    terms: [
      { term: 'Convergence', def: 'The process by which routing protocols re-learn topology after a change/failure.' },
    ],
    questions: [
      {
        q: 'Quiz day — use the 6-question drill in the activity section below.',
        a: 'The drill covers longest-prefix match, switching behaviour, VLANs and troubleshooting methodology.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'Routing table: 10.0.0.0/8 via A; 10.1.0.0/16 via B; 10.1.2.0/24 via C; 0.0.0.0/0 via D. Where does 10.1.2.7 go?',
        a: 'Via C — longest prefix match: /24 beats /16, /8 and default.',
        topic: 'IP & Routing',
      },
      {
        q: 'User can reach 10.1.1.5 but not 8.8.8.8. Likely points of failure?',
        a: 'Default route/gateway misconfigured, NAT/ISP issue, or firewall ACL blocking egress. Internal reach succeeding shows L2/L3-local path is fine; isolate at routing/NAT layer.',
        topic: 'IP & Routing',
      },
      {
        q: 'What causes an ARP entry for the gateway to become stale and what does the host then do?',
        a: 'Timeout/aging or gateway MAC change (failover, new device). The host re-broadcasts ARP on next send; transient one-packet delay, no permanent outage (unless corrupted/static entries conflict).',
        topic: 'IP & Routing',
      },
      {
        q: 'Two departments are on the same switch. What is (a) the simplest isolation and (b) what breaks?',
        a: '(a) VLANs per department. (b) Inter-VLAN traffic now needs routing (L3 switch/router + SVIs/gateway per VLAN); DHCP relay may be needed if servers are centralized.',
        topic: 'Fundamentals',
      },
      {
        q: 'A switch port shows FCS errors. What are likely causes?',
        a: 'Bad cable/connector, NIC/driver issues, duplex mismatch, EMI or failing port. FCS errors are physical/link-layer symptoms — check the local link first.',
        topic: 'Fundamentals',
      },
      {
        q: 'Explain the difference between a packet (route) decision and a frame (switch) decision.',
        a: 'Routing forwards by IP/longest-prefix across networks and rewrites MACs. Switching forwards by MAC inside one broadcast domain; the IP header is untouched.',
        topic: 'Fundamentals',
      },
    ],
  },
  {
    id: 27,
    week: 4,
    topic: 'Mock interview',
    category: 'Revision',
    objective: 'Attempt 18 mixed questions with answers revealed only after attempting each.',
    subtopics: [
      'Attempt each question aloud before revealing',
      'Reveal + self-mark (got it / missed it)',
      'Review the mistake log afterwards',
    ],
    checklist: [
      'Answer each question aloud from memory',
      'Reveal the model answer only after attempting',
      'Self-mark honestly (Got it / Missed it)',
      'Review your mistake summaries at the end',
      'Plan revisits for the topics you missed',
    ],
    summary:
      'Simulate the interview: 18 questions across every week — definitions, comparisons and scenarios. Answer aloud first, then reveal and self-mark. Your results feed the weak-topics tracker (which is reviewed on Day 28) — be honest with yourself.',
    terms: [
      { term: 'STAR', def: 'For scenario answers: Situation, Task, Action, Result — keeps long answers structured.' },
    ],
    questions: [
      {
        q: 'Mock day — the 18-question mock interview is in the activity section below.',
        a: 'Reveal answers only after attempting each one; self-mark to feed your weak-topic log for Day 28.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'Define latency, bandwidth and throughput, and how they relate.',
        a: 'Latency = travel time (ms). Bandwidth = link capacity (bits/s). Throughput = actual delivered rate ≤ bandwidth, reduced by loss/retransmission/overhead. High bandwidth does not fix latency; both limit user-perceived performance.',
        topic: 'Fundamentals',
      },
      {
        q: 'Why does the TCP/IP model not have a session layer?',
        a: 'TCP/IP folds OSI’s session/presentation/application into one Application layer: session semantics are implemented inside applications/protocols (HTTP, TLS, RPC) rather than a separate standard layer.',
        topic: 'Fundamentals',
      },
      {
        q: 'A packet is at a router. What exactly changes in its headers on this hop?',
        a: 'Link layer: new source MAC = router’s outgoing interface, new destination MAC = next-hop (resolved by ARP). IP layer: TTL decremented (and header checksum recomputed); addresses unchanged (except NAT translations).',
        topic: 'Fundamentals',
      },
      {
        q: 'Why do we need both ports and IP addresses — can’t either suffice?',
        a: 'IP gets the packet to the right host among millions (routing needs hierarchy); port identifies the right process among dozens on that host (flat demultiplexing). Different problems at different layers.',
        topic: 'Fundamentals',
      },
      {
        q: 'Compare TCP and UDP header size and why it matters.',
        a: 'TCP header is 20+ bytes (seq, ack, window, options); UDP is a fixed 8 bytes. For small datagrams that overhead and TCP’s handshake/setup matter — why DNS uses UDP for the common query case.',
        topic: 'Transport',
      },
      {
        q: 'Draw the three-way handshake and label sequence numbers.',
        a: 'SYN(x) → SYN+ACK(y, ack=x+1) → ACK(ack=y+1). Each side’s ISN becomes the first byte number of its stream; ack = “last byte received + 1”.',
        topic: 'Transport',
      },
      {
        q: 'What is fast retransmit and why does it need 3 duplicate ACKs?',
        a: 'Receiver ACKs same byte repeatedly when out-of-order segments arrive behind a loss. One or two dup ACKs can be reordering; 3 strongly indicates loss, triggering resent without waiting for RTO.',
        topic: 'Transport',
      },
      {
        q: 'How does TCP behave when the network is congested? Name the two control phases.',
        a: 'cwnd governs in-flight data. Slow start: exponential growth per RTT until ssthresh/loss. Congestion avoidance: linear increase (AIMD), halve on loss (fast recovery) or collapse on timeout.',
        topic: 'Transport',
      },
      {
        q: 'What status code should a correctly authenticated-but-not-allowed request return, vs wrong credentials?',
        a: '403 Forbidden (identity known, no permission) vs 401 Unauthorized (no/invalid credentials). 404 sometimes chosen for security to obscure existence.',
        topic: 'Application',
      },
      {
        q: 'Explain how a browser decides a cached response is still usable.',
        a: 'Freshness via Cache-Control/Expires; if stale, revalidate with If-None-Match (ETag) or If-Modified-Since; server replies 304 (reuse) or 200 (fresh body).',
        topic: 'Application',
      },
      {
        q: 'Why does the DNS system use hierarchical nameservers instead of one giant database?',
        a: 'Delegation: root → TLD → authoritative zones. Scales (each zone manages only itself), resilient (mirrored anycast servers), updatable independently, cacheable at every level.',
        topic: 'Application',
      },
      {
        q: 'What does DNS do for mail delivery differently than for the web?',
        a: 'Mail senders resolve MX records (with priority) pointing to mail hosts, not the domain’s A record. Web only needs A/AAAA/CNAME.',
        topic: 'Application',
      },
      {
        q: 'Given 192.168.30.0/24, create 8 subnets. State the prefix and usable range of the first one.',
        a: 'Borrow 3 bits → /29. Block size 8: subnets at .0, .8, .16… First: 192.168.30.0/29, usable .1–.6 (6 hosts), broadcast .7.',
        topic: 'IP & Routing',
      },
      {
        q: 'Explain what happens when a host ARPs for an IP that doesn’t exist on the LAN.',
        a: 'No reply; the sender retries a few times then fails (Destination Host Unreachable / ENOENT-like ARP failure). No frame can be built without the MAC.',
        topic: 'IP & Routing',
      },
      {
        q: 'Walk NAT translation details for two simultaneous connections from two hosts to the same server.',
        a: 'Distinct internal flows → distinct public ports; the 4-tuple stays unique both ways. Server just sees two client sockets; the router maps replies back by port table.',
        topic: 'IP & Routing',
      },
      {
        q: 'What is route aggregation and why does BGP use it?',
        a: 'Announcing a supernet covering many prefixes (e.g. 10.0.0.0/8 covering /24s). Shrinks global routing tables and processing requirements; motivates CIDR design that replaced classful allocation.',
        topic: 'IP & Routing',
      },
      {
        q: 'How does TLS prevent a man-in-the-middle from reading your traffic?',
        a: 'Server certificate validated against trusted CAs → MITM can’t impersonate the domain without a CA-signed cert. ECDHE key exchange ensures only the two peers derive session keys; AEAD ciphers protect data + integrity.',
        topic: 'Security',
      },
      {
        q: '“The user says the VPN is connected but sites don’t load.” Debug flow?',
        a: 'Check DNS through tunnel (nslookup), split-tunnel routes (default route via VPN?), MTU/fragmentation drops, and whether the VPN gateway itself forwards. Layered: DNS → routes → MTU.',
        topic: 'Revision',
      },
    ],
  },
  {
    id: 28,
    week: 4,
    topic: 'Final revision & readiness assessment',
    category: 'Revision',
    objective: 'Take the 20-question final assessment and read your readiness summary.',
    subtopics: [
      'Review your weak topics from the mistake log',
      'Take the 20-question final assessment',
      'Read your completed-journey summary',
    ],
    checklist: [
      'Review wrong-answer log (Practice → Weak topics)',
      'Take the 20-question assessment from memory',
      'Study your results: strengths vs gaps',
      'Follow the recommended next topics below',
      'Celebrate completing the 28-day journey!',
    ],
    summary:
      'Last day. First re-study your logged wrong answers (they appear in Practice → Weak topics). Then take the final 20-question assessment below — it samples every week. Afterwards you get a summary of strengths, gaps and what to study next. The recommended next topics: CIDR practice sets, HTTP/2 vs HTTP/3 depth, DNSSEC & DoH/DoT, NAT traversal (STUN/TURN), TLS 1.3 details, and — if your role is web-heavy — CDN/caching/load-balancer behavior; for backend roles, sockets and epoll/select models. Well done: 28 days, one hour a day, and you can hold a CN interview conversation.',
    terms: [
      { term: 'Readiness', def: 'Ability to answer clearly without notes — measure it, don’t assume it.' },
    ],
    questions: [
      {
        q: 'Assessment day — the 20-question final assessment is in the activity section below.',
        a: 'Complete the assessment once, from memory. Your result page shows strengths and gaps. Re-visit weak topics after the assessment for lasting retention.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'What is the fundamental difference between a protocol and an API?',
        a: 'A protocol is a wire agreement (formats + exchange order) between independent implementations over a network; an API is a programmatic contract within one process/host (library boundaries). Some protocols are exposed via APIs (e.g. HTTP through fetch).',
        topic: 'Fundamentals',
      },
      {
        q: 'Name all 7 OSI layers in order and the PDU each deals with (where applicable).',
        a: 'Physical(bits) → Data Link(frame) → Network(packet) → Transport(segment) → Session(data) → Presentation(data) → Application(message/data).',
        topic: 'Fundamentals',
      },
      {
        q: 'Why does a switch not need an IP address to forward LAN traffic — yet real switches have one?',
        a: 'Forwarding is by MAC (L2), no IP needed. The IP is for management (SSH/SNMP access) and for features like DHCP relay. A pure unmanaged switch has no IP at all.',
        topic: 'Fundamentals',
      },
      {
        q: 'What is a socket pair and how does one server port serve thousands of clients?',
        a: 'The pair is (local IP:port, remote IP:port). The server listens on one port; each client has a unique ephemeral port, so each connection has a unique 4-tuple the kernel demultiplexes.',
        topic: 'Fundamentals',
      },
      {
        q: 'Explain the trade-offs of TCP-level vs application-level heartbeats.',
        a: 'TCP keepalive (default hours) detects dead peers only; too slow for apps. App-level heartbeats/pings control interval, semantics (e.g. “still in a call”), and cleanup, at some traffic cost. WebSocket ping/pong is a common middle ground.',
        topic: 'Transport',
      },
      {
        q: 'When the receiver advertises window = 0 briefly during heavy load, is data lost?',
        a: 'No — flow control pauses the sender; data waits in sender buffers. The sender probes with zero-window probes until space frees. Loss only happens on actual packet drops or buffer overflow.',
        topic: 'Transport',
      },
      {
        q: 'Why does TCP need both congestion control AND flow control?',
        a: 'They protect different resources: flow control protects the receiver’s buffers (rwnd); congestion control protects the routers/network path (cwnd). Either one alone either starves the network or overloads a slow receiver.',
        topic: 'Transport',
      },
      {
        q: 'What changes in an HTTP request when switching from HTTP/1.1 to HTTP/2 on the wire?',
        a: 'Same semantics (methods, headers, bodies) but binary framing, multiplexed streams over one TCP connection, header compression (HPACK), stream priorities. App code mostly unchanged.',
        topic: 'Application',
      },
      {
        q: 'When does the browser use HTTP methods other than GET?',
        a: 'Form submissions (POST), REST/API clients (PUT/DELETE/PATCH), and fetch/XHR calls. Regular navigation/links are GET (which is why login forms use POST).',
        topic: 'Application',
      },
      {
        q: 'What exactly does the Host header do?',
        a: 'It carries the requested hostname, letting one IP:443 serve many sites (virtual hosts / SNI at TLS). Required since HTTP/1.1.',
        topic: 'Application',
      },
      {
        q: 'Why do CDNs matter for HTTP performance?',
        a: 'Edge caches close to users cut RTT and origin load; combined with cache headers, ETags, gzip/brotli, and connection reuse. Regional failures are also isolated at edges.',
        topic: 'Application',
      },
      {
        q: 'Explain DNS zone delegation with one concrete example.',
        a: '.com TLD servers hold NS records for example.com pointing to its nameservers; example.com’s zone files define its own records and can delegate sub.zones (e.g. api.example.com → another nameserver). Authority is delegated down the tree.',
        topic: 'Application',
      },
      {
        q: 'Which IP does a NAT table entry keep alive and for how long?',
        a: 'Entry maps internal (IP:port) ↔ external (IP:port) per flow; kept while traffic flows (timeouts per protocol: TCP minutes, UDP seconds — hence application keepalives on NATed UDP)',
        topic: 'IP & Routing',
      },
      {
        q: 'Why are the three private ranges chosen as they are, and can two companies overlap?',
        a: 'RFC 1918 picked ranges that were unassigned classful space. Overlap is normal and safe because they are not routed publicly; inter-company VPNs require care to avoid overlapping allocations.',
        topic: 'IP & Routing',
      },
      {
        q: 'Given subnet 10.20.30.0/27: how many hosts, what is the broadcast, where do the next subnets start?',
        a: '5 host bits → 32 total, 30 usable. Block size 32 → subnets start .0, .32, .64… Broadcast of first = 10.20.30.31.',
        topic: 'IP & Routing',
      },
      {
        q: 'Your gateway’s ARP entry is stale. What is the impact?',
        a: 'First packet after the change may be dropped or delayed; the host re-ARPs and heals automatically. Persistent impact only if a wrong static entry is configured.',
        topic: 'IP & Routing',
      },
      {
        q: 'How does a router handle a packet whose TTL arrives at 0?',
        a: 'Drops it and sends ICMP Time Exceeded back to the source (if not itself in an ACL-blocked path). This is the mechanism traceroute exploits.',
        topic: 'IP & Routing',
      },
      {
        q: 'A developer says “we use HTTPS so we don’t need the firewall.” Two (or more) rebuttals?',
        a: 'HTTPS only encrypts transport; firewalls reduce attack surface, control egress, block by IP/rate, and enforce segmentation. Plus TLS says nothing about application bugs, credentials, or insider traffic.',
        topic: 'Security',
      },
      {
        q: 'Why do we say HSTS improves security?',
        a: 'The server tells the browser to only use HTTPS for that domain for a period, preventing downgrade/stripping attacks where an attacker forces an initial HTTP connection (and, with includeSubDomains/preload, extends to subdomains).',
        topic: 'Security',
      },
      {
        q: 'Give the one-sentence version of the answer to “what happens when you type google.com”.',
        a: 'The browser resolves the DNS name, opens a TCP (or QUIC) connection through routed hops and NAT, performs a TLS handshake, sends an HTTP GET, and renders the server’s HTML — with DNS, ARP/routing, and TLS each doing their layer’s job.',
        topic: 'Revision',
      },
    ],
  },
]
