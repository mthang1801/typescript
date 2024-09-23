import { setFlagsFromString } from 'v8';
import { runInNewContext } from 'vm';
setFlagsFromString('--expose_gc');
const gc = runInNewContext('gc'); // nocommit

const memoryUsed = () => Math.floor(process.memoryUsage().heapUsed / 1e6) + 'MB';

const collectGarbage = () => {
	const before = process.memoryUsage().heapUsed;
	console.log(`Before collected garbage: ${memoryUsed()}`);

	gc();
	const after = process.memoryUsage().heapUsed;
	console.log(`After collected garbage: ${Math.floor(before - after) / 1e6}MB`);
};

function fill(mapLike: Map<any, any> | WeakMap<any, any>, char: string) {
	for (let i = 0; i < 2500; i++) {
		mapLike.set({ id: Math.random() }, new Array(100_000).fill(char));
	}
}

console.log('=========== Map ==============');
const map = new Map();
console.log(`Start: ${memoryUsed()}`);
fill(map, '*');
collectGarbage();

console.log(`Start: ${memoryUsed()}`);
fill(map, 'Hello World');
collectGarbage();
map.clear()

console.log('=========== WeakMap ==============');
const weakMap = new WeakMap();
console.log(`Start: ${memoryUsed()}`);
fill(weakMap, '*');
collectGarbage();

console.log(`Start: ${memoryUsed()}`); 
fill(weakMap, 'Hello World');
collectGarbage();
