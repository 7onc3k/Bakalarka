import { describe, it, expect } from 'vitest'
import {
  DunningStatus,
  createInstance,
  process,
  type DunningEvent,
  type ActionDescriptor,
  type DunningConfig,
  type DunningState,
  type ProcessResult
} from '../src/index.js'

describe('Domain Types', () => {
  it('should export DunningStatus array', () => {
    expect(DunningStatus).toBeDefined()
  })

  it('should have all required statuses', () => {
    const expectedStatuses = [
      'ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE',
      'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE',
      'SUSPENDED', 'WRITTEN_OFF', 'PAID', 'PAUSED', 'CANCELLED'
    ]
    expectedStatuses.forEach(status => {
      expect(DunningStatus.includes(status)).toBe(true)
    })
  })

  it('should export createInstance function', () => {
    expect(createInstance).toBeDefined()
    expect(typeof createInstance).toBe('function')
  })

  it('should export process function', () => {
    expect(process).toBeDefined()
    expect(typeof process).toBe('function')
  })
})