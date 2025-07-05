import { StringNormalizer } from '../../utils/normalization'
import { ValidationUtils } from '../../utils/validators'
import { EvaluateFilter } from '../evaluate-filter.interface'

export abstract class BaseStringFilter implements EvaluateFilter {
  public constructor(
    protected searchValue: string,
    protected isCaseInsensitive: boolean = false
  ) {}

  public abstract evaluate(targetString: any): boolean

  protected validateStringInput(targetString: any): boolean {
    return ValidationUtils.validateString(targetString)
  }

  protected normalizeString(str: string): string {
    return StringNormalizer.normalize(str, this.isCaseInsensitive)
  }

  protected performStringOperation(
    operation: 'includes' | 'startsWith' | 'endsWith',
    targetString: string,
    searchValue: string
  ): boolean {
    switch (operation) {
      case 'includes':
        return StringNormalizer.contains(
          targetString,
          searchValue,
          this.isCaseInsensitive
        )
      case 'startsWith':
        return StringNormalizer.startsWith(
          targetString,
          searchValue,
          this.isCaseInsensitive
        )
      case 'endsWith':
        return StringNormalizer.endsWith(
          targetString,
          searchValue,
          this.isCaseInsensitive
        )
      default:
        return false
    }
  }
}
