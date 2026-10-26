export interface Flashcard {
  front: string
  back: string
  topic: string
}

export const FLASHCARDS: Flashcard[] = [
  { front: 'Bandwidth', back: 'Capacity of a link in bits per second — how wide the pipe is.', topic: 'Fundamentals' },
  { front: 'Latency', back: 'Time for data to travel source → destination (propagation + processing + queuing).', topic: 'Fundamentals' },
  { front: '7 OSI layers', back: 'Physical, Data Link, Network, Transport, Session, Presentation, Application.', topic: 'Fundamentals' },
  { front: 'PDU names', back: 'Bits → Frames → Packets → Segments → Data (going up the stack).', topic: 'Fundamentals' },
  { front: 'Hub vs Switch vs Router', back: 'Hub: L1 repeater (all ports). Switch: L2, forwards by MAC. Router: L3, forwards between networks by IP.', topic: 'Fundamentals' },
  { front: 'MAC address', back: '48-bit hardware identifier for delivery on the LOCAL segment; rewritten every hop.', topic: 'Fundamentals' },
  { front: 'IP address', back: 'Logical, routable address carried unchanged end-to-end; identifies the host per network.', topic: 'Fundamentals' },
  { front: 'Port', back: '16-bit number identifying a process/service on a host; socket = IP:port.', topic: 'Fundamentals' },
  { front: 'Broadcast frame MAC / IP', back: 'MAC FF:FF:FF:FF:FF:FF; IP = all host bits set (e.g. 192.168.1.255). Stops at routers.', topic: 'Fundamentals' },
  { front: 'Unicast vs Broadcast vs Multicast', back: 'One → one; one → all on the local link; one → subscribed group members only.', topic: 'Fundamentals' },
  { front: 'TCP guarantees', back: 'Connection-oriented, reliable, ordered byte stream + flow & congestion control.', topic: 'Transport' },
  { front: 'UDP guarantees', back: 'Best-effort, connectionless, preserves message boundaries, minimal overhead (8-byte header).', topic: 'Transport' },
  { front: 'Three-way handshake', back: 'SYN(x) → SYN-ACK(y, ack=x+1) → ACK(ack=y+1). Both sides sync random ISNs.', topic: 'Transport' },
  { front: 'Four-way termination', back: 'FIN → ACK → FIN → ACK; each direction closed separately; closer holds TIME_WAIT (2×MSL).', topic: 'Transport' },
  { front: 'Sliding window', back: 'Sender keeps only rwnd/cwnd-limited bytes in flight; window “slides” as ACKs arrive.', topic: 'Transport' },
  { front: 'Fast retransmit', back: 'After 3 duplicate ACKs, re-send the missing segment without waiting for the RTO timer.', topic: 'Transport' },
  { front: 'Flow control vs congestion control', back: 'Flow = receiver-driven (advertised rwnd). Congestion = network-driven (sender’s cwnd). Limit = min(rwnd, cwnd).', topic: 'Transport' },
  { front: 'Slow start & AIMD', back: 'Double cwnd every RTT until threshold (slow start); then +1 per RTT, halve on loss (AIMD).', topic: 'Transport' },
  { front: 'Idempotent HTTP methods', back: 'GET, PUT, DELETE, HEAD — same result on repeat. POST is not.', topic: 'Application' },
  { front: 'Status codes 401 vs 403', back: '401: not authenticated (bad/missing credentials). 403: authenticated but not allowed.', topic: 'Application' },
  { front: 'DNS resolution chain', back: 'Client cache → recursive resolver → root → TLD (.com) → authoritative → answer with TTL.', topic: 'Application' },
  { front: 'DHCP DORA', back: 'Discover (broadcast) → Offer → Request → Acknowledge; the client gets IP/mask/gateway/DNS.', topic: 'Application' },
  { front: 'SMTP vs IMAP vs POP3', back: 'SMTP pushes/sends mail (25/587). IMAP syncs and stores on server (143/993). POP3 downloads to one device (110/995).', topic: 'Application' },
  { front: 'RFC 1918 private ranges', back: '10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16. Not routable publicly; NATed to a public IP.', topic: 'IP & Routing' },
  { front: 'Loopback & link-local', back: '127.0.0.0/8 = own host. 169.254.0.0/16 = self-assigned when DHCP fails.', topic: 'IP & Routing' },
  { front: 'Usable hosts in a subnet', back: '2^(32 − prefix) − 2 (network and broadcast addresses reserved).', topic: 'IP & Routing' },
  { front: 'Longest prefix match', back: 'Router picks the routing-table entry whose prefix is most specific (/24 beats /16 beats default).', topic: 'IP & Routing' },
  { front: 'ARP', back: 'Broadcast “who has IP x?” → owner replies (unicast) with its MAC; cached in the ARP table.', topic: 'IP & Routing' },
  { front: 'NAT / PAT', back: 'Router rewrites IP+port per flow and entries match return traffic; blocks unsolicited inbound.', topic: 'IP & Routing' },
  { front: 'What HTTPS gives you', back: 'Confidentiality + integrity + server authentication, via cert chain (asymmetric) then symmetric AEAD session encryption.', topic: 'Security' },
  { front: 'What TLS does NOT protect', back: 'Destination IP, DNS/SNI metadata, traffic patterns, compromised endpoints, application bugs.', topic: 'Security' },
  { front: 'TLS 1.3 handshake sketch', back: 'ClientHello(+key share) → ServerHello + certificate + Finished → client Finished — ~1 RTT, then AEAD-encrypted data.', topic: 'Security' },
]
