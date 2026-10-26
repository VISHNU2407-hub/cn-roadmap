import type { Lesson } from '../types'

export const LESSONS_PART1: Lesson[] = [
  // ------------------------------------------------ WEEK 1
  {
    id: 1,
    week: 1,
    topic: 'Introduction to computer networks',
    category: 'Fundamentals',
    objective: 'Explain basic networking terminology: network, client-server, LAN/WAN, bandwidth, latency.',
    subtopics: [
      'What a network is and why we link devices',
      'Client-server architecture vs peer-to-peer',
      'LAN vs WAN, bandwidth vs latency',
    ],
    checklist: [
      'Define a computer network in one sentence',
      'Describe client-server architecture and one example',
      'Compare LAN and WAN with real examples',
      'Explain the difference between bandwidth and latency',
      'Recall why protocols matter for interoperability',
    ],
    summary:
      'A computer network is a set of devices (hosts) connected by links so they can exchange data using agreed rules called protocols. Networks exist to share resources: files, printers, computation and communication. A protocol is a formal description of message formats and the order of exchanges — without shared protocols, two devices cannot understand each other.\n\nIn client-server architecture, servers run services and wait for requests while clients initiate requests (the web, email, DNS). In peer-to-peer (P2P), nodes act as both client and server (e.g. BitTorrent). Client-server is easier to manage and secure centrally; P2P scales cheaply but is harder to control.\n\nA LAN (Local Area Network) covers a small area like a home, office or campus and is typically privately owned and fast. A WAN (Wide Area Network) connects LANs across large distances, often over leased telecom links — the Internet is the largest WAN. Bandwidth is the capacity of a link (how many bits per second it can carry); latency is the delay a packet experiences (propagation, transmission, queuing, processing time). High bandwidth does not fix high latency: a wide pipe still takes time to fill and to reach the other end.',
    terms: [
      { term: 'Host / end device', def: 'Any device that sends or receives data on a network (PC, phone, server).' },
      { term: 'Protocol', def: 'A set of rules governing message format and exchange order between devices.' },
      { term: 'Bandwidth', def: 'Maximum data-carrying capacity of a link, measured in bits per second.' },
      { term: 'Latency', def: 'Time for data to travel from source to destination, including propagation, queuing and processing delays.' },
      { term: 'Throughput', def: 'Actual measured rate of successful data delivery, usually lower than bandwidth.' },
    ],
    questions: [
      {
        q: 'What is a computer network, and what is the purpose of a protocol?',
        a: 'A computer network is a collection of interconnected devices that exchange data. A protocol is a set of rules defining message format and exchange order; both peers must follow the same protocol to understand each other. Protocols enable interoperability between devices from different vendors.',
        topic: 'Fundamentals',
      },
      {
        q: 'Explain client-server architecture versus peer-to-peer. When would you use each?',
        a: 'In client-server, servers host services and clients initiate requests (e.g. a web browser fetching from a web server) — central control, easy to secure and back up. In P2P every node is both client and server (e.g. BitTorrent) — cheap to scale without central infrastructure but harder to secure and manage. Use client-server for business services; P2P suits content distribution among many equal peers.',
        topic: 'Fundamentals',
      },
      {
        q: 'What is the difference between bandwidth and latency? Can you have high bandwidth but still bad performance?',
        a: 'Bandwidth is the capacity of a link in bits per second; latency is the time a packet takes to travel end to end. You can have high bandwidth but bad performance when latency is high (e.g. a satellite link, or long RTT with TCP window limits), or when there is packet loss forcing retransmissions. For interactive apps latency usually matters more.',
        topic: 'Fundamentals',
      },
      {
        q: 'Give examples of a LAN and a WAN. What characterizes each?',
        a: 'A LAN is a small-area network like your home Wi-Fi or an office network — high speed, low latency, privately managed. A WAN connects sites over long distances using telecom links — e.g. a company connecting branch offices, or the Internet itself. LANs are typically faster and owned by the organization; WANs span operator networks.',
        topic: 'Fundamentals',
      },
    ],
  },
  {
    id: 2,
    week: 1,
    topic: 'The OSI model',
    category: 'Fundamentals',
    objective: 'Explain all seven OSI layers, their responsibilities, and how encapsulation works.',
    subtopics: [
      'The seven layers and each layer’s responsibility',
      'Protocol examples at each layer',
      'Data encapsulation as it moves down the stack',
    ],
    checklist: [
      'Name all 7 layers in order, bottom-up and top-down',
      'State the responsibility of each layer',
      'Match one protocol/device to each layer',
      'Explain encapsulation (PDU names per layer)',
      'Explain why layered models are useful',
    ],
    summary:
      'The OSI model is a 7-layer reference model that splits networking into independent layers, each with a clear responsibility. From top to bottom: Application (user-facing protocols — HTTP, SMTP), Presentation (data format, encoding, encryption), Session (dialog management), Transport (end-to-end delivery, ports — TCP/UDP), Network (logical addressing and routing between networks — IP), Data Link (node-to-node delivery on the local link, MAC addressing, frames — Ethernet), Physical (bits on the wire, radio, fibre).\n\nMnemonic bottom-up: “Please Do Not Throw Sausage Pizza Away”. Each layer adds its own header to the data from the layer above — this is encapsulation: data becomes segments (transport), packets (network), frames (data link) and finally bits (physical). The receiver reverses the process (decapsulation).\n\nThe OSI model is a teaching and reasoning tool, not a literal implementation: real stacks are usually built on TCP/IP. Interviewers use it to see whether you can reason about where a problem or feature lives, e.g. “encryption ≈ presentation”, “routing ≈ network”, “switching ≈ data link”.',
    terms: [
      { term: 'PDU', def: 'Protocol Data Unit — the name of the data unit at a layer: bits, frame, packet, segment.' },
      { term: 'Encapsulation', def: 'Wrapping upper-layer data with each layer’s header as it moves down the stack.' },
      { term: 'Header', def: 'Control information added in front of the payload at a given layer.' },
    ],
    questions: [
      {
        q: 'Name the seven OSI layers in order and give one responsibility or example for each.',
        a: 'From bottom up: Physical (bit transmission — cables, radio), Data Link (node-to-node delivery, MAC addressing, frames — Ethernet, switches), Network (logical addressing and routing — IP, routers), Transport (end-to-end delivery, ports — TCP/UDP), Session (dialog setup and management — RPC sessions), Presentation (formatting, encoding, encryption — TLS is often mapped here, JPEG), Application (user-facing network services — HTTP, SMTP, DNS).',
        topic: 'Fundamentals',
      },
      {
        q: 'Describe what happens when data moves down the stack (encapsulation).',
        a: 'The application hands data to the transport layer, which adds a TCP header (segment). The network layer adds an IP header making a packet. The data link layer adds MAC addresses and a frame check sequence making a frame, and the physical layer transmits it as bits/signals. Each layer treats everything above it as opaque payload. The receiver strips headers in reverse order (decapsulation).',
        topic: 'Fundamentals',
      },
      {
        q: 'Why is the OSI model useful as a mental model even though nobody implements it literally?',
        a: 'It standardizes vocabulary and responsibilities, so engineers can reason and communicate about where a function lives (routing = network, switching = data link). It helps isolate faults layer by layer, and enables interoperability because layer interfaces can be implemented independently. Real systems like TCP/IP map onto it: TCP at transport, IP at network.',
        topic: 'Fundamentals',
      },
      {
        q: 'At which OSI layers do a hub, a switch and a router operate?',
        a: 'Hub: layer 1 (physical) — repeats signals blindly. Switch: layer 2 (data link) — forwards frames by MAC address. Router: layer 3 (network) — forwards packets between networks by IP address.',
        topic: 'Fundamentals',
      },
    ],
    diagram: 'osi',
  },
  {
    id: 3,
    week: 1,
    topic: 'The TCP/IP model',
    category: 'Fundamentals',
    objective: 'Compare the TCP/IP model with OSI, and explain encapsulation and decapsulation.',
    subtopics: [
      'TCP/IP layers and how they map to OSI',
      'Encapsulation and decapsulation end to end',
      'Why the Internet runs on TCP/IP',
    ],
    checklist: [
      'List the TCP/IP layers and map them to OSI',
      'Explain encapsulation with PDU names',
      'Explain decapsulation at the receiver',
      'Compare OSI vs TCP/IP in an interview answer',
      'Identify where real protocols sit (IP, TCP, HTTP)',
    ],
    summary:
      'The TCP/IP model is the practical model the Internet uses. It has four layers (in the classic description): Network Access/Link (OSI physical + data link — Ethernet, Wi-Fi), Internet (OSI network — IP, ICMP), Transport (OSI transport — TCP, UDP), Application (OSI session + presentation + application — HTTP, DNS, SMTP). Some textbooks split the Link layer into two, giving five layers.\n\nEncapsulation: each layer prepends its header and (sometimes) a trailer. An HTTP message becomes a TCP segment, then an IP packet, then an Ethernet frame carrying the payload as bits. Decapsulation is the mirror image at the receiver: each layer validates and strips its header and passes the payload up.\n\nIn an interview, the clean comparison: OSI is a 7-layer conceptual/teaching model, prescriptive and protocol-neutral; TCP/IP is a 4-layer descriptive model that matches what the Internet actually runs. OSI splits the top functionality into three layers where TCP/IP collapses it into one Application layer, and OSI’s data link + physical become TCP/IP’s Network Access layer.',
    terms: [
      { term: 'Segment', def: 'Transport-layer PDU (TCP/UDP).' },
      { term: 'Packet / datagram', def: 'Internet-layer PDU (IP).' },
      { term: 'Frame', def: 'Link-layer PDU (Ethernet, Wi-Fi).' },
      { term: 'MTU', def: 'Maximum transmission unit — the largest payload a link can carry; Ethernet is typically 1500 bytes.' },
    ],
    questions: [
      {
        q: 'Compare the OSI and TCP/IP models — layers, purpose, and practical relevance.',
        a: 'OSI has 7 layers (physical → application); TCP/IP has 4 (network access, internet, transport, application). OSI is a conceptual reference model created for standardization and teaching; TCP/IP describes the protocol suite the Internet actually uses. TCP/IP’s application layer covers OSI’s top three layers, and its network access layer covers OSI’s bottom two. In practice we use TCP/IP terminology but borrow OSI layer numbers when discussing devices.',
        topic: 'Fundamentals',
      },
      {
        q: 'Walk through encapsulation for an HTTP request leaving your laptop.',
        a: 'HTTP builds the request message. TCP wraps it with source/destination ports, sequence and window fields — a segment. IP adds source/destination addresses, TTL and protocol number — a packet. Ethernet (or Wi-Fi) adds source/destination MAC addresses, type field and FCS — a frame. The NIC transmits the frame as bits. Each router strips and rewrites the link-layer header while keeping the IP packet intact.',
        topic: 'Fundamentals',
      },
      {
        q: 'What is decapsulation and where does each header get removed?',
        a: 'It is the receiver-side reverse of encapsulation: the NIC receives bits and reassembles the frame, the data link layer checks the FCS and strips its header, the network layer validates and strips the IP header, the transport layer strips the TCP/UDP header and reassembles the byte stream, and the application finally reads the message. Each layer only understands its own peer-layer headers.',
        topic: 'Fundamentals',
      },
    ],
    diagram: 'tcpip',
  },
  {
    id: 4,
    week: 1,
    topic: 'Networking devices',
    category: 'Fundamentals',
    objective: 'Explain the role of hub, switch, router, bridge and modem, and when each is used.',
    subtopics: [
      'Hub, switch, router: the layer each operates at',
      'Bridge and modem',
      'Choosing the right device for the job',
    ],
    checklist: [
      'Describe a hub and why it is obsolete',
      'Explain how a switch forwards frames',
      'Explain what a router does that a switch cannot',
      'Describe a bridge and a modem',
      'State which device connects different networks',
    ],
    summary:
      'A hub is a layer-1 device: it repeats every incoming signal out of all other ports, so all connected hosts share the same collision domain and everyone sees everyone’s traffic. Hubs are obsolete, replaced by switches.\n\nA switch is a layer-2 device that forwards frames based on destination MAC addresses. It learns which MAC address lives on which port by inspecting source addresses of incoming frames (the MAC address table), and unicasts frames to the right port. Each port is its own collision domain.\n\nA router is a layer-3 device that forwards packets between different networks based on IP routing tables. It separates broadcast domains, chooses the best route, can filter traffic, and connects LANs to WANs. A bridge is a precursor of the switch — it joins two LAN segments at layer 2 and filters traffic between them. A modem (modulator-demodulator) converts between digital data and signals suitable for a transport medium (DSL line, cable, cellular); a router/switch then distributes connectivity inside the home.',
    terms: [
      { term: 'Collision domain', def: 'A network segment where frames can collide (shared medium); switch ports separate them.' },
      { term: 'Broadcast domain', def: 'The set of devices that receive one another’s broadcast frames; terminated only by routers (or VLANs).' },
      { term: 'MAC address table', def: 'A switch’s mapping of MAC addresses to ports, learned from source addresses.' },
    ],
    questions: [
      {
        q: 'What is the difference between a hub, a switch and a router?',
        a: 'A hub is a physical-layer repeater: it sends every bit out all ports, hosts share one collision domain and it is obsolete. A switch is a data-link device: it learns MAC-to-port mappings and forwards frames only out the needed port, giving each port its own collision domain. A router is a network-layer device: it forwards packets between different IP networks using routing tables, separates broadcast domains, and reaches the outside world.',
        topic: 'Fundamentals',
      },
      {
        q: 'How does a switch learn where devices are?',
        a: 'When a frame arrives, the switch records the source MAC address and incoming port in its MAC address table. It then looks up the destination MAC: if known, it forwards out that one port; if unknown, it floods the frame out all other ports in the broadcast domain. Entries age out if not refreshed.',
        topic: 'Fundamentals',
      },
      {
        q: 'Why do we need a router to connect to the Internet — why not just more switches?',
        a: 'Switches only understand MAC addressing, which is local to one broadcast domain; there is no global MAC-based routing and broadcasts would flood everything. Routers work at the IP layer: they route packets toward the destination network using routing tables (including the default route to the ISP), hop by hop across the Internet.',
        topic: 'Fundamentals',
      },
      {
        q: 'What does a modem do?',
        a: 'A modem converts digital signals from your device into analogue/line signals suitable for the carrier medium (telephone line, cable, fibre, cellular radio) and demodulates the reverse direction, connecting a site to the ISP network.',
        topic: 'Fundamentals',
      },
    ],
  },
  {
    id: 5,
    week: 1,
    topic: 'IP address, MAC address and ports',
    category: 'Fundamentals',
    objective: 'Explain how data reaches the correct device and application using IPs, MACs and ports.',
    subtopics: [
      'IP vs MAC: logical routing address vs physical link address',
      'IPv4 structure and public/private basics',
      'Port numbers and sockets',
    ],
    checklist: [
      'Compare IP and MAC addresses and their jobs',
      'Explain what a port identifies on a host',
      'Define a socket',
      'Recall well-known port examples (80, 443, 22, 53)',
      'Explain the journey: IP gets you to the host, port to the process',
    ],
    summary:
      'Three identifiers cooperate to deliver data. The MAC address is a globally unique 48-bit hardware identifier (e.g. 3C:22:FB:…:…) burned into the NIC; it is used for delivery on the local network segment only, and changes meaning as frames hop between links (it is rewritten at each hop). The IP address is a logical, hierarchically structured address (e.g. 192.168.1.20) that supports routing across many networks; it stays with the packet end to end and can change with your network location.\n\nIP routes the packet to the destination host’s network; ARP resolves the final MAC on the destination link. A port is a 16-bit number (0–65535) identifying a specific process/service on a host — so multiple apps on one machine share one IP. Web servers use 80 (HTTP) and 443 (HTTPS), SSH 22, DNS 53, SMTP 25. Ports 0–1023 are well-known, 1024–49151 registered, 49152–65535 ephemeral.\n\nA socket is the combination of IP address and port (implicitly with a protocol): 192.168.1.20:443. A TCP connection is defined by the pair of sockets — (client IP:port, server IP:port) — which is why thousands of connections can hit one server port 443.',
    terms: [
      { term: 'Port', def: '16-bit identifier of a process/service on a host; allows multiplexing many connections per IP.' },
      { term: 'Socket', def: 'IP address + port (per protocol); endpoints of TCP connections.' },
      { term: 'Ephemeral port', def: 'Temporary client-side port chosen automatically per connection.' },
      { term: 'Well-known ports', def: '0–1023, reserved for standard services (80 HTTP, 443 HTTPS, 53 DNS, 22 SSH).' },
    ],
    questions: [
      {
        q: 'Why does networking need both MAC addresses and IP addresses?',
        a: 'MAC addresses identify hardware on a local segment for hop-to-hop delivery (frames), IP addresses identify hosts globally for network-level routing (packets). A packet’s IP addresses stay constant end to end, but its MAC addresses change on every hop. Layered design: IP is logical and location-based, MAC is flat and local.',
        topic: 'Fundamentals',
      },
      {
        q: 'What is the purpose of a port number, and what is a socket?',
        a: 'Port numbers identify the sending/receiving process (service) on a host, letting many applications share one IP — the OS demultiplexes by port. A socket is the combination of IP address and port. A TCP connection is uniquely identified by the two endpoint sockets, so many clients can connect to server port 443 simultaneously.',
        topic: 'Fundamentals',
      },
      {
        q: 'Explain how data reaches the right application: browser → web server.',
        a: 'The browser sends to the server IP:443. IP routing walks the packet to the server’s network hop by hop, each hop resolving the next MAC via ARP. The final router delivers the frame to the server’s NIC; the server’s TCP stack sees port 443, finds the listening web-server socket, and hands the data to that process.',
        topic: 'Fundamentals',
      },
    ],
    diagram: 'encapsulation',
  },
  {
    id: 6,
    week: 1,
    topic: 'Network communication types',
    category: 'Fundamentals',
    objective: 'Understand unicast, broadcast and multicast packet delivery patterns.',
    subtopics: [
      'Unicast: one-to-one delivery',
      'Broadcast and its scope limits',
      'Multicast: one-to-many efficiently',
    ],
    checklist: [
      'Define unicast, broadcast and multicast',
      'Recall the IPv4 broadcast address pattern',
      'Know one real multicast use case',
      'Explain why broadcasts stop at routers',
      'Relate each pattern to Ethernet behaviour',
    ],
    summary:
      'Unicast is one-to-one delivery: a frame/packet addressed to a single host — the normal case for almost all Internet traffic. Broadcast is one-to-all on the local link: a frame addressed to FF:FF:FF:FF:FF:FF (MAC) or the subnet’s directed broadcast address (e.g. 192.168.1.255) is processed by every host in the broadcast domain. Routers do not forward broadcast frames, which contains their scope. ARP requests and DHCP discovery use broadcast because the sender doesn’t yet know the target’s address.\n\nMulticast is one-to-many: a single stream is delivered only to hosts that joined a multicast group (IPv4 class D addresses 224.0.0.0/4, joining via IGMP). The source sends one copy; the network replicates it only where subscribed receivers live — used for IPTV, video conferencing, linking routing protocols (OSPF hellos to 224.0.0.5).\n\nEthernet frames carry a destination MAC; NICs accept frames addressed to their own MAC, broadcast, or a joined multicast group, and discard the rest.',
    terms: [
      { term: 'Unicast', def: 'One-to-one delivery to a single host.' },
      { term: 'Directed broadcast', def: 'An IPv4 address with all host bits set (…255) representing all hosts of that subnet.' },
      { term: 'Multicast group', def: 'A set of receivers subscribed to one multicast address; replication happens near receivers.' },
      { term: 'IGMP', def: 'Internet Group Management Protocol — hosts use it to join/leave multicast groups on a LAN.' },
    ],
    questions: [
      {
        q: 'Compare unicast, broadcast and multicast, with an example of each.',
        a: 'Unicast sends one copy to one destination (each HTTP reply). Broadcast sends to every host in the local broadcast domain (FF:FF:FF:FF:FF:FF) — used by ARP/DHCP, never forwarded by routers. Multicast delivers one copy to all subscribed receivers only (224.0.0.0/4, e.g. IPTV or OSPF hellos), letting the network replicate efficiently between source and group members.',
        topic: 'Fundamentals',
      },
      {
        q: 'Why can broadcast flooding hurt a network, and how do you contain it?',
        a: 'Every host must process every broadcast frame, and broadcasts consume everyone’s bandwidth; large flat networks and loops amplify this (broadcast storms). Contain them by splitting networks into smaller subnets/VLANs connected by routers, since routers terminate broadcast domains (unless forwarding helpers like DHCP relay are used).',
        topic: 'Fundamentals',
      },
      {
        q: 'One server streams video to 10,000 viewers — why is multicast more efficient than unicast?',
        a: 'With unicast the server sends 10,000 identical copies and its uplink collapses. With multicast the server sends one stream to a group address; routers replicate only toward branches with subscribed receivers, so network load scales with topology, not viewer count.',
        topic: 'Fundamentals',
      },
    ],
  },
  {
    id: 7,
    week: 1,
    topic: 'Week 1 revision',
    category: 'Revision',
    objective: 'Review Days 1–6: answer 10 mixed questions, then write a short self-assessment.',
    subtopics: [
      'Review notes from Days 1–6',
      'Answer 10 mixed interview questions (no notes!)',
      'Write a self-assessment marking weak topics',
    ],
    checklist: [
      'Reread/refresh your Day 1–6 notes (max 15 min)',
      'Answer all 10 quiz questions from memory first',
      'Read the model answers and mark yourself honestly',
      'List 2–3 topics you need to revisit',
      'Write a short self-assessment in Notes',
    ],
    summary:
      'Today is consolidation. Spend the first 35 minutes reviewing your notes for Days 1–6 — redraw the OSI stack and the encapsulation flow from memory, and re-explain the IP/MAC/port trio aloud. During the recall block, take the 10-question mixed quiz below without looking at notes, then mark yourself honestly and log wrong answers.\n\nFinish by writing a short self-assessment in the notes area: two or three topics that felt shaky (for example subnet-free terms you couldn’t define, or where broadcast traffic stops), and schedule a revisit during week days 15–26 revision slots. Identifying weak spots early is exactly what the Day 28 assessment will later measure.',
    terms: [
      { term: 'Spaced recall', def: 'Re-testing yourself after a delay; far more effective for retention than re-reading.' },
      { term: 'Feynman check', def: 'If you can’t explain a concept simply out loud, you don’t know it well yet.' },
    ],
    questions: [
      {
        q: 'Quiz day — use the 10-question quiz in the activity section below.',
        a: 'The quiz covers networks and protocols, OSI layers, devices, IP/MAC/ports, communication types and encapsulation. Attempt from memory, then check answers.',
        topic: 'Revision',
      },
    ],
    quiz: [
      {
        q: 'What is a computer network, and why are protocols needed?',
        a: 'A set of devices interconnected to exchange data. Protocols are shared rules of message format and order of exchange; without agreement on them, devices cannot interoperate.',
        topic: 'Fundamentals',
      },
      {
        q: 'List the seven OSI layers in order with one example protocol or device each.',
        a: 'Physical (cable/NIC), Data Link (Ethernet/switch), Network (IP/router), Transport (TCP/UDP), Session, Presentation, Application (HTTP/SMTP). Session and presentation rarely exist as distinct layers in real stacks.',
        topic: 'Fundamentals',
      },
      {
        q: 'Where do a hub, a switch and a router operate, and what is the practical difference?',
        a: 'Hub L1: repeats signals out all ports — one collision domain, obsolete. Switch L2: forwards frames to the port learned by destination MAC — isolates collisions. Router L3: forwards packets between IP networks, terminates broadcast domains.',
        topic: 'Fundamentals',
      },
      {
        q: 'What is the difference between a MAC address and an IP address?',
        a: 'MAC is a 48-bit hardware identifier used for delivery on the local link, rewritten at each hop. IP is a logical, routable address assigned by configuration/DHCP, carried unchanged end to end.',
        topic: 'Fundamentals',
      },
      {
        q: 'What does a port number do, and what is a socket?',
        a: 'It identifies the process/service on a host so many apps share one IP. A socket is IP address + port; a TCP connection is identified by the pair of sockets.',
        topic: 'Fundamentals',
      },
      {
        q: 'What is encapsulation? Name the PDU at each layer.',
        a: 'Each layer wraps upper data with its own header going down the stack: segment (TCP), packet (IP), frame (Ethernet), bits (physical). Decapsulation reverses it at the receiver.',
        topic: 'Fundamentals',
      },
      {
        q: 'Compare bandwidth and latency with one concrete example.',
        a: 'Bandwidth is capacity (bits/s — how wide the pipe is); latency is delay (how long a packet takes). A satellite link has decent bandwidth but ~600 ms RTT, so interactive use feels laggy regardless of speed.',
        topic: 'Fundamentals',
      },
      {
        q: 'Give an everyday example of broadcast traffic and explain how far it travels.',
        a: 'ARP “who has 192.168.1.10?” is sent to FF:FF:FF:FF:FF:FF — every host in the local broadcast domain must process it. Routers do not forward broadcast frames, so it stops at the local subnet/VLAN.',
        topic: 'Fundamentals',
      },
      {
        q: 'Your office has 200 employees on one big unmanaged switch. What problems do you foresee and how would you fix them?',
        a: 'One giant broadcast domain (noise, broadcast storms, flat security). Replace with managed switches, slice into VLANs/subnets, and route between them with a router/L3 switch; possibly multicast filtering and storm control.',
        topic: 'Fundamentals',
      },
      {
        q: 'Client-server vs P2P: give one advantage of each.',
        a: 'Client-server: central control, easy security/backup/management. P2P: scales without central infrastructure and shares load across peers (e.g. BitTorrent distribution).',
        topic: 'Fundamentals',
      },
    ],
  },

  // ------------------------------------------------ WEEK 2
  {
    id: 8,
    week: 2,
    topic: 'TCP vs UDP',
    category: 'Transport',
    objective: 'Compare TCP and UDP confidently: reliability, ordering, overhead and use cases.',
    subtopics: [
      'Connection-oriented vs connectionless',
      'Reliability, ordering and flow control features',
      'Overhead and typical use cases',
    ],
    checklist: [
      'List TCP guarantees and what UDP provides instead',
      'Explain why UDP packets can be lost/reordered',
      'Match apps to TCP vs UDP (web, DNS, video, gaming)',
      'Explain the speed/overhead trade-off',
      'Know where modern adaptations fit (QUIC/HTTP3)',
    ],
    summary:
      'TCP (Transmission Control Protocol) is connection-oriented and reliable: it establishes a connection (3-way handshake), guarantees ordered delivery with sequence numbers and acknowledgements, detects loss and retransmits, manages flow control (receiver window) and congestion control (sender window). It is byte-stream based — you lose message boundaries.\n\nUDP (User Datagram Protocol) is connectionless and unreliable: it is a thin wrapper around IP adding only ports and an optional checksum. No handshake, no retransmission, no ordering, no congestion control; it preserves message boundaries (datagrams). It is faster, lower-overhead, and hands the reliability decision to the application.\n\nUse cases: HTTP(S), email, file transfer → TCP (need completeness). DNS queries, VoIP, video streaming, online games → UDP (need small, fast messages; late data is worthless; retransmit at app level only if needed). DNS uses UDP/53 for standard queries but TCP/53 for large responses or zone transfer. Modern note: QUIC (HTTP/3) implements TCP-like reliability inside UDP at the application layer.',
    terms: [
      { term: 'Connection-oriented', def: 'Communication preceded by explicit setup (TCP handshake) and torn down at the end.' },
      { term: 'Datagram', def: 'An independent, self-contained message (UDP unit) with no delivery guarantee.' },
      { term: 'Checksum', def: 'A field used to detect corruption in a segment/datagram.' },
      { term: 'QUIC', def: 'A UDP-based transport providing TCP-like reliability with lower connection setup latency (basis of HTTP/3).' },
    ],
    questions: [
      {
        q: 'Explain the key differences between TCP and UDP and when to use each.',
        a: 'TCP: connection-oriented, reliable, ordered byte stream with flow/congestion control and higher overhead. UDP: connectionless, best-effort, preserves message boundaries, minimal overhead. Choose TCP when all data must arrive (web, email, file transfer) and UDP for latency-sensitive or simple request/reply traffic (VoIP, games, DNS) where the app tolerates or handles loss. DNS is a good nuance: UDP for normal lookups, TCP for truncated/large responses.',
        topic: 'Transport',
      },
      {
        q: 'Why is UDP often chosen for video streaming or online games despite being unreliable?',
        a: 'Because late data is worthless: a retransmitted frame of a live stream arrives after its playtime. UDP avoids handshake and retransmission latency; the app can drop old packets, use codecs that tolerate loss, and prioritize fresh frames — keeping latency low matters more than perfect delivery.',
        topic: 'Transport',
      },
      {
        q: 'What does TCP provide that IP alone does not?',
        a: 'End-to-end reliability (sequence numbers, ACKs, retransmission), in-order delivery, duplicate suppression, flow control (receiver-advertised window), congestion control, and connection lifecycle. IP is best-effort, unordered, unverified beyond header checksum and hop-limited.',
        topic: 'Transport',
      },
      {
        q: 'Why is HTTP/3 built on QUIC instead of plain TCP?',
        a: 'QUIC runs over UDP, but provides TCP-like reliability: 0-vs-1-RTT connection establishment combined with TLS, no head-of-line blocking across independent streams, connection migration across IP changes (e.g. Wi-Fi→cellular), and it can evolve in user space rather than waiting for OS/kernel updates.',
        topic: 'Transport',
      },
    ],
  },
  {
    id: 9,
    week: 2,
    topic: 'TCP three-way handshake',
    category: 'Transport',
    objective: 'Draw and explain the three-way handshake (SYN, SYN-ACK, ACK) and sequence numbers.',
    subtopics: [
      'SYN, SYN-ACK, ACK message by message',
      'Initial sequence numbers and why they are random',
      'Why exactly three steps (not two)',
    ],
    checklist: [
      'Draw the handshake without notes',
      'Explain what each message confirms',
      'Explain ISN randomness (security + history)',
      'Explain why both sides need one each way',
      'Know the related flags in the TCP header',
    ],
    summary:
      'The three-way handshake synchronizes both ends before any data flows. 1) Client → SYN: carries a random initial sequence number (ISN) x and requests a connection. 2) Server → SYN-ACK: picks its own ISN y, acknowledges the client’s x by setting ack = x+1. 3) Client → ACK: ack = y+1. Both sides now know each other’s ISNs (which become “the first byte number” of the stream) and are in ESTABLISHED state; the ACK step often carries the first data byte with it.\n\nWhy three steps: each side must both send its own starting sequence number and have the other side acknowledge it — otherwise a receiver can’t distinguish old duplicates of a previous connection’s segments (old SYN retransmissions wandering the Internet). ISNs are randomized to prevent attackers from injecting or hijacking connections by guessing sequence numbers (blind spoofing attacks, famously mitigated after the Morris worm).\n\nConnection states: listen (server), SYN-SENT (client), SYN-RECEIVED (server after SYN-ACK), ESTABLISHED. A failed/flooded handshake list on the server is the half-open connection queue — exploited by SYN flood DoS attacks (server keeps half-open state waiting for the final ACK).',
    terms: [
      { term: 'ISN', def: 'Initial Sequence Number — random starting byte number chosen by each side of a TCP connection.' },
      { term: 'SYN / ACK flags', def: 'Header control bits: SYN requests sync; ACK acknowledges receipt of data up to a byte.' },
      { term: 'Half-open connection', def: 'A connection where one side completed the handshake but the peer did not (SYN flood creates many).' },
    ],
    questions: [
      {
        q: 'Draw and explain the TCP three-way handshake.',
        a: 'Client sends SYN with its random ISN x. Server responds SYN-ACK with its own ISN y and ack = x+1. Client sends ACK with ack = y+1 (optionally with first data). Purpose: synchronize initial sequence numbers both ways and establish state. Without the third ACK the server can’t confirm the client received its ISN.',
        topic: 'Transport',
      },
      {
        q: 'Why are initial sequence numbers random instead of starting at 0?',
        a: 'Random ISNs prevent blind spoofing/hijacking — an attacker can’t inject valid segments without knowing the sequence space, and old duplicate segments from previous connections are less likely to be accepted as valid. (Deterministic ISNs were famously exploited; modern kernels randomize per connection.)',
        topic: 'Transport',
      },
      {
        q: 'Why three messages — why isn’t two enough?',
        a: 'Two-way sync lets each side announce its ISN but the server can’t know whether the client saw its SYN-ACK. The third ACK closes that loop. It also lets the server discard duplicate SYN retransmissions from aborted connection attempts.',
        topic: 'Transport',
      },
      {
        q: 'What is a SYN flood and one defence?',
        a: 'An attacker sends many SYNs but never completes the handshake, filling the server’s half-open queue and denying service. Defences: SYN cookies (encode connection state into the sequence number, defer state), firewall rate limiting, backlog tuning.',
        topic: 'Transport',
      },
    ],
    diagram: 'handshake',
  },
  {
    id: 10,
    week: 2,
    topic: 'TCP connection termination',
    category: 'Transport',
    objective: 'Explain the four-way termination (FIN/ACK) and why TIME_WAIT exists.',
    subtopics: [
      'FIN, ACK, FIN, ACK message by message',
      'Why teardown takes four steps',
      'TIME_WAIT and the 2×MSL delay',
    ],
    checklist: [
      'Draw the four-way teardown without notes',
      'Explain FIN half-close semantics',
      'Explain why TIME_WAIT waits 2×MSL',
      'Know final states (CLOSE_WAIT, TIME_WAIT…)',
      'Relate teardown to graceful vs abrupt closes',
    ],
    summary:
      'Closing is four steps because a TCP stream is full-duplex — each direction must be closed separately. 1) Closing side → FIN (“I have no more data”). 2) Peer → ACK. Now the peer can still send (half-close). 3) When the peer finishes, it sends its own FIN. 4) The closing side ACKs it. Either side can initiate; often the server closes first after responding.\n\nTIME_WAIT: the side that sends the final ACK holds the connection (more precisely its socket identity) for 2×MSL (Maximum Segment Lifetime — usually 60 s total). Reasons: (a) if the final ACK is lost, the peer retransmits its FIN and the TIME_WAIT holder can re-ACK; (b) any stray duplicate segments from this connection die out rather than corrupting a new connection using the same 4-tuple. Practical effect: servers/extreme client churn that opens thousands of short-lived connections may exhaust ephemeral ports until TIME_WAIT entries expire — an interview favourite.',
    terms: [
      { term: 'FIN', def: 'Flag signalling “no more data from me” — begins half-close of one direction.' },
      { term: 'Half-close', def: 'One direction closed (FIN ⇒ ACK) while the other still sends.' },
      { term: 'MSL', def: 'Maximum Segment Lifetime — how long a segment can roam the network; typical implementation value 30–60 s.' },
      { term: 'TIME_WAIT', def: 'State held 2×MSL after sending the final ACK, to re-ACK lost FINs and let duplicates expire.' },
    ],
    questions: [
      {
        q: 'Describe the four-way TCP connection termination.',
        a: 'The closer sends FIN; the peer ACKs it (its direction is still usable — half-close); later the peer sends its own FIN; the closer ACKs and enters TIME_WAIT for 2×MSL. Four messages because each direction is closed independently.',
        topic: 'Transport',
      },
      {
        q: 'Why does TIME_WAIT exist and why does it matter for servers?',
        a: 'It guarantees the final ACK can be re-sent if the peer’s FIN retransmission arrives, and lets old duplicate segments expire before the 4-tuple is reused. Consequence: hosts creating massive numbers of short connections accumulate TIME_WAIT sockets, potentially exhausting ephemeral ports — tune keep-alive reuse, shorten timeouts, or reuse ports carefully.',
        topic: 'Transport',
      },
      {
        q: 'What is a half-close and a legitimate use?',
        a: 'After the client’s FIN, the client stops sending but may still receive; the server keeps sending data it had queued. Use case: client sends a request then signals “that’s all” with FIN while the server streams the (long) response back.',
        topic: 'Transport',
      },
    ],
    diagram: 'termination',
  },
  {
    id: 11,
    week: 2,
    topic: 'TCP reliability and flow control',
    category: 'Transport',
    objective: 'Explain how TCP delivers data reliably: ACKs, retransmission and sliding windows.',
    subtopics: [
      'Sequence numbers, ACKs and retransmission (RTO, fast retransmit)',
      'Sliding window: sender-side buffering in flight',
      'Receiver flow control (advertised window)',
    ],
    checklist: [
      'Explain cumulative ACK and duplicate ACKs',
      'Compare timeout retransmission vs fast retransmit',
      'Describe the sliding window idea',
      'Explain the receiver window (rwnd) and zero-window',
      'Relate reliability to loss detection',
    ],
    summary:
      'TCP numbers every byte. The ACK field says “I have correctly received all bytes up to N-1; send me N next” — this cumulative acknowledgement also implicitly rejects gaps. The receiver withholds ACKs slightly to allow delayed-ACK batching, and sends duplicate ACKs when out-of-order segments arrive (a gap exists).\n\nLoss detection: (a) retransmission timeout (RTO) — the sender’s timer fires and it re-sends the unacknowledged segment; (b) fast retransmit — three duplicate ACKs strongly suggest loss, so the sender re-sends immediately without waiting for the timer. The console of bytes not yet ACKed is the window: the sender may have only bytes within the window in flight — a sliding window that moves forward as ACKs arrive.\n\nFlow control protects the receiver: every ACK advertises how much buffer space remains (receive window, rwnd). If the app reads slowly, rwnd shrinks to zero; the sender stops and probes occasionally (persist timer) until space frees. This is receiver-driven; congestion control (next lesson) is network-driven — two different knobs.',
    terms: [
      { term: 'Cumulative ACK', def: 'Acknowledges receipt of all bytes up to (but not including) the ack number.' },
      { term: 'RTO', def: 'Retransmission timeout, adapted dynamically from measured round-trip time (RTT) and its variance.' },
      { term: 'Fast retransmit', def: 'Resending after 3 duplicate ACKs, without waiting for RTO.' },
      { term: 'rwnd / zero-window', def: 'Receiver-advertised free buffer space; zero means the receiver is full and the sender must pause.' },
    ],
    questions: [
      {
        q: 'How does TCP detect and recover from packet loss?',
        a: 'Two mechanisms: the retransmission timer (RTO, estimated from RTT and variance) fires for unacknowledged data, and fast retransmit triggers after three duplicate ACKs (a sign that a gap is making the receiver send repeated ACKs). Lost segments are then resent, and the ACK stream confirms repair.',
        topic: 'Transport',
      },
      {
        q: 'Explain TCP flow control and the sliding window.',
        a: 'The receiver advertises its remaining buffer space (rwnd) in every ACK; the sender may keep at most that much data in flight. As the app drains data, rwnd grows and the window “slides” forward. If rwnd reaches zero the sender stops and probes with zero-window probes until buffer frees. This is receiver-driven — distinct from congestion control, which is network-driven.',
        topic: 'Transport',
      },
      {
        q: 'The receiver buffer is full. What exactly happens at both ends?',
        a: 'The receiver advertises a zero window; the sender stops sending new data, keeps the connection alive with persist-timer window probes, resumes when a later ACK advertises a non-zero window. If the receiver process stayed stuck, the sender would be blocked indefinitely — often the app’s own bug, surfacing as “the connection stalled”.',
        topic: 'Transport',
      },
    ],
  },
  {
    id: 12,
    week: 2,
    topic: 'Congestion control',
    category: 'Transport',
    objective: 'Distinguish congestion control from flow control; explain slow start and congestion avoidance conceptually.',
    subtopics: [
      'What network congestion is and how it hurts',
      'Slow start (exponential) and congestion avoidance (AIMD)',
      'Controlled by loss or by delay signals',
    ],
    checklist: [
      'Define congestion control vs flow control precisely',
      'Explain cwnd and how it interacts with rwnd',
      'Describe slow start and congestion avoidance',
      'Know the two congestion signals (loss, delay)',
      'Be able to contrast the two controls in one breath',
    ],
    summary:
      'Congestion control protects the network: routers have finite queues, and when too many packets try to flow simultaneously, queues fill, delays grow and packets drop. TCP’s sender keeps a congestion window (cwnd) that it adjusts based on inferred congestion; the real limit in flight is min(cwnd, rwnd).\n\nSlow start: starting a connection, the sender doubles cwnd each RTT (1, 2, 4, 8…) until reaching a slow-start threshold (ssthresh) or loss. Then congestion avoidance: linear growth (add one segment per RTT) — AIMD (Additive Increase, Multiplicative Decrease). On detected loss (timeout), cwnd collapses to restart slow start; on triple-duplicate-ACK loss, halve cwnd (fast recovery).\n\nLoss-based (classic Reno) vs delay-based (e.g. Vegas, BBR) algorithms: loss-based waits for drops, which is unfriendly on high-latency links and can cause bufferbloat; delay/probing algorithms read growing queueing delay. Flow control is the receiver telling the sender “don’t overwhelm me”; congestion control is the sender being a polite citizen of the network (“don’t overwhelm the Internet”). Both cap the send rate, for different reasons.',
    terms: [
      { term: 'cwnd', def: 'Congestion window — sender-estimated safe limit of in-flight bytes to avoid overloading the network.' },
      { term: 'AIMD', def: 'Additive Increase (probe upward slowly), Multiplicative Decrease (halve on loss) — the core of TCP congestion behaviour.' },
      { term: 'Bufferbloat', def: 'Oversized queues adding large delays before packets drop — hurts interactive apps.' },
    ],
    questions: [
      {
        q: 'What is the difference between flow control and congestion control?',
        a: 'Flow control is end-to-end and receiver-driven: the receiver advertises buffer space (rwnd) so the sender doesn’t outrun the receiving app. Congestion control is network-driven: the sender estimates network capacity (cwnd) and backs off when loss or growing delay appears, to avoid overloading routers. The effective send limit is min(cwnd, rwnd).',
        topic: 'Transport',
      },
      {
        q: 'Explain slow start and congestion avoidance conceptually.',
        a: 'Slow start doubles cwnd each RTT (exponential probe) until reaching a threshold or experiencing loss — fast ramp-up at the beginning of a connection. Above the threshold TCP switches to AIMD: increase one segment per RTT, halve on congestion — stable probing near capacity. Classic Reno, modern variants (CUBIC, BBR) refine these curves.',
        topic: 'Transport',
      },
      {
        q: 'Why do TCP connections often start slow (ramp-up) rather than at full speed?',
        a: 'The sender has no idea of available bandwidth initially; blasting data would cause immediate loss for everyone. Slow start probes exponentially to find the corridor quickly, then settles into linear exploration. On high-bandwidth-delay links slow start itself limits early throughput — hence large initial receive windows (e.g. Linux tcp_slow_start_after_idle tuning, initial cwnd ≈ 10).',
        topic: 'Transport',
      },
      {
        q: 'What is bufferbloat and what problem does it cause?',
        a: 'Oversized router/device buffers queue excess packets, adding hundreds of milliseconds of delay before any real congestion signal (drop) appears — interactive apps feel laggy even at low loss. Fixes: smarter queue discipline (FQ-CoDel/CAKE), ECN, delay-based congestion algorithms (BBR).',
        topic: 'Transport',
      },
    ],
  },
  {
    id: 13,
    week: 2,
    topic: 'HTTP and HTTPS',
    category: 'Application',
    objective: 'Explain HTTP methods, status codes, headers, and how HTTPS secures web traffic.',
    subtopics: [
      'HTTP methods and status codes',
      'Headers, caching and statelessness',
      'HTTPS: TLS, certificates, encryption split',
    ],
    checklist: [
      'Know GET/POST/PUT/DELETE and idempotency',
      'Recall 200, 301, 302, 403, 404, 500 meanings',
      'Explain stateless + cookies',
      'Explain TLS: cert, key exchange, symmetric encryption',
      'Contrast HTTP/1.1 vs HTTP/2 (and mention HTTP/3)',
    ],
    summary:
      'HTTP is a stateless request/response protocol: each request from the client carries everything the server needs; state is bolted on with cookies, tokens and server-side sessions. Methods: GET (read, idempotent, cacheable), POST (create/process, non-idempotent), PUT (replace wholly, idempotent), PATCH (partial), DELETE (remove, idempotent), HEAD (headers only), OPTIONS (capability discovery — CORS preflight). Status codes: 1xx informational, 2xx success (200 OK, 201 Created, 304 Not Modified), 3xx redirects (301 permanent, 302 temporary, 304 not-modified), 4xx client error (400 bad request, 401 unauthorized, 403 forbidden, 404 not found, 429 rate-limited), 5xx server error (500 internal, 502 bad gateway, 503 unavailable).\n\nHeaders carry metadata: Host (virtual hosting), Content-Type, Accept, authorization tokens, Cache-Control/ETag (caching), Set-Cookie. Caching via freshness (Cache-Control, Expires) and validators (ETag, Last-Modified + 304).\n\nHTTPS = HTTP over TLS. TLS uses asymmetric cryptography for authentication and key exchange (server certificate chains to a trusted CA, optionally mTLS both ways); then symmetric encryption (e.g. AES-GCM, ChaCha20) protects the data because symmetric is much faster. It guarantees confidentiality (nobody reads your data), integrity (nobody modifies it undetected), and server authentication (you talk to the real owner of the domain). Note: TLS encrypts content but not domain names (SNI leaks) or IP addresses.',
    terms: [
      { term: 'Stateless', def: 'Each request carries all needed context; the server stores no client session in the protocol itself.' },
      { term: 'Idempotent', def: 'Repeating the request produces the same result (GET, PUT, DELETE — not POST).' },
      { term: 'TLS handshake', def: 'Exchange verifying the certificate and establishing symmetric session keys.' },
      { term: 'CA / certificate chain', def: 'Hierarchy of authorities that vouch for the certificate; browsers verify path to a root in their trust store.' },
    ],
    questions: [
      {
        q: 'Explain the most common HTTP methods and which are idempotent.',
        a: 'GET reads (idempotent, cacheable), POST creates/processes (not idempotent), PUT fully replaces a resource (idempotent), PATCH partially updates, DELETE removes (idempotent), HEAD returns headers only, OPTIONS is used for CORS preflight. Idempotent means same result on repeat — me retrying PUT is safe, me retrying POST may create duplicates.',
        topic: 'Application',
      },
      {
        q: 'What do status codes 200, 301, 403, 404 and 500 mean?',
        a: '200 OK success; 301 moved permanently (redirect, may be cached); 403 forbidden — authenticated but not allowed; 404 not found; 500 internal server error (unhandled server-side failure). Related: 201 created, 304 not modified (cache hit), 401 needs authentication, 429 too many requests, 503 temporarily unavailable.',
        topic: 'Application',
      },
      {
        q: 'How does HTTPS secure a connection?',
        a: 'TLS first authenticates the server with a certificate signed by a CA the client trusts, verifying identity. Then both sides agree on session keys (via ephemeral key exchange, e.g. ECDHE in TLS 1.3 — one round trip), after which application data is encrypted with fast symmetric cryptography (AES-GCM/ChaCha20) with integrity authentication. Result: confidentiality, integrity and server authentication (plus optional client/mTLS).',
        topic: 'Application',
      },
      {
        q: 'Why use asymmetric crypto for the handshake but symmetric for the data?',
        a: 'Asymmetric (e.g. RSA/ECDH) solves the trust problem: the server can prove identity with its private key without ever sharing it. But it is computationally expensive — using it for every packet would be slow. Once trusted, both sides derive a shared symmetric key (cheap to use, fast hardware) and encrypt bulk data with that.',
        topic: 'Application',
      },
      {
        q: 'What does HTTP/2 add over HTTP/1.1 and what is still its weakness?',
        a: 'Binary framing, header compression, multiplexed streams over the one TCP connection (fixing HTTP/1.1 head-of-line blocking at the request level) and server push. Weakness: TCP layer still suffers head-of-line blocking — one lost packet stalls all streams. That is what QUIC/HTTP/3 addresses at the transport layer.',
        topic: 'Application',
      },
    ],
  },
  {
    id: 14,
    week: 2,
    topic: 'DNS and application protocols',
    category: 'Application',
    objective: 'Explain how a domain name becomes an IP address, plus DHCP, SMTP, IMAP and FTP.',
    subtopics: [
      'DNS resolution: resolver, root, TLD, authoritative',
      'Caching and TTL; records A, AAAA, CNAME, MX',
      'DHCP, email and file transfer protocols',
    ],
    checklist: [
      'Walk through a DNS lookup step by step',
      'Explain recursive vs authoritative servers',
      'Name common record types',
      'Explain TTL and caching benefit',
      'Describe DHCP DORA and the email protocol split',
    ],
    summary:
      'DNS translates names (api.example.com) into IP addresses. The client asks its configured recursive resolver (at ISP, or 8.8.8.8 / 1.1.1.1). The resolver, if not cached, asks the root servers (which answer “ask the .com servers”), then the TLD (.com → “ask example.com’s nameservers”), then the authoritative nameserver for the zone, which returns the actual record (A → IPv4, AAAA → IPv6, CNAME → another name, MX → mail server, NS → zone nameservers). Answers carry a TTL — caching at the OS, browser and resolver layers makes subsequent lookups instant.\n\nDHCP assigns IP configuration to a joining host with four messages: Discover (client broadcasts), Offer (server proposes address/lease), Request (client asks for one offered), Acknowledge (server confirms) — DORA — plus lease renewal, DNS servers and default gateway as options.\n\nEmail: SMTP (port 25 server-to-server, 587 submission with auth) pushes mail between servers and to servers; the recipient’s server stores mail, and the client reads it via IMAP (synchronized, mail stays on server; port 143/993 TLS) or legacy POP3 (download-then-delete). FTP transfers files (control port 21, separate data connection, plaintext — replaced in practice by SFTP/FTPS).',
    terms: [
      { term: 'Recursive resolver', def: 'Server that performs the full DNS lookup chain on behalf of the client and caches answers.' },
      { term: 'Authoritative server', def: 'Nameserver holding the official records for a zone.' },
      { term: 'TTL', def: 'Time-to-live — how many seconds a DNS answer may be cached before re-querying.' },
      { term: 'DORA', def: 'DHCP message sequence: Discover, Offer, Request, Acknowledge.' },
    ],
    questions: [
      {
        q: 'Explain how DNS resolves example.com to an IP address.',
        a: 'Client → OS cache → configured recursive resolver. Resolver checks its cache; on miss asks a root server (‘.com’ authority pointer), then the .com TLD servers (zone’s nameservers), then the authoritative nameserver for example.com, which returns the A/AAAA record. The answer propagates back with a TTL and is cached at every level.',
        topic: 'Application',
      },
      {
        q: 'What is the difference between recursive and authoritative name servers?',
        a: 'Recursive resolvers answer clients by chasing referrals themselves and caching (duty to the client). Authoritative servers serve the final, official records for the domains they host (duty to the zone). One resolver can serve millions of domains; an authoritative server only knows its own zones.',
        topic: 'Application',
      },
      {
        q: 'Why is caching so important in DNS, and what trade-off does the TTL create?',
        a: 'Caching removes the multi-step lookup latency and shields root/TLD servers from internet-scale query volume. Longer TTLs mean fewer lookups but slower failover/changes; short TTLs allow quick migrations but increase global query load. Ops often lower TTL hours before a planned IP change.',
        topic: 'Application',
      },
      {
        q: 'Describe DHCP and why it matters.',
        a: 'DHCP automatically configures a joining host with IP address, subnet mask, gateway and DNS servers. Broadcast Discover → server Offer → client Request → server Acknowledge (DORA), with leases that renew. It removes per-device manual IP configuration and prevents address conflicts.',
        topic: 'Application',
      },
      {
        q: 'How do SMTP, IMAP and POP3 divide email work?',
        a: 'SMTP pushes mail: client→outgoing server (submission on 587) and server→server (25). IMAP stores mail on the server and synchronizes state across devices (143/993). POP3 downloads mail to one device and typically deletes it from the server (110/995) — simple but not multi-device friendly. FTP is unrelated: it transfers files (control 21), nowadays largely replaced by SFTP/FTPS.',
        topic: 'Application',
      },
    ],
    diagram: 'dns',
  },
]
