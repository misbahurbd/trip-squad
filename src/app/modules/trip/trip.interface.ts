export interface ITrip {
  destination: string
  description: string
  startDate: Date
  endDate: Date
  tripType: string
  photos: string[]
  budget: number
  location: string
  itinerary: string
}

export interface IReview {
  rating: number
  content: string
}
