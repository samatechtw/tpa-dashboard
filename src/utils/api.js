import { parse } from 'date-fns';

const FMT = 'yyyy-MM-dd';

const description = `
<b>Summary</b><br>
Extend Multi-sig powers by another three months until end of May 2021 whilst an in-progress replacement proposal matures further.
<br><br>
<b>Abstract</b><br>
If adopted, this proposal seeks to extend the existing Multisig empowerment as was established by TPA-41 for another three months until May 24 2021. This is done in order for a currently in-progress governance architecture proposal to mature further, and ultimately have longer time to be discussed in the community, prior to it being proposed.
<br><br>
<b>Rationale</b><br>
The existing mandate expires on February 24 2021. As is stated in TPA-41, the Multisig was empowered for rapid decision making until the protocol transitioned to a “multi-DAO structure”. A plan to decentralize power away from the Multisig, is in-progress of being finalized. It has been delayed due to recent Governance activities.
<br><br>
The three month extension would be used to introduce the proposal to the wider community, iterate on it further to incorporate feedback, without being rushed by the somewhat arbitrary deadline that the mandate expiration sets.
`;

const user1 = {
  address: '0xc23cdda468e2e54fa7c0ab176feb9e5d164d176f',
  name: 'Banteg',
  image: '/avatar1.png',
};

const user2 = {
  address: '0xccaf1c761f49c3a4493f16dbeebdd07abc9ca4a4',
  name: 'Telco',
  image: '/avatar2.png',
};

const user3 = {
  address: '0x01e524b95c7e1a3f2ed9d719ea9b239b219ebd78',
  name: 'GenT',
  image: '/avatar3.png',
};

const user4 = {
  address: '0xf2849d347b6ff04b3409789e77d5a6979c03a5d7',
  name: 'Saften',
  image: '/avatar1.png',
};

const proposals = [
  {
    id: 1,
    label: '#QmdRCXH',
    title: 'TPA-59: Temporarily extend Multisig empowerment',
    description,
    type: 'Core',
    status: 'Closed',
    author: user1,
    start: parse('2021-02-19', FMT, new Date()),
    end: parse('2021-02-24', FMT, new Date()),
  },
  {
    id: 2,
    label: '#SFubNfK',
    title: 'TPA-58: Adaptive mgmt fees based on AUM',
    description,
    type: 'Core',
    status: 'Closed',
    author: user2,
    start: parse('2021-02-19', FMT, new Date()),
    end: parse('2021-02-24', FMT, new Date()),
  },
  {
    id: 3,
    label: '#lvrYRnt',
    title: 'TPA-57: Funding TPA’s Future',
    description,
    type: 'Core',
    status: 'Closed',
    author: user3,
    start: parse('2021-02-19', FMT, new Date()),
    end: parse('2021-02-24', FMT, new Date()),
  },
  {
    id: 4,
    label: '#ODINjau',
    title: 'TPA-56: Buyback and Build TPA',
    description,
    type: 'Core',
    status: 'Closed',
    author: user4,
    start: parse('2021-02-19', FMT, new Date()),
    end: parse('2021-02-24', FMT, new Date()),
  },
];

export function getProposals(filter) {
  if(filter === 'All') {
    return [...proposals];
  }
  return proposals.filter(p => p.type === filter || p.status === filter);
}

export function getProposal(id) {
  return proposals.find(p => p.id === id);
}
