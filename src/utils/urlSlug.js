// Utility functions for converting project/client names to URL-friendly slugs

export function nameToSlug(name) {
  if (!name) return ''
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function slugToName(slug, manifest = []) {
  // Try to find exact match first
  const allProjects = manifest.filter(item => item.type === 'project')
  
  // Direct slug match
  const directMatch = allProjects.find(p => nameToSlug(p.name) === slug || nameToSlug(p.folder) === slug)
  if (directMatch) return directMatch
  
  // Try matching by folder name
  const folderMatch = allProjects.find(p => {
    const folderSlug = nameToSlug(p.folder)
    return folderSlug === slug || folderSlug.includes(slug) || slug.includes(folderSlug)
  })
  if (folderMatch) return folderMatch
  
  // Try matching by name
  const nameMatch = allProjects.find(p => {
    const nameSlug = nameToSlug(p.name)
    return nameSlug === slug || nameSlug.includes(slug) || slug.includes(nameSlug)
  })
  if (nameMatch) return nameMatch
  
  return null
}

// Special mappings for clients
const CLIENT_SLUG_MAP = {
  'text-me-records': 'Text Me Records',
  'lawbnexus': 'LAWBNEXUS NFT Collection',
  'portion-club': 'portion club',
  '411': '411 Oak Branding',
  '411-logos': '411 Oak Branding',
  'planeta-pisces': 'Planeta Pisces',
  'ynb': 'YNB',
  'brooklyn-bussdown': 'The Brooklyn Bussdown',
  'bussdown': 'The Brooklyn Bussdown',
  'joogmaster-j': 'Promo for JoogMaster J\'s BDAY BASH - December 2025',
  'crybaby': 'CRYBABY OAKLAND',
  'crybaby-oakland': 'CRYBABY OAKLAND',
  'rare-bet-sports': 'Rare Bet Sports Clips',
  'rbs': 'Rare Bet Sports Clips',
  'psyched-sf': 'PSYCHED SF',
  'looie-el-ser': 'PSYCHED SF',
  'xtraforms': 'XTRAFORMS'
}

export function slugToClientName(slug) {
  return CLIENT_SLUG_MAP[slug] || null
}

export function clientNameToSlug(name) {
  // Reverse lookup
  for (const [slug, clientName] of Object.entries(CLIENT_SLUG_MAP)) {
    if (clientName === name || name.includes(clientName) || clientName.includes(name)) {
      return slug
    }
  }
  // Fallback to nameToSlug
  return nameToSlug(name)
}
