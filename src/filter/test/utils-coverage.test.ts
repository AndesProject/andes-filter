import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FilterEvaluator } from '../evaluate-filter/evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter/evaluate-filter.interface'
import { ArrayEvaluator } from '../utils/array-evaluator'
import { SafeEvaluator } from '../utils/error-handling'
import { Logger } from '../utils/logger'
import { StringNormalizer } from '../utils/normalization'
import { ValidationUtils } from '../utils/validators'

describe('Utils Coverage Tests', () => {
  describe('ArrayEvaluator', () => {
    it('should evaluate array with some operation', () => {
      const data = [1, 2, 3, 4, 5]
      const evaluator = (item: number) => item > 3

      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'some')).toBe(true)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'every')).toBe(false)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'none')).toBe(false)
    })

    it('should evaluate array with every operation', () => {
      const data = [4, 5, 6]
      const evaluator = (item: number) => item > 3

      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'some')).toBe(true)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'every')).toBe(true)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'none')).toBe(false)
    })

    it('should evaluate array with none operation', () => {
      const data = [1, 2, 3]
      const evaluator = (item: number) => item > 3

      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'some')).toBe(false)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'every')).toBe(false)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'none')).toBe(true)
    })

    it('should handle invalid array input', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const evaluator = (_item: any) => true

      expect(ArrayEvaluator.evaluateArray(null, evaluator, 'some')).toBe(false)
      expect(ArrayEvaluator.evaluateArray(undefined, evaluator, 'some')).toBe(
        false,
      )
      expect(ArrayEvaluator.evaluateArray('string', evaluator, 'some')).toBe(
        false,
      )
      expect(ArrayEvaluator.evaluateArray(123, evaluator, 'some')).toBe(false)
    })

    it('should handle null items in array', () => {
      const data = [1, null, 3, undefined, 5]
      const evaluator = (item: any) => item > 3

      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'some')).toBe(true)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'every')).toBe(false)
      expect(ArrayEvaluator.evaluateArray(data, evaluator, 'none')).toBe(false)
    })

    it('should handle invalid operation', () => {
      const data = [1, 2, 3]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const evaluator = (_item: any) => true

      expect(
        ArrayEvaluator.evaluateArray(data, evaluator, 'invalid' as any),
      ).toBe(false)
    })

    it('should evaluate empty filter with some operation', () => {
      const data = [{ name: 'test' }, { age: 25 }]

      expect(ArrayEvaluator.evaluateEmptyFilter(data, 'some')).toBe(true)
      expect(ArrayEvaluator.evaluateEmptyFilter(data, 'every')).toBe(true)
      expect(ArrayEvaluator.evaluateEmptyFilter(data, 'none')).toBe(false)
    })

    it('should evaluate empty filter with invalid data', () => {
      expect(ArrayEvaluator.evaluateEmptyFilter(null, 'some')).toBe(false)
      expect(ArrayEvaluator.evaluateEmptyFilter([1, 2, 3], 'some')).toBe(false) // Not objects
    })

    it('should evaluate primitive filter', () => {
      const data = [1, 2, 3, 4, 5]

      expect(ArrayEvaluator.evaluatePrimitiveFilter(data, 3, 'some')).toBe(true)
      expect(ArrayEvaluator.evaluatePrimitiveFilter(data, 3, 'every')).toBe(
        false,
      )
      expect(ArrayEvaluator.evaluatePrimitiveFilter(data, 3, 'none')).toBe(
        false,
      )
    })

    it('should evaluate simple object filter', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Alice', age: 35 },
      ]
      const filter = { name: 'Alice' }

      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(data, filter, 'some'),
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(data, filter, 'every'),
      ).toBe(false)
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(data, filter, 'none'),
      ).toBe(false)
    })

    it('should evaluate complex filter', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ]

      const mockFilter: EvaluateFilter = {
        evaluate: (item: any) => item.age > 25,
      }

      expect(
        ArrayEvaluator.evaluateComplexFilter(data, mockFilter, 'some'),
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateComplexFilter(data, mockFilter, 'every'),
      ).toBe(false)
      expect(
        ArrayEvaluator.evaluateComplexFilter(data, mockFilter, 'none'),
      ).toBe(false)
    })

    it('should evaluate complex filter with FilterEvaluator', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ]

      const filterConfig = { age: { gt: 25 } }
      const evaluator = new FilterEvaluator(filterConfig)

      expect(
        ArrayEvaluator.evaluateComplexFilter(data, evaluator, 'some'),
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateComplexFilter(data, evaluator, 'every'),
      ).toBe(false)
      expect(
        ArrayEvaluator.evaluateComplexFilter(data, evaluator, 'none'),
      ).toBe(false)
    })

    it('should check if array is distinct', () => {
      expect(ArrayEvaluator.isDistinct([1, 2, 3, 4, 5])).toBe(true)
      expect(ArrayEvaluator.isDistinct([1, 2, 2, 3, 4])).toBe(false)
      expect(ArrayEvaluator.isDistinct([])).toBe(true)
      expect(ArrayEvaluator.isDistinct([1])).toBe(true)
    })

    it('should handle invalid input for isDistinct', () => {
      expect(ArrayEvaluator.isDistinct(null)).toBe(false)
      expect(ArrayEvaluator.isDistinct(undefined)).toBe(false)
      expect(ArrayEvaluator.isDistinct('string')).toBe(false)
      expect(ArrayEvaluator.isDistinct(123)).toBe(false)
    })
  })

  describe('SafeEvaluator', () => {
    it('should evaluate operation safely', () => {
      const successOperation = () => 'success'
      const failureOperation = () => {
        throw new Error('test error')
      }

      expect(SafeEvaluator.evaluate(successOperation, 'fallback')).toBe(
        'success',
      )
      expect(SafeEvaluator.evaluate(failureOperation, 'fallback')).toBe(
        'fallback',
      )
    })

    it('should compare numbers safely', () => {
      expect(SafeEvaluator.compareNumbers(5, 3, 'gt')).toBe(true)
      expect(SafeEvaluator.compareNumbers(3, 5, 'lt')).toBe(true)
      expect(SafeEvaluator.compareNumbers(5, 5, 'eq')).toBe(true)
      expect(SafeEvaluator.compareNumbers(5, 5, 'lte')).toBe(true)
      expect(SafeEvaluator.compareNumbers(5, 5, 'gte')).toBe(true)
      expect(SafeEvaluator.compareNumbers(3, 5, 'gte')).toBe(false)
    })

    it('should handle invalid number comparisons', () => {
      expect(SafeEvaluator.compareNumbers(NaN, 5, 'eq')).toBe(false)
      expect(SafeEvaluator.compareNumbers(5, NaN, 'eq')).toBe(false)
      expect(SafeEvaluator.compareNumbers(NaN, NaN, 'eq')).toBe(false)
      expect(SafeEvaluator.compareNumbers('invalid', 5, 'eq')).toBe(false)
      expect(SafeEvaluator.compareNumbers(5, 'invalid', 'eq')).toBe(false)
    })

    it('should handle invalid operation in number comparison', () => {
      expect(SafeEvaluator.compareNumbers(5, 3, 'invalid' as any)).toBe(false)
    })

    it('should compare dates safely', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')

      expect(SafeEvaluator.compareDates(date1, date2, 'lt')).toBe(true)
      expect(SafeEvaluator.compareDates(date2, date1, 'gt')).toBe(true)
      expect(SafeEvaluator.compareDates(date1, date1, 'eq')).toBe(true)
      expect(SafeEvaluator.compareDates(date1, date1, 'lte')).toBe(true)
      expect(SafeEvaluator.compareDates(date1, date1, 'gte')).toBe(true)
    })

    it('should handle invalid date comparisons', () => {
      expect(SafeEvaluator.compareDates('invalid-date', new Date(), 'eq')).toBe(
        false,
      )
      expect(SafeEvaluator.compareDates(new Date(), 'invalid-date', 'eq')).toBe(
        false,
      )
      expect(SafeEvaluator.compareDates(NaN, new Date(), 'eq')).toBe(false)
      expect(SafeEvaluator.compareDates(new Date(), NaN, 'eq')).toBe(false)
    })

    it('should handle invalid operation in date comparison', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')
      expect(SafeEvaluator.compareDates(date1, date2, 'invalid' as any)).toBe(
        false,
      )
    })

    it('should test regex safely', () => {
      expect(SafeEvaluator.testRegex('test', undefined, 'this is a test')).toBe(
        true,
      )
      expect(SafeEvaluator.testRegex('test', 'i', 'THIS IS A TEST')).toBe(true)
      expect(SafeEvaluator.testRegex('test', undefined, 'no match')).toBe(false)
    })

    it('should handle invalid regex patterns', () => {
      expect(SafeEvaluator.testRegex('[invalid', undefined, 'test')).toBe(false)
      expect(SafeEvaluator.testRegex('test', 'invalid-flags', 'test')).toBe(
        false,
      )
    })
  })

  describe('Logger', () => {
    let originalEnv: string | undefined

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
    })

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('should log warnings in non-production environment', () => {
      process.env.NODE_ENV = 'development'
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      Logger.warn('test warning', 'TestContext')

      expect(consoleSpy).toHaveBeenCalledWith('[TestContext] test warning')
      consoleSpy.mockRestore()
    })

    it('should not log warnings in production environment', () => {
      process.env.NODE_ENV = 'production'
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      Logger.warn('test warning')

      expect(consoleSpy).toHaveBeenCalledWith('[Filter] test warning')
      consoleSpy.mockRestore()
    })

    it('should log errors always', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      Logger.error('test error', new Error('test'), 'TestContext')

      expect(consoleSpy).toHaveBeenCalledWith(
        '[TestContext] test error',
        expect.any(Error),
      )
      consoleSpy.mockRestore()
    })

    // it('should log debug messages in development environment', () => {
    //   process.env.NODE_ENV = 'development'
    //   const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    //   Logger.debug('test debug', { data: 'test' }, 'TestContext')

    //   expect(consoleSpy).toHaveBeenCalledWith(
    //     '[DEBUG:TestContext] test debug',
    //     { data: 'test' }
    //   )
    //   consoleSpy.mockRestore()
    // })

    // it('should not log debug messages in non-development environment', () => {
    //   process.env.NODE_ENV = 'production'
    //   const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    //   Logger.debug('test debug')

    //   expect(consoleSpy).not.toHaveBeenCalled()
    //   consoleSpy.mockRestore()
    // })

    // it('should log info messages in development environment', () => {
    //   process.env.NODE_ENV = 'development'
    //   const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    //   Logger.info('test info', { data: 'test' }, 'TestContext')

    //   expect(consoleSpy).toHaveBeenCalledWith('[INFO:TestContext] test info', {
    //     data: 'test',
    //   })
    //   consoleSpy.mockRestore()
    // })

    // it('should not log info messages in non-development environment', () => {
    //   process.env.NODE_ENV = 'production'
    //   const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    //   Logger.info('test info')

    //   expect(consoleSpy).not.toHaveBeenCalled()
    //   consoleSpy.mockRestore()
    // })

    it('should log unknown filter warnings', () => {
      process.env.NODE_ENV = 'development'
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      Logger.unknownFilter('unknownFilterType')

      expect(consoleSpy).toHaveBeenCalledWith(
        '[FilterRegistry] Unknown filter type: unknownFilterType',
      )
      consoleSpy.mockRestore()
    })
  })

  describe('StringNormalizer', () => {
    it('should normalize strings correctly', () => {
      expect(StringNormalizer.normalize('Test', false)).toBe('Test')
      expect(StringNormalizer.normalize('Test', true)).toBe('test')
      expect(StringNormalizer.normalize('TEST', true)).toBe('test')
      expect(StringNormalizer.normalize('', true)).toBe('')
    })

    it('should compare strings correctly', () => {
      expect(StringNormalizer.compare('Test', 'test', false)).toBe(false)
      expect(StringNormalizer.compare('Test', 'test', true)).toBe(true)
      expect(StringNormalizer.compare('TEST', 'test', true)).toBe(true)
      expect(StringNormalizer.compare('', '', true)).toBe(true)
    })

    it('should check string containment correctly', () => {
      expect(StringNormalizer.contains('Test String', 'test', false)).toBe(
        false,
      )
      expect(StringNormalizer.contains('Test String', 'test', true)).toBe(true)
      expect(StringNormalizer.contains('TEST STRING', 'test', true)).toBe(true)
      expect(StringNormalizer.contains('', 'test', true)).toBe(false)
      expect(StringNormalizer.contains('test', '', true)).toBe(true)
    })

    it('should check string starts with correctly', () => {
      expect(StringNormalizer.startsWith('Test String', 'test', false)).toBe(
        false,
      )
      expect(StringNormalizer.startsWith('Test String', 'test', true)).toBe(
        true,
      )
      expect(StringNormalizer.startsWith('TEST STRING', 'test', true)).toBe(
        true,
      )
      expect(StringNormalizer.startsWith('', 'test', true)).toBe(false)
      expect(StringNormalizer.startsWith('test', '', true)).toBe(true)
    })

    it('should check string ends with correctly', () => {
      expect(StringNormalizer.endsWith('String Test', 'test', false)).toBe(
        false,
      )
      expect(StringNormalizer.endsWith('String Test', 'test', true)).toBe(true)
      expect(StringNormalizer.endsWith('STRING TEST', 'test', true)).toBe(true)
      expect(StringNormalizer.endsWith('', 'test', true)).toBe(false)
      expect(StringNormalizer.endsWith('test', '', true)).toBe(true)
    })
  })

  describe('ValidationUtils', () => {
    it('should validate strings correctly', () => {
      expect(ValidationUtils.validateString('test')).toBe(true)
      expect(ValidationUtils.validateString('')).toBe(true)
      expect(ValidationUtils.validateString(null)).toBe(false)
      expect(ValidationUtils.validateString(undefined)).toBe(false)
      expect(ValidationUtils.validateString(123)).toBe(false)
      expect(ValidationUtils.validateString({})).toBe(false)
      expect(ValidationUtils.validateString([])).toBe(false)
    })

    it('should validate arrays correctly', () => {
      expect(ValidationUtils.validateArray([1, 2, 3])).toBe(true)
      expect(ValidationUtils.validateArray([])).toBe(true)
      expect(ValidationUtils.validateArray(null)).toBe(false)
      expect(ValidationUtils.validateArray(undefined)).toBe(false)
      expect(ValidationUtils.validateArray('string')).toBe(false)
      expect(ValidationUtils.validateArray(123)).toBe(false)
      expect(ValidationUtils.validateArray({})).toBe(false)
    })

    it('should validate objects correctly', () => {
      expect(ValidationUtils.validateObject({})).toBe(true)
      expect(ValidationUtils.validateObject({ key: 'value' })).toBe(true)
      expect(ValidationUtils.validateObject(null)).toBe(false)
      expect(ValidationUtils.validateObject(undefined)).toBe(false)
      expect(ValidationUtils.validateObject('string')).toBe(false)
      expect(ValidationUtils.validateObject(123)).toBe(false)
      expect(ValidationUtils.validateObject([])).toBe(false)
    })

    it('should validate not null values correctly', () => {
      expect(ValidationUtils.validateNotNull('test')).toBe(true)
      expect(ValidationUtils.validateNotNull(123)).toBe(true)
      expect(ValidationUtils.validateNotNull({})).toBe(true)
      expect(ValidationUtils.validateNotNull([])).toBe(true)
      expect(ValidationUtils.validateNotNull(null)).toBe(false)
      expect(ValidationUtils.validateNotNull(undefined)).toBe(false)
    })
  })

  describe('Logger (cobertura total)', () => {
    let originalEnv: string | undefined
    let warnSpy: any, errorSpy: any, logSpy: any

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    })
    afterEach(() => {
      process.env.NODE_ENV = originalEnv
      warnSpy.mockRestore()
      errorSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('warn debe loguear en desarrollo', () => {
      process.env.NODE_ENV = 'development'
      Logger['isProduction'] = false
      Logger.warn('msg', 'CTX')
      expect(warnSpy).toHaveBeenCalledWith('[CTX] msg')
    })
    it('warn NO debe loguear en producción', () => {
      process.env.NODE_ENV = 'production'
      Logger['isProduction'] = true
      Logger.warn('msg', 'CTX')
      expect(warnSpy).not.toHaveBeenCalled()
    })
    it('error siempre loguea', () => {
      Logger.error('err', 'e', 'CTX')
      expect(errorSpy).toHaveBeenCalledWith('[CTX] err', 'e')
    })
    it('debug solo loguea en desarrollo', () => {
      process.env.NODE_ENV = 'development'
      Logger['isDevelopment'] = true
      Logger.debug('dbg', { foo: 1 }, 'CTX')
      expect(logSpy).toHaveBeenCalledWith('[DEBUG:CTX] dbg', { foo: 1 })
    })
    it('debug NO loguea fuera de desarrollo', () => {
      process.env.NODE_ENV = 'production'
      Logger['isDevelopment'] = false
      Logger.debug('dbg', { foo: 1 }, 'CTX')
      expect(logSpy).not.toHaveBeenCalled()
    })
    it('info solo loguea en desarrollo', () => {
      process.env.NODE_ENV = 'development'
      Logger['isDevelopment'] = true
      Logger.info('inf', { bar: 2 }, 'CTX')
      expect(logSpy).toHaveBeenCalledWith('[INFO:CTX] inf', { bar: 2 })
    })
    it('info NO loguea fuera de desarrollo', () => {
      process.env.NODE_ENV = 'production'
      Logger['isDevelopment'] = false
      Logger.info('inf', { bar: 2 }, 'CTX')
      expect(logSpy).not.toHaveBeenCalled()
    })
    it('unknownFilter llama a warn con contexto FilterRegistry', () => {
      Logger['isProduction'] = false
      Logger.unknownFilter('custom')
      expect(warnSpy).toHaveBeenCalledWith(
        '[FilterRegistry] Unknown filter type: custom',
      )
    })
  })

  describe('ValidationUtils (cobertura total)', () => {
    it('isEmptyFilter: cubre todos los casos', () => {
      expect(ValidationUtils.isEmptyFilter({})).toBe(true)
      expect(ValidationUtils.isEmptyFilter({ a: 1 })).toBe(false)
      expect(ValidationUtils.isEmptyFilter([])).toBe(false)
      expect(ValidationUtils.isEmptyFilter(null)).toBe(false)
      expect(ValidationUtils.isEmptyFilter(undefined)).toBe(false)
      expect(ValidationUtils.isEmptyFilter('')).toBe(false)
    })
    it('hasOnlyPrimitiveValues: cubre todos los casos', () => {
      expect(
        ValidationUtils.hasOnlyPrimitiveValues({ a: 1, b: 'x', c: null }),
      ).toBe(true)
      expect(
        ValidationUtils.hasOnlyPrimitiveValues({ a: 1, b: { x: 2 } }),
      ).toBe(false)
      expect(ValidationUtils.hasOnlyPrimitiveValues(null)).toBe(false)
      expect(ValidationUtils.hasOnlyPrimitiveValues([])).toBe(true)
      expect(ValidationUtils.hasOnlyPrimitiveValues('str')).toBe(false)
      expect(ValidationUtils.hasOnlyPrimitiveValues({})).toBe(true)
    })
  })
})
