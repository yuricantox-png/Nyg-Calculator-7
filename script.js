// ===== STATE =====
let current = '0'
let previous = ''
let operator = ''
let justEvaluated = false

// ===== ELEMENTS =====
const display = document.getElementById('result')
const expressionEl = document.getElementById('expression')

// ===== UPDATE DISPLAY =====
function updateDisplay(value, expr) {
    reseultEl.textContent = value
    expressionEl.textContent = expr || ''
} 

// ===== FORMAT NUMBER =====
function format(n) {
    let s = parseFloat(n).toString()
    if (s.length > 12) s = parseFloat(parseFloat(n).toPrecision(9)).toString()
    return s
}

// ===== CALCULATE =====
function calculate(a, b, op) {
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    if (op === '+') return format(numA + numB)
    if (op === '-') return format(numA - numB)
    if (op === '*') return format(numA * numB)
    if (op === '/') {
        if (numB === 0) return 'Burro'
        return numA / numB
    }
}

// ===== SYMBOL DISPLAY =====
function symbolDisplay(op) {
    if (op === '*') return '×'
    if (op === '/') return '÷'
    if (op === '-') return '-'
    return op
}

// ===== HANDLE NUMBER =====
function handleNumber(num) {
    if (justEvaluated) { current = ''; justEvaluated = false }
    if (current === '0') current = num
    else current += num
    if (current.length >= 12) return
    updateDisplay(current, expressionEl.textContent) 
}

// ===== HANDLE OPERATOR =====
function handleOperator(op) {
    if (operator && !justEvaluated) {
        const result = calculate(previous, current, operator)
        current = result
        previois = result
    } else {
        previous = current
    }
    operator = op
    justEvaluated = false
    current = ''
    updateDisplay(previous, previous + ' ' + symbol(op))
}

// ===== HANDLE EQUALS =====
function handleEquals() {
    if (!operator || previous === '') return
    const b = current || previous
    const result = calculate(previous, b, operator)
    updateDisplay(
        format(result),
        previous + ' ' + symbol(operator) + ' ' + b + ' ='
    )
    current = format(result)
    previous = ''
    operator = ''
    justEvaluated = true
}

// ===== HANDLE AC =====


// ===== HANDLE SIGN =====


// ===== HANDLE PERCENT =====


// ===== HANDLE DOT =====


// ===== EVENT =====

