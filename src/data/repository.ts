export interface OutreachEntry {
  id: string;
  prospectName: string;
  market: string;
  dateSent: string;
  channel: 'LinkedIn' | 'Email' | 'Ad';
  messagePreview: string;
  status: 'Sent' | 'Opened' | 'Replied' | 'Meeting Booked';
}

export interface CampaignEntry {
  id: string;
  campaignName: string;
  marketsTargeted: string[];
  budget: number;
  spendToDate: number;
  leadsGenerated: number;
  costPerLead: number;
  status: 'Active' | 'Paused' | 'Completed';
}

export const outreachData: OutreachEntry[] = [
  { id: 'o1', prospectName: 'Gulf Coast Family Medicine', market: 'Houston', dateSent: '2026-02-10', channel: 'Email', messagePreview: 'Hi Dr. Chen, I noticed your practice website hasn\'t been updated since 2018. We help multi-location healthcare practices...', status: 'Meeting Booked' },
  { id: 'o2', prospectName: 'Lone Star Legal Group', market: 'Houston', dateSent: '2026-02-09', channel: 'LinkedIn', messagePreview: 'James, I came across Lone Star Legal Group and noticed some opportunities to strengthen your digital presence...', status: 'Replied' },
  { id: 'o3', prospectName: 'DFW Dental Associates', market: 'Dallas', dateSent: '2026-02-08', channel: 'Email', messagePreview: 'Dr. Nguyen, we recently helped a similar multi-location dental practice increase new patient bookings by 40%...', status: 'Meeting Booked' },
  { id: 'o4', prospectName: 'Alamo Orthopaedic Group', market: 'San Antonio', dateSent: '2026-02-07', channel: 'Email', messagePreview: 'Dr. Mendez, your practice scored a 25/100 on our digital maturity audit. Here\'s how we can help...', status: 'Opened' },
  { id: 'o5', prospectName: 'H-Town BBQ & Catering', market: 'Houston', dateSent: '2026-02-06', channel: 'LinkedIn', messagePreview: 'DeShawn, love what you\'re building with H-Town BBQ. A proper website with online ordering could really scale your catering arm...', status: 'Replied' },
  { id: 'o6', prospectName: 'North Texas Manufacturing Co.', market: 'Dallas', dateSent: '2026-02-05', channel: 'Email', messagePreview: 'William, in 2026 your competitors are winning deals online while NTX Manufacturing has no digital catalogue...', status: 'Sent' },
  { id: 'o7', prospectName: 'Stockyards Manufacturing', market: 'Fort Worth', dateSent: '2026-02-04', channel: 'Email', messagePreview: 'Robert, we specialise in helping manufacturing companies build e-commerce platforms and product showcases...', status: 'Opened' },
  { id: 'o8', prospectName: 'Chicago Franchise Solutions', market: 'Chicago', dateSent: '2026-02-03', channel: 'LinkedIn', messagePreview: 'Rachel, as a franchise operations leader, you know how critical consistent branding is across locations...', status: 'Meeting Booked' },
  { id: 'o9', prospectName: 'River Walk Hospitality Group', market: 'San Antonio', dateSent: '2026-02-02', channel: 'Email', messagePreview: 'Patricia, managing digital presence across multiple hospitality properties is exactly what we do best...', status: 'Replied' },
  { id: 'o10', prospectName: 'Cowtown Logistics', market: 'Fort Worth', dateSent: '2026-02-01', channel: 'Ad', messagePreview: 'Targeted LinkedIn ad: "Still relying on word of mouth? See how logistics companies are winning with digital."', status: 'Opened' },
  { id: 'o11', prospectName: 'Border City Medical Centre', market: 'El Paso', dateSent: '2026-01-30', channel: 'Email', messagePreview: 'Dr. Hernandez, a bilingual website could help you reach the 80%+ of El Paso residents who speak Spanish...', status: 'Sent' },
  { id: 'o12', prospectName: 'Nashville Healthcare Partners', market: 'Nashville', dateSent: '2026-01-28', channel: 'LinkedIn', messagePreview: 'Dr. Blake, managing 5 locations with one outdated website is costing you patients. Let\'s fix that...', status: 'Meeting Booked' },
];

export const campaignData: CampaignEntry[] = [
  { id: 'c1', campaignName: 'Texas Healthcare Blitz', marketsTargeted: ['Houston', 'Dallas', 'San Antonio'], budget: 8000, spendToDate: 5420, leadsGenerated: 34, costPerLead: 159, status: 'Active' },
  { id: 'c2', campaignName: 'DFW Manufacturing Outreach', marketsTargeted: ['Dallas', 'Fort Worth'], budget: 4500, spendToDate: 4500, leadsGenerated: 18, costPerLead: 250, status: 'Completed' },
  { id: 'c3', campaignName: 'Multi-Location Franchise Campaign', marketsTargeted: ['Chicago', 'Nashville', 'Atlanta'], budget: 6000, spendToDate: 2180, leadsGenerated: 12, costPerLead: 182, status: 'Active' },
  { id: 'c4', campaignName: 'Austin Restaurant & Hospitality', marketsTargeted: ['Austin'], budget: 3000, spendToDate: 1200, leadsGenerated: 8, costPerLead: 150, status: 'Paused' },
];
