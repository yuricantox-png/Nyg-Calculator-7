// ===== STATE =====
let current = '0'       // armazena o número que está sendo digitado 
let previous = ''       // armazena o número anterior antes do operador
let operator = ''       // armazena o operador selecionado (+, -, *, /)
let justEvaluated = false // controla se o = foi pressionado

// ===== ELEMENTS =====
const resultEl = document.getElementById('result')       // captura o elemento do display principal
const expressionEl = document.getElementById('expression') // captura o elemento da expressão

// ===== UPDATE DISPLAY =====
function updateDisplay(value, expr) { // função que atualiza o que aparece na tela
  resultEl.textContent = value        // coloca o valor no display principal
  expressionEl.textContent = expr || '' // coloca a expressão no display secundário, ou vazio se não houver
  if (value === 'Error') {            // verifica se o valor é um erro
    resultEl.classList.add('error')   // adiciona classe CSS vermelha quando for Error
  } else {
    resultEl.classList.remove('error') // remove a classe vermelha nos outros casos
  }
}

// ===== FORMAT NUMBER =====
function format(n) { // formata números para não ficarem muito longos
  let s = parseFloat(n).toString() // converte o número para string removendo zeros desnecessários
  if (s.length > 12) s = parseFloat(parseFloat(n).toPrecision(9)).toString() // se muito longo, reduz para 9 dígitos significativos
  return s // retorna o número formatado
}

// ===== CALCULATE =====
function calculate(a, b, op) { // função que executa o cálculo entre dois números
  const numA = parseFloat(a)   // converte o primeiro valor de string para número
  const numB = parseFloat(b)   // converte o segundo valor de string para número
  if (isNaN(numA) || isNaN(numB)) return 'Error' // retorna Error se qualquer valor não for NaN
  if (op === '+') return numA + numB // executa adição
  if (op === '-') return numA - numB // executa subtração
  if (op === '*') return numA * numB // executa multiplicação
  if (op === '/') {                  // executa divisão
    if (numB === 0) return 'Error'   // retorna Error se tentar dividir por zero
    return numA / numB               // retorna o resultado da divisão
  }
}

// ===== SYMBOL =====
function symbol(op) {        // converte o operador interno para o símbolo visual correto
  if (op === '*') return '×' // multiplição: * vira ×
  if (op === '/') return '÷' // divisão: / vira ÷
  if (op === '-') return '−' // subtração: - vira −
  return op                  // + não precisa de conversão, retorna como está
}

// ===== HANDLE NUMBER =====
function handleNumber(num) { // chamada toda vez que um número é clicado
  if (resultEl.textContent === 'Error') handleAC() // se o display mostrar Error, limpa tudo antes de continuar
  if (justEvaluated) { current = ''; justEvaluated = false } // após pressionar =, começa um novo número do zero
  if (current === '0' && num !== '.') current = num // substitui o 0 inicial pelo número digitado
  else current += num                               // adiciona o dígito ao número atual
  if (current.length > 12) return                  // bloqueia se o número tiver mais de 12 dígitos
  updateDisplay(current, expressionEl.textContent)  // atualiza o display com o número atual
}

// ===== HANDLE OPERATOR =====
function handleOperator(op) { // chamada quando um operador é clicado (+, -, *, /)
  if (operator && !justEvaluated) {           // se já havia um operador e não acabou de calcular
    const result = calculate(previous, current, operator) // calcula o resultado parcial
    current = format(result)                  // formata e salva o resultado como número atual
    previous = format(result)                 // salva o resultado também como número anterior
  } else {
    previous = current                        // salva o número atual como anterior
  }
  operator = op             // armazena o novo operador selecionado
  justEvaluated = false     // reseta o controle de avaliação
  current = ''              // limpa o número atual para receber o próximo
  updateDisplay(previous, previous + ' ' + symbol(op)) // exibe o número anterior e o operador no display
}

// ===== HANDLE EQUALS =====
function handleEquals() { // chamada quando o botão = é clicado
  if (!operator || previous === '') return // sai da função se não houver operador ou número anterior
  const b = current || previous            // usa o número atual, ou o anterior se current estiver vazio
  const result = calculate(previous, b, operator) // executa o cálculo com os valores armazenados

  if (result === 'Error') { // verifica se o resultado é um erro
    updateDisplay('Error', previous + ' ' + symbol(operator) + ' ' + b + ' =') // exibe Error no display
    current = '0'           // reseta o número atual
    previous = ''           // limpa o número anterior
    operator = ''           // limpa o operador
    justEvaluated = true    // marca que o cálculo foi concluído
    return                  // encerra a função sem continuar
  }

  updateDisplay(format(result), previous + ' ' + symbol(operator) + ' ' + b + ' =') // exibe o resultado e a expressão completa
  addToHistory(previous + ' ' + symbol(operator) + ' ' + b, format(result)) // salva o cálculo no histórico
  current = format(result)  // o resultado vira o novo número atual para próximas operações
  previous = ''             // limpa o número anterior
  operator = ''             // limpa o operador
  justEvaluated = true      // marca que o = foi pressionado
}

// ===== HANDLE AC =====
function handleAC() {   // chamada quando o botão AC é clicado
  current = '0'         // reseta o número atual para 0
  previous = ''         // limpa o número anterior
  operator = ''         // limpa o operador
  justEvaluated = false // reseta o controle de avaliação
  updateDisplay('0', '') // atualiza o display mostrando 0 e expressão vazia
}

// ===== HANDLE SIGN =====
function handleSign() { // chamada quando o botão +/- é clicado
  if (current === '' || current === '0') return // não faz nada se não houver número ou for zero
  current = format(parseFloat(current) * -1)    // multiplica o número por -1 para inverter o sinal
  updateDisplay(current, expressionEl.textContent) // atualiza o display com o novo valor
}

// ===== HANDLE PERCENT =====
function handlePercent() { // chamada quando o botão % é clicado
  if (previous && operator) { // se houver número anterior e operador (ex: 500 - 50%)
    current = format((parseFloat(previous) * parseFloat(current)) / 100) // calcula a porcentagem em relação ao número anterior
  } else {
    current = format(parseFloat(current) / 100) // divide o número por 100 (modo simples)
  }
  updateDisplay(current, expressionEl.textContent) // atualiza o display com o resultado
}

// ===== HANDLE DOT =====
function handleDot() { // chamada quando o botão . é clicado
  if (justEvaluated) {  // se acabou de calcular com =
    current = '0'       // começa um número novo com 0
    justEvaluated = false // reseta o controle
  }
  if (current === '') { // se o campo estiver vazio
    current = '0'       // adiciona o 0 antes do ponto → "0."
  }
  if (current.includes('.')) return // bloqueia segundo ponto, impede "1.2.3"
  current += '.'                    // adiciona o ponto decimal ao número atual
  updateDisplay(current, expressionEl.textContent) // atualiza o display
}

// ===== HANDLE BACKSPACE =====
function handleBackspace() { // chamada quando a tecla Backspace é pressionada
  if (justEvaluated) return  // não faz nada se acabou de calcular com =
  if (current.length <= 1) { // se só tiver 1 dígito (ou estiver vazio)
    current = '0'            // reseta para 0 em vez de ficar vazio
  } else {
    current = current.slice(0, -1) // remove o último caractere do número atual
  }
  updateDisplay(current, expressionEl.textContent) // atualiza o display
}

// ===== EVENTS =====
document.querySelectorAll('[data-num]').forEach(btn => { // seleciona todos os botões de número
  btn.addEventListener('click', () => handleNumber(btn.dataset.num)) // ao clicar, chama handleNumber com o valor do botão
})

document.querySelectorAll('[data-op]').forEach(btn => { // seleciona todos os botões de operador
  btn.addEventListener('click', () => handleOperator(btn.dataset.op)) // ao clicar, chama handleOperator com o operador do botão
})

document.getElementById('equals').addEventListener('click', handleEquals)   // botão = chama handleEquals
document.getElementById('ac').addEventListener('click', handleAC)           // botão AC chama handleAC
document.getElementById('sign').addEventListener('click', handleSign)       // botão +/- chama handleSign
document.getElementById('percent').addEventListener('click', handlePercent) // botão % chama handlePercent
document.getElementById('dot').addEventListener('click', handleDot)         // botão . chama handleDot

// ===== HISTORY =====
const historyList = document.getElementById('history-list') // captura o elemento da lista de histórico

function addToHistory(expr, result) { // função que adiciona um cálculo ao histórico
  const empty = historyList.querySelector('.history-empty') // procura a mensagem "No calculations yet"
  if (empty) empty.remove() // remove a mensagem vazia se existir
  const li = document.createElement('li') // cria um novo item de lista
  li.innerHTML = `
    <span class="hist-expr">${expr}</span>     
    <span class="hist-result">${result}</span> 
  ` // preenche o item com a expressão à esquerda e o resultado à direita
  historyList.prepend(li) // insere o novo cálculo no topo da lista (mais recente primeiro)
}

document.getElementById('clear-history').addEventListener('click', () => { // botão Clear do histórico
  historyList.innerHTML = '<li class="history-empty">No calculations yet</li>' // substitui toda a lista pela mensagem vazia
})

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (e) => { // escuta qualquer tecla pressionada na página
  const key = e.key                           // armazena a tecla pressionada
  if (key >= '0' && key <= '9')       handleNumber(key)    // teclas 0-9 digitam números
  if (key === '+')                     handleOperator('+')  // tecla + seleciona adição
  if (key === '-')                     handleOperator('-')  // tecla - seleciona subtração
  if (key === '*')                     handleOperator('*')  // tecla * seleciona multiplicação
  if (key === '/')                    { e.preventDefault(); handleOperator('/') } // tecla / seleciona divisão, preventDefault evita abrir busca do browser
  if (key === 'Enter' || key === '=') handleEquals()        // Enter ou = executa o cálculo
  if (key === 'Backspace')            handleBackspace()     // Backspace apaga o último dígito
  if (key === 'Escape')               handleAC()            // Escape limpa tudo como o AC
  if (key === '.')                    handleDot()           // tecla . adiciona ponto decimal
  if (key === '%')                    handlePercent()       // tecla % calcula porcentagem
})

// ===== DARK/LIGHT MODE =====
const themeBtn = document.getElementById('theme-btn') // captura o botão de alternância de tema

themeBtn.addEventListener('click', () => { // ao clicar no botão de tema
  const isLight = document.documentElement.classList.toggle('light') // adiciona ou remove a classe "light" no <html>
  themeBtn.textContent = isLight ? '🌙' : '☀️'                      // troca o ícone: lua no light mode, sol no dark mode
  localStorage.setItem('theme', isLight ? 'light' : 'dark')         // salva a preferência no navegador para persistir após recarregar
})

const savedTheme = localStorage.getItem('theme') // busca o tema salvo no navegador
if (savedTheme === 'light') {                     // se o usuário tinha escolhido light mode antes
  document.documentElement.classList.add('light') // aplica o light mode ao carregar a página
  themeBtn.textContent = '🌙'                     // coloca o ícone de lua no botão
}
 