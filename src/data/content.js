// All portfolio copy lives here. Edit this file to update the site.

export const profile = {
  name: 'Shans',
  title: 'Azure Network Engineer',
  years: 3,
  tagline: 'Build the network. Break the packet. Fix the route.',
  intro:
    'Three years of hands-on Azure networking: hub-and-spoke routing, VPN Gateway, Azure Firewall, Private Link DNS and the production escalations in between.',
  location: 'India · Remote for international clients',
  email: 'shans.cloud@outlook.com',
  linkedin: 'https://www.linkedin.com/in/shunmugarajeswaran23/',
  github: 'https://github.com/ShansStark',
}

// Rotating lines in the hero
export const typedLines = [
  'VPN Gateway · S2S & P2S',
  'Hub & spoke routing, spoke to spoke',
  'Azure Firewall rules + DNS proxy',
  'Private Endpoint + Private Link DNS',
  'Route Server + BGP behaviour',
  'Load Balancer · NAT Gateway · Bastion',
]

// Nodes shown in the 3D hero. Click one in the scene to scan it.
export const networkNodes = {
  hub: {
    label: 'Hub VNet',
    blurb:
      'The core of the design. Shared services live here: firewall, gateways, Route Server, Bastion. Spokes peer to it and send traffic through it.',
  },
  fw: {
    label: 'Azure Firewall',
    blurb:
      'Central inspection point. Network, application and DNAT rules, plus DNS proxy so spokes and on-prem resolve names through one controlled path.',
  },
  vpn: {
    label: 'VPN Gateway',
    blurb:
      'Site-to-Site and Point-to-Site. I read gateway and tunnel diagnostic logs plus connection status to find why a tunnel flaps, a P2S client fails or routes do not appear.',
  },
  rs: {
    label: 'Route Server',
    blurb:
      'BGP with NVAs and the VNet. I set it up, check learned and advertised routes, and know how it behaves with peering, gateways and UDRs.',
  },
  pe: {
    label: 'Private Endpoint',
    blurb:
      'Private IP for a PaaS service inside your VNet. The part that usually breaks is DNS, so I build the private DNS zones and manage the links.',
  },
  lb: {
    label: 'Load Balancer',
    blurb:
      'Public and internal, with VMs and NICs in the backend pool. Probes, rules, outbound behaviour and why a backend shows unhealthy.',
  },
  nat: {
    label: 'NAT Gateway',
    blurb:
      'Predictable outbound with static public IPs. Best-practice replacement for default outbound access and SNAT port exhaustion.',
  },
  bas: {
    label: 'Bastion',
    blurb:
      'Browser-based RDP/SSH without public IPs on VMs. Setup, subnet requirements and troubleshooting access.',
  },
  dns: {
    label: 'Azure DNS',
    blurb:
      'Public and private zones, custom DNS servers and the exact order a query takes. DNS is behind most "network" problems.',
  },
  onprem: {
    label: 'On-Premises',
    blurb: 'The other side of the tunnel. Hybrid connectivity means both ends have to agree on routes and names.',
  },
  net: {
    label: 'Internet',
    blurb: 'Inbound through firewall DNAT or load balancer public IPs. Outbound through firewall or NAT Gateway.',
  },
}

export const about = [
  'I am an Azure networking engineer with around three years of experience. I like the problems where the portal says everything is green and the packet still does not arrive.',
  'I have worked on a Microsoft vendor engagement as a Technical Advisor, collaborating with enterprise clients, Solution Architects, partner vendors and Microsoft Product Group teams to reproduce issues, find the failure point and drive resolution.',
  'Now I am offering that experience as consulting: architecture reviews, routing and DNS troubleshooting, and incident root cause analysis.',
]

// "Arsenal": what I'm good at, in the user's own words
export const arsenal = [
  {
    icon: '🛡️',
    title: 'VPN Gateway',
    text: 'Site-to-Site and Point-to-Site. Reading Azure gateway logs and connection status to find why a tunnel or client will not connect.',
    tags: ['S2S', 'P2S', 'Diagnostic logs', 'Connection status'],
  },
  {
    icon: '🧭',
    title: 'Routing, end to end',
    text: 'Any resource to any resource: through a hub, spoke to spoke, hybrid. Effective routes, next hops and why a packet takes the path it takes.',
    tags: ['Hub & spoke', 'Spoke to spoke', 'Effective routes'],
  },
  {
    icon: '🔀',
    title: 'User Defined Routes',
    text: 'Route tables that steer traffic through the firewall or an NVA, and the side effects to check before applying them.',
    tags: ['UDR', 'Next hop', 'Forced tunnelling'],
  },
  {
    icon: '🛰️',
    title: 'Route Server',
    text: 'Setup with the virtual network, BGP peering with NVAs and how learned routes behave alongside peering and gateways.',
    tags: ['BGP', 'NVA', 'Route Server'],
  },
  {
    icon: '🔥',
    title: 'Azure Firewall',
    text: 'Setup, rule collections, and how the firewall behaves with DNS, including DNS proxy and FQDN rules.',
    tags: ['Network rules', 'App rules', 'DNS proxy'],
  },
  {
    icon: '🧱',
    title: 'NSG',
    text: 'Rule design and priority, subnet versus NIC association, and reading why a flow is allowed or denied.',
    tags: ['Priority', 'Subnet/NIC', 'Service tags'],
  },
  {
    icon: '🕸️',
    title: 'VNets, subnetting, peering',
    text: 'Address planning and subnetting, virtual network peering, and hub-and-spoke build-outs that scale.',
    tags: ['CIDR', 'Peering', 'Hub & spoke'],
  },
  {
    icon: '🖥️',
    title: 'VM and NIC troubleshooting',
    text: 'Basic VM connectivity checks, attaching and detaching network interfaces, and fixing what that changes.',
    tags: ['NIC attach/detach', 'VM basics'],
  },
  {
    icon: '🚪',
    title: 'Bastion',
    text: 'Secure RDP/SSH without public IPs: deployment, subnet needs and everyday usage.',
    tags: ['AzureBastionSubnet', 'No public IP'],
  },
  {
    icon: '⚖️',
    title: 'Load Balancer',
    text: 'Public and internal load balancers with backend VMs and NICs. Probes, rules and outbound behaviour.',
    tags: ['Public', 'Internal', 'Backend pools'],
  },
  {
    icon: '🔒',
    title: 'Private Endpoint + Private Link DNS',
    text: 'Creating private endpoints, building the private DNS zones, linking them and managing records over time.',
    tags: ['Private Endpoint', 'privatelink zones', 'VNet links'],
  },
  {
    icon: '📖',
    title: 'DNS behaviour and resolution',
    text: 'Configuration, resolution order, custom DNS, and how the firewall changes the picture.',
    tags: ['Azure DNS', 'Resolution', 'Forwarding'],
  },
  {
    icon: '🌐',
    title: 'Public IP + NAT Gateway',
    text: 'Public IP and NAT Gateway placement for outbound control, following best practice for the architecture.',
    tags: ['Static outbound', 'SNAT', 'Best practice'],
  },
]

export const toolkit = [
  'Network Watcher',
  'Connection Monitor',
  'Azure Monitor',
  'Traffic Analytics',
  'Wireshark',
  'Azure CLI',
  'PowerShell',
  'ARM Templates',
  'RBAC',
  'Managed Identity',
  'Key Vault',
  'ExpressRoute',
  'Virtual WAN',
  'Application Gateway',
  'Front Door',
  'WAF',
]

export const experience = {
  company: 'LTM',
  role: 'Cloud Engineer',
  period: 'June 2024 – August 2026', // TODO: confirm start date (resume text also said August 2024)
  engagement: 'Microsoft Vendor Engagement · Azure Networking Project · Microsoft designation: Technical Advisor',
  bullets: [
    'Deployed and optimised Azure networking solutions — VNet, VPN Gateway, ExpressRoute, Azure Firewall, Application Gateway, Load Balancer and Virtual WAN — for secure, reliable enterprise connectivity.',
    'Designed and optimised ExpressRoute connectivity and Azure network architectures to address latency, routing and hybrid connectivity requirements.',
    'Implemented Azure Firewall rule sets, WAF policies, BGP routing, Azure Route Server and Network Virtual Appliances to strengthen security and optimise traffic routing across Azure and Virtual WAN.',
    'Investigated and resolved production-impacting issues: routing failures, traffic-flow disruptions, migration issues and deployment failures.',
    'Analysed and mitigated DDoS incidents against public endpoints across Application Gateway, Azure Front Door and Load Balancer.',
    'Worked with enterprise clients, Solution Architects, partner vendors and Microsoft Product Group teams to reproduce product-level issues, identify failure points and drive engineering resolutions.',
  ],
}

export const achievements = [
  { value: 3, suffix: ' yrs', label: 'Azure networking', text: 'Hands-on across routing, VPN, firewall, DNS and private connectivity.' },
  { value: 50, suffix: '+', label: 'Escalations resolved', text: 'Production-critical routing, traffic-flow, migration and deployment failures.' },
  { value: 20, suffix: '+', label: 'Hybrid DNS clients', text: 'Hybrid DNS architectures between Azure and on-premises.' },
  { value: 10, suffix: '+', label: 'Routing optimisations', text: 'Enterprise clients with complex hybrid Azure environments.' },
  { value: 5, suffix: '+', label: 'DDoS escalations', text: 'Mitigated across Application Gateway, Front Door and Load Balancer.' },
  { value: 5, suffix: '+', label: 'BGP deployments', text: 'Azure Route Server and NVA architectures, Virtual WAN and standalone.' },
]

export const awards = [
  'Best Super Crew team recognition (LTM) on 5+ occasions for client engagement, CSAT, technical problem resolution and Azure networking delivery.',
]

export const certifications = [
  { name: 'Microsoft Azure Networking – L100', issuer: 'Microsoft Azure-QA' },
  { name: 'Microsoft Azure Networking – VPN – Specialist Assessment', issuer: 'Microsoft Azure-QA' },
  { name: 'Microsoft Azure Networking – Core Networking – Specialist', issuer: 'Microsoft Azure-QA' },
]

// TODO: I could not read your GitHub (rate-limited). Replace with your real repos and URLs.
export const projects = [
  {
    title: 'NetworkWatcherKit',
    description:
      'Tooling for Azure Network Watcher diagnostics: connection troubleshooting, packet capture and flow analysis workflows.',
    tags: ['Network Watcher', 'PowerShell', 'Azure CLI'],
    url: 'https://github.com/ShansStark',
  },
  {
    title: 'Azure Troubleshooting Playbooks',
    description:
      'Step-by-step playbooks for routing, DNS, VPN and firewall problems with the checks in the order I run them.',
    tags: ['Playbooks', 'RCA', 'Hybrid'],
    url: 'https://github.com/ShansStark',
  },
  {
    title: 'Hub-and-Spoke Reference Builds',
    description:
      'Reference builds with firewall, UDRs, Route Server and Private Link DNS, with diagrams and deployment notes.',
    tags: ['Hub & spoke', 'UDR', 'ARM'],
    url: 'https://github.com/ShansStark',
  },
]

export const caseStudies = [
  {
    title: 'The Private Endpoint that resolved to a public IP',
    summary:
      'Fictional scenario: the endpoint exists, the private zone exists, yet the VM still gets the public address. Walkthrough of VNet links, DNS proxy and what to check first.',
  },
  {
    title: 'Spoke to spoke goes nowhere',
    summary:
      'Fictional scenario: two spokes peered to one hub cannot talk. Walkthrough of non-transitive peering, UDRs and firewall rules.',
  },
  {
    title: 'A P2S client that connects but reaches nothing',
    summary:
      'Fictional scenario: tunnel up, no access to spoke resources. Walkthrough of gateway logs, address pools and route propagation.',
  },
]

export const services = [
  { title: 'Chat & email support', text: 'Quick answers and second opinions on Azure networking questions.' },
  { title: 'Scheduled consulting', text: 'Architecture reviews, design sessions and live troubleshooting calls.' },
  { title: 'Incident analysis', text: 'Root cause analysis and written findings for network incidents.' },
]
