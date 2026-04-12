// ===== STATE =====
let current = '0'
let previous = ''
let operator = ''
let justEvaluated = false

// ===== ELEMENTS =====
const resultEl = document.getElementById('result')
const expressionEl = document.getElementById('expression')

// ===== UPDATE DISPLAY =====
function updateDisplay(value, expr) {
  resultEl.textContent = value
  expressionEl.textContent = expr || ''
  if (value === 'Error') {
    resultEl.classList.add('error') // adiciona classe vermelha quando for Error
  } else {
    resultEl.classList.remove('error') // remove classe vermelha nos outros casos
  }
}

// ===== FORMAT NUMBER =====
function format(n) {
  let s = parseFloat(n).toString()
  if (s.length > 12) s = parseFloat(parseFloat(n).toPrecision(9)).toString()
  return s
}

// ===== CALCULATE =====
function calculate(a, b, op) {
  const numA = parseFloat(a)  // converte string "10" para número 10
  const numB = parseFloat(b)  // converte string "0" para número 0
  if (isNaN(numA) || isNaN(numB)) return 'Error' // se não for número válido retorna Error
  if (op === '+') return numA + numB
  if (op === '-') return numA - numB
  if (op === '*') return numA * numB
  if (op === '/') {
    if (numB === 0) return 'Error' // bloqueia divisão por zero
    return numA / numB
  }
}

// ===== SYMBOL =====
function symbol(op) {
  if (op === '*') return '×'
  if (op === '/') return '÷'
  if (op === '-') return '−'
  return op
}

// ===== HANDLE NUMBER =====
function handleNumber(num) {
  if (resultEl.textContent === 'Error') handleAC() // se display mostrar Error, limpa tudo antes de digitar
  if (justEvaluated) { current = ''; justEvaluated = false } // após =, começa número novo
  if (current === '0' && num !== '.') current = num // substitui 0 inicial, mas preserva "0."
  else current += num
  if (current.length > 12) return // impede números maiores que 12 dígitos
  updateDisplay(current, expressionEl.textContent)
}

// ===== HANDLE OPERATOR =====
function handleOperator(op) {
  if (operator && !justEvaluated) {
    const result = calculate(previous, current, operator)
    current = format(result)
    previous = format(result)
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
  if (!operator || previous === '') return // impede = sem operação definida
  const b = current || previous // usa current, ou previous se current estiver vazio
  const result = calculate(previous, b, operator) // executa o cálculo

  if (result === 'Error') {
    updateDisplay('Error', previous + ' ' + symbol(operator) + ' ' + b + ' =') // mostra Error no display
    current = '0'
    previous = ''
    operator = ''
    justEvaluated = true
    return
  }

  updateDisplay(format(result), previous + ' ' + symbol(operator) + ' ' + b + ' =')
  addToHistory(previous + ' ' + symbol(operator) + ' ' + b, format(result)) // salva no histórico
  current = format(result) // resultado vira o novo número atual
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
  if (current === '' || current === '0') return
  current = format(parseFloat(current) * -1)
  updateDisplay(current, expressionEl.textContent)
}

// ===== HANDLE PERCENT =====
function handlePercent() {
  if (previous && operator) {
    current = format((parseFloat(previous) * parseFloat(current)) / 100)
  } else {
    current = format(parseFloat(current) / 100)
  }
  updateDisplay(current, expressionEl.textContent)
}

// ===== HANDLE DOT =====
function handleDot() {
  if (justEvaluated) {
    current = '0' // após =, começa número novo com 0
    justEvaluated = false
  }
  if (current === '') {
    current = '0' // se vazio, adiciona 0 antes do ponto → "0."
  }
  if (current.includes('.')) return // bloqueia segundo ponto → impede "1.2.3"
  current += '.'
  updateDisplay(current, expressionEl.textContent)
}

// ===== HANDLE BACKSPACE =====
function handleBackspace() {
  if (justEvaluated) return
  if (current.length <= 1) {
    current = '0'
  } else {
    current = current.slice(0, -1) // apaga o último dígito
  }
  updateDisplay(current, expressionEl.textContent)
}

// ===== EVENTS =====
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

// ===== HISTORY =====
const historyList = document.getElementById('history-list')

function addToHistory(expr, result) {
  const empty = historyList.querySelector('.history-empty')
  if (empty) empty.remove()
  const li = document.createElement('li')
  li.innerHTML = `
    <span class="hist-expr">${expr}</span>
    <span class="hist-result">${result}</span>
  `
  historyList.prepend(li)
}

document.getElementById('clear-history').addEventListener('click', () => {
  historyList.innerHTML = '<li class="history-empty">No calculations yet</li>'
})

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (e) => {
  const key = e.key
  if (key >= '0' && key <= '9')       handleNumber(key)
  if (key === '+')                     handleOperator('+')
  if (key === '-')                     handleOperator('-')
  if (key === '*')                     handleOperator('*')
  if (key === '/')                    { e.preventDefault(); handleOperator('/') }
  if (key === 'Enter' || key === '=') handleEquals()
  if (key === 'Backspace')            handleBackspace()
  if (key === 'Escape')               handleAC()
  if (key === '.')                    handleDot()
  if (key === '%')                    handlePercent()
})

// ===== DARK/LIGHT MODE =====
const themeBtn = document.getElementById('theme-btn')

themeBtn.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light') // adiciona/remove classe "light" no <html>
  themeBtn.textContent = isLight ? '🌙' : '☀️' // troca o ícone conforme o tema
  localStorage.setItem('theme', isLight ? 'light' : 'dark') // salva preferência no navegador
})

// carrega o tema salvo quando a página abre
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'light') {
  document.documentElement.classList.add('light')
  themeBtn.textContent = '🌙'
}
