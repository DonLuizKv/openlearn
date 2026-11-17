import type { Lesson } from '../domain/models';

// Original introductory explanations and questions. Sources are linked for further reading.
export const lessons: Lesson[] = [
  {
    id: 'familias-instrumental', title: 'Familias del instrumental quirúrgico', area: 'medicine',
    subject: 'Instrumentación quirúrgica', minutes: 4,
    summary: 'Un mapa para relacionar la forma de cada instrumento con su función.',
    keywords: ['clasificación', 'corte', 'prensión', 'separación', 'hemostasia', 'sutura'],
    sections: [
      { title: 'Clasificar por función', text: 'Cortar, sujetar, separar, ocluir y aproximar son funciones distintas. Agrupar el instrumental por su finalidad ayuda a estudiarlo sin depender únicamente de los nombres.' },
      { title: 'Reconocer una familia', text: 'Las tijeras se asocian al corte; los retractores, a la exposición; y los portaagujas, al cierre. La forma orienta, pero no reemplaza la identificación de la variante.' },
      { title: 'Una comparación útil', text: 'Unas tijeras y un portaagujas pueden tener anillas. Para distinguirlos, observa el extremo de trabajo y relaciona sus características con la función.' },
    ],
    instrumentIds: ['mayo', 'kocher', 'mayo-hegar'],
    sources: [{ title: 'AORN · Categorías del instrumental', url: 'https://info.aorn.org/New-Member-Instrument-Resource.html' }],
    questions: [
      { id: 'funcion', prompt: '¿Qué función caracteriza a un retractor?', answer: 'Separar y exponer', distractors: ['Cortar suturas', 'Sujetar agujas', 'Medir temperatura'], explanation: 'Facilita la visualización al mantener tejidos apartados.' },
      { id: 'anillas', prompt: 'Dos instrumentos tienen anillas. ¿Qué conviene comparar para identificarlos?', answer: 'El extremo de trabajo y su función', distractors: ['Solo el brillo', 'Solo el color del fondo', 'Únicamente el nombre del fabricante'], explanation: 'Las anillas, por sí solas, no permiten distinguir tijeras de portaagujas.' },
    ],
  },
  {
    id: 'corte-diseccion', title: 'Corte y disección: Mayo y Metzenbaum', area: 'medicine', subject: 'Instrumentación quirúrgica', minutes: 4,
    summary: 'Aprende a comparar hojas, ramas y robustez con las fichas visuales.',
    keywords: ['tijeras', 'hojas', 'ramas', 'tejidos', 'mayo', 'metzenbaum'],
    sections: [
      { title: 'Qué observar', text: 'Compara la forma de las puntas, la curvatura y la relación entre hojas y ramas. Un nombre puede corresponder a diferentes tamaños y variantes.' },
      { title: 'Mayo', text: 'Su construcción es robusta. Se relaciona con tejidos más resistentes; conviene distinguir las variantes rectas y curvas al estudiar una ficha.' },
      { title: 'Metzenbaum', text: 'Tiene un diseño más fino y ramas relativamente largas respecto a sus hojas. Se asocia al trabajo con tejidos delicados. Las fotografías permiten practicar esta comparación.' },
    ],
    instrumentIds: ['mayo', 'metzenbaum'],
    sources: [{ title: 'University of Saskatchewan · Scissors', url: 'https://wcvm.usask.ca/vsac205/Lab1/scissors.php' }],
    questions: [
      { id: 'robustez', prompt: '¿Qué tijeras se caracterizan por una construcción más robusta?', answer: 'Mayo', distractors: ['Metzenbaum', 'Portaagujas Mayo-Hegar', 'Pinza Kocher'], explanation: 'La comparación introductoria distingue la robustez de Mayo del diseño fino de Metzenbaum.' },
      { id: 'proporcion', prompt: '¿Qué proporción ayuda a reconocer unas Metzenbaum?', answer: 'Ramas largas respecto a las hojas', distractors: ['Ausencia de articulación', 'Mandíbulas sin hojas', 'Una única anilla'], explanation: 'La relación entre ramas y hojas es una pista visual útil.' },
    ],
  },
  {
    id: 'limpieza-esterilizacion', title: 'Limpieza, desinfección y esterilización', area: 'medicine', subject: 'Procesamiento del instrumental', minutes: 5,
    summary: 'Tres conceptos diferentes que conviene comprender desde el principio.',
    keywords: ['asepsia', 'infecciones', 'microorganismos', 'esporas', 'instrumentación quirúrgica'],
    sections: [
      { title: 'Limpieza', text: 'Retira suciedad y materia orgánica e inorgánica. Un objeto que parece limpio no es necesariamente estéril. Los residuos pueden interferir con procesos posteriores.' },
      { title: 'Desinfección', text: 'Elimina muchos microorganismos patógenos en objetos inanimados, pero no equivale a eliminar todas las formas microbianas. Su alcance depende del nivel y del proceso.' },
      { title: 'Esterilización', text: 'Busca eliminar todas las formas de vida microbiana, incluidas las esporas. Estos conceptos no sustituyen las instrucciones del fabricante ni los protocolos validados del centro.' },
    ],
    instrumentIds: [],
    sources: [{ title: 'CDC · Definiciones de limpieza, desinfección y esterilización', url: 'https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/introduction-methods-definition-of-terms.html' }],
    questions: [
      { id: 'limpio', prompt: 'Un instrumento se ve limpio. ¿Qué puedes concluir?', answer: 'Su aspecto no demuestra esterilidad', distractors: ['Ya está estéril', 'No requiere evaluación', 'La limpieza elimina siempre las esporas'], explanation: 'Limpieza y esterilización describen procesos diferentes.' },
      { id: 'esporas', prompt: '¿Qué proceso busca eliminar todas las formas microbianas, incluidas las esporas?', answer: 'Esterilización', distractors: ['Inspección visual', 'Secado por sí solo', 'Limpieza por sí sola'], explanation: 'La eliminación de todas las formas microbianas define la esterilización.' },
    ],
  },
  {
    id: 'clasificacion-spaulding', title: 'Clasificación de Spaulding', area: 'medicine', subject: 'Procesamiento del instrumental', minutes: 5,
    summary: 'Relaciona el riesgo del material con el tipo de contacto que tiene.',
    keywords: ['crítico', 'semicrítico', 'no crítico', 'riesgo', 'instrumentación quirúrgica'],
    sections: [
      { title: 'Material crítico', text: 'Entra en tejido estéril o en el sistema vascular. Debe estar estéril. La clasificación depende del uso previsto, no del tamaño o precio del objeto.' },
      { title: 'Material semicrítico', text: 'Contacta mucosas o piel no intacta. Como principio general, requiere al menos desinfección de alto nivel, respetando indicaciones específicas y compatibilidad.' },
      { title: 'Material no crítico', text: 'Contacta piel intacta. Distinguir estas categorías ayuda a entender por qué no todos los objetos reciben el mismo procesamiento. Las decisiones prácticas siguen los protocolos del centro.' },
    ], instrumentIds: [],
    sources: [{ title: 'CDC · Clasificación del material según el riesgo', url: 'https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/rational-approach.html' }],
    questions: [
      { id: 'criterio', prompt: '¿Qué criterio organiza la clasificación de Spaulding?', answer: 'El contacto previsto y el riesgo de infección', distractors: ['El peso', 'El color del envase', 'El precio'], explanation: 'La clasificación se basa en el riesgo asociado al uso.' },
      { id: 'critico', prompt: '¿Cómo se clasifica un instrumento que entra en tejido estéril?', answer: 'Crítico', distractors: ['No crítico', 'Semicrítico', 'No depende del contacto'], explanation: 'El contacto con tejido estéril sitúa el objeto en la categoría crítica.' },
    ],
  },
  {
    id: 'seguridad-quirurgica', title: 'Seguridad y trabajo en quirófano', area: 'medicine', subject: 'Seguridad quirúrgica', minutes: 4,
    summary: 'Comprende por qué la seguridad es una responsabilidad compartida.',
    keywords: ['equipo', 'comunicación', 'paciente', 'OMS', 'lista de verificación', 'instrumentación quirúrgica'],
    sections: [
      { title: 'Más que una destreza individual', text: 'La seguridad quirúrgica combina prevención de infecciones, anestesia segura, equipos seguros y evaluación de los servicios. No depende de una sola persona.' },
      { title: 'Un lenguaje compartido', text: 'Las verificaciones organizadas ayudan al equipo a compartir información relevante. Su propósito es apoyar la seguridad del paciente, no limitarse a llenar un formulario.' },
      { title: 'Aprender el marco', text: 'La OMS reúne guías y una lista de verificación quirúrgica. Estudia su finalidad y revisa con tu docente cómo se integra en los protocolos de tu institución.' },
    ], instrumentIds: [],
    sources: [{ title: 'OMS · Cirugía segura', url: 'https://www.who.int/teams/integrated-health-services/patient-safety/research/safe-surgery' }],
    questions: [
      { id: 'equipo', prompt: '¿De quién depende la seguridad quirúrgica?', answer: 'Del trabajo coordinado del equipo y sus sistemas', distractors: ['Solo del cirujano', 'Solo del instrumental', 'Solo de un formulario'], explanation: 'La seguridad integra varias áreas y responsabilidades.' },
      { id: 'objetivo', prompt: '¿Cuál es la finalidad de las verificaciones compartidas?', answer: 'Apoyar la seguridad del paciente', distractors: ['Reemplazar la formación', 'Evitar toda comunicación', 'Garantizar que nunca habrá riesgos'], explanation: 'Una herramienta de verificación apoya el trabajo del equipo; no elimina por sí sola todos los riesgos.' },
    ],
  },
  {
    id: 'planos-anatomicos', title: 'Planos y orientación anatómica', area: 'medicine', subject: 'Anatomía básica', minutes: 4,
    summary: 'Las palabras que usamos para describir posiciones en el cuerpo.',
    keywords: ['sagital', 'frontal', 'transversal', 'medial', 'lateral', 'anatomía'],
    sections: [
      { title: 'Una referencia común', text: 'La posición anatómica permite describir el cuerpo con un marco compartido. Derecha e izquierda se refieren a la persona descrita, no al observador.' },
      { title: 'Tres planos', text: 'El plano sagital separa derecha e izquierda; el frontal, anterior y posterior; y el transversal, superior e inferior. Son referencias imaginarias para describir secciones.' },
      { title: 'Términos de relación', text: 'Medial significa más próximo a la línea media; lateral, más alejado. Estos términos expresan relaciones entre estructuras, no ubicaciones absolutas.' },
    ], instrumentIds: [],
    sources: [{ title: 'OpenStax · Terminología anatómica', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology' }],
    questions: [
      { id: 'plano', prompt: '¿Qué plano separa las porciones superior e inferior?', answer: 'Transversal', distractors: ['Sagital', 'Frontal', 'Medial'], explanation: 'El plano transversal divide el cuerpo en porciones superior e inferior.' },
      { id: 'medial', prompt: '¿Qué significa medial?', answer: 'Más próximo a la línea media', distractors: ['Más alejado de la línea media', 'Siempre más superficial', 'Siempre más inferior'], explanation: 'Medial y lateral describen la relación con la línea media.' },
    ],
  },
  {
    id: 'celulas', title: 'La célula: unidad de la vida', area: 'science', subject: 'Biología', minutes: 4,
    summary: 'Un primer acercamiento al mundo que solo vemos con ayuda.',
    keywords: ['células', 'organismos', 'microscopio', 'teoría celular'],
    sections: [
      { title: 'La unidad básica', text: 'La célula es la unidad básica de los seres vivos. Hay organismos unicelulares y otros formados por muchas células.' },
      { title: 'Una idea que conecta', text: 'La teoría celular relaciona a los organismos con las células y establece que las células proceden de células preexistentes.' },
      { title: 'Observar lo pequeño', text: 'Los microscopios permiten estudiar estructuras que no distinguimos a simple vista. Aumento y resolución no son lo mismo: ampliar una imagen no garantiza revelar más detalle.' },
    ], instrumentIds: [],
    sources: [{ title: 'OpenStax · Estudio de las células', url: 'https://openstax.org/books/biology-2e/pages/4-1-studying-cells' }],
    questions: [
      { id: 'unidad', prompt: '¿Cuál es la unidad básica de los seres vivos?', answer: 'La célula', distractors: ['El órgano', 'La población', 'El tejido'], explanation: 'Un organismo puede estar formado por una o por muchas células.' },
      { id: 'origen', prompt: 'Según la teoría celular, ¿de dónde proceden las células?', answer: 'De células preexistentes', distractors: ['Del aumento óptico', 'Siempre de órganos completos', 'De materia inerte de forma espontánea'], explanation: 'La continuidad celular es un principio de la teoría celular.' },
    ],
  },
  {
    id: 'atomos', title: 'Átomos y partículas', area: 'science', subject: 'Química', minutes: 4,
    summary: 'Protones, neutrones y electrones: comienza por las piezas básicas.',
    keywords: ['átomo', 'núcleo', 'protones', 'neutrones', 'electrones', 'isótopos'],
    sections: [
      { title: 'Un núcleo pequeño', text: 'El núcleo concentra casi toda la masa del átomo y contiene protones y, salvo excepciones como el hidrógeno-1, neutrones.' },
      { title: 'Las cargas', text: 'El protón tiene carga positiva, el electrón negativa y el neutrón no tiene carga eléctrica neta. Los electrones ocupan la región exterior al núcleo.' },
      { title: 'Isótopos', text: 'Los isótopos de un elemento tienen igual número de protones y diferente número de neutrones. Cambiar el número de neutrones no cambia la identidad del elemento.' },
    ], instrumentIds: [],
    sources: [{ title: 'OpenStax · Evolución de la teoría atómica', url: 'https://openstax.org/books/chemistry-2e/pages/2-2-evolution-of-atomic-theory' }],
    questions: [
      { id: 'carga', prompt: '¿Qué partícula tiene carga eléctrica negativa?', answer: 'Electrón', distractors: ['Protón', 'Neutrón', 'Núcleo'], explanation: 'El electrón es negativo; el protón es positivo.' },
      { id: 'isotopos', prompt: '¿Qué diferencia a dos isótopos del mismo elemento?', answer: 'El número de neutrones', distractors: ['El número de protones', 'Siempre el número de electrones', 'El signo de la carga del protón'], explanation: 'Conservan el mismo número de protones, pero difieren en neutrones.' },
    ],
  },
  {
    id: 'pensamiento-cientifico', title: 'Preguntas, evidencia y ciencia', area: 'science', subject: 'Pensamiento científico', minutes: 3,
    summary: 'Aprende a conectar una pregunta con las pruebas que pueden responderla.',
    keywords: ['método científico', 'hipótesis', 'investigación', 'experimento'],
    sections: [
      { title: 'Contrastar ideas', text: 'La ciencia relaciona explicaciones con evidencia. Una idea debe poder contrastarse con observaciones relevantes, no sostenerse únicamente porque resulta convincente.' },
      { title: 'Un proceso que vuelve sobre sí mismo', text: 'Investigar no siempre sigue una receta lineal. Los resultados pueden llevar a nuevas preguntas, cambios en la explicación o nuevas observaciones.' },
      { title: 'Conocimiento compartido', text: 'La discusión y revisión entre investigadores forman parte del proceso. Las conclusiones pueden revisarse cuando existe evidencia que lo justifica.' },
    ], instrumentIds: [],
    sources: [{ title: 'UC Berkeley · Cómo funciona la ciencia', url: 'https://undsci.berkeley.edu/understanding-science-101/how-science-works/' }],
    questions: [
      { id: 'evidencia', prompt: '¿Qué permite contrastar una explicación científica?', answer: 'Evidencia pertinente', distractors: ['Solo su popularidad', 'Solo la confianza del autor', 'La cantidad de veces que se repite'], explanation: 'Las explicaciones se contrastan con evidencia relevante.' },
      { id: 'proceso', prompt: '¿Cómo se desarrolla la investigación científica?', answer: 'Puede revisar ideas y abrir nuevas preguntas', distractors: ['Siempre sigue pasos idénticos', 'Termina al formular una hipótesis', 'Evita la discusión con otros investigadores'], explanation: 'Es un proceso revisable y colectivo, no una receta invariable.' },
    ],
  },
  {
    id: 'lectura-critica', title: 'Cómo evaluar una fuente', area: 'other', subject: 'Lectura crítica', minutes: 3,
    summary: 'Haz mejores preguntas sobre la información que encuentras.',
    keywords: ['fuentes', 'autor', 'evidencia', 'información', 'humanidades'],
    sections: [
      { title: 'Quién lo afirma', text: 'Identifica al autor, su experiencia y el contexto de publicación. La autoridad se evalúa en relación con el tema del que se está hablando.' },
      { title: 'Para qué fue escrito', text: 'Examina el propósito y el público del texto. Un material puede informar, persuadir o vender; entenderlo ayuda a interpretar sus afirmaciones.' },
      { title: 'Qué lo respalda', text: 'Distingue los datos de las opiniones y sigue las referencias. Una presentación atractiva no demuestra la calidad de la evidencia.' },
    ], instrumentIds: [],
    sources: [{ title: 'Purdue OWL · Evaluación de fuentes', url: 'https://owl.purdue.edu/owl/research_and_citation/conducting_research/evaluating_sources_of_information/general_guidelines.html' }],
    questions: [
      { id: 'autor', prompt: '¿Qué conviene revisar sobre el autor de una fuente?', answer: 'Su experiencia en el tema', distractors: ['Solo su foto', 'Solo sus seguidores', 'Solo el diseño de su página'], explanation: 'La experiencia relevante aporta contexto para evaluar la fuente.' },
      { id: 'respaldo', prompt: '¿Qué ayuda a evaluar el respaldo de una afirmación?', answer: 'Examinar la evidencia y sus referencias', distractors: ['Contar sus colores', 'Aceptar el título como prueba', 'Confiar solo en que se comparte mucho'], explanation: 'Las referencias permiten examinar el fundamento de una afirmación.' },
    ],
  },
  {
    id: 'estudio-activo', title: 'Aprender con preguntas', area: 'other', subject: 'Técnicas de estudio', minutes: 3,
    summary: 'Convierte la lectura en una oportunidad para explicar y recordar.',
    keywords: ['flashcards', 'aprendizaje', 'repaso', 'memoria', 'apuntes'],
    sections: [
      { title: 'Haz una pregunta', text: 'Transforma una idea del tema en una pregunta concreta. Por ejemplo: “¿En qué se diferencian estos dos conceptos?”.' },
      { title: 'Explica con tus palabras', text: 'Intenta responder antes de consultar tus apuntes. Después compara tu respuesta con el material y corrige lo que falte.' },
      { title: 'Vuelve más adelante', text: 'Distribuye el estudio en varias sesiones y utiliza los errores para elegir qué repasar. Recordar una tarjeta una vez no significa dominar el tema completo.' },
    ], instrumentIds: [],
    sources: [{ title: 'UNC Learning Center · Estudio activo', url: 'https://learningcenter.unc.edu/tips-and-tools/studying-101-study-smarter-not-harder/' }],
    questions: [
      { id: 'recuerdo', prompt: '¿Qué acción convierte una tarjeta en práctica activa?', answer: 'Intentar responder antes de mirar el reverso', distractors: ['Leer siempre ambos lados a la vez', 'Cambiar solo su color', 'Copiar sin pensar en su significado'], explanation: 'Intentar explicar y luego contrastar ayuda a reconocer las lagunas.' },
      { id: 'error', prompt: '¿Para qué puede servir un error durante el repaso?', answer: 'Para identificar qué necesita más estudio', distractors: ['Para abandonar el tema', 'Para demostrar incapacidad permanente', 'Para omitir la explicación'], explanation: 'El error aporta información útil para dirigir el siguiente repaso.' },
    ],
  },
];

export const findLesson = (id?: string) => lessons.find(lesson => lesson.id === id);
