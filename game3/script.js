const ageSelectionDiv = document.getElementById("age-selection");
const gameAreaDiv = document.getElementById("game-area");
const questionContainer = document.getElementById("question-container");
const nextButton = document.getElementById("next-button");
const feedbackElement = document.getElementById("feedback");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const floatingAnimalImg = document.getElementById("floating-animal");
const endScreenDiv = document.getElementById("end-screen");
const finalScoreElement = document.getElementById("final-score");

let currentAgeRange = null;
let currentQuestionIndex = 0;
let questions = [];
let score = 0;
const totalQuestions = 5;

// Array de imagens de animais que flutuam no jogo. Adicione mais se quiser!
const animalImages = [
  "owl.png",
  "fox.png",
  "turtle.png",
  "rabbit.png",
  "squirrel.png",
];
let currentAnimalIndex = 0;

// --- Funções Auxiliares ---

// Função para mudar a imagem do animal flutuante
function changeAnimalImage() {
  currentAnimalIndex = (currentAnimalIndex + 1) % animalImages.length;
  floatingAnimalImg.src = animalImages[currentAnimalIndex];
}

// Muda a imagem do animal a cada 5 segundos
setInterval(changeAnimalImage, 5000);

// Gera um número aleatório entre min e max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Lógica de Início e Reinício do Jogo ---

// Inicia o jogo com base na faixa etária selecionada
function startGame(minAge, maxAge) {
  currentAgeRange = { min: minAge, max: maxAge };
  ageSelectionDiv.style.display = "none"; // Esconde a seleção de idade
  gameAreaDiv.style.display = "block"; // Mostra a área do jogo
  currentQuestionIndex = 0;
  score = 0;
  // Gera as perguntas com base na idade
  questions = generateQuestions(minAge, maxAge, totalQuestions);
  totalQuestionsSpan.textContent = totalQuestions;
  loadQuestion(); // Carrega a primeira pergunta
}

// Reinicia o jogo, voltando para a tela de seleção de idade
function restartGame() {
  endScreenDiv.style.display = "none"; // Esconde a tela final
  ageSelectionDiv.style.display = "block"; // Mostra a seleção de idade novamente
}

// --- Geração de Perguntas ---

// Gera um conjunto de perguntas mistas (matemática e português)
function generateQuestions(minAge, maxAge, numQuestions) {
  const generatedQuestions = [];
  for (let i = 0; i < numQuestions; i++) {
    // Decide aleatoriamente se a pergunta será de matemática ou português
    const type = Math.random() < 0.5 ? "math" : "portuguese";
    let questionData;

    if (type === "math") {
      questionData = generateMathQuestion(minAge, maxAge);
    } else {
      questionData = generatePortugueseQuestion(minAge, maxAge);
    }
    generatedQuestions.push(questionData);
  }
  // Opcional: Embaralha as perguntas para que não fiquem em ordem previsível
  return shuffleArray(generatedQuestions);
}

// Gera uma pergunta de matemática de acordo com a faixa etária
function generateMathQuestion(minAge, maxAge) {
  let num1, num2, operation, correctAnswer, questionText;

  if (minAge >= 10) {
    // 10 a 11 anos: Soma, Subtração, Multiplicação com números maiores
    num1 = getRandomNumber(10, 50);
    num2 = getRandomNumber(5, 20);
    operation = ["+", "-", "*"][getRandomNumber(0, 2)]; // +, -, *
    if (operation === "+") {
      questionText = `Quanto é ${num1} + ${num2}?`;
      correctAnswer = num1 + num2;
    } else if (operation === "-") {
      // Garante que o resultado não seja negativo para facilitar
      if (num1 < num2) [num1, num2] = [num2, num1]; // Troca os números se num1 for menor
      questionText = `Quanto é ${num1} - ${num2}?`;
      correctAnswer = num1 - num2;
    } else {
      questionText = `Quanto é ${num1} x ${num2}?`;
      correctAnswer = num1 * num2;
    }
  } else if (minAge >= 8) {
    // 8 a 9 anos: Soma, Subtração com números médios
    num1 = getRandomNumber(5, 30);
    num2 = getRandomNumber(2, 15);
    operation = ["+", "-"][getRandomNumber(0, 1)]; // +, -
    if (operation === "+") {
      questionText = `Quanto é ${num1} + ${num2}?`;
      correctAnswer = num1 + num2;
    } else {
      if (num1 < num2) [num1, num2] = [num2, num1];
      questionText = `Quanto é ${num1} - ${num2}?`;
      correctAnswer = num1 - num2;
    }
  } else {
    // 6 a 7 anos: Apenas Adição com números pequenos
    num1 = getRandomNumber(1, 15);
    num2 = getRandomNumber(1, 10);
    operation = "+";
    questionText = `Quanto é ${num1} + ${num2}?`;
    correctAnswer = num1 + num2;
  }
  return {
    type: "math",
    question: questionText,
    answer: correctAnswer.toString(),
  };
}

// Gera uma pergunta de português de acordo com a faixa etária
function generatePortugueseQuestion(minAge, maxAge) {
  let questionsPool;

  if (minAge >= 10) {
    // 10 a 11 anos: Plural, Antônimos, Completar frases com palavras mais complexas
    questionsPool = [
      { q: "Qual o plural de 'cidade'?", a: "cidades" },
      { q: "Qual o antônimo de 'difícil'?", a: "fácil" },
      {
        q: "Complete a frase: 'O avião ______ no céu azul.'",
        a: "voa",
        options: ["voa", "nada", "anda"],
      },
      { q: "Qual a palavra que significa o oposto de 'quente'?", a: "frio" },
      {
        q: "Qual o sinônimo de 'bonito'?",
        a: "belo",
        options: ["feio", "belo", "velho"],
      },
    ];
  } else if (minAge >= 8) {
    // 8 a 9 anos: Rimas, Completar frases, Primeiras e últimas letras
    questionsPool = [
      {
        q: "Qual palavra rima com 'flor'?",
        a: "amor",
        options: ["mesa", "amor", "bola"],
      },
      {
        q: "Complete: O cachorro ______ um osso.",
        a: "comeu",
        options: ["dormiu", "comeu", "voou"],
      },
      { q: "Qual a última letra da palavra 'pipoca'?", a: "a" },
      {
        q: "Qual animal faz 'miau'?",
        a: "gato",
        options: ["cachorro", "gato", "vaca"],
      },
    ];
  } else {
    // 6 a 7 anos: Primeiras letras, Quantidade de sílabas, Nomes simples
    questionsPool = [
      { q: "Qual a primeira letra da palavra 'sol'?", a: "s" },
      { q: "Quantas sílabas tem a palavra 'bola'?", a: "2" },
      {
        q: "Qual o nome do animal que faz 'muu'?",
        a: "vaca",
        options: ["gato", "vaca", "pato"],
      },
      // Exemplo de pergunta com imagem - você precisaria da imagem 'circulo.png'
      // { q: "Qual é esta forma?", a: "círculo", questionType: 'image', imageSrc: 'circulo.png' }
    ];
  }

  const randomIndex = getRandomNumber(0, questionsPool.length - 1);
  const selectedQuestion = questionsPool[randomIndex];

  let finalQuestion = selectedQuestion.q;
  // Se houver opções, adiciona-as à pergunta
  if (selectedQuestion.options) {
    finalQuestion += ` (Opções: ${selectedQuestion.options.join(", ")})`;
    return {
      type: "portuguese",
      question: finalQuestion,
      answer: selectedQuestion.a.toLowerCase(),
      options: selectedQuestion.options, // Para criar um <select>
    };
  } else if (selectedQuestion.questionType === "image") {
    return {
      type: "portuguese",
      question: finalQuestion,
      answer: selectedQuestion.a.toLowerCase(),
      questionType: "image",
      imageSrc: selectedQuestion.imageSrc,
    };
  }
  return {
    type: "portuguese",
    question: finalQuestion,
    answer: selectedQuestion.a.toLowerCase(),
  };
}

// Função para embaralhar um array (útil para as perguntas)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- Lógica de Exibição e Verificação das Perguntas ---

// Carrega a próxima pergunta na tela
function loadQuestion() {
  if (currentQuestionIndex < totalQuestions) {
    const questionData = questions[currentQuestionIndex];
    questionContainer.innerHTML = ""; // Limpa a pergunta anterior

    const questionBox = document.createElement("div");
    questionBox.classList.add("question-box");

    const questionTextElement = document.createElement("p");
    questionTextElement.textContent = questionData.question;
    questionBox.appendChild(questionTextElement);

    let answerInput;
    // Se a pergunta tiver opções (múltipla escolha), cria um <select>
    if (questionData.options) {
      answerInput = document.createElement("select");
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "Selecione";
      defaultOption.value = "";
      answerInput.appendChild(defaultOption);
      // Adiciona cada opção ao <select>
      questionData.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionElement.value = option.toLowerCase();
        answerInput.appendChild(optionElement);
      });
    }
    // Se a pergunta for baseada em imagem, exibe a imagem e um campo de texto
    else if (questionData.questionType === "image") {
      const imageElement = document.createElement("img");
      imageElement.src = questionData.imageSrc; // O caminho da imagem está em imageSrc
      imageElement.alt = "Imagem da Pergunta";
      imageElement.style.maxWidth = "150px"; // Tamanho máximo da imagem
      imageElement.style.display = "block";
      imageElement.style.margin = "10px auto";
      questionBox.appendChild(imageElement);
      answerInput = document.createElement("input");
      answerInput.type = "text";
      answerInput.placeholder = "Digite o nome ou a resposta";
    }
    // Caso contrário, cria um campo de texto simples
    else {
      answerInput = document.createElement("input");
      answerInput.type = "text";
      answerInput.placeholder = "Digite sua resposta";
    }
    answerInput.id = "user-answer-input"; // ID para ser acessado na função checkAnswer
    questionBox.appendChild(answerInput);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Responder";
    submitButton.onclick = checkAnswer; // Associa a função de verificação ao clique
    questionBox.appendChild(submitButton);

    questionContainer.appendChild(questionBox);

    // Atualiza o progresso no rodapé do jogo
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    feedbackElement.textContent = ""; // Limpa feedback anterior
    feedbackElement.className = "feedback"; // Reseta as classes de feedback
    nextButton.style.display = "none"; // Garante que o botão "Próxima" esteja oculto
  } else {
    endGame(); // Se todas as perguntas foram respondidas, finaliza o jogo
  }
}

// Verifica a resposta do usuário
function checkAnswer() {
  const userAnswerElement = document.getElementById("user-answer-input");
  // .trim() remove espaços em branco extras, .toLowerCase() converte para minúsculas
  const userAnswer = userAnswerElement
    ? userAnswerElement.value.trim().toLowerCase()
    : "";
  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswer = currentQuestion.answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    feedbackElement.textContent = "Resposta Correta! 😊";
    feedbackElement.classList.add("correct"); // Adiciona classe para cor verde
    score++; // Incrementa a pontuação
  } else {
    feedbackElement.textContent = `Ops! Resposta Incorreta. A resposta correta é: "${currentQuestion.answer}" 😞`;
    feedbackElement.classList.add("incorrect"); // Adiciona classe para cor vermelha
  }

  // Avança para a próxima pergunta ou finaliza o jogo
  currentQuestionIndex++;
  if (currentQuestionIndex < totalQuestions) {
    setTimeout(loadQuestion, 2000); // Espera 2 segundos antes de carregar a próxima pergunta
  } else {
    setTimeout(endGame, 2000); // Espera 2 segundos antes de ir para a tela final
  }
}

// --- Lógica de Fim de Jogo ---

// Exibe a tela de fim de jogo com a pontuação final
function endGame() {
  gameAreaDiv.style.display = "none"; // Esconde a área do jogo
  endScreenDiv.style.display = "block"; // Mostra a tela final
  finalScoreElement.textContent = `Você acertou ${score} de ${totalQuestions} perguntas!`;
  // Você pode adicionar uma mensagem de encorajamento aqui baseada na pontuação
}
