// Utilidades de manejo de errores centralizadas
export class SafeEvaluator {
  /** Ejecuta una operación de forma segura con un valor de fallback */
  static evaluate<T>(operation: () => T, fallback: T): T {
    try {
      return operation()
    } catch {
      return fallback
    }
  }

  /** Ejecuta una operación de comparación numérica de forma segura */
  static compareNumbers(
    a: any,
    b: any,
    operation: 'eq' | 'lt' | 'lte' | 'gt' | 'gte',
  ): boolean {
    return this.evaluate(() => {
      const numA = Number(a)

      const numB = Number(b)

      if (Number.isNaN(numA) || Number.isNaN(numB)) return false

      switch (operation) {
        case 'eq':
          return numA === numB
        case 'lt':
          return numA < numB
        case 'lte':
          return numA <= numB
        case 'gt':
          return numA > numB
        case 'gte':
          return numA >= numB
        default:
          return false
      }
    }, false)
  }

  /** Ejecuta una operación de comparación de fechas de forma segura */
  static compareDates(
    a: any,
    b: any,
    operation: 'eq' | 'lt' | 'lte' | 'gt' | 'gte',
  ): boolean {
    return this.evaluate(() => {
      const dateA = new Date(a)

      const dateB = new Date(b)

      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return false

      const timeA = dateA.getTime()

      const timeB = dateB.getTime()

      switch (operation) {
        case 'eq':
          return timeA === timeB
        case 'lt':
          return timeA < timeB
        case 'lte':
          return timeA <= timeB
        case 'gt':
          return timeA > timeB
        case 'gte':
          return timeA >= timeB
        default:
          return false
      }
    }, false)
  }

  /** Ejecuta una operación de regex de forma segura */
  static testRegex(
    pattern: string,
    flags: string | undefined,
    input: string,
  ): boolean {
    return this.evaluate(() => {
      const regex = new RegExp(pattern, flags)

      return regex.test(input)
    }, false)
  }
}
