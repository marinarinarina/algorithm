function solution(k, tangerine) {
    // 가장 많은 것 부터 넣는다.
    let cnt = 0;
    const max = Math.max(...tangerine);
    const arr = Array(max + 1).fill(0);

    for(let i = 0; i < tangerine.length; i++) {
        arr[tangerine[i]]++;
    }

    arr.sort((a, b) => b - a);

    for(let i = 0; i < arr.length - 1; i++) {
        if(k === 0) {
            return cnt;
        }
        if(arr[i] <= k) {
            k -= arr[i];
            cnt++;
        } else {
            k = 0;
            cnt++;
        }
    }

    return cnt;
}

// 풀이 2 - Map (계수정렬보다 더 빠름)
function solution(k, tangerine) {
    const map = tangerine.reduce((acc, curV) => {
        acc.set(curV, (acc.get(curV) || 0) + 1);
        return acc;
    }, new Map());
    
    const arr = Array.from(map.values()).sort((a, b) => b - a);

    let cnt = 0;
    
    for(let i = 0; i < arr.length; i++) {
        if(k === 0) {
            return cnt;
        }
        if(arr[i] <= k) {
            k -= arr[i];
            cnt++;
        } else {
            k = 0;
            cnt++;
        }
    }
    
    return cnt;
}
