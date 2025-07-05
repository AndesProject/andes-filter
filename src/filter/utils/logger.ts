// Sistema de logging centralizado
export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development'
  private static isProduction = process.env.NODE_ENV === 'production'

  /** Log de advertencias (solo en desarrollo) */
  static warn(message: string, context?: string) {
    if (!this.isProduction) {
      console.warn(`[${context || 'Filter'}] ${message}`)
    }
  }

  /** Log de errores (siempre) */
  static error(message: string, error?: any, context?: string) {
    console.error(`[${context || 'Filter'}] ${message}`, error || '')
  }

  /** Log de debug (solo en desarrollo) */
  static debug(message: string, data?: any, context?: string) {
    if (this.isDevelopment) {
      console.log(`[DEBUG:${context || 'Filter'}] ${message}`, data || '')
    }
  }

  /** Log de información (solo en desarrollo) */
  static info(message: string, data?: any, context?: string) {
    if (this.isDevelopment) {
      console.log(`[INFO:${context || 'Filter'}] ${message}`, data || '')
    }
  }

  /** Log de filtro desconocido */
  static unknownFilter(filterType: string) {
    this.warn(`Unknown filter type: ${filterType}`, 'FilterRegistry')
  }
}
