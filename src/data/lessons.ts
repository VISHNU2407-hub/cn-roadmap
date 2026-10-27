import type { Lesson } from '../types'

// 28-day roadmap: topics, objectives and checklists only.
export const LESSONS: Lesson[] = [
  {
    "id": 1,
    "week": 1,
    "topic": "Introduction to computer networks",
    "category": "Fundamentals",
    "objective": "Explain basic networking terminology: network, client-server, LAN/WAN, bandwidth, latency.",
    "subtopics": [
      "What a network is and why we link devices",
      "Client-server architecture vs peer-to-peer",
      "LAN vs WAN, bandwidth vs latency"
    ],
    "checklist": [
      "Define a computer network in one sentence",
      "Describe client-server architecture and one example",
      "Compare LAN and WAN with real examples",
      "Explain the difference between bandwidth and latency",
      "Recall why protocols matter for interoperability"
    ]
  },
  {
    "id": 2,
    "week": 1,
    "topic": "The OSI model",
    "category": "Fundamentals",
    "objective": "Explain all seven OSI layers, their responsibilities, and how encapsulation works.",
    "subtopics": [
      "The seven layers and each layer’s responsibility",
      "Protocol examples at each layer",
      "Data encapsulation as it moves down the stack"
    ],
    "checklist": [
      "Name all 7 layers in order, bottom-up and top-down",
      "State the responsibility of each layer",
      "Match one protocol/device to each layer",
      "Explain encapsulation (PDU names per layer)",
      "Explain why layered models are useful"
    ]
  },
  {
    "id": 3,
    "week": 1,
    "topic": "The TCP/IP model",
    "category": "Fundamentals",
    "objective": "Compare the TCP/IP model with OSI, and explain encapsulation and decapsulation.",
    "subtopics": [
      "TCP/IP layers and how they map to OSI",
      "Encapsulation and decapsulation end to end",
      "Why the Internet runs on TCP/IP"
    ],
    "checklist": [
      "List the TCP/IP layers and map them to OSI",
      "Explain encapsulation with PDU names",
      "Explain decapsulation at the receiver",
      "Compare OSI vs TCP/IP in an interview answer",
      "Identify where real protocols sit (IP, TCP, HTTP)"
    ]
  },
  {
    "id": 4,
    "week": 1,
    "topic": "Networking devices",
    "category": "Fundamentals",
    "objective": "Explain the role of hub, switch, router, bridge and modem, and when each is used.",
    "subtopics": [
      "Hub, switch, router: the layer each operates at",
      "Bridge and modem",
      "Choosing the right device for the job"
    ],
    "checklist": [
      "Describe a hub and why it is obsolete",
      "Explain how a switch forwards frames",
      "Explain what a router does that a switch cannot",
      "Describe a bridge and a modem",
      "State which device connects different networks"
    ]
  },
  {
    "id": 5,
    "week": 1,
    "topic": "IP address, MAC address and ports",
    "category": "Fundamentals",
    "objective": "Explain how data reaches the correct device and application using IPs, MACs and ports.",
    "subtopics": [
      "IP vs MAC: logical routing address vs physical link address",
      "IPv4 structure and public/private basics",
      "Port numbers and sockets"
    ],
    "checklist": [
      "Compare IP and MAC addresses and their jobs",
      "Explain what a port identifies on a host",
      "Define a socket",
      "Recall well-known port examples (80, 443, 22, 53)",
      "Explain the journey: IP gets you to the host, port to the process"
    ]
  },
  {
    "id": 6,
    "week": 1,
    "topic": "Network communication types",
    "category": "Fundamentals",
    "objective": "Understand unicast, broadcast and multicast packet delivery patterns.",
    "subtopics": [
      "Unicast: one-to-one delivery",
      "Broadcast and its scope limits",
      "Multicast: one-to-many efficiently"
    ],
    "checklist": [
      "Define unicast, broadcast and multicast",
      "Recall the IPv4 broadcast address pattern",
      "Know one real multicast use case",
      "Explain why broadcasts stop at routers",
      "Relate each pattern to Ethernet behaviour"
    ]
  },
  {
    "id": 7,
    "week": 1,
    "topic": "Week 1 revision",
    "category": "Revision",
    "objective": "Review Days 1–6: answer 10 mixed questions, then write a short self-assessment.",
    "subtopics": [
      "Review notes from Days 1–6",
      "Answer 10 mixed interview questions (no notes!)",
      "Write a self-assessment marking weak topics"
    ],
    "checklist": [
      "Reread/refresh your Day 1–6 notes (max 15 min)",
      "Answer all 10 quiz questions from memory first",
      "Read the model answers and mark yourself honestly",
      "List 2–3 topics you need to revisit",
      "Write a short self-assessment in Notes"
    ]
  },
  {
    "id": 8,
    "week": 2,
    "topic": "TCP vs UDP",
    "category": "Transport",
    "objective": "Compare TCP and UDP confidently: reliability, ordering, overhead and use cases.",
    "subtopics": [
      "Connection-oriented vs connectionless",
      "Reliability, ordering and flow control features",
      "Overhead and typical use cases"
    ],
    "checklist": [
      "List TCP guarantees and what UDP provides instead",
      "Explain why UDP packets can be lost/reordered",
      "Match apps to TCP vs UDP (web, DNS, video, gaming)",
      "Explain the speed/overhead trade-off",
      "Know where modern adaptations fit (QUIC/HTTP3)"
    ]
  },
  {
    "id": 9,
    "week": 2,
    "topic": "TCP three-way handshake",
    "category": "Transport",
    "objective": "Draw and explain the three-way handshake (SYN, SYN-ACK, ACK) and sequence numbers.",
    "subtopics": [
      "SYN, SYN-ACK, ACK message by message",
      "Initial sequence numbers and why they are random",
      "Why exactly three steps (not two)"
    ],
    "checklist": [
      "Draw the handshake without notes",
      "Explain what each message confirms",
      "Explain ISN randomness (security + history)",
      "Explain why both sides need one each way",
      "Know the related flags in the TCP header"
    ]
  },
  {
    "id": 10,
    "week": 2,
    "topic": "TCP connection termination",
    "category": "Transport",
    "objective": "Explain the four-way termination (FIN/ACK) and why TIME_WAIT exists.",
    "subtopics": [
      "FIN, ACK, FIN, ACK message by message",
      "Why teardown takes four steps",
      "TIME_WAIT and the 2×MSL delay"
    ],
    "checklist": [
      "Draw the four-way teardown without notes",
      "Explain FIN half-close semantics",
      "Explain why TIME_WAIT waits 2×MSL",
      "Know final states (CLOSE_WAIT, TIME_WAIT…)",
      "Relate teardown to graceful vs abrupt closes"
    ]
  },
  {
    "id": 11,
    "week": 2,
    "topic": "TCP reliability and flow control",
    "category": "Transport",
    "objective": "Explain how TCP delivers data reliably: ACKs, retransmission and sliding windows.",
    "subtopics": [
      "Sequence numbers, ACKs and retransmission (RTO, fast retransmit)",
      "Sliding window: sender-side buffering in flight",
      "Receiver flow control (advertised window)"
    ],
    "checklist": [
      "Explain cumulative ACK and duplicate ACKs",
      "Compare timeout retransmission vs fast retransmit",
      "Describe the sliding window idea",
      "Explain the receiver window (rwnd) and zero-window",
      "Relate reliability to loss detection"
    ]
  },
  {
    "id": 12,
    "week": 2,
    "topic": "Congestion control",
    "category": "Transport",
    "objective": "Distinguish congestion control from flow control; explain slow start and congestion avoidance conceptually.",
    "subtopics": [
      "What network congestion is and how it hurts",
      "Slow start (exponential) and congestion avoidance (AIMD)",
      "Controlled by loss or by delay signals"
    ],
    "checklist": [
      "Define congestion control vs flow control precisely",
      "Explain cwnd and how it interacts with rwnd",
      "Describe slow start and congestion avoidance",
      "Know the two congestion signals (loss, delay)",
      "Be able to contrast the two controls in one breath"
    ]
  },
  {
    "id": 13,
    "week": 2,
    "topic": "HTTP and HTTPS",
    "category": "Application",
    "objective": "Explain HTTP methods, status codes, headers, and how HTTPS secures web traffic.",
    "subtopics": [
      "HTTP methods and status codes",
      "Headers, caching and statelessness",
      "HTTPS: TLS, certificates, encryption split"
    ],
    "checklist": [
      "Know GET/POST/PUT/DELETE and idempotency",
      "Recall 200, 301, 302, 403, 404, 500 meanings",
      "Explain stateless + cookies",
      "Explain TLS: cert, key exchange, symmetric encryption",
      "Contrast HTTP/1.1 vs HTTP/2 (and mention HTTP/3)"
    ]
  },
  {
    "id": 14,
    "week": 2,
    "topic": "DNS and application protocols",
    "category": "Application",
    "objective": "Explain how a domain name becomes an IP address, plus DHCP, SMTP, IMAP and FTP.",
    "subtopics": [
      "DNS resolution: resolver, root, TLD, authoritative",
      "Caching and TTL; records A, AAAA, CNAME, MX",
      "DHCP, email and file transfer protocols"
    ],
    "checklist": [
      "Walk through a DNS lookup step by step",
      "Explain recursive vs authoritative servers",
      "Name common record types",
      "Explain TTL and caching benefit",
      "Describe DHCP DORA and the email protocol split"
    ]
  },
  {
    "id": 15,
    "week": 3,
    "topic": "IPv4 and private/public IPs",
    "category": "IP & Routing",
    "objective": "Identify IPv4 structure and common address types: public, private, loopback, broadcast.",
    "subtopics": [
      "IPv4 structure: 32 bits, octets, network vs host part",
      "Private ranges (RFC 1918), loopback, APIPA",
      "Public vs private and why NAT bridges them"
    ],
    "checklist": [
      "Explain the 32-bit / dotted-decimal structure",
      "Recall the three private ranges from memory",
      "Explain loopback 127.0.0.1 and 0.0.0.0",
      "Explain why we ran out of IPv4 and how NAT helps",
      "Recognize an address type on sight"
    ]
  },
  {
    "id": 16,
    "week": 3,
    "topic": "Subnetting and CIDR",
    "category": "IP & Routing",
    "objective": "Solve beginner-level subnetting questions: masks, prefixes, host ranges.",
    "subtopics": [
      "CIDR notation and subnet masks",
      "Network, broadcast, usable host range",
      "Worked example calculations"
    ],
    "checklist": [
      "Convert /24, /26 etc. to dotted masks",
      "Compute network and broadcast address of a subnet",
      "Count usable hosts: 2^host_bits − 2",
      "Do one worked /26 example on paper",
      "Explain why every subnet needs a router gateway"
    ]
  },
  {
    "id": 17,
    "week": 3,
    "topic": "ARP, NAT and DHCP",
    "category": "IP & Routing",
    "objective": "Explain how devices join a network and reach external networks (ARP, NAT, DHCP).",
    "subtopics": [
      "ARP: resolving IP → MAC on a LAN",
      "NAT: how many private hosts share one public IP",
      "DHCP: dynamic address assignment"
    ],
    "checklist": [
      "Explain ARP request/reply and the ARP cache",
      "Walk a packet through NAT outbound and inbound",
      "Explain port address translation (PAT)",
      "Describe DORA again and lease renewal",
      "Explain why private IPs need NAT to reach the Internet"
    ]
  },
  {
    "id": 18,
    "week": 3,
    "topic": "Routing and forwarding",
    "category": "IP & Routing",
    "objective": "Explain how packets travel between networks: routing tables, next hops, default routes.",
    "subtopics": [
      "Routing tables and longest prefix match",
      "Next hop, default gateway, default route",
      "How routers pick routes (static vs dynamic)"
    ],
    "checklist": [
      "Read a routing table and pick the matching route",
      "Explain longest-prefix-match with an example",
      "Explain the default route 0.0.0.0/0",
      "Contrast static vs dynamic routing",
      "Describe TTL’s role in preventing loops"
    ]
  },
  {
    "id": 19,
    "week": 3,
    "topic": "Switching and Ethernet",
    "category": "Fundamentals",
    "objective": "Explain how switches forward frames and distinguish collision vs broadcast domains.",
    "subtopics": [
      "Ethernet frames and MAC learning",
      "Forwarding, flooding, filtering decisions",
      "Collision domains vs broadcast domains"
    ],
    "checklist": [
      "Describe an Ethernet frame's key fields",
      "Explain MAC table learning and aging",
      "Contrast flooding vs forwarding vs filtering",
      "Count collision and broadcast domains in a small topology",
      "Explain VLANs as separated broadcast domains"
    ]
  },
  {
    "id": 20,
    "week": 3,
    "topic": "TLS and network security",
    "category": "Security",
    "objective": "Explain the purpose of HTTPS security: certificates, trust, encryption, firewalls.",
    "subtopics": [
      "Certificates, CAs and the chain of trust",
      "TLS handshake and symmetric session keys",
      "Firewalls and Defence in depth"
    ],
    "checklist": [
      "Explain what a certificate proves and how it’s validated",
      "Sketch the TLS 1.3 handshake w/ key exchange",
      "Explain confidentiality/integrity/authentication trio",
      "Describe what a firewall inspects and where it sits",
      "Know what TLS does NOT protect (metadata, endpoints)"
    ]
  },
  {
    "id": 21,
    "week": 3,
    "topic": "What happens when you type google.com?",
    "category": "Revision",
    "objective": "Deliver a clear, structured end-to-end interview answer from typing to rendering.",
    "subtopics": [
      "DNS resolution chain",
      "TCP + TLS connection",
      "HTTP request, server processing, render"
    ],
    "checklist": [
      "Recite the flow aloud in under two minutes",
      "Name every protocol as it appears",
      "Explain where ARP/NAT/routing fit",
      "Weave in weeks-1-and-2 details naturally",
      "Practise with follow-up questions (quiz below)"
    ]
  },
  {
    "id": 22,
    "week": 4,
    "topic": "Revision: OSI, TCP/IP and devices",
    "category": "Revision",
    "objective": "Sharpen layer-based answers and device comparisons.",
    "subtopics": [
      "Redraw OSI and TCP/IP mappings from memory",
      "Compare hub / switch / router / L3 switch",
      "Layer-based interview questions drill"
    ],
    "checklist": [
      "Redraw the two stacks and map them",
      "Re-derive the encapsulation flow",
      "Do the 6-question drill below",
      "Re-explain hub vs switch vs router aloud",
      "Note remaining confusion in Notes"
    ]
  },
  {
    "id": 23,
    "week": 4,
    "topic": "Revision: TCP, UDP and handshakes",
    "category": "Revision",
    "objective": "Drill connection establishment/termination and reliability concepts.",
    "subtopics": [
      "Redraw handshake + teardown from memory",
      "Explain reliability, flow vs congestion control",
      "TCP/UDP comparison drill"
    ],
    "checklist": [
      "Draw handshake AND teardown on paper",
      "Recite slow start / AIMD in 3 sentences",
      "Do the 6-question drill below",
      "Re-explain rwnd vs cwnd vs window size",
      "Note remaining confusion in Notes"
    ]
  },
  {
    "id": 24,
    "week": 4,
    "topic": "Revision: DNS, HTTP, HTTPS and TLS",
    "category": "Revision",
    "objective": "Explain DNS lookups and secure web requests fluently.",
    "subtopics": [
      "DNS lookup + caching drill",
      "HTTP methods/status codes on sight",
      "Scenario-based TLS questions"
    ],
    "checklist": [
      "Recite the DNS chain from memory",
      "Instant-quiz yourself on status codes",
      "Do the 6-question drill below",
      "Re-explain cert validation aloud",
      "Note remaining confusion in Notes"
    ]
  },
  {
    "id": 25,
    "week": 4,
    "topic": "Revision: IP addressing, subnetting, ARP, NAT",
    "category": "Revision",
    "objective": "Solve subnetting exercises and explain local vs external packet delivery.",
    "subtopics": [
      "Subnetting drill on paper",
      "Local delivery path vs external delivery path",
      "ARP/NAT/DHCP scenario questions"
    ],
    "checklist": [
      "Solve the drill's subnet questions on paper",
      "Walk local vs external delivery aloud",
      "Do the 6-question drill below",
      "Recall the 3 private ranges one more time",
      "Note remaining confusion in Notes"
    ]
  },
  {
    "id": 26,
    "week": 4,
    "topic": "Revision: routing, switching and control",
    "category": "Revision",
    "objective": "Review routing decisions, Ethernet switching, and troubleshooting scenarios.",
    "subtopics": [
      "Routing table + longest prefix drill",
      "Switch behaviour + VLAN scenarios",
      "Troubleshooting methodology questions"
    ],
    "checklist": [
      "Pick the matching route from a table by hand",
      "Do the 6-question drill below",
      "Re-derive MAC learning on paper",
      "Practise “user can’t reach X” debugging aloud",
      "Note remaining confusion in Notes"
    ]
  },
  {
    "id": 27,
    "week": 4,
    "topic": "Mock interview",
    "category": "Revision",
    "objective": "Attempt 18 mixed questions with answers revealed only after attempting each.",
    "subtopics": [
      "Attempt each question aloud before revealing",
      "Reveal + self-mark (got it / missed it)",
      "Review the mistake log afterwards"
    ],
    "checklist": [
      "Answer each question aloud from memory",
      "Reveal the model answer only after attempting",
      "Self-mark honestly (Got it / Missed it)",
      "Review your mistake summaries at the end",
      "Plan revisits for the topics you missed"
    ]
  },
  {
    "id": 28,
    "week": 4,
    "topic": "Final revision & readiness assessment",
    "category": "Revision",
    "objective": "Take the 20-question final assessment and read your readiness summary.",
    "subtopics": [
      "Review your weak topics from the mistake log",
      "Take the 20-question final assessment",
      "Read your completed-journey summary"
    ],
    "checklist": [
      "Review wrong-answer log (Practice → Weak topics)",
      "Take the 20-question assessment from memory",
      "Study your results: strengths vs gaps",
      "Follow the recommended next topics below",
      "Celebrate completing the 4-week journey!"
    ]
  }
]
