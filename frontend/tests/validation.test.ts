import { isValidDateObject } from '../src/utils/validation';

describe('validation of date', () => {
	it('should return true if date is valid', () => {
		expect(isValidDateObject(new Date('2021-01-01'))).toBe(true);
	});

	it('should return false if date is invalid', () => {
		expect(isValidDateObject(new Date('2021-01-32'))).toBe(false);

		expect(isValidDateObject(new Date('2021-13-01'))).toBe(false);

		expect(isValidDateObject(new Date('2021-00-01'))).toBe(false);

		expect(isValidDateObject(new Date('2021-01-00'))).toBe(false);
	});

	it('should return false if date is not a date', () => {
		expect(isValidDateObject('Some random string')).toBe(false);

		expect(isValidDateObject(123)).toBe(false);

		expect(isValidDateObject(true)).toBe(false);

		expect(isValidDateObject(undefined)).toBe(false);

		expect(isValidDateObject(null)).toBe(false);

		expect(isValidDateObject({})).toBe(false);
	});
});
