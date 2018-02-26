import one from './fixtures/one';

describe('t2', () => {
  describe('Fixture 2', () => {
    it('should be defined', () => {
      expect(one).toBeDefined();
    });
    it('should return dependency signature', () => {
      expect(one()).toBe('1ab');
    });
  });
});
