export function sample2dBFS(sample: number) {
	return 20 * Math.log10(Math.abs(sample));
}

export function dBFS2sample(dBFS: number) {
	return Math.pow(10, dBFS / 20);
}

/** scale of -1..+1 will be scaled from -1..0 to -inf..0  and from 0..+1 to 0..max. */
export function scaleTodBFS(v: number, max: number) {
	const max_s = dBFS2sample(max);
	if (v < 0) {
		return 20 * Math.log10(1 + v);
	} else {
		return max - 20 * Math.log10((1 - v * (1 - dBFS2sample(-max))) * max_s);
	}
}

/** Scale the dBFS value to a scale of -1..+1, where -1..0 will be scaled to -inf..0  and 0..+1 to 0..max. */
export function dBFSToScale(db: number, max: number) {
	const max_s = dBFS2sample(max);
	if (db < 0) {
		return 1 - Math.pow(10, db / 20);
	} else {
		db = max - db;
		db /= 20;
		db = Math.pow(10, db);
		db /= max_s;
		db = 1 - db;
		db /= 1 - dBFS2sample(-max);
		return db;
	}
}
