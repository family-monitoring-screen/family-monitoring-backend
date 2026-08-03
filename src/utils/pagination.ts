interface PaginationParams {
  page?: number
  limit?: number
}

interface PaginationResult {
  skip: number
  limit: number
  page: number
}

export const getPaginationParams = (params: PaginationParams): PaginationResult => {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 20))
  const skip = (page - 1) * limit
  
  return { skip, limit, page }
}

export const getPaginationMeta = (total: number, page: number, limit: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }
}
