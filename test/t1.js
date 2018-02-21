import one from './fixtures/1';

describe('t1', () => {
  describe('Fixture 1', () => {
    it('should be defined', () => {
      expect(one).toBeDefined();
    });
    it('should return dependency signature', () => {
      expect(one()).toBe('1ab');
    });
  });
});
