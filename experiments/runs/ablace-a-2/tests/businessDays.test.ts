import { describe, it, expect } from 'vitest'
import { addBusinessDays, countBusinessDays, isBusinessDay } from '../src/index.js'

describe('Business Days Calculator', () => {
  describe('isBusinessDay', () => {
    it('should return true for Monday', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      expect(isBusinessDay(monday)).toBe(true)
    })

    it('should return true for Tuesday', () => {
      const tuesday = new Date('2024-01-09T12:00:00Z')
      expect(isBusinessDay(tuesday)).toBe(true)
    })

    it('should return true for Wednesday', () => {
      const wednesday = new Date('2024-01-10T12:00:00Z')
      expect(isBusinessDay(wednesday)).toBe(true)
    })

    it('should return true for Thursday', () => {
      const thursday = new Date('2024-01-04T12:00:00Z')
      expect(isBusinessDay(thursday)).toBe(true)
    })

    it('should return true for Friday', () => {
      const friday = new Date('2024-01-05T12:00:00Z')
      expect(isBusinessDay(friday)).toBe(true)
    })

    it('should return false for Saturday', () => {
      const saturday = new Date('2024-01-06T12:00:00Z')
      expect(isBusinessDay(saturday)).toBe(false)
    })

    it('should return false for Sunday', () => {
      const sunday = new Date('2024-01-07T12:00:00Z')
      expect(isBusinessDay(sunday)).toBe(false)
    })
  })

  describe('countBusinessDays', () => {
    it('should count 0 days when start and end are the same', () => {
      const date = new Date('2024-01-08T12:00:00Z')
      expect(countBusinessDays(date, date)).toBe(0)
    })

    it('should count 1 day for next business day', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      const tuesday = new Date('2024-01-09T12:00:00Z')
      expect(countBusinessDays(monday, tuesday)).toBe(1)
    })

    it('should exclude weekends from count', () => {
      const friday = new Date('2024-01-05T12:00:00Z')
      const monday = new Date('2024-01-08T12:00:00Z')
      expect(countBusinessDays(friday, monday)).toBe(1)
    })

    it('should count 5 days for a full work week', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      const nextMonday = new Date('2024-01-15T12:00:00Z')
      expect(countBusinessDays(monday, nextMonday)).toBe(5)
    })

    it('should exclude holidays from count', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      const tuesday = new Date('2024-01-09T12:00:00Z')
      const holidays = [new Date('2024-01-09T12:00:00Z')]
      expect(countBusinessDays(monday, tuesday, holidays)).toBe(0)
    })

    it('should handle multiple holidays', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      const thursday = new Date('2024-01-11T12:00:00Z')
      const holidays = [
        new Date('2024-01-09T12:00:00Z'),
        new Date('2024-01-10T12:00:00Z')
      ]
      expect(countBusinessDays(monday, thursday, holidays)).toBe(1)
    })
  })

  describe('addBusinessDays', () => {
    it('should add 0 days', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      const result = addBusinessDays(monday, 0)
      expect(result.getTime()).toBe(monday.getTime())
    })

    it('should add 1 business day', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      const result = addBusinessDays(monday, 1)
      expect(result.getDay()).toBe(2)
    })

    it('should skip weekends when adding days', () => {
      const friday = new Date('2024-01-05T12:00:00Z')
      const result = addBusinessDays(friday, 1)
      expect(result.getDay()).toBe(1)
    })

    it('should skip multiple weekends', () => {
      const friday = new Date('2024-01-05T12:00:00Z')
      const result = addBusinessDays(friday, 5)
      expect(countBusinessDays(friday, result)).toBe(5)
    })

    it('should exclude holidays when adding days', () => {
      const monday = new Date('2024-01-08T12:00:00Z')
      const holidays = [new Date('2024-01-09T12:00:00Z')]
      const result = addBusinessDays(monday, 1, holidays)
      expect(result.getTime()).toBe(new Date('2024-01-10T12:00:00Z').getTime())
    })

    it('should handle starting on a weekend by moving to Monday', () => {
      const saturday = new Date('2024-01-06T12:00:00Z')
      const result = addBusinessDays(saturday, 1)
      expect(result.getDay()).toBe(1)
    })
  })
})