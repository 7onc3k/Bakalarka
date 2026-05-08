import { describe, it, expect } from 'vitest'
import { createInstance, process, DunningStatus, type DunningEvent } from '../src/index.js'

function daysFromNow(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(12, 0, 0, 0)
  return date
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

describe('Dunning State Machine', () => {
  describe('createInstance', () => {
    it('should create instance with ISSUED status', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      expect(state.status).toBe('ISSUED')
      expect(state.dueDate.getTime()).toBe(dueDate.getTime())
      expect(state.stateEnteredAt).toBeInstanceOf(Date)
    })

    it('should use default config when not provided', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      expect(state.config).toBeDefined()
      expect(state.config.timeouts).toBeUndefined()
      expect(state.config.holidays).toBeUndefined()
    })

    it('should use custom config when provided', () => {
      const dueDate = daysFromNow(30)
      const customHolidays = [daysFromNow(10)]
      const state = createInstance(dueDate, { holidays: customHolidays })
      expect(state.config.holidays).toEqual(customHolidays)
    })

    it('should use custom timeouts when provided', () => {
      const dueDate = daysFromNow(30)
      const customTimeouts = { OVERDUE: 5 }
      const state = createInstance(dueDate, { timeouts: customTimeouts })
      expect(state.config.timeouts).toEqual(customTimeouts)
    })
  })

  describe('Time-based transitions', () => {
    it('should transition from ISSUED to DUE_SOON 7 business days before due date', () => {
      const dueDate = addDays(new Date(), 14)
      const state = createInstance(dueDate)
      const sevenDaysBefore = addDays(dueDate, -7)
      const result = process(state, { type: 'tick' }, sevenDaysBefore)
      expect(result.state.status).toBe('DUE_SOON')
      expect(result.actions).toHaveLength(1)
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'due_soon_reminder' })
    })

    it('should transition from DUE_SOON to OVERDUE at due date', () => {
      const dueDate = addDays(new Date(), 7)
      const state = createInstance(dueDate)
      const atDueDate = new Date(dueDate)
      state.status = 'DUE_SOON'
      state.stateEnteredAt = addDays(dueDate, -7)
      const result = process(state, { type: 'tick' }, atDueDate)
      expect(result.state.status).toBe('OVERDUE')
      expect(result.actions).toHaveLength(0)
    })

    it('should transition from OVERDUE to GRACE after 3 business days', () => {
      const dueDate = new Date()
      const state = createInstance(dueDate)
      state.status = 'OVERDUE'
      state.stateEnteredAt = addDays(dueDate, 0)
      const after3Days = addDays(dueDate, 3)
      const result = process(state, { type: 'tick' }, after3Days)
      expect(result.state.status).toBe('GRACE')
      expect(result.actions).toHaveLength(0)
    })

    it('should transition from GRACE to REMINDER_1 after 7 business days', () => {
      const dueDate = new Date()
      const state = createInstance(dueDate)
      state.status = 'GRACE'
      state.stateEnteredAt = addDays(dueDate, 3)
      const after7Days = addDays(state.stateEnteredAt, 7)
      const result = process(state, { type: 'tick' }, after7Days)
      expect(result.state.status).toBe('REMINDER_1')
      expect(result.actions).toHaveLength(1)
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' })
    })

    it('should transition from REMINDER_1 to REMINDER_2 after 14 business days', () => {
      const dueDate = new Date()
      const state = createInstance(dueDate)
      state.status = 'REMINDER_1'
      state.stateEnteredAt = addDays(dueDate, 10)
      const after14Days = addDays(state.stateEnteredAt, 14)
      const result = process(state, { type: 'tick' }, after14Days)
      expect(result.state.status).toBe('REMINDER_2')
      expect(result.actions).toHaveLength(1)
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'second_reminder' })
    })

    it('should transition from REMINDER_2 to FINAL_NOTICE after 14 business days', () => {
      const dueDate = new Date()
      const state = createInstance(dueDate)
      state.status = 'REMINDER_2'
      state.stateEnteredAt = addDays(dueDate, 24)
      const after14Days = addDays(state.stateEnteredAt, 14)
      const result = process(state, { type: 'tick' }, after14Days)
      expect(result.state.status).toBe('FINAL_NOTICE')
      expect(result.actions).toHaveLength(1)
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'final_warning' })
    })

    it('should transition from FINAL_NOTICE to SUSPENDED after 7 business days', () => {
      const dueDate = new Date()
      const state = createInstance(dueDate)
      state.status = 'FINAL_NOTICE'
      state.stateEnteredAt = addDays(dueDate, 38)
      const after7Days = addDays(state.stateEnteredAt, 7)
      const result = process(state, { type: 'tick' }, after7Days)
      expect(result.state.status).toBe('SUSPENDED')
      expect(result.actions).toHaveLength(2)
      expect(result.actions).toContainEqual({ type: 'suspend_service' })
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'service_suspended' })
    })

    it('should transition from SUSPENDED to WRITTEN_OFF after 30 business days', () => {
      const dueDate = new Date()
      const state = createInstance(dueDate)
      state.status = 'SUSPENDED'
      state.stateEnteredAt = addDays(dueDate, 45)
      const after30Days = addDays(state.stateEnteredAt, 30)
      const result = process(state, { type: 'tick' }, after30Days)
      expect(result.state.status).toBe('WRITTEN_OFF')
      expect(result.actions).toHaveLength(1)
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' })
    })
  })

  describe('Payment handling', () => {
    it('should transition to PAID from any active state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'OVERDUE'
      const result = process(state, { type: 'payment_received' }, new Date())
      expect(result.state.status).toBe('PAID')
    })

    it('should return resume_service when payment received from SUSPENDED', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'SUSPENDED'
      const result = process(state, { type: 'payment_received' }, new Date())
      expect(result.state.status).toBe('PAID')
      expect(result.actions).toContainEqual({ type: 'resume_service' })
    })
  })

  describe('Invoice cancellation', () => {
    it('should transition to CANCELLED from any active state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'OVERDUE'
      const result = process(state, { type: 'invoice_cancelled' }, new Date())
      expect(result.state.status).toBe('CANCELLED')
    })

    it('should return resume_service when cancelling from SUSPENDED', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'SUSPENDED'
      const result = process(state, { type: 'invoice_cancelled' }, new Date())
      expect(result.state.status).toBe('CANCELLED')
      expect(result.actions).toContainEqual({ type: 'resume_service' })
    })

    it('should not transition from PAID state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'PAID'
      const result = process(state, { type: 'invoice_cancelled' }, new Date())
      expect(result.state.status).toBe('PAID')
    })

    it('should not transition from WRITTEN_OFF state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'WRITTEN_OFF'
      const result = process(state, { type: 'invoice_cancelled' }, new Date())
      expect(result.state.status).toBe('WRITTEN_OFF')
    })
  })

  describe('Pause/Resume', () => {
    it('should transition from active state to PAUSED', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'OVERDUE'
      const result = process(state, { type: 'dunning_paused' }, new Date())
      expect(result.state.status).toBe('PAUSED')
      expect(result.state.pausedFrom).toBe('OVERDUE')
    })

    it('should preserve pausedElapsed when pausing', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'OVERDUE'
      state.stateEnteredAt = addDays(new Date(), -2)
      const result = process(state, { type: 'dunning_paused' }, new Date())
      expect(result.state.pausedElapsed).toBeGreaterThan(0)
    })

    it('should resume from previous state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'PAUSED'
      state.pausedFrom = 'OVERDUE'
      const result = process(state, { type: 'dunning_resumed' }, new Date())
      expect(result.state.status).toBe('OVERDUE')
      expect(result.state.pausedFrom).toBeUndefined()
    })

    it('should prioritize payment over paused state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'PAUSED'
      const result = process(state, { type: 'payment_received' }, new Date())
      expect(result.state.status).toBe('PAID')
    })

    it('should allow cancellation from paused state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'PAUSED'
      const result = process(state, { type: 'invoice_cancelled' }, new Date())
      expect(result.state.status).toBe('CANCELLED')
    })
  })

  describe('Manual advance', () => {
    it('should advance to next state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'GRACE'
      state.stateEnteredAt = new Date()
      const result = process(state, { type: 'manual_advance' }, new Date())
      expect(result.state.status).toBe('REMINDER_1')
      expect(result.actions).toHaveLength(1)
    })
  })

  describe('Terminal states', () => {
    it('should not transition from PAID state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'PAID'
      const result = process(state, { type: 'tick' }, new Date())
      expect(result.state.status).toBe('PAID')
      expect(result.actions).toHaveLength(0)
    })

    it('should not transition from WRITTEN_OFF state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'WRITTEN_OFF'
      const result = process(state, { type: 'tick' }, new Date())
      expect(result.state.status).toBe('WRITTEN_OFF')
      expect(result.actions).toHaveLength(0)
    })

    it('should not transition from CANCELLED state', () => {
      const dueDate = daysFromNow(30)
      const state = createInstance(dueDate)
      state.status = 'CANCELLED'
      const result = process(state, { type: 'tick' }, new Date())
      expect(result.state.status).toBe('CANCELLED')
      expect(result.actions).toHaveLength(0)
    })
  })
})