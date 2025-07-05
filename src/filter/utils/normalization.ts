// Utilidades de normalización centralizadas
export class StringNormalizer {
  /** Normaliza un string según el modo case-insensitive */
  static normalize(value: string, caseInsensitive: boolean): string {
    return caseInsensitive ? value.toLowerCase() : value
  }

  /** Compara dos strings según el modo case-insensitive */
  static compare(a: string, b: string, caseInsensitive: boolean): boolean {
    return (
      this.normalize(a, caseInsensitive) === this.normalize(b, caseInsensitive)
    )
  }

  /** Verifica si un string contiene otro según el modo case-insensitive */
  static contains(
    source: string,
    target: string,
    caseInsensitive: boolean
  ): boolean {
    const normalizedSource = this.normalize(source, caseInsensitive)
    const normalizedTarget = this.normalize(target, caseInsensitive)
    return normalizedSource.includes(normalizedTarget)
  }

  /** Verifica si un string empieza con otro según el modo case-insensitive */
  static startsWith(
    source: string,
    target: string,
    caseInsensitive: boolean
  ): boolean {
    const normalizedSource = this.normalize(source, caseInsensitive)
    const normalizedTarget = this.normalize(target, caseInsensitive)
    return normalizedSource.startsWith(normalizedTarget)
  }

  /** Verifica si un string termina con otro según el modo case-insensitive */
  static endsWith(
    source: string,
    target: string,
    caseInsensitive: boolean
  ): boolean {
    const normalizedSource = this.normalize(source, caseInsensitive)
    const normalizedTarget = this.normalize(target, caseInsensitive)
    return normalizedSource.endsWith(normalizedTarget)
  }
}
