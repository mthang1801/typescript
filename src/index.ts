
import {
    interval,
    map,
    merge,
    mergeAll,
    of
} from 'rxjs';

const first = interval(2500).pipe(map(val => `First  --> ${val}`));
const second = interval(1000).pipe(map(val => `Second --> ${val}`));

of(first, second).pipe(mergeAll()).subscribe(console.log)