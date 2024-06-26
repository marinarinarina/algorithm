// eg. [1,2]가 [1,2,3]의 부분집합인지 판단
function isSubset(subset, set) {
    return subset.every(e => set.includes(e));
}

function getCombinations(arr, selectN) {
    const result = [];
    if(selectN === 1) {
        return arr.map(e => [e]);
    }
    arr.forEach((fixed, idx, origin) => {
        const rest = origin.slice(idx + 1);
        const combinations = getCombinations(rest, selectN - 1);
        const attached = combinations.map(comb => [fixed, ...comb]);
        result.push(...attached);
    });
    return result;
}

function checkUniqueness(relation, combinations) {
    const result = [];
    const tupleCnt = relation.length;
    combinations.forEach(keys => {
        const set = new Set();
        relation.forEach(tuples => {
            set.add(keys.map(key => tuples[key]).join(','));
        });
        if(set.size === tupleCnt) {
            result.push(keys);
        }
    });
    return result;
}

function checkMinimality(combinations) {
    const result = [];
    while(combinations.length) {
        result.push(combinations[0]);
        combinations = combinations.reduce((arr, keys) => {
            if(isSubset(combinations[0], keys) === false) arr.push(keys);
            return arr;
        }, []);
    }
    return result;
}

function solution(relation) {
    const relIdxes = Array.from({ length: relation[0].length }, (_, i) => i);
    const combinations = [];

    for(let i = 0; i < relation.length; i++) {
        combinations.push(...getCombinations(relIdxes, i + 1));
    }

    const filteredUniqCombinations = checkUniqueness(relation, combinations);
    const result = checkMinimality(filteredUniqCombinations);

    return result.length;
}

// 두 번째 풀이 - 비트마스킹
function getCombinations(n) {
    const bitmask = [];
    
    for(let i = 1; i < (1 << n); i++) {
        let bit = '';
        for(let j = 0; j < n; j++) {
            if((i & (1 << j)) !== 0) bit += j;
        }
        bitmask.push(bit);
    }
    
    bitmask.sort((a, b) => a.length - b.length);
    
    return bitmask;
}

function checkUniqueness(keys, relation) {
    const set = new Set();
    relation.forEach(tuple => {
        const temp = keys.map(k => tuple[k]).join(',');
        set.add(temp);
    });
    return set.size === relation.length;
}

function solution(relation) {
    const col = relation[0].length;
    const row = relation.length;
    let bitmask = getCombinations(col); 
    let cnt = 0;
    
    while(bitmask.length) {
        const keys = bitmask.shift().split('').map(bit => +bit);
        
        if(checkUniqueness(keys, relation)) {
            cnt++;
            bitmask = bitmask.filter(bit => !keys.every(k => bit.includes(k)));
        }
    }
    
    return cnt;
}
