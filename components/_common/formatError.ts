export function formatError(error: any) {
  if (typeof error === "object") {
    if (error.error) return formatError(error.error)
    if (error.message) return error.message
    return String(error)
  } else {
    return String(error)
  }
}
