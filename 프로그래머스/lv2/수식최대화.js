// "50*6-3*2" -> [50, '*', 6, '-', 3, '*', 2]
function expressionToArr(expression) {
    const expArr = [];
    const operators = new Set();
    let temp = expression[0];

    for(let i = 1; i < expression.length; i++) {
        if(isNaN(expression[i])) {
            expArr.push(+temp);
            expArr.push(expression[i]);
            operators.add(expression[i]);
            temp = "";
        } else {
            temp += expression[i];
        }
    }
    expArr.push(+temp);
    return { expArr, operators };
}

// [ '*', '-' ] -> [[*,-], [-,*]]
function getPriority(arr, selectedNum) {
    const result = [];

    if(selectedNum === 1) return arr.map(e => [e]);

    arr.forEach((fixed, idx, origin) => {
        const tails = [...origin.slice(0, idx), ...origin.slice(idx + 1)];
        const heads = getPriority(tails, selectedNum - 1);
        const attached = heads.map(head => [fixed, ... head]);
        result.push(...attached);
    });

    return result;
}

function calculate(t1, t2, targetOp) {
    switch(targetOp) {
        case '+':
            return t1 + t2;
        case '-':
            return t1 - t2;
        case '*':
            return t1 * t2;
    }
}

function updateExp(expArr, operators) {
    if(expArr.length === 1) {
        return expArr[0];
    }
    const i = expArr.indexOf(operators[0]);
    if(i === -1) {
        operators.shift();
        return updateExp(expArr, operators);
    }
    if(i !== -1) {
        const term = calculate(expArr[i - 1], expArr[i + 1], operators[0]);
        const updatedExpArr = [...expArr.slice(0, i - 1), term, ...expArr.slice(i + 2)];
        return updateExp(updatedExpArr, operators);
    }
}

function solution(expression) {
    let max = 0;
    const { expArr, operators } = expressionToArr(expression); 
    const q = getPriority([...operators], operators.size); 

    q.forEach(op => {
        const temp = updateExp(expArr, op);
        max = Math.max(max, Math.abs(temp));
    });

    return max;
}

// 두 번째 풀이 - slice 활용
function convertExpression(expression) {
    const terms = [];
    const operators = new Set();
    let temp = '';
    for(let i = 0; i < expression.length; i++) {
        if(isNaN(expression[i])) {
            terms.push(+temp, expression[i]);
            operators.add(expression[i]);
            temp = '';
        } else {
            temp += expression[i];
        }
    }
    terms.push(+temp);
    return { terms, operators };
}

function getPermutations(arr, selectedN) {
    const result = [];
    if(arr.length === 1) return arr.map(e => [e]);
    arr.forEach((fixed, i, origin) => {
        const rest = [...origin.slice(0, i), ...origin.slice(i + 1)];
        const perms = getPermutations(rest, selectedN - 1);
        const attached = perms.map(p => [fixed, ...p]);
        result.push(...attached);
    });
    return result;
}

function calculateTerm(a, b, op) {
    if(op === '*') {
        return a * b;
    }
    if(op === '+') {
        return a + b;
    }
    if(op === '-') {
        return a - b;
    }
}

function calculate(terms, ops) {
    if(terms.length === 1) {
        return Math.abs(...terms);
    }
    const i = terms.indexOf(ops[0]);
    if(i === -1) {
        return calculate(terms, ops.slice(1));
    }
    if(i !== -1) {
        return calculate([...terms.slice(0, i - 1), calculateTerm(terms[i - 1], terms[i + 1], ops[0]), ...terms.slice(i + 2)], ops);
    }
}

function solution(expression) {
    // 주어진 문자열을 배열로 변환하고 문자열에 들어간 연산자 배열 구하기
    const { terms, operators } = convertExpression(expression);
    // 연산자 우선순위 조합 구하기
    const operatorPerms = getPermutations([...operators], operators.size);
    // 연산자 우선순위 조합을 순회하며 가장 큰 절댓값을 찾기
    let max = 0;
    operatorPerms.forEach(op => {
        max = Math.max(max, calculate(terms, op));
    });
    return max;
}
