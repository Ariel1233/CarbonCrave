export type Language = 'en' | 'es'

export type EcoBadge = 'platinum' | 'gold' | 'silver' | 'bronze' | 'starter'

export type Neighborhood =
  | 'Calle Ocho'
  | 'Brickell'
  | 'Doral'
  | 'Little Haiti'
  | 'Wynwood'
  | 'Overtown'
  | 'South Beach'
  | 'Coral Gables'

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
  commentEs: string
  sustainabilityNote: string
  sustainabilityNoteEs: string
  packagingRating: number
}

export interface EcoScore {
  total: number
  carbonScore: number
  offsetScore: number
  wasteScore: number
  sustainabilityScore: number
  transparencyScore: number
  offsetPercent: number
  wastePercent: number
  weeklyEmissions: number
}

export interface Restaurant {
  id: string
  name: string
  neighborhood: Neighborhood
  cuisine: string
  cuisineEs: string
  description: string
  descriptionEs: string
  priceRange: '$' | '$$' | '$$$'
  rating: number
  reviewCount: number
  ecoScore: EcoScore
  badge: EcoBadge
  videoThumb: string
  videoColor: string
  featuredDish: string
  featuredDishEs: string
  tags: string[]
  tagsEs: string[]
  phone: string
  address: string
  hours: string
  hoursEs: string
  reviews: Review[]
  sustainableActions: string[]
  sustainableActionsEs: string[]
  ownerStory: string
  ownerStoryEs: string
  image?: string
  trending?: boolean
  risingGreenStar?: boolean
}
