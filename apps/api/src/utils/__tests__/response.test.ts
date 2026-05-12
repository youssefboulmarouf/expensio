import { describe, it, expect } from 'vitest';
import { success, error, internalError } from '../response';

describe('success', () => {
  it('wraps data in the success envelope', () => {
    expect(success({ id: '1' })).toEqual({ success: true, data: { id: '1' } });
  });

  it('works with primitive values', () => {
    expect(success(42)).toEqual({ success: true, data: 42 });
  });
});

describe('error', () => {
  it('returns error envelope without details', () => {
    expect(error('NOT_FOUND', 'Resource not found')).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Resource not found' },
    });
  });

  it('includes details when provided', () => {
    expect(error('VALIDATION_ERROR', 'Invalid input', { email: 'invalid' })).toEqual({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: { email: 'invalid' } },
    });
  });

  it('omits details key when undefined', () => {
    const result = error('CODE', 'msg');
    expect(Object.keys(result.error)).not.toContain('details');
  });
});

describe('internalError', () => {
  it('always includes message and stack', () => {
    const err = new Error('something broke');
    const result = internalError(err);

    expect(result.error.code).toBe('INTERNAL_ERROR');
    expect(result.error.details).toMatchObject({
      message: 'something broke',
      stack: expect.stringContaining('something broke'),
    });
  });

  it('handles non-Error values', () => {
    const result = internalError('raw string error');

    expect(result.error.details).toMatchObject({ message: 'raw string error' });
  });
});
