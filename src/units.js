export function sample2dBFS(sample) {
	return 20 * Math.log10(Math.abs(sample));
}

export function dBFS2sample(dBFS) {
	return Math.pow(10, dBFS / 20);
}
