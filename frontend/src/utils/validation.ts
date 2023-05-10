export const isValidDateObject = (d: any) => {
	return d instanceof Date && !isNaN(d.getTime());
};
