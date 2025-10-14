export const testimonialsData = [
  {
    id: 1,
    tag: 'EMPLOYEE TRAINING',
    logo: { type: 'text', content: 'boldyn', style: { fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '-0.05em' } },
    quote: '"Interactive video is redefining training for us"',
    authorName: 'Jen Ruthven',
    authorTitle: 'Group Director, Learning & Career Development',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 2,
    tag: 'COMPLIANCE TRAINING',
    logo: { type: 'svg', content: (
      <svg height="24" viewBox="0 0 100 24" style={{ fill: 'white' }}>
        <path d="M0 0h12v24H0zM16 0h12v24H16zM32 0h4v24h-4zM40 0h12v24H40zM56 0h12v24H56zM72 0h12v24H72zM88 0h12v24H88z" />
        <text x="1" y="19" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold">BRINKS</text>
      </svg>
     ) },
    quote: '"We push updates without touching the LMS."',
    authorName: 'Mark Stauffer',
    authorTitle: 'Senior Manager, Global L&D',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 3,
    tag: 'EMPLOYEE TRAINING',
    logo: { type: 'text', content: 'five BEL°W', style: { fontWeight: '800', fontSize: '1.5rem', letterSpacing: '0.05em' } },
    quote: '"We saved $56K and hit 100+ custom videos"',
    authorName: 'Matt Wezar',
    authorTitle: 'Senior Director of Talent Development',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 4,
    tag: 'EMPLOYEE TRAINING',
    logo: { type: 'text', content: 'SAP', style: { fontWeight: 'bold', fontSize: '1.5rem' } },
    quote: '"Fast and easy, transforming our company."',
    authorName: 'Jane Doe',
    authorTitle: 'Head of Innovation',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    id: 5,
    tag: 'MARKETING',
    logo: { type: 'text', content: 'accénture', style: { fontStyle: 'italic', fontSize: '1.5rem' } },
    quote: '"A game changer for our content strategy."',
    authorName: 'John Smith',
    authorTitle: 'Marketing Lead',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 6,
    tag: 'SALES ENABLEMENT',
    logo: { type: 'text', content: 'Tele-Corp', style: { fontWeight: '600', fontSize: '1.5rem' } },
    quote: '"Our sales team now delivers perfect pitches every time."',
    authorName: 'Sarah Chen',
    authorTitle: 'VP of Sales',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 7,
    tag: 'CORPORATE COMMUNICATIONS',
    logo: { type: 'text', content: 'Innovate Inc.', style: { fontWeight: '300', fontSize: '1.5rem', letterSpacing: '0.1em' } },
    quote: '"Consistent, clear messaging across all our global offices."',
    authorName: 'David Lee',
    authorTitle: 'Head of Communications',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  }
];

export const carouselAttributes = {
  slides: testimonialsData,
  slideGap: 30,
  dimensions: { cardWidth: 430, cardHeight: 590, fontScale: 1 }
};