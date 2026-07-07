import { Topic, Quiz } from './types';

export interface FormulaOfTheDay {
  id: string;
  title: string;
  formula: string;
  engineeringApplication: string;
  solutionHighlight: string;
}

export const formulasOfTheDay: FormulaOfTheDay[] = [
  {
    id: 'f1',
    title: 'Cinética de Esterilización Acumulada (Valor F)',
    formula: 'F_0 = \\int_{0}^{t} 10^{\\frac{T(\\tau) - 121.1}{z}} d\\tau',
    engineeringApplication: 'Calcula el tiempo equivalente de muerte térmica a una temperatura de referencia (121.1 °C) para garantizar la destrucción de Clostridium botulinum en conservas de alimentos de baja acidez.',
    solutionHighlight: 'Cuando la temperatura $T(\\tau)$ fluctúa durante el calentamiento y enfriamiento del autoclave, se requiere resolver numéricamente o analíticamente esta integral para evitar sobrecocer el alimento y destruir nutrientes.'
  },
  {
    id: 'f2',
    title: 'Concentración Promedio en Flujo Laminar',
    formula: 'C_{prom} = \\frac{1}{\\pi R^2 u_{prom}} \\int_{0}^{R} C(r) \\cdot 2\\pi r \\cdot u_{max} \\left(1 - \\frac{r^2}{R^2}\\right) dr',
    engineeringApplication: 'Determina la concentración media de un soluto (como azúcar o un conservante) en una tubería donde un fluido viscoso alimenticio (jarabe de glucosa) fluye de forma laminar.',
    solutionHighlight: 'Para resolverla, se distribuyen los términos dentro de la integral y se integra con respecto al radio $r$ desde el centro de la tubería ($r=0$) hasta la pared ($r=R$).'
  },
  {
    id: 'f3',
    title: 'Evaporación Osmótica Transitoria',
    formula: 'M_{evap} = A \\cdot K_m \\int_{t_1}^{t_2} \\ln\\left(\\frac{P_{sat}(T_a)}{P_{v}(t)}\\right) dt',
    engineeringApplication: 'Cuantifica la masa total de agua evaporada a través de una membrana hidrofóbica en la concentración de jugos frutales a baja temperatura, ideal para preservar aromas naturales.',
    solutionHighlight: 'Se utiliza sustitución simple y propiedades logarítmicas cuando la presión de vapor $P_{v}(t)$ decae exponencialmente conforme el jugo se vuelve más concentrado y viscoso.'
  },
  {
    id: 'f4',
    title: 'Energía Total de Enfriamiento por Convección',
    formula: 'Q_{total} = \\int_{0}^{t_f} h \\cdot A_s \\cdot (T_{alimento}(\\tau) - T_{fluido}) d\\tau',
    engineeringApplication: 'Calcula los requisitos frigoríficos totales en una cámara de enfriamiento rápido para canales de carne de res o cerdo suspendidas.',
    solutionHighlight: 'Sabiendo que $T_{alimento}(\\tau) = T_{fluido} + (T_{inicial} - T_{fluido})e^{-k\\tau}$, la integral resultante requiere resolver una integral exponencial simple pero crítica para el diseño de compresores.'
  }
];

export const topics: Topic[] = [
  {
    id: 'intro',
    title: '1. Interpretación Geométrica y Área',
    description: 'El área bajo la curva como acumulación total de flujos de masa, biomasa o energía térmica.',
    theory: `La integral definida es el pilar de la cuantificación de procesos acumulativos en la industria de alimentos. Geométricamente, representa el **área neta bajo la curva** de una función $f(x)$ entre dos límites de integración:

$$A = \\int_{a}^{b} f(x) dx$$

### Aplicación Profunda en Ingeniería de Alimentos:
Imaginemos que una línea de embotellado automático de jugo de naranja de alta viscosidad experimenta variaciones de caudal por fluctuaciones de presión de la bomba. Si el caudal de entrada es $Q(t)$ en litros por segundo, el volumen total acumulado en la botella en un intervalo $[a, b]$ es el área exacta bajo la curva de flujo:

$$V_{total} = \\int_{a}^{b} Q(t) dt$$

#### El Desafío del Control de Procesos
En plantas industriales modernas, los flujómetros electromagnéticos envían lecturas instantáneas de caudal a un Controlador Lógico Programable (PLC). El PLC aproxima esta integral continua miles de veces por segundo utilizando sumas de Riemann o la regla trapezoidal. Si el cálculo falla o se desfasa por milisegundos, miles de botellas saldrán con volúmenes de llenado fuera de norma, ocasionando multas por control de calidad o pérdidas millonarias de materia prima.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
Supón que el caudal de jugo varía transitoriamente debido al ciclo de arranque de una bomba lobular, modelado por la función cuadrática:
$$Q(t) = 0.5 + 0.06t^2 \\quad \\text{[litros/segundo]}$$

Queremos determinar matemáticamente el volumen neto de jugo transferido a un tanque pulmón entre el segundo $t = 1$ y el segundo $t = 3$.

1. **Planteamiento de la Integral Definida:**
   $$V = \\int_{1}^{3} (0.5 + 0.06t^2) dt$$
   
2. **Determinación de la Antiderivada General:**
   Aplicando las reglas básicas de integración para potencias ($x^n \\to \\frac{x^{n+1}}{n+1}$):
   $$\\int 0.5 \\, dt = 0.5t$$
   $$\\int 0.06t^2 \\, dt = 0.06 \\left(\\frac{t^3}{3}\\right) = 0.02t^3$$
   Combinando términos y agregando la constante de integración $C$:
   $$F(t) = 0.5t + 0.02t^3 + C$$

3. **Evaluación de Límites (Segundo Teorema Fundamental):**
   Evaluamos la antiderivada en el límite superior ($t = 3$):
   $$F(3) = 0.5(3) + 0.02(3)^3 = 1.5 + 0.02(27) = 1.5 + 0.54 = 2.04 \\text{ litros}$$
   
   Evaluamos la antiderivada en el límite inferior ($t = 1$):
   $$F(1) = 0.5(1) + 0.02(1)^3 = 0.5 + 0.02(1) = 0.52 \\text{ litros}$$

4. **Sustracción de Valores Extremos:**
   $$V = F(3) - F(1) = 2.04 - 0.52 = 1.52 \\text{ litros}$$

**Significado Físico:** El área bajo la curva de caudal en el plano $Q$-$t$ equivale exactamente a la acumulación de **1.52 litros de jugo**. Este balance riguroso permite calibrar la válvula neumática para que corte la dosificación de manera exacta.`,
    icon: 'area',
    quizId: 'quiz-1',
    color: 'bg-green-500'
  },
  {
    id: 'properties',
    title: '2. Teorema Fundamental del Cálculo',
    description: 'La conexión de oro entre la tasa instantánea de transferencia y los acumuladores térmicos.',
    theory: `El **Teorema Fundamental del Cálculo (TFC)** representa el eslabón dorado que unifica el análisis de razones de cambio instantáneas (derivadas) con los procesos de acumulación física continua (integrales).

### Enunciados del Teorema:

**Parte 1 (La Función Acumuladora):**
Si $f$ es una función continua en $[a, b]$, entonces la función $g$ definida por:
$$g(x) = \\int_{a}^{x} f(t) dt$$
es continua en $[a, b]$, derivable en $(a, b)$ y su derivada es simplemente la función original evaluated en la variable límite:
$$g'(x) = \\frac{d}{dx} \\left[ \\int_{a}^{x} f(t) dt \\right] = f(x)$$

**Parte 2 (Método de Evaluación):**
Nos proporciona un método analítico exacto para calcular integrales definidas sin recurrir a tediosas sumas infinitas de Riemann, siempre que conozcamos una antiderivada $F$:
$$\\int_{a}^{b} f(x) dx = F(b) - F(a) \\quad \\text{donde} \\quad F'(x) = f(x)$$

### Relevancia Crítica en Transferencia de Calor:
En la pasteurización flash (HTST) de la leche, la tasa de transferencia de calor $q(t)$ (en Watts) en el intercambiador de placas cambia conforme el vapor se condensa. Si definimos una función acumuladora de energía térmica $E(t) = \\int_{0}^{t} q(\\tau) d\\tau$, el TFC nos garantiza que la velocidad con la que cambia la energía acumulada en el alimento en cualquier segundo es exactamente igual al flujo de calor instantáneo $q(t)$ provisto por la caldera.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
Supongamos que la tasa neta de acumulación de energía térmica dentro de un secador rotativo de almidón de yuca viene descrita por la función:
$$f(t) = 6t^2 - 4t \\quad \\text{[Joules/hora]}$$

Deseamos calcular la energía total acumulada en el secador en el transcurso de la segunda hora de operación ($t = 1$ a $t = 2$ horas).

1. **Planteamiento de la Integral Acumulativa:**
   $$E = \\int_{1}^{2} (6t^2 - 4t) dt$$

2. **Cálculo de la Antiderivada Analítica:**
   $$F(t) = \\int (6t^2 - 4t) dt = 6\\left(\\frac{t^3}{3}\\right) - 4\\left(\\frac{t^2}{2}\\right) = 2t^3 - 2t^2 + C$$

3. **Evaluación de la Antiderivada de Acuerdo al TFC Parte 2:**
   Para el límite superior ($t = 2$):
   $$F(2) = 2(2)^3 - 2(2)^2 = 2(8) - 2(4) = 16 - 8 = 8 \\text{ Joules}$$
   
   Para el límite inferior ($t = 1$):
   $$F(1) = 2(1)^3 - 2(1)^2 = 2(1) - 2(1) = 0 \\text{ Joules}$$

4. **Resultado Neto del Balance:**
   $$E = F(2) - F(1) = 8 - 0 = 8 \\text{ Joules}$$

Este resultado es fundamental para que el ingeniero mecánico valide si el soplador de aire caliente tiene la eficiencia termodinámica idónea para arrastrar el agua del almidón sin gelatinizarlo.`,
    icon: 'book',
    quizId: 'quiz-2',
    color: 'bg-blue-500'
  },
  {
    id: 'solids_disk',
    title: '3. Sólidos de Revolución (Discos)',
    description: 'Diseño volumétrico tridimensional de tolvas de dosificación, mezcladores y boquillas de extrusión.',
    theory: `La determinación geométrica del volumen de cuerpos tridimensionales simétricos es crucial para el diseño de equipos de procesamiento. Si rotamos una región plana delimitada por una curva continua $y = f(x)$, el eje $X$, y las rectas $x = a$ y $x = b$ alrededor de dicho eje $X$, generamos un sólido tridimensional de revolución.

El **Método de Discos** aproxima el volumen rebanando el sólido en finas rodajas circulares cuyo radio es $R(x) = f(x)$ y cuyo espesor infinitesimal es $dx$. El volumen de cada disco elemental es $dV = \\pi [R(x)]^2 dx$. Sumando todas las rebanadas mediante la integración continua:

$$V = \\pi \\int_{a}^{b} [f(x)]^2 dx$$

### Aplicación Práctica en Equipos de Alimentos:
Los silos verticales para almacenamiento de granos secos (como cebada o café), las tolvas cónicas de molienda y las boquillas de extrusión que moldean pastas de sémola de trigo se construyen geométricamente rotando curvas parabólicas, lineales o elípticas. Calcular el volumen exacto de estos silos evita derrames o problemas de compactación por fuerzas de fricción de Jansen.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
Diseñamos una tolva dosificadora de mermelada de fresa de alta viscosidad cuya pared interna sigue la curva radical:
$$y = \\sqrt{x} \\quad \\text{[centímetros]}$$
Desde la base de la boquilla en $x = 0$ hasta el extremo superior de carga en $x = 4$ cm. Evaluemos el volumen de masa que puede albergar esta sección.

1. **Planteamiento de la Integral para Sólidos de Revolución (Discos):**
   $$V = \\pi \\int_{0}^{4} [\\sqrt{x}]^2 dx$$

2. **Simplificación del Integrando:**
   Dado que $(\\sqrt{x})^2 = x$ para $x \\geq 0$:
   $$V = \\pi \\int_{0}^{4} x \\, dx$$

3. **Obtención de la Antiderivada:**
   $$\\int x \\, dx = \\frac{x^2}{2} + C$$

4. **Evaluación de los Límites de Integración:**
   $$V = \\pi \\left[ \\frac{x^2}{2} \\right]_{0}^{4} = \\pi \\left( \\frac{4^2}{2} - \\frac{0^2}{2} \\right) = \\pi \\left( \\frac{16}{2} \\right) = 8\\pi \\approx 25.13 \\text{ cm}^3$$

Este cálculo preciso le da al ingeniero de diseño de empaques la certeza del volumen estático retenido en el cabezal, factor crítico para programar los ciclos de lavado in situ (CIP) e impedir la proliferación microbiológica en zonas muertas.`,
    icon: 'cylinder',
    quizId: 'quiz-3',
    color: 'bg-purple-500'
  },
  {
    id: 'solids_shell',
    title: '4. Método de Capas Cilíndricas',
    description: 'Cálculo geométrico avanzado en espacios concéntricos e intercambiadores helicoidales.',
    theory: `Cuando la región plana gira alrededor del eje $Y$, o cuando despejar la función $y = f(x)$ en términos de la variable inversa $x = g(y)$ resulta algebraicamente inviable o genera integrales intratables, el método de discos deja de ser práctico. Para estos casos, empleamos el **Método de Capas Cilíndricas** (o cascarones cilíndricos concéntricos).

La aproximación consiste en envolver el eje de rotación con cilindros concéntricos de radio $x$, espesor diferencial $dx$ y altura $f(x)$. Al "desenrollar" una capa cilíndrica, se forma un prisma rectangular de volumen $dV = 2\\pi x \\cdot f(x) \\cdot dx$. La suma infinitesimal de estos cascarones nos da la fórmula:

$$V = 2\\pi \\int_{a}^{b} x \\cdot f(x) dx$$

### Aplicación Clave en Intercambiadores de Calor de Alimentos:
Los intercambiadores de calor de superficie raspada (SSHE) se usan para procesar fluidos altamente viscosos o sensibles al calor (como chocolate, helados o margarina). Cuentan con un cilindro exterior y un rotor interno. El espacio libre entre ambos es un anular concéntrico donde fluye el alimento. Utilizar capas cilíndricas es el camino óptimo para modelar perfiles de velocidad radiales y calcular el volumen exacto de fluido sometido a cizalla en estos equipos.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
Calculamos el volumen interno activo de una sección de un intercambiador anular cuyo perfil de altura axial está modelado por la función lineal:
$$y = 2x \\quad \\text{[decímetros]}$$
Desde el radio interno $x = 0$ hasta el radio externo del tambor en $x = 2$ decímetros, rotado alrededor del eje $Y$.

1. **Planteamiento de la Integral de Capas Cilíndricas:**
   $$V = 2\\pi \\int_{0}^{2} x \\cdot (2x) dx$$

2. **Álgebra Interna del Integrando:**
   Multiplicamos las variables para unificar la potencia:
   $$V = 2\\pi \\int_{0}^{2} 2x^2 dx = 4\\pi \\int_{0}^{2} x^2 dx$$

3. **Cálculo de la Antiderivada:**
   $$\\int x^2 dx = \\frac{x^3}{3} + C$$

4. **Evaluación de Límites Integrales:**
   $$V = 4\\pi \\left[ \\frac{x^3}{3} \\right]_{0}^{2} = 4\\pi \\left( \\frac{2^3}{3} - \\frac{0^3}{3} \\right) = 4\\pi \\left( \\frac{8}{3} \\right) = \\frac{32}{3}\\pi \\approx 33.51 \\text{ dm}^3 \\text{ (litros)}$$

Gracias a este modelo, el ingeniero de planta calcula el tiempo de residencia hidráulico exacto ($t_R = V / Q$), garantizando que todo el chocolate reciba el temple térmico necesario sin sobrecalentarse.`,
    icon: 'layers',
    quizId: 'quiz-4',
    color: 'bg-indigo-500'
  },
  {
    id: 'exp_log',
    title: '5. Integrales Exponenciales y Logarítmicas',
    description: 'Cinéticas microbiológicas de destrucción térmica, pasteurización y decaimiento en torres de enfriamiento.',
    theory: `En la microbiología industrial y la transferencia de masa/calor transitoria, los fenómenos naturales rara vez son lineales; casi siempre se rigen por relaciones exponenciales y logarítmicas. Las ecuaciones diferenciales de primer orden que gobiernan estos decaimientos se resuelven mediante integrales de las formas:

$$\\int e^{kx} dx = \\frac{1}{k} e^{kx} + C$$
$$\\int \\frac{1}{x} dx = \\ln|x| + C$$

### Cinética Microbiológica de Destrucción Térmica:
La reducción de patógenos letales como *Salmonella* o *Clostridium botulinum* sigue una cinética química de primer orden:
$$\\frac{dN}{dt} = -k N$$
Donde $N$ es la concentración de bacterias viables y $k$ es la constante de muerte térmica. Al separar variables e integrar en el tiempo:
$$\\int_{N_0}^{N_t} \\frac{1}{N} dN = -\\int_{0}^{t} k dt \\implies \\ln\\left(\\frac{N_t}{N_0}\\right) = -kt \\implies N_t = N_0 e^{-kt}$$

### Ejercicio de Ejemplo Resuelto Paso a Paso:
La tasa de disipación de calor de una conserva de sopa de verduras enlatada durante su inmersión en un canal de enfriamiento rápido decae según el modelo:
$$E(t) = 50e^{-0.1t} \\quad \\text{[kJ/hora]}$$

Deseamos cuantificar el calor total removido del envase durante las primeras 10 horas de enfriamiento ($t = 0$ a $t = 10$).

1. **Planteamiento de la Integral Definida de Energía:**
   $$Q = \\int_{0}^{10} 50 e^{-0.1t} dt$$

2. **Resolución de la Antiderivada (Sustitución simple $u = -0.1t \\implies dt = \\frac{du}{-0.1}$):**
   $$\\int 50 e^{-0.1t} dt = 50 \\left( \\frac{e^{-0.1t}}{-0.1} \\right) = -500 e^{-0.1t} + C$$

3. **Evaluación de Límites Integrales aplicando el TFC:**
   Para el límite superior ($t = 10$):
   $$F(10) = -500 e^{-0.1(10)} = -500 e^{-1} \\approx -500(0.36787) = -183.94 \\text{ kJ}$$
   
   Para el límite inferior ($t = 0$):
   $$F(0) = -500 e^{-0.1(0)} = -500(1) = -500 \\text{ kJ}$$

4. **Sustracción Final de los Estados de Energía:**
   $$Q = F(10) - F(0) = -183.94 - (-500) = 500 - 183.94 = 316.06 \\text{ kJ}$$

**Significado Físico:** Se han removido exactamente **316.06 kJ** del bote de conserva. Este cálculo es el insumo clave para que el diseñador de la planta dimensione la capacidad frigorífica del compresor del sistema de enfriamiento por agua helada.`,
    icon: 'graph',
    quizId: 'quiz-5',
    color: 'bg-orange-500'
  },
  {
    id: 'trig',
    title: '6. Integrales Trigonométricas y sus Inversas',
    description: 'Modelado analítico de fluctuaciones térmicas estacionales en silos de granos y flujo pulsante.',
    theory: `Las funciones trigonométricas (seno, coseno y sus recíprocas) son indispensables para modelar comportamientos cíclicos y periódicos en la naturaleza y la industria. La integración de estas funciones periódicas permite calcular promedios de temperatura o caudales en equipos sujetos a oscilaciones mecánicas o meteorológicas.

### Integrales elementales y sustituciones trigonométricas:
$$\\int \\sin(x) dx = -\\cos(x) + C$$
$$\\int \\cos(x) dx = \\sin(x) + C$$
$$\\int \\frac{1}{x^2 + a^2} dx = \\frac{1}{a} \\arctan\\left(\\frac{x}{a}\\right) + C$$

### El Caso del Flujo Pulsante en Alimentos:
Las bombas de pistón positivo o de diafragma se emplean en la industria alimenticia para dosificar con precisión aditivos concentrados (como colorantes o saborizantes) o para bombear fluidos sensibles a altas presiones (como la homogeneización de la leche). El caudal resultante tiene un comportamiento pulsante senoidal. Para calcular el volumen neto dosificado por ciclo, se deben integrar las amplitudes armónicas positivas del caudal.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
La temperatura del aire ambiente en la pared externa de un silo metálico de trigo oscila a lo largo del día según una tasa de cambio temporal aproximada de:
$$T'(t) = \\pi \\cos\\left(\\frac{\\pi t}{12}\\right) \\quad \\text{[°C/hora]}$$
Donde $t$ representa el tiempo en horas transcurridas desde las 6:00 AM. Evaluemos el cambio neto de temperatura interna que experimentará la pared del silo durante las primeras 6 horas del día ($t = 0$ a $t = 6$).

1. **Planteamiento de la Integral Definida:**
   $$\\Delta T = \\int_{0}^{6} \\pi \\cos\\left(\\frac{\\pi t}{12}\\right) dt$$

2. **Resolución de la Antiderivada por Sustitución Simple ($u = \\frac{\\pi t}{12} \\implies dt = \\frac{12}{\\pi} du$):**
   $$\\int \\pi \\cos\\left(\\frac{\\pi t}{12}\\right) dt = \\pi \\left[ \\frac{12}{\\pi} \\sin\\left(\\frac{\\pi t}{12}\\right) \\right] = 12 \\sin\\left(\\frac{\\pi t}{12}\\right) + C$$

3. **Evaluación de Límites Integrales aplicando el TFC:**
   Para el límite superior ($t = 6$):
   $$F(6) = 12 \\sin\\left(\\frac{\\pi \\cdot 6}{12}\\right) = 12 \\sin\\left(\\frac{\\pi}{2}\\right) = 12(1) = 12 \\text{ °C}$$
   
   Para el límite inferior ($t = 0$):
   $$F(0) = 12 \\sin\\left(\\frac{\\pi \\cdot 0}{12}\\right) = 12 \\sin(0) = 12(0) = 0 \\text{ °C}$$

4. **Sustracción de Límites:**
   $$\\Delta T = F(6) - F(0) = 12 - 0 = 12 \\text{ °C}$$

**Significado Físico:** En este ciclo de calentamiento matutino, la pared metálica eleva su temperatura en **12 °C**. Con este dato, el ingeniero de granos calcula si la tasa de respiración del trigo se acelerará excesivamente, lo que demandaría encender los sopladores de aireación forzada para evitar hongos.`,
    icon: 'wave',
    quizId: 'quiz-6',
    color: 'bg-pink-500'
  },
  {
    id: 'hyperbolic',
    title: '7. Funciones Hiperbólicas e Inversas',
    description: 'Comportamiento mecánico de geles alimenticios, catenarias de soporte y reología viscoelástica.',
    theory: `Las funciones hiperbólicas (seno, coseno y tangente hiperbólica) surgen al resolver ecuaciones diferenciales lineales de segundo orden comunes en la transferencia de calor en aletas disipadoras y en el análisis de esfuerzos mecánicos estructurales. Sus integrales directas se definen como:

$$\\int \\sinh(x) dx = \\cosh(x) + C$$
$$\\int \\cosh(x) dx = \\sinh(x) + C$$

### El Caso Estructural en la Industria de la Carne:
En los mataderos y plantas de procesamiento de carne de res o cerdo, las canales pesadas se transportan suspendidas de ganchos que corren a lo largo de cables de acero inoxidable o rieles aéreos. El cable suspendido entre dos columnas de soporte, bajo la acción de su propio peso y de las cargas de las canales de carne, toma la forma geométrica de una **catenaria**, modelada matemáticamente por la función hiperbólica:
$$y = H \\cosh\\left(\\frac{x}{H}\\right)$$
Donde $H$ es el parámetro de tensión del cable. Para calcular la longitud total de cable requerida entre dos vanos de soporte de la planta, se debe integrar el diferencial de longitud de arco, el cual da origen de manera natural a integrales hiperbólicas.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
Se modela un tramo suspendido de riel de transporte donde la tensión del cable da un valor de $H = 2$ metros, en un tramo horizontal de $x = 0$ a $x = 2$ metros. Resolvamos la integral fundamental del esfuerzo de flexión mecánico sobre el cable cuya formulación matemática requiere resolver:
$$I = \\int_{0}^{2} \\cosh\\left(\\frac{x}{2}\\right) dx$$

1. **Planteamiento de la Integral Definida:**
   $$I = \\int_{0}^{2} \\cosh\\left(\\frac{x}{2}\\right) dx$$

2. **Resolución de la Antiderivada Analítica:**
   Efectuamos la sustitución simple $u = \\frac{x}{2} \\implies dx = 2 \\, du$:
   $$\\int \\cosh\\left(\\frac{x}{2}\\right) dx = 2 \\sinh\\left(\\frac{x}{2}\\right) + C$$

3. **Evaluación de Límites Integrales de Acuerdo al TFC:**
   Para el límite superior ($t = 2$):
   $$F(2) = 2 \\sinh\\left(\\frac{2}{2}\\right) = 2 \\sinh(1)$$
   Dado que $\\sinh(1) = \\frac{e^1 - e^{-1}}{2} \\approx \\frac{2.71828 - 0.36787}{2} \\approx 1.1752$:
   $$F(2) = 2(1.1752) \\approx 2.3504 \\text{ metros}$$
   
   Para el límite inferior ($t = 0$):
   $$F(0) = 2 \\sinh(0) = 0 \\text{ metros}$$

4. **Sustracción de Límites:**
   $$I = F(2) - F(0) = 2.3504 - 0 = 2.3504 \\text{ metros}$$

Este cálculo estructural es vital para certificar la carga de ruptura del riel, impidiendo accidentes laborales catastróficos por desprendimiento mecánico de las líneas aéreas cargadas de canales cárnicas.`,
    icon: 'activity',
    quizId: 'quiz-7',
    color: 'bg-rose-500'
  },
  {
    id: 'parts',
    title: '8. Integración por Partes',
    description: 'Modelación avanzada de deshidratación osmótica, difusión y transporte de solutos en matrices porosas.',
    theory: `La integración por partes es un método de alta potencia analítica derivado de la regla del producto para derivadas. Se emplea para resolver integrales donde el integrando es el producto de dos funciones de distinta naturaleza matemática (algebraicas, exponenciales, trigonométricas, logarítmicas):

$$\\int u \\, dv = u v - \\int v \\, du$$

Para seleccionar la función $u$ de manera estratégica, se sigue la regla mnemotécnica **ILATE** (Inversas trigonométricas, Logarítmicas, Algebraicas, Trigonométricas, Exponenciales).

### Difusión de Solutos y Pérdida de Agua en Secado:
Durante el secado por aire caliente de trozos de fruta (como rodajas de manzana o mango) o la deshidratación osmótica en jarabe de sacarosa, la tasa de remoción de humedad del interior de la matriz porosa del alimento disminuye paulatinamente en el tiempo. La velocidad de transferencia de masa no es lineal debido a la formación de una capa seca superficial que opone resistencia difusiva. Este transporte de solutos combinado con decaimiento cinético da origen a integrales de la forma $\\int t e^{-kt} dt$, que exigen integración por partes.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
En la deshidratación por aire forzado de cubos de piña, la tasa de salida de agua (en gramos/hora) disminuye transitoriamente según el modelo:
$$R(t) = t e^{-0.5t} \\quad \\text{[g/h]}$$
Donde $t$ es el tiempo en horas. Calculemos la masa total de agua eliminada por el secador durante las primeras 4 horas de proceso ($t = 0$ a $t = 4$).

1. **Planteamiento de la Integral Definida de Masa:**
   $$M = \\int_{0}^{4} t e^{-0.5t} dt$$

2. **Selección de Variables por ILATE:**
   * $u = t$ (Algebraica) $\\implies du = dt$
   * $dv = e^{-0.5t} dt$ (Exponencial) $\\implies v = \\frac{e^{-0.5t}}{-0.5} = -2e^{-0.5t}$

3. **Aplicación de la Fórmula de Integración por Partes ($uv - \\int v du$):**
   $$\\int t e^{-0.5t} dt = t \\left( -2 e^{-0.5t} \\right) - \\int \\left( -2 e^{-0.5t} \\right) dt$$
   $$\\int t e^{-0.5t} dt = -2t e^{-0.5t} + 2 \\int e^{-0.5t} dt$$
   Integramos el término restante usando la regla exponencial:
   $$F(t) = -2t e^{-0.5t} + 2 \\left( -2e^{-0.5t} \\right) = -2t e^{-0.5t} - 4e^{-0.5t} + C$$

4. **Evaluación de Límites Integrales aplicando el TFC:**
   Para el límite superior ($t = 4$):
   $$F(4) = -2(4)e^{-0.5(4)} - 4e^{-0.5(4)} = -8e^{-2} - 4e^{-2} = -12e^{-2}$$
   Sabiendo que $e^{-2} \\approx 0.13533$:
   $$F(4) \\approx -12(0.13533) = -1.624 \\text{ gramos}$$
   
   Para el límite inferior ($t = 0$):
   $$F(0) = -2(0)e^{0} - 4e^{0} = 0 - 4(1) = -4 \\text{ gramos}$$

5. **Sustracción de Estados para Obtener el Agua Total:**
   $$M = F(4) - F(0) = -1.624 - (-4) = 4 - 1.624 = 2.376 \\text{ gramos}$$

**Significado Físico:** Cada trozo de piña ha perdido exactamente **2.38 gramos de agua**. Con esta información, el ingeniero calibra la velocidad del ventilador del túnel de secado para evitar el endurecimiento superficial de la fruta (case hardening).`,
    icon: 'puzzle',
    quizId: 'quiz-8',
    color: 'bg-teal-500'
  },
  {
    id: 'trig_powers',
    title: '9. Potencias de Senos, Cosenos, Secantes y Tangentes',
    description: 'Irradiación espectral de lámparas UV-C y análisis de absorción de energía de ondas electromagnéticas.',
    theory: `La integración de potencias de funciones trigonométricas es un tema clásico que requiere el uso estratégico de identidades de reducción y simplificación para transformar integrandos complejos en sumas polinómicas sencillas de resolver.

### Identidades Clave de Reducción:
* **Identidades de ángulo medio (para potencias pares):**
  $$\\sin^2(x) = \\frac{1 - \\cos(2x)}{2}, \\quad \\cos^2(x) = \\frac{1 + \\cos(2x)}{2}$$
* **Identidad Pitagórica fundamental:**
  $$\\sin^2(x) + \\cos^2(x) = 1, \\quad \\sec^2(x) = 1 + \\tan^2(x)$$

### En Ingeniería de Alimentos:
Las lámparas de radiación ultravioleta de longitud de onda corta (UV-C, ~254 nm) se utilizan ampliamente para la desinfección superficial de agua potable, jugos clarificados y empaques plásticos antes de su llenado aséptico. La distribución de la intensidad luminosa sobre superficies curvas (como la cáscara de manzanas u naranjas en bandas transportadoras) varía de acuerdo con el ángulo de incidencia (Ley de Lambert). Calcular la dosis germicida acumulada (energía por unidad de área) requiere integrar potencias senoidales en el espectro angular de radiación.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
Se modela la radiación UV-C absorbida por la superficie superior de una fruta en rotación. La potencia instantánea absorbida varía según la función sinusoidal al cuadrado:
$$I(\\theta) = 20 \\sin^2(1.5\\theta) \\quad \\text{[milliwatts/cm}^2\\text{]}$$
Donde $\\theta$ es el ángulo de barrido. Deseamos calcular la dosis total de energía acumulada en el intervalo angular desde $\\theta = 0$ hasta $\\theta = \\frac{\\pi}{3}$ radianes.

1. **Planteamiento de la Integral Definida:**
   $$\\text{Dosis} = \\int_{0}^{\\pi/3} 20 \\sin^2(1.5\\theta) d\\theta$$

2. **Aplicación de la Identidad de Ángulo Medio para Eliminar la Potencia Par:**
   $$\\sin^2(1.5\\theta) = \\frac{1 - \\cos(3\\theta)}{2}$$
   Sustituyendo en la integral:
   $$\\text{Dosis} = \\int_{0}^{\\pi/3} 20 \\left( \\frac{1 - \\cos(3\\theta)}{2} \\right) d\\theta = 10 \\int_{0}^{\\pi/3} (1 - \\cos(3\\theta)) d\\theta$$

3. **Resolución de la Antiderivada:**
   $$F(\\theta) = 10 \\left[ \\theta - \\frac{\\sin(3\\theta)}{3} \\right] + C$$

4. **Evaluación de Límites aplicando el TFC:**
   Para el límite superior ($\\theta = \\frac{\\pi}{3}$):
   $$F\\left(\\frac{\\pi}{3}\\right) = 10 \\left[ \\frac{\\pi}{3} - \\frac{\\sin(3 \\cdot \\frac{\\pi}{3})}{3} \\right] = 10 \\left[ \\frac{\\pi}{3} - \\frac{\\sin(\\pi)}{3} \\right]$$
   Dado que $\\sin(\\pi) = 0$:
   $$F\\left(\\frac{\\pi}{3}\\right) = 10 \\left[ \\frac{\\pi}{3} - 0 \\right] = \\frac{10\\pi}{3} \\approx 10.47 \\text{ mJ/cm}^2$$
   
   Para el límite inferior ($\\theta = 0$):
   $$F(0) = 10 \\left[ 0 - \\frac{\\sin(0)}{3} \\right] = 0 \\text{ mJ/cm}^2$$

5. **Sustracción Final:**
   $$\\text{Dosis} = 10.47 - 0 = 10.47 \\text{ mJ/cm}^2$$

**Significado Físico:** Se ha depositado una dosis de **10.47 mJ/cm²** sobre el empaque. Este cálculo asegura que se supera el umbral de energía necesario para desnaturalizar el ADN de esporas de mohos, asegurando la inocuidad sin generar calor que degrade organolépticamente el producto.`,
    icon: 'star',
    quizId: 'quiz-9',
    color: 'bg-amber-500'
  },
  {
    id: 'fractions',
    title: '10. Fracciones Parciales',
    description: 'Crecimiento de poblaciones microbianas logísticas en fermentadores de yogurt y biorreactores enzimáticos.',
    theory: `La integración de funciones racionales $\\frac{P(x)}{Q(x)}$ donde el grado del polinomio del denominador es mayor que el del numerador se resuelve mediante el método de **Descomposición en Fracciones Parciales**. Este método nos permite "desarmar" un cociente complejo en una suma de fracciones lineales o cuadráticas simples, cuyas integrales directas dan origen a logaritmos y arcotangentes.

### Crecimiento Microbiano Logístico en Biorreactores:
En la fermentación para la producción de yogurt o masa madre, las bacterias ácido-lácticas (*Lactobacillus bulgaricus*) crecen en un medio limitado en nutrientes. Su población $X(t)$ no crece de forma exponencial indefinida; se frena debido al consumo de lactosa y acumulación de ácido láctico. Este comportamiento sigue la **Ecuación Logística de Crecimiento**:
$$\\frac{dX}{dt} = r X \\left( 1 - \\frac{X}{K} \\right)$$
Donde $r$ es la tasa específica de crecimiento y $K$ es la capacidad de carga del fermentador. Al separar variables, surge la integral racional:
$$\\int \\frac{1}{X(K - X)} dX = \\int \\frac{r}{K} dt$$
Resolver el miembro izquierdo exige descomponer la expresión en fracciones parciales.

#### Ejercicio de Ejemplo Resuelto Paso a Paso:
Durante un ensayo de fermentación ácida, se modela la tasa de producción de metabolitos inhibitorios. La función matemática de concentración requiere resolver la integral:
$$I = \\int_{0}^{1} \\frac{1}{(x-2)(x-3)} dx$$

1. **Planteamiento de la Descomposición Racional:**
   $$\\frac{1}{(x-2)(x-3)} = \\frac{A}{x-2} + \\frac{B}{x-3}$$

2. **Resolución de las Constantes $A$ y $B$:**
   Multiplicamos toda la ecuación por el denominador común $(x-2)(x-3)$:
   $$1 = A(x-3) + B(x-2)$$
   Evaluamos en los valores críticos (raíces) para despejar las incógnitas:
   * **Si $x = 2$:**
     $$1 = A(2-3) + B(2-2) \\implies 1 = A(-1) \\implies A = -1$$
   * **Si $x = 3$:**
     $$1 = A(3-3) + B(3-2) \\implies 1 = B(1) \\implies B = 1$$

3. **Sustitución de Coeficientes en la Integral:**
   $$I = \\int_{0}^{1} \\left( \\frac{-1}{x-2} + \\frac{1}{x-3} \\right) dx$$

4. **Integración Directa mediante Logaritmos:**
   $$F(x) = -\\ln|x-2| + \\ln|x-3| = \\ln\\left| \\frac{x-3}{x-2} \\right| + C$$

5. **Evaluación de Límites aplicando el TFC:**
   Para el límite superior ($x = 1$):
   $$F(1) = \\ln\\left| \\frac{1-3}{1-2} \\right| = \\ln\\left| \\frac{-2}{-1} \\right| = \\ln(2) \\approx 0.6931$$
   
   Para el límite inferior ($x = 0$):
   $$F(0) = \\ln\\left| \\frac{0-3}{0-2} \\right| = \\ln\\left| \\frac{-3}{-2} \\right| = \\ln(1.5) \\approx 0.4054$$

6. **Resultado Neto del Balance:**
   $$I = F(1) - F(0) = \\ln(2) - \\ln(1.5) = \\ln\\left(\\frac{2}{1.5}\\right) = \\ln\\left(\\frac{4}{3}\\right) \\approx 0.2876$$

**Significado Físico:** El valor integrado representa la concentración adimensional crítica de ácido láctico acumulada. Con este modelo, el biotecnólogo predice el momento preciso en que el fermentador debe enfriarse para detener la acidificación, garantizando la textura perfecta y el sabor característico del yogurt comercial.`,
    icon: 'pie',
    quizId: 'quiz-10',
    color: 'bg-yellow-500'
  }
];

export const quizzes: Record<string, Quiz> = {
  'quiz-1': {
    id: 'quiz-1',
    questions: [
      {
        id: 'q1-1',
        text: 'La tasa de llenado de un tanque de pulpa de fruta es $Q(t) = 4t^3$ litros por minuto. ¿Cuál es el volumen acumulado de pulpa entre $t = 1$ y $t = 3$ minutos?',
        options: [
          '80 litros',
          '40 litros',
          '260 litros',
          '120 litros'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $\\int_{1}^{3} 4t^3 dt = [t^4]_{1}^{3} = 3^4 - 1^4 = 81 - 1 = 80$ litros.'
      },
      {
        id: 'q1-2',
        text: 'Si el flujo de calor en una pasteurizadora de placas es $q(t) = 10t$ kW, ¿cuál es la energía térmica acumulada en kJ en los primeros 10 segundos ($t = 0$ a $t = 10$)?',
        options: [
          '1000 kJ',
          '500 kJ',
          '100 kJ',
          '250 kJ'
        ],
        correctAnswer: 1,
        explanation: 'Calculamos $\\int_{0}^{10} 10t dt = [5t^2]_{0}^{10} = 5(100) - 0 = 500$ kJ.'
      },
      {
        id: 'q1-3',
        text: '¿Qué representa geométricamente la integral definida de una función de tasa $f(x)$ entre los límites $a$ y $b$?',
        options: [
          'La pendiente promedio de la función en ese intervalo',
          'El área neta bajo la curva de la función en ese intervalo',
          'El punto de máxima tasa instantánea del proceso',
          'La curvatura de la tubería del extrusor'
        ],
        correctAnswer: 1,
        explanation: 'La integral definida representa matemáticamente la acumulación continua que se visualiza físicamente como el área neta bajo la curva en el plano cartesiano.'
      },
      {
        id: 'q1-4',
        text: 'En la modelación del llenado de silos, si el caudal de alimentación es constante $Q(t) = C$, ¿cómo es el volumen acumulado respecto al tiempo?',
        options: [
          'Aumenta linealmente con respecto al tiempo ($V = C \\cdot t$)',
          'Aumenta exponencialmente con respecto al tiempo',
          'Permanece constante e invariable',
          'Disminuye cuadráticamente conforme pasa el tiempo'
        ],
        correctAnswer: 0,
        explanation: 'Integrando un valor constante: $\\int C dt = C \\cdot t + K$. Por lo tanto, el volumen acumulado crece linealmente con una pendiente igual a la tasa constante.'
      },
      {
        id: 'q1-5',
        text: 'En una planta de lácteos, se mide el caudal de desnatado $Q(t) = 3 + 0.1t^2$ L/min. Si la desnatadora opera de $t=0$ a $t=10$ minutos, ¿cuál es el volumen total acumulado que va al tanque de crema?',
        options: [
          '63.3 litros',
          '30.0 litros',
          '33.3 litros',
          '43.3 litros'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $\\int_{0}^{10} (3 + 0.1t^2) dt = [3t + \\frac{0.1t^3}{3}]_{0}^{10} = (30 + \\frac{100}{3}) - 0 = 30 + 33.3 = 63.3$ litros.'
      }
    ]
  },
  'quiz-2': {
    id: 'quiz-2',
    questions: [
      {
        id: 'q2-1',
        text: 'Si definimos la función acumuladora del volumen de leche envasado como $V(x) = \\int_{0}^{x} (3 + e^{-t}) dt$, ¿cuál es la velocidad de llenado instantánea $V\'(x)$ al cabo de $x$ segundos?',
        options: [
          '$3x - e^{-x}$',
          '$3 + e^{-x}$',
          '$3 - e^{-x}$',
          '$\\ln|3 + e^{-x}|$'
        ],
        correctAnswer: 1,
        explanation: 'Por el Teorema Fundamental del Cálculo (Parte 1), la derivada de la integral acumuladora es simplemente el integrando evaluado en el límite superior: $V\'(x) = 3 + e^{-x}$.'
      },
      {
        id: 'q2-2',
        text: 'Evalúa la integral definida $\\int_{1}^{2} (6x^2 - 2x) dx$ que modela la resistencia al corte de una gelatina.',
        options: [
          '11',
          '14',
          '8',
          '16'
        ],
        correctAnswer: 0,
        explanation: 'Antiderivada: $F(x) = 2x^3 - x^2$. Evaluando: $F(2) = 2(8) - 4 = 12$. $F(1) = 2(1) - 1 = 1$. Entonces $F(2) - F(1) = 12 - 1 = 11$.'
      },
      {
        id: 'q2-3',
        text: '¿Cuál es la relación principal que establece el Teorema Fundamental del Cálculo (TFC)?',
        options: [
          'La derivada y la integral son operaciones inversas',
          'La tasa de flujo siempre es proporcional al área',
          'La viscosidad disminuye con la temperatura',
          'Toda función continua es derivable en cualquier punto'
        ],
        correctAnswer: 0,
        explanation: 'El TFC conecta de manera directa la derivación y la integración como procesos inversos, simplificando el cálculo de integrales a través de antiderivadas.'
      },
      {
        id: 'q2-4',
        text: 'Según el TFC, si conocemos una antiderivada $F(x)$ de una función continua $f(x)$, ¿cómo se calcula la integral definida en $[a, b]$?',
        options: [
          '$\\int_{a}^{b} f(x) dx = F(b) - F(a)$',
          '$\\int_{a}^{b} f(x) dx = F\'(b) - F\'(a)$',
          '$\\int_{a}^{b} f(x) dx = F(a) - F(b)$',
          '$\\int_{a}^{b} f(x) dx = f(b) - f(a)$'
        ],
        correctAnswer: 0,
        explanation: 'La Parte 2 del TFC establece de forma exacta que $\\int_{a}^{b} f(x) dx = F(b) - F(a)$, facilitando la resolución analítica sin sumas infinitas.'
      },
      {
        id: 'q2-5',
        text: 'La tasa de transferencia de calor en un autoclave durante el enfriamiento de conservas de atún es $q(t) = 150 e^{-0.2t}$ kJ/min. Calcula la pérdida de energía térmica entre $t = 0$ y $t = 5$ minutos.',
        options: [
          '474.3 kJ',
          '150.0 kJ',
          '375.0 kJ',
          '47.4 kJ'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $\\int_{0}^{5} 150 e^{-0.2t} dt = [\\frac{150}{-0.2} e^{-0.2t}]_{0}^{5} = [-750 e^{-0.2t}]_{0}^{5} = -750(e^{-1} - 1) \\approx 474.3$ kJ.'
      }
    ]
  },
  'quiz-3': {
    id: 'quiz-3',
    questions: [
      {
        id: 'q3-1',
        text: 'Un envase de vidrio cilíndrico para mermelada se genera rotando la recta $y = 3$ alrededor del eje $X$ en el intervalo $[0, 5]$ (en cm). ¿Cuál es su volumen en $\\text{cm}^3$?',
        options: [
          '$15\\pi\\text{ cm}^3$',
          '$45\\pi\\text{ cm}^3$',
          '$9\\pi\\text{ cm}^3$',
          '$30\\pi\\text{ cm}^3$'
        ],
        correctAnswer: 1,
        explanation: 'Usando discos: $V = \\pi \\int_{0}^{5} [3]^2 dx = \\pi \\int_{0}^{5} 9 dx = \\pi [9x]_{0}^{5} = 45\\pi\\text{ cm}^3$.'
      },
      {
        id: 'q3-2',
        text: 'Se diseña una boquilla rotativa para un extrusor de masa cuya curva límite es $y = \\sqrt{x}$. Si rotamos esta curva en el eje $X$ de $x = 0$ a $x = 4$ cm, ¿qué volumen de masa contiene?',
        options: [
          '$8\\pi\\text{ cm}^3$',
          '$16\\pi\\text{ cm}^3$',
          '$4\\pi\\text{ cm}^3$',
          '$12\\pi\\text{ cm}^3$'
        ],
        correctAnswer: 0,
        explanation: 'El volumen es $V = \\pi \\int_{0}^{4} (\\sqrt{x})^2 dx = \\pi \\int_{0}^{4} x dx = \\pi [\\frac{x^2}{2}]_{0}^{4} = 8\\pi\\text{ cm}^3$.'
      },
      {
        id: 'q3-3',
        text: '¿Cuál es la fórmula matemática para calcular el volumen de un sólido de revolución mediante el método de discos?',
        options: [
          '$V = \\pi \\int_{a}^{b} [f(x)]^2 dx$',
          '$V = 2\\pi \\int_{a}^{b} x f(x) dx$',
          '$V = \\pi \\int_{a}^{b} f(x) dx$',
          '$V = \\int_{a}^{b} [f(x)]^2 dx$'
        ],
        correctAnswer: 0,
        explanation: 'El método se basa en sumar infinitas rodajas cilíndricas delgadas de volumen $dV = \\pi r^2 h$, donde $r = f(x)$ y $h = dx$, dando $V = \\pi \\int_{a}^{b} [f(x)]^2 dx$.'
      },
      {
        id: 'q3-4',
        text: 'Si rotamos una función alrededor del eje X, ¿cómo se posicionan los discos con respecto a dicho eje?',
        options: [
          'De manera perfectamente paralela al eje X',
          'De manera perfectamente perpendicular al eje X',
          'Con un ángulo oblicuo de 45 grados',
          'Se enrollan en cilindros concéntricos alrededor de X'
        ],
        correctAnswer: 1,
        explanation: 'Las secciones transversales circulares (discos) se forman cortando perpendicularmente el eje de revolución, en este caso el eje X.'
      },
      {
        id: 'q3-5',
        text: 'Se modela la superficie de un chocolate de repostería con forma de bombón rotando la curva $y = 0.5x^2$ desde $x=0$ hasta $x=2$ cm alrededor del eje X. ¿Cuál es el volumen total de chocolate en este bombón?',
        options: [
          '$0.8\\pi\\text{ cm}^3$',
          '$1.6\\pi\\text{ cm}^3$',
          '$3.2\\pi\\text{ cm}^3$',
          '$0.4\\pi\\text{ cm}^3$'
        ],
        correctAnswer: 1,
        explanation: 'La integral es $V = \\pi \\int_{0}^{2} (0.5x^2)^2 dx = \\pi \\int_{0}^{2} 0.25x^4 dt = 0.25\\pi [\\frac{x^5}{5}]_{0}^{2} = 0.25\\pi (\\frac{32}{5}) = 1.6\\pi\\text{ cm}^3$.'
      }
    ]
  },
  'quiz-4': {
    id: 'quiz-4',
    questions: [
      {
        id: 'q4-1',
        text: 'Para calcular el volumen de chocolate en un tanque mezclador especial, rotamos la región bajo la recta $y = 2x$ de $x = 0$ a $x = 2$ alrededor del eje $Y$. Aplicando capas cilíndricas, ¿qué integral se plantea?',
        options: [
          '$2\\pi \\int_{0}^{2} 2x^2 dx$',
          '$2\\pi \\int_{0}^{2} x dx$',
          '$\\pi \\int_{0}^{2} (2x)^2 dx$',
          '$2\\pi \\int_{0}^{2} (x + 2x) dx$'
        ],
        correctAnswer: 0,
        explanation: 'Fórmula de capas cilíndricas: $V = 2\\pi \\int_{a}^{b} x f(x) dx$. Con $f(x) = 2x$, resulta en $V = 2\\pi \\int_{0}^{2} x(2x) dx = 2\\pi \\int_{0}^{2} 2x^2 dx$.'
      },
      {
        id: 'q4-2',
        text: 'Calcula el valor exacto del volumen del chocolate del ejercicio anterior en unidades cúbicas.',
        options: [
          '$\\frac{32}{3}\\pi$',
          '$\\frac{16}{3}\\pi$',
          '$8\\pi$',
          '$\\frac{64}{3}\\pi$'
        ],
        correctAnswer: 0,
        explanation: '$V = 2\\pi \\int_{0}^{2} 2x^2 dx = 4\\pi [\\frac{x^3}{3}]_{0}^{2} = 4\\pi (\\frac{8}{3}) = \\frac{32}{3}\\pi$.'
      },
      {
        id: 'q4-3',
        text: '¿Cuál es la fórmula fundamental para calcular el volumen de revolución mediante capas cilíndricas (cascarones)?',
        options: [
          '$V = 2\\pi \\int_{a}^{b} x f(x) dx$',
          '$V = \\pi \\int_{a}^{b} [f(x)]^2 dx$',
          '$V = 2\\pi \\int_{a}^{b} [f(x)]^2 dx$',
          '$V = \\pi \\int_{a}^{b} x^2 f(x) dx$'
        ],
        correctAnswer: 0,
        explanation: 'El volumen acumulado se halla sumando tubos delgados de área lateral $2\\pi x f(x)$ y espesor $dx$, lo que da $V = 2\\pi \\int_{a}^{b} x f(x) dx$.'
      },
      {
        id: 'q4-4',
        text: 'Al rotar una región alrededor del eje Y usando cascarones, ¿con respecto a qué variable se realiza la integración?',
        options: [
          'Con respecto a la variable $x$ (eje perpendicular al eje de rotación)',
          'Con respecto a la variable $y$ (eje paralelo al de rotación)',
          'Con respecto al ángulo $\\theta$ únicamente',
          'Es indistinto e independiente de la variable'
        ],
        correctAnswer: 0,
        explanation: 'El método de cascarones integra a lo largo del radio horizontal de los cilindros concéntricos, lo que corresponde a la variable $x$ en el plano horizontal.'
      },
      {
        id: 'q4-5',
        text: 'Se vierte chocolate fundido en un molde rotativo industrial cuyo perfil interno es $y = 4 - x^2$ (para $x$ de 0 a 2 dm). Rota alrededor del eje Y. Determina el volumen de chocolate contenido usando cascarones.',
        options: [
          '$8\\pi$ litros',
          '$4\\pi$ litros',
          '$16\\pi$ litros',
          '$12\\pi$ litros'
        ],
        correctAnswer: 0,
        explanation: 'La integral de cascarones es $V = 2\\pi \\int_{0}^{2} x(4-x^2) dx = 2\\pi \\int_{0}^{2} (4x - x^3) dx = 2\\pi [2x^2 - \\frac{x^4}{4}]_{0}^{2} = 2\\pi(8 - 4) = 8\\pi$ dm³ (litros).'
      }
    ]
  },
  'quiz-5': {
    id: 'quiz-5',
    questions: [
      {
        id: 'q5-1',
        text: 'La tasa de evaporación del agua en un concentrador de jugo al vacío es $E(t) = 50 e^{-0.1t}$ kg/h. ¿Cuánta agua se evapora en las primeras 10 horas?',
        options: [
          '$500(1 - e^{-1})$ kg',
          '$50(1 - e^{-1})$ kg',
          '$500(e - 1)$ kg',
          '$100(1 - e^{-0.1})$ kg'
        ],
        correctAnswer: 0,
        explanation: 'Integrando: $\\int_{0}^{10} 50 e^{-0.1t} dt = [\\frac{50}{-0.1} e^{-0.1t}]_{0}^{10} = [-500 e^{-0.1t}]_{0}^{10} = -500(e^{-1} - 1) = 500(1 - e^{-1})$ kg.'
      },
      {
        id: 'q5-2',
        text: 'En una prueba de fermentación, la velocidad específica de crecimiento de bacterias lácticas es $\\mu(t) = \\frac{2}{t}$ para $t \\geq 1$ hora. ¿Cuál es el incremento integrado de biomasa desde las 1 hasta las $e$ horas?',
        options: [
          '2 unidades',
          '1 unidad',
          '$2e$ unidades',
          '$\\ln(2)$ unidades'
        ],
        correctAnswer: 0,
        explanation: 'Calculamos $\\int_{1}^{e} \\frac{2}{t} dt = [2 \\ln|t|]_{1}^{e} = 2 \\ln(e) - 2 \\ln(1) = 2(1) - 0 = 2$.'
      },
      {
        id: 'q5-3',
        text: '¿Cuál es la antiderivada general de la función exponencial simple $f(x) = e^{-kx}$?',
        options: [
          '$-\\frac{1}{k} e^{-kx} + C$',
          '$\\frac{1}{k} e^{-kx} + C$',
          '$-k e^{-kx} + C$',
          '$e^{-kx} + C$'
        ],
        correctAnswer: 0,
        explanation: 'Aplicando la regla de sustitución para $u = -kx$, obtenemos la integral $-\\frac{1}{k} e^{-kx} + C$.'
      },
      {
        id: 'q5-4',
        text: '¿Cuál es la integral indefinida de la función $\\frac{1}{x}$ para $x > 0$?',
        options: [
          '$\\ln(x) + C$',
          '$x^{-2} + C$',
          '$e^x + C$',
          '$\\log_{10}(x) + C$'
        ],
        correctAnswer: 0,
        explanation: 'La derivada del logaritmo natural de $x$ es $1/x$, de modo que su integral indefinida correspondiente es $\\ln(x) + C$.'
      },
      {
        id: 'q5-5',
        text: 'La tasa de pérdida de humedad de unos granos de cacao en un tostador sigue la ecuación $dH/dt = -1.2 e^{-0.3t}$ % de agua/hora. Calcula la disminución del contenido de humedad total tras 4 horas.',
        options: [
          '2.8 %',
          '1.2 %',
          '4.8 %',
          '3.5 %'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $\\int_{0}^{4} -1.2 e^{-0.3t} dt = [4 e^{-0.3t}]_{0}^{4} = 4(e^{-1.2} - 1) \\approx 4(0.301 - 1) = -2.8$ %.'
      }
    ]
  },
  'quiz-6': {
    id: 'quiz-6',
    questions: [
      {
        id: 'q6-1',
        text: 'La temperatura diaria de un almacén de quesos oscila según $T\'(t) = \\pi \\cos(\\frac{\\pi t}{12})$ °C/hora. ¿Cuál es el cambio total de temperatura entre las horas $t = 0$ y $t = 6$?',
        options: [
          '12 °C',
          '6 °C',
          '24 °C',
          '$\\pi$ °C'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $\\int_{0}^{6} \\pi \\cos(\\frac{\\pi t}{12}) dt = [\\pi \\frac{12}{\\pi} \\sin(\\frac{\\pi t}{12})]_{0}^{6} = [12 \\sin(\\frac{\\pi t}{12})]_{0}^{6} = 12 \\sin(\\frac{\\pi}{2}) - 12 \\sin(0) = 12$ °C.'
      },
      {
        id: 'q6-2',
        text: 'Al calcular el perfil de velocidad de un fluido viscoso en un capilar, surge la integral $\\int \\frac{1}{x^2 + 4} dx$. ¿Cuál es su antiderivada correcta?',
        options: [
          '$\\frac{1}{2} \\arctan\\left(\\frac{x}{2}\\right) + C$',
          '$\\arctan\\left(\\frac{x}{2}\\right) + C$',
          '$\\frac{1}{4} \\arctan\\left(\\frac{x}{4}\\right) + C$',
          '$\\ln|x^2 + 4| + C$'
        ],
        correctAnswer: 0,
        explanation: 'Usando la fórmula estándar con $a = 2$, la antiderivada es $\\frac{1}{a} \\arctan(\\frac{x}{a}) + C = \\frac{1}{2} \\arctan(\\frac{x}{2}) + C$.'
      },
      {
        id: 'q6-3',
        text: '¿Cuál es el valor de la integral de la función trigonométrica básica $\\int \\sin(2x) dx$?',
        options: [
          '$-$ \\frac{1}{2} \\cos(2x) + C$',
          '$\\frac{1}{2} \\cos(2x) + C$',
          '$-2 \\cos(2x) + C$',
          '$\\cos(2x) + C$'
        ],
        correctAnswer: 0,
        explanation: 'Usando sustitución simple $u = 2x \\implies du = 2dx$, la integral se convierte en $\\frac{1}{2} \\int \\sin(u) du = -\\frac{1}{2} \\cos(2x) + C$.'
      },
      {
        id: 'q6-4',
        text: '¿Qué sustitución trigonométrica se recomienda para resolver integrales con el término radical $\\sqrt{9 - x^2}$?',
        options: [
          '$x = 3 \\sin(\\theta)$',
          '$x = 3 \\tan(\\theta)$',
          '$x = 9 \\sin(\\theta)$',
          '$x = 3 \\sec(\\theta)$'
        ],
        correctAnswer: 0,
        explanation: 'Usando $x = a \\sin(\\theta)$ con $a = 3$, la expresión se convierte en $9 - 9\\sin^2(\\theta) = 9\\cos^2(\\theta)$, eliminando la raíz por simplificación trigonométrica.'
      },
      {
        id: 'q6-5',
        text: 'La tasa de oscilación térmica exterior en una cámara fría de frutas es $T\'(t) = 3 \\cos(\\frac{\\pi t}{12})$ °C/hora. Calcula el cambio neto de temperatura interna de la pared entre $t = 0$ y $t = 12$ horas.',
        options: [
          '0 °C',
          '6 °C',
          '3 °C',
          '12 °C'
        ],
        correctAnswer: 0,
        explanation: 'La integral en un ciclo simétrico de 12 horas es $\\int_{0}^{12} 3 \\cos(\\frac{\\pi t}{12}) dt = [\\frac{36}{\\pi} \\sin(\\frac{\\pi t}{12})]_{0}^{12} = \\frac{36}{\\pi}(\\sin(\\pi) - \\sin(0)) = 0$ °C.'
      }
    ]
  },
  'quiz-7': {
    id: 'quiz-7',
    questions: [
      {
        id: 'q7-1',
        text: 'En la modelación del esfuerzo de corte de un fluido de gel de almidón modificado, se requiere resolver $\\int \\cosh(3x) dx$. ¿Cuál es el resultado?',
        options: [
          '$\\frac{1}{3} \\sinh(3x) + C$',
          '$3 \\sinh(3x) + C$',
          '$\\sinh(3x) + C$',
          '$\\frac{1}{3} \\cosh(3x) + C$'
        ],
        correctAnswer: 0,
        explanation: 'La integral de $\\cosh(u) du$ es $\\sinh(u) + C$. Con la sustitución $u = 3x, du = 3dx$, obtenemos $\\frac{1}{3} \\sinh(3x) + C$.'
      },
      {
        id: 'q7-2',
        text: 'La longitud de la cadena de transporte de una canal de cerdo sigue una curva catenaria. La integral matemática para calcular su longitud involucra la expresión $\\int \\sinh(x) dx$. ¿Cuál es su resultado?',
        options: [
          '$\\cosh(x) + C$',
          '$-$ \\cosh(x) + C$',
          '$\\tanh(x) + C$',
          '$\\cosh^2(x) + C$'
        ],
        correctAnswer: 0,
        explanation: 'La derivada de $\\cosh(x)$ es $\\sinh(x)$, por lo tanto, su antiderivada directa es $\\cosh(x) + C$.'
      },
      {
        id: 'q7-3',
        text: '¿Cuáles de las siguientes combinaciones definen correctamente a las funciones hiperbólicas fundamentales?',
        options: [
          '$\\sinh(x) = \\frac{e^x - e^{-x}}{2}$ y $\\cosh(x) = \\frac{e^x + e^{-x}}{2}$',
          '$\\sinh(x) = \\frac{e^x + e^{-x}}{2}$ y $\\cosh(x) = \\frac{e^x - e^{-x}}{2}$',
          '$\\sinh(x) = e^x - e^{-x}$',
          '$\\sinh(x) = \\sin(ix)$'
        ],
        correctAnswer: 0,
        explanation: 'Por definición, el seno hiperbólico es la diferencia de exponenciales dividida por 2, y el coseno hiperbólico es la suma dividida por 2.'
      },
      {
        id: 'q7-4',
        text: '¿Cuál es la identidad hiperbólica fundamental análoga al círculo unitario trigonométrico?',
        options: [
          '$\\cosh^2(x) - \\sinh^2(x) = 1$',
          '$\\cosh^2(x) + \\sinh^2(x) = 1$',
          '$\\sinh^2(x) - \\cosh^2(x) = 1$',
          '$\\tanh^2(x) + \\cosh^2(x) = 1$'
        ],
        correctAnswer: 0,
        explanation: 'La identidad fundamental hiperbólica derivada de sus exponenciales es $\\cosh^2(x) - \\sinh^2(x) = 1$, parametrizando una hipérbola.'
      },
      {
        id: 'q7-5',
        text: 'Un cable de sujeción para un secador industrial de lecho fluidizado adopta la forma de una catenaria de longitud $L = \\int_{0}^{2} \\cosh(0.5x) dx$ metros. Calcula la longitud exacta del cable.',
        options: [
          '2.35 m',
          '1.18 m',
          '3.50 m',
          '4.12 m'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $\\int_{0}^{2} \\cosh(0.5x) dx = [\\frac{1}{0.5} \\sinh(0.5x)]_{0}^{2} = [2 \\sinh(0.5x)]_{0}^{2} = 2 \\sinh(1) \\approx 2(1.1752) = 2.35$ m.'
      }
    ]
  },
  'quiz-8': {
    id: 'quiz-8',
    questions: [
      {
        id: 'q8-1',
        text: 'Para modelar la difusión de un conservante en un queso madurado, integramos $\\int x e^{2x} dx$. ¿Cuál es su solución utilizando integración por partes?',
        options: [
          '$\\frac{x}{2}e^{2x} - \\frac{1}{4}e^{2x} + C$',
          '$xe^{2x} - e^{2x} + C$',
          '$\\frac{x^2}{2}e^{2x} + C$',
          '$\\frac{x}{2}e^{2x} + \\frac{1}{4}e^{2x} + C$'
        ],
        correctAnswer: 0,
        explanation: 'Sea $u = x \\implies du = dx$ y $dv = e^{2x}dx \\implies v = \\frac{1}{2}e^{2x}$. Aplicando $uv - \\int v du$: $\\frac{x}{2}e^{2x} - \\int \\frac{1}{2}e^{2x} dx = \\frac{x}{2}e^{2x} - \\frac{1}{4}e^{2x} + C$.'
      },
      {
        id: 'q8-2',
        text: '¿Cuál es la elección óptima de $u$ y $dv$ según la regla mnemotécnica ILATE para resolver la integral $\\int x \\ln(x) dx$?',
        options: [
          '$u = x$, $dv = \\ln(x) dx$',
          '$u = \\ln(x)$, $dv = x dx$',
          '$u = x \\ln(x)$, $dv = dx$',
          '$u = 1/x$, $dv = x^2 dx$'
        ],
        correctAnswer: 1,
        explanation: 'En ILATE, las Logarítmicas (L) van antes que las Algebraicas (A). Por lo tanto, seleccionamos $u = \\ln(x)$ y $dv = x dx$.'
      },
      {
        id: 'q8-3',
        text: '¿De qué teorema o regla de derivación diferencial se deduce la fórmula de integración por partes?',
        options: [
          'La regla del producto para derivadas',
          'La regla del cociente para derivadas',
          'La regla de la cadena',
          'El teorema del valor medio'
        ],
        correctAnswer: 0,
        explanation: 'Partiendo de $d(uv) = u\\,dv + v\\,du$, integramos ambos miembros para despejar la conocida fórmula $\\int u\\,dv = uv - \\int v\\,du$.'
      },
      {
        id: 'q8-4',
        text: 'En la mnemotecnia ILATE para elegir el término $u$, ¿qué significan las letras A y T?',
        options: [
          'Algebraicas y Trigonométricas',
          'Aritméticas y Tangenciales',
          'Asintóticas y Teóricas',
          'Áreas y Tensores'
        ],
        correctAnswer: 0,
        explanation: 'En ILATE, la "A" representa funciones algebraicas (ej: $x^2$, $3x$) y la "T" a trigonométricas (ej: $\\sin(x)$, $\\cos(x)$).'
      },
      {
        id: 'q8-5',
        text: 'El secado térmico de láminas de manzana se modela integrando la tasa de remoción de humedad acumulada $M = \\int_{0}^{5} t e^{-0.5t} dt$ en gramos. Resuelve por partes para conocer el agua total extraída.',
        options: [
          '2.85 gramos',
          '1.20 gramos',
          '3.50 gramos',
          '4.15 gramos'
        ],
        correctAnswer: 0,
        explanation: 'Usando $u=t, dv=e^{-0.5t}dt \\implies v=-2e^{-0.5t}$. Obtenemos $[-2t e^{-0.5t} - 4 e^{-0.5t}]_{0}^{5} = -14 e^{-2.5} + 4 \\approx 2.85$ gramos.'
      }
    ]
  },
  'quiz-9': {
    id: 'quiz-9',
    questions: [
      {
        id: 'q9-1',
        text: 'Se requiere calcular la absorción de calor en un horno de deshidratación integrando $\\int \\sin^2(x) dx$. ¿Cuál es el método adecuado?',
        options: [
          'Sustituir $u = \\sin(x)$',
          'Usar la identidad de ángulo medio $\\sin^2(x) = \\frac{1 - \\cos(2x)}{2}$',
          'Utilizar integración por partes directamente con $u = \\sin^2(x)$',
          'Convertir a $\\cos^2(x) - 1$'
        ],
        correctAnswer: 1,
        explanation: 'Para potencias pares de senos o cosenos, la identidad de reducción de ángulo medio $\\sin^2(x) = \\frac{1 - \\cos(2x)}{2}$ es el camino directo para poder integrar.'
      },
      {
        id: 'q9-2',
        text: 'Resuelve la integral $\\int \\tan(x) \\sec^2(x) dx$. (Usa la sustitución $u = \\tan(x)$).',
        options: [
          '$\\frac{1}{2}\\tan^2(x) + C$',
          '$\\sec(x) + C$',
          '$\\tan^3(x) + C$',
          '$\\frac{1}{2}\\sec^2(x) + C$'
        ],
        correctAnswer: 0,
        explanation: 'Si $u = \\tan(x)$, entonces $du = \\sec^2(x) dx$. La integral se simplifica a $\\int u du = \\frac{1}{2} u^2 + C = \\frac{1}{2}\\tan^2(x) + C$.'
      },
      {
        id: 'q9-3',
        text: 'Para resolver integrales de potencias impares de funciones trigonométricas como $\\int \\cos^3(x) dx$, ¿cuál es el mejor primer paso algebraico?',
        options: [
          'Separar un factor coseno y sustituir $\\cos^2(x) = 1 - \\sin^2(x)$',
          'Usar partes directamente con $u = \\cos^3(x)$',
          'Sustituir $u = x^3$',
          'Expresar como ángulo doble'
        ],
        correctAnswer: 0,
        explanation: 'Al separar en $\\cos(x)\\cos^2(x) = \\cos(x)(1 - \\sin^2(x))$, podemos usar $u = \\sin(x) \\implies du = \\cos(x)dx$ para resolver por sustitución simple.'
      },
      {
        id: 'q9-4',
        text: '¿Cuál es la derivada de la función trigonométrica secante, fundamental en la resolución de integrales de potencias trigonométricas?',
        options: [
          '$\\sec(x) \\tan(x)$',
          '$\\sec^2(x)$',
          '$-\\csc(x) \\cot(x)$',
          '$\\tan^2(x)$'
        ],
        correctAnswer: 0,
        explanation: 'La derivada de la secante es $\\sec(x) \\tan(x)$, lo cual facilita el acople de diferenciales en integrales trigonométricas mixtas.'
      },
      {
        id: 'q9-5',
        text: 'La potencia disipada por un agitador excéntrico oscila armónicamente según $P(t) = 10 \\sin^2(\\pi t)$ Watts. Calcula la energía media transferida en un ciclo completo de $t=0$ a $t=1$ segundos integrando la potencia.',
        options: [
          '5 Joules',
          '10 Joules',
          '2.5 Joules',
          '0 Joules'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $\\int_{0}^{1} 10 \\sin^2(\\pi t) dt = 10 \\int_{0}^{1} \\frac{1 - \\cos(2\pi t)}{2} dt = 5 [t - \\frac{\\sin(2\\pi t)}{2\\pi}]_{0}^{1} = 5(1 - 0) = 5$ Joules.'
      }
    ]
  },
  'quiz-10': {
    id: 'quiz-10',
    questions: [
      {
        id: 'q10-1',
        text: 'La cinética de acidificación del yogurt requiere integrar $\\int \\frac{1}{(x-2)(x-3)} dx$. Descompón en fracciones parciales e indica los coeficientes $A$ y $B$ para: $\\frac{A}{x-2} + \\frac{B}{x-3}$.',
        options: [
          '$A = -1, B = 1$',
          '$A = 1, B = -1$',
          '$A = 2, B = 3$',
          '$A = -2, B = 2$'
        ],
        correctAnswer: 0,
        explanation: 'Multiplicando por el denominador común: $1 = A(x-3) + B(x-2)$. Si $x = 2 \\implies A(-1) = 1 \\implies A = -1$. Si $x = 3 \\implies B(1) = 1 \\implies B = 1$.'
      },
      {
        id: 'q10-2',
        text: 'Integrando el yogurt del ejercicio anterior $\\int \\left( \\frac{-1}{x-2} + \\frac{1}{x-3} \\right) dx$, ¿cuál es el perfil final de la integral?',
        options: [
          '$\\ln\\left|\\frac{x-3}{x-2}\\right| + C$',
          '$\\ln|(x-2)(x-3)| + C$',
          '$\\ln\\left|\\frac{x-2}{x-3}\\right| + C$',
          '$-$ \\ln|x-3| + \\ln|x-2| + C$'
        ],
        correctAnswer: 0,
        explanation: 'La integral es $-\\ln|x-2| + \\ln|x-3| + C$. Por las propiedades de los logaritmos, esto equivale a $\\ln\\left|\\frac{x-3}{x-2}\\right| + C$.'
      },
      {
        id: 'q10-3',
        text: '¿Bajo qué condición sobre los grados de los polinomios $P(x)$ y $Q(x)$ es directo aplicar fracciones parciales sobre la función racional $\\frac{P(x)}{Q(x)}$?',
        options: [
          'Cuando el grado de $P(x)$ es estrictamente menor al de $Q(x)$ (fracción propia)',
          'Cuando el grado de $P(x)$ es estrictamente mayor al de $Q(x)$',
          'Cuando ambos polinomios tienen exactamente el mismo grado',
          'Solo si $P(x)$ es un valor constante igual a 1'
        ],
        correctAnswer: 0,
        explanation: 'Se requiere que la función sea una fracción propia. Si es impropia, primero se realiza una división larga de polinomios.'
      },
      {
        id: 'q10-4',
        text: 'Si el denominador $Q(x)$ contiene factores lineales repetidos de la forma $(x - r)^2$, ¿cómo se plantea su descomposición?',
        options: [
          '$\\frac{A}{x-r} + \\frac{B}{(x-r)^2}$',
          '$\\frac{A}{x-r}$',
          '$\\frac{Ax + B}{(x-r)^2}$',
          '$\\frac{A}{(x-r)^2}$'
        ],
        correctAnswer: 0,
        explanation: 'Por cada factor repetido se debe proponer una suma de fracciones con denominadores con potencias sucesivas de dicho factor lineal.'
      },
      {
        id: 'q10-5',
        text: 'El crecimiento de una levadura de cerveza se modela con la integral $\\int \\frac{2}{x(x+2)} dx$. Descompón en fracciones parciales y resuélvela para conocer el modelo cinético acumulativo.',
        options: [
          '$\\ln\\left|\\frac{x}{x+2}\\right| + C$',
          '$\\ln|x(x+2)| + C$',
          '$2\\ln|x+2| + C$',
          '$\\frac{1}{2}\\ln\\left|\\frac{x}{x+2}\\right| + C$'
        ],
        correctAnswer: 0,
        explanation: 'La descomposición es $\\frac{1}{x} - \\frac{1}{x+2}$. Al integrar nos da $\\ln|x| - \\ln|x+2| = \\ln\\left|\\frac{x}{x+2}\\right| + C$.'
      }
    ]
  }
};
