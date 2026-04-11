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
    result.textContent = value
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
    if (op === '%') return format(numA % numB)
    if (op === '/') {
        if (numB === 0) return 'Error'
        return numA / numB
    }
}

// ===== SYMBOL DISPLAY =====
function symbolDisplay(op) {
    if (op === '*') return '×'
    if (op === '/') return '÷'
    if (op === '-') return '-'
    if (op === '%') return '%'
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
    updateDisplay(previous, previous + ' ' + symbolDisplay(op))
}

// ===== HANDLE EQUALS =====
function handleEquals() {
    if (!operator || previous === '') return
    const b = current || previous
    const result = calculate(previous, b, operator)
    updateDisplay(
        format(result),
        previous + ' ' + symbolDisplay(operator) + ' ' + b + ' ='
    )
    current = format(result)
    previous = ''
    operator = ''
    justEvaluated = true
}

// ===== HANDLE AC =====
function handleAC() {
    current = '0'
    previous = ''
    operator = ''
    justEvaluated = false
    updateDisplay('0', '')
}
// ===== HANDLE SIGN =====
function handleSign() {
    current = format(-parseFloat(current) * -1)
    updateDisplay(current, expressionEl.textContent)
}

// ===== HANDLE PERCENT =====
function handlePercent() {
    current = format(parseFloat(current) / 100)
    updateDisplay(current, expressionEl.textContent)
}

// ===== HANDLE DOT =====
function handleDot() {
    if (justEvaluated) { current = '0'; justEvaluated = false }
    if (current === '') current = '0'
    if (current.includes('.')) return
    current += '.'
    updateDisplay(current, expressionEl.textContent)
}
// ===== EVENT =====
document.querySelectorAll('[data-num]').forEach(btn => {
  btn.addEventListener('click', () => handleNumber(btn.dataset.num))
})

document.querySelectorAll('[data-op]').forEach(btn => {
  btn.addEventListener('click', () => handleOperator(btn.dataset.op))
})

document.getElementById('equals').addEventListener('click', handleEquals)
document.getElementById('ac').addEventListener('click', handleAC)
document.getElementById('sign').addEventListener('click', handleSign)
document.getElementById('percent').addEventListener('click', handlePercent)
document.getElementById('dot').addEventListener('click', handleDot)
