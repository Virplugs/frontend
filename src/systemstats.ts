import os = require('os');
import { clearInterval } from 'timers';

function getCPUUsage(cpus: os.CpuInfo[]) {
	let usages = [];
	for (var i = 0, len = cpus.length; i < len; i++) {
		var cpu = cpus[i], total = 0, idle = 0;

		total += cpu.times['user'];
		total += cpu.times['nice'];
		total += cpu.times['sys'];
		total += cpu.times['irq'];
		total += cpu.times['idle'];

		idle = cpu.times['idle'];

		usages.push({
			idle,
			total,
		});
	}
	return usages;
}

export function requestCPUUpdates(callback: (avg: { total: number; idle: number; average: number }[]) => boolean, interval = 1000) {
	let prev = getCPUUsage(os.cpus());
	const handle = setInterval(() => {
		let cur = getCPUUsage(os.cpus());

		const res = [];
		for (var i = 0; i < cur.length; i++) {
			res[i] = {
				total: cur[i].total - prev[i].total,
				idle: cur[i].idle - prev[i].idle,
				average: 0
			};
			res[i].average = 1.0 - res[i].idle / res[i].total;
		}

		if (callback(res) === false) {
			clearInterval(handle);
		}
		prev = cur;
	}, interval);
}
