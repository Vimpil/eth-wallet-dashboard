import { ErrorMonitor } from './monitoring';

describe('ErrorMonitor', () => {
  let errorMonitor: ErrorMonitor;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    errorMonitor = ErrorMonitor.getInstance();
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should be a singleton', () => {
    const instance1 = ErrorMonitor.getInstance();
    const instance2 = ErrorMonitor.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should report error and log in development', () => {
    const error = new Error('Test error');
    const context = { foo: 'bar' };
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    errorMonitor.reportError(error, context);
    expect(console.error).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        error,
        context,
        userAgent: expect.any(String),
        timestamp: expect.any(Number)
      })
    );
    process.env.NODE_ENV = oldEnv;
  });

  it('should not log in production', () => {
    const error = new Error('Prod error');
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    errorMonitor.reportError(error);
    expect(console.error).not.toHaveBeenCalled();
    process.env.NODE_ENV = oldEnv;
  });

  it('should handle unhandledrejection', () => {
    const error = new Error('Promise rejection');
    const spy = jest.spyOn(errorMonitor, 'reportError');
    const event = { reason: error } as PromiseRejectionEvent;
    errorMonitor['handleUnhandledRejection'](event);
    expect(spy).toHaveBeenCalledWith(error);
  });

  it('should handle error event', () => {
    const error = new Error('Event error');
    const spy = jest.spyOn(errorMonitor, 'reportError');
    const event = { error } as ErrorEvent;
    errorMonitor['handleError'](event);
    expect(spy).toHaveBeenCalledWith(error);
  });
});
