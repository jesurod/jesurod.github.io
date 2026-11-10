/**
 * Project records: the single source for the grid and the inspector drawer.
 * Jesús Rodríguez González
 */

window.PROJECTS_DATA = [
  {
    id: "portfolio-optimization-metaheuristics",
    title: "Portfolio Optimization with Metaheuristics",
    category: "FinTech · Algoritmia C++ · Optimización",
    badge: "Algoritmos Evolutivos & Meméticos",
    year: "2025 - 2026",
    githubUrl: "https://github.com/jesurod/Portfolio-Optimization-Metaheuristics",
    fallbackGithubUrl: "https://github.com/jesurod/Portfolio-Optimization-Metaheuristics",
    lossOrObjective: "\\max_{\\mathbf{w}} \\sum_i w_i \\sum_t \\ln(1 + \\mu_{i,t}) - \\lambda \\sqrt{\\mathbf{w}^T \\boldsymbol{\\Sigma} \\mathbf{w}} \\quad \\text{s.t.} \; \\sum_i w_i = 1, \; w_i \\in \\{0\\} \\cup [lo, hi]",
    formattedObjective: `<span class="font-serif italic text-brand-accent font-semibold">max</span><sub class="text-[10px] text-slate-400">w</sub> <span class="text-white font-medium">∑w<sub>i</sub> ∑ ln(1 + μ<sub>i,t</sub>) − λ √(wᵀΣw)</span> <span class="text-brand-muted text-[10px]">s.t.</span> <span class="text-slate-300">∑w<sub>i</sub>=1, w<sub>i</sub> ∈ {0} ∪ [lo, hi]</span>`,
    tagline: "Implementación en C++17 de metaheurísticas evolutivas, meméticas y de trayectorias para optimizar carteras reales del IBEX 35, S&P 100 y S&P 500.",
    abstract: "Implementación en C++17 de diversas metaheurísticas para el problema de optimización de carteras, desarrollada en la asignatura de Metaheurística: algoritmos genéticos generacionales y estacionarios (AGG, AGE), meméticos (AM-All, AM-Rand, AM-Best) y búsquedas de trayectorias (BMB, ILS, Enfriamiento Simulado). Maximiza el beneficio logarítmico penalizado por el riesgo (λ = 500) con límites de peso por activo. Los modelos poblacionales superan a los de trayectorias: AM-Best logra el mejor fitness en S&P 500 y AGG-BLX se queda cerca con menor tiempo de ejecución.",
    businessImpact: "Compara de forma reproducible estrategias de asignación de capital sobre datos reales de mercado. Los límites por activo evitan la concentración excesiva, y optimizar con 2015-2024 para evaluar sobre 2025 mide la robustez de cada cartera fuera de la muestra.",
    metrics: [
      { label: "Fitness S&P 500", value: "-2.765", delta: "AM-Best · vs -3.446 Búsqueda Local" },
      { label: "Algoritmos Core", value: "AGG, AGE, AM", delta: "Implementados en C++17" },
      { label: "Tiempo Cómputo", value: "0.27 s", delta: "10.000 evaluaciones · S&P 500" },
      { label: "Activos en Cartera", value: "457 Activos", delta: "Instancia S&P 500" }
    ],
    pipeline: [
      { step: "01. Estadísticas de Mercado", desc: "Precálculo de beneficios logarítmicos y matrices de covarianza por periodo." },
      { step: "02. Diseño Genético (AGG/AGE)", desc: "Selección por torneo, cruces Aritmético y BLX-0.3, y mutación." },
      { step: "03. Hibridación Memética (AM)", desc: "Búsqueda local cada 10 generaciones en tres variantes: AM-All, AM-Rand y AM-Best." },
      { step: "04. Control de Restricciones", desc: "Reparación de soluciones para que los pesos sumen 1 y cada uno sea 0 o esté en [lo, hi]." },
      { step: "05. Validación Temporal", desc: "50 ejecuciones por algoritmo con 10.000 evaluaciones, optimizando en 2015-2024 y proyectando a 2025." }
    ],
    codeSnippet: {
      lang: "cpp",
      code: `// Extractos de src/portfolioProblem.cpp y src/memetic.cpp
tFitness PortfolioProblem::fitness(const tSolution<double> &solution) const{
    return calculateBenefit(solution) - (lambda * calculateRisk(solution));
}

// Búsqueda local cada 10 generaciones
nGenerations ++;
if (nGenerations % 10 == 0){
    applyLocalSearch(newPopulation, fitnesses, nEvals, maxEvals, problem);
}

// Elitismo: si se ha perdido la mejor solución, sustituye a la peor
auto maxValue = max_element(fitnesses.begin(), fitnesses.end());

if (*maxValue < lastBestFitness){
    auto minValue = min_element(fitnesses.begin(), fitnesses.end());
    size_t worstIdx = distance(fitnesses.begin(), minValue);
    fitnesses[worstIdx] = lastBestFitness;
    newPopulation[worstIdx] = lastBestSol;
}`
    },
    tags: ["C++", "Diseño Algorítmico", "Metaheurísticas", "AGG", "AGE", "AM", "FinTech"]
  },
  {
    id: "np-completitud-p3-particion",
    title: "NP-Completitud del Problema P3-Partición",
    category: "Ciencia de la Computación Teórica",
    badge: "Lógica Formal & NP-Completitud",
    year: "2025",
    githubUrl: "https://github.com/jesurod/NP-Completitud-P3-Particion",
    fallbackGithubUrl: "https://github.com/jesurod/NP-Completitud-P3-Particion",
    lossOrObjective: "P_3\\text{-Partición} \\in \\text{NPC}, \\quad \\text{3-SET} \\le_{\\log} P_3\\text{-Partición}",
    formattedObjective: `<span class="text-white font-mono font-medium">P₃-Partición</span> <span class="text-brand-accent font-bold">∈ NPC</span> <span class="text-brand-muted mx-1">·</span> <span class="text-white font-mono">3-SET</span> <span class="text-brand-accent font-bold">≤<sub>log</sub></span> <span class="text-white font-mono">P₃-Partición</span>`,
    tagline: "Demostración formal de que particionar un grafo en caminos de longitud 2 (P3-Partición) es un problema NP-Completo.",
    abstract: "Demostración matemática formal de la NP-Completitud de la P3-Partición: dado un grafo no dirigido con |V| = 3q, decidir si sus vértices admiten una partición en q caminos de longitud 2. Prueba la pertenencia a NP con un certificado polinómico y un verificador en O(|V| + |E|), y la NP-dificultad mediante una reducción en espacio logarítmico desde 3-SET (Cubrimiento Exacto), usando gadgets de 6 vértices con una propiedad de «Todo o Nada».",
    businessImpact: "Delimita por qué ciertos problemas de agrupación sobre grafos no admiten, salvo que P = NP, algoritmos exactos en tiempo polinomial, lo que justifica recurrir a heurísticas y metaheurísticas.",
    metrics: [
      { label: "Demostración", value: "NP-Completo", delta: "Reducción desde 3-SET" },
      { label: "Espacio Memoria", value: "Espacio L", delta: "O(log n) en la cinta de trabajo" },
      { label: "Verificador", value: "O(|V| + |E|)", delta: "Certificado polinómico" },
      { label: "Formato", value: "LaTeX / PDF", delta: "Grafos y gadgets en TikZ" }
    ],
    pipeline: [
      { step: "01. Definición Formal", desc: "Dado un grafo no dirigido con |V| = 3q, decidir si V admite una partición en q caminos de longitud 2." },
      { step: "02. Verificación en NP", desc: "Certificado de tamaño O(|V|) y verificador determinista en tiempo O(|V| + |E|)." },
      { step: "03. Reducción desde 3-SET", desc: "Cada subconjunto del Cubrimiento Exacto se transforma en un gadget de 6 vértices conectado a los vértices de universo." },
      { step: "04. Propiedad Todo o Nada", desc: "El gadget impide transferencias parciales de vértices, lo que preserva la equivalencia entre instancias." },
      { step: "05. Análisis de Cotas Espaciales", desc: "La transformación solo necesita índices y punteros de O(log n) bits en la cinta de trabajo." }
    ],
    codeSnippet: {
      lang: "latex",
      code: `\\section{Demostración de NP-Completitud: Reducción desde 3-SET}

\\textbf{Vértices (V):}
\\begin{itemize}
    \\item Por cada elemento $x_i \\in X$, se crea un vértice de universo $u_i$.
    \\item Por cada subconjunto $c_j = \\{x_a, x_b, x_c\\} \\in C$, creamos un
          \\textit{gadget} $G_j$ compuesto por 6 vértices internos:
          $A_{j,1}, A_{j,2}, B_{j,1}, B_{j,2}, C_{j,1}, C_{j,2}$.
\\end{itemize}

El número total de vértices es $|V| = 3q + 6m = 3(q + 2m)$,
lo cual cumple la restricción de ser un múltiplo de 3.`
    },
    tags: ["Lógica Formal", "NP-Completitud", "Espacio L", "Teoría de la Complejidad", "LaTeX"]
  },
  {
    id: "mpa-metaheuristics-framework",
    title: "Marine Predators Algorithm (MPA) Framework",
    category: "Metaheurísticas · Algoritmia C++ · Optimización",
    badge: "Bio-Inspirado & Vuelos de Lévy",
    year: "2025 - 2026",
    githubUrl: "https://github.com/jesurod/MPA-Metaheuristics-Framework",
    fallbackGithubUrl: "https://github.com/jesurod/MPA-Metaheuristics-Framework",
    lossOrObjective: "\\mathbf{x}_{i}^{t+1} = \\mathbf{x}_{i}^t + P \\cdot R \\otimes \\textbf{Lévy} \\otimes (\\mathbf{Elite}^t - \\textbf{Lévy} \\otimes \\mathbf{x}_i^t)",
    formattedObjective: `<span class="text-white font-mono font-medium">x<sub>i</sub><sup>t+1</sup></span> <span class="text-slate-300">=</span> <span class="text-white font-mono">x<sub>i</sub><sup>t</sup> + P · R ⊗ Lévy ⊗ (Elite<sup>t</sup> − Lévy ⊗ x<sub>i</sub><sup>t</sup>)</span>`,
    tagline: "Implementación en C++17 del Marine Predators Algorithm y dos variantes propias, evaluadas en carteras reales y en el benchmark CEC 2017.",
    abstract: "Implementación en C++17 del Marine Predators Algorithm (MPA) y de dos variantes propias, desarrollada en la asignatura de Metaheurística: una memética con búsqueda local intensiva (MPA-Mem) y una multimodal con nichos y reinicios cataclísmicos (MPA-Mul). El algoritmo divide la búsqueda en tres fases que combinan movimiento browniano y vuelos de Lévy. Se evalúa en carteras del IBEX 35, S&P 100 y S&P 500 y en las 30 funciones de CEC 2017 en dimensiones 10, 30 y 50, con análisis estadístico mediante Wilcoxon y TacoLab.",
    businessImpact: "MPA-Mul devuelve un conjunto de carteras diversificadas en lugar de una sola, lo que mitiga el riesgo de concentración sin sacrificar fitness. En CEC 2017 supera a PSO y evita el colapso que sufren los meméticos tradicionales en alta dimensión.",
    metrics: [
      { label: "Fitness S&P 500", value: "-2.771", delta: "MPA-Mul · vs -2.874 MPA base" },
      { label: "Tiempo Cómputo", value: "0.34 s", delta: "10.000 evaluaciones · S&P 500" },
      { label: "Variantes Propias", value: "MPA-Mem, MPA-Mul", delta: "Memética y multimodal" },
      { label: "Benchmark", value: "CEC 2017", delta: "30 funciones · D = 10, 30, 50" }
    ],
    pipeline: [
      { step: "01. Inicialización de Presas", desc: "Población inicial evaluada y registro del mejor individuo como Top Predator." },
      { step: "02. Fase 1: Exploración", desc: "Primer tercio de iteraciones: movimiento browniano de las presas hacia el Top Predator." },
      { step: "03. Fase 2: Transición", desc: "Segundo tercio: media población explora con vuelos de Lévy y la otra mitad explota con movimiento browniano." },
      { step: "04. Fase 3: Explotación", desc: "Último tercio: vuelos de Lévy alrededor del Top Predator con paso decreciente." },
      { step: "05. Memoria Marina & FADs", desc: "Conserva las mejores posiciones y aplica el efecto FADs (0.2) para escapar de mínimos locales." }
    ],
    codeSnippet: {
      lang: "cpp",
      code: `// Extractos de src/mpa.cpp
double MPA::getLevyStep() {
    double u = getNormal(0.0, levySigma);
    double v = getNormal(0.0, 1.0);
    if (v == 0.0) v = 1e-10; // Evitar división por cero
    return u / std::pow(std::abs(v), 1.0 / 1.5);
}

// Fase 2: media población con movimiento browniano, la otra con Lévy
if (phaseBehavior == 2) {
    double RB = getNormal(0.0, 1.0);
    stepsize = RB * (RB * topPredatorPos[j] - prey[i][j]);
    prey[i][j] = topPredatorPos[j] + P * CF * stepsize;
}
else if (phaseBehavior == 3) {
    double RL = 0.05 * getLevyStep();
    double R = Random::get<double>(0.0, 1.0);
    stepsize = RL * (topPredatorPos[j] - RL * prey[i][j]);
    prey[i][j] += P * R * stepsize;
}`
    },
    tags: ["C++17", "Metaheurísticas", "MPA", "Vuelos de Lévy", "Optimización Global", "CEC 2017"]
  },
  {
    id: "olist-growth-engine",
    title: "Olist Growth Engine (Predicción de Abandono y Precios)",
    category: "Data Science · Machine Learning · E-commerce",
    badge: "Churn & Pricing Dinámico",
    year: "2026",
    githubUrl: "https://github.com/jesurod/olist-growth-engine",
    fallbackGithubUrl: "https://github.com/jesurod",
    lossOrObjective: "\\hat{p}(x) = \\frac{\\sum_{i \\in N_{250}(x)} y_i \\,/\\, \\|x - x_i\\|_1}{\\sum_{i \\in N_{250}(x)} 1 \\,/\\, \\|x - x_i\\|_1}, \\quad \\hat{p}(x) \\ge 0.82",
    formattedObjective: `<span class="text-emerald-400 font-mono font-medium">p̂(x)</span> <span class="text-slate-300">= ∑<sub>N₂₅₀(x)</sub> y<sub>i</sub> / ‖x − x<sub>i</sub>‖₁ ÷ ∑<sub>N₂₅₀(x)</sub> 1 / ‖x − x<sub>i</sub>‖₁</span> <span class="text-amber-400 font-mono">≥ 0.82</span>`,
    tagline: "Motor predictivo para anticipar el abandono de clientes (churn) en e-commerce y decidir qué descuentos de retención son rentables.",
    abstract: "Sistema de retención predictiva y precios dinámicos sobre el dataset público de e-commerce de Olist. Ingesta los datos en PostgreSQL, construye variables RFM y LTV, y predice el abandono con un KNN (K=250, distancia Manhattan, pesos por distancia). La experimentación detectó y eliminó un data leakage que producía un ROC-AUC falso de 1.00; sin él, los modelos basados en árboles se estancaron en torno a 0.59 y el KNN optimizado alcanzó 0.76. Un panel en Streamlit traduce las probabilidades en decisiones comerciales.",
    businessImpact: "Evalúa si retener a un cliente compensa económicamente, comparando su LTV con el coste del descuento. Tres perfiles corporativos (conservador, balanceado y agresivo) ajustan los límites de LTV y los incentivos, y un simulador de ROI estima el coste de la campaña frente al beneficio neto salvado.",
    metrics: [
      { label: "ROC-AUC Score", value: "0.76", delta: "vs 0.59 XGBoost optimizado" },
      { label: "Modelo Final", value: "KNN", delta: "K=250 · Manhattan · pesos por distancia" },
      { label: "Umbral de Intervención", value: "0.82", delta: "Ajustable en el simulador" },
      { label: "Clientes en Test", value: "18.679", delta: "Partición estratificada" }
    ],
    pipeline: [
      { step: "01. Ingesta en PostgreSQL", desc: "ETL de los CSV de Olist a una base de datos PostgreSQL en Docker." },
      { step: "02. Feature Engineering & RFM", desc: "Variables RFM y LTV, One-Hot Encoding por estado y eliminación de la variable que causaba data leakage." },
      { step: "03. Comparación de Modelos", desc: "Regresión logística (0.54), XGBoost optimizado (0.59) y KNN optimizado (0.76), comparados por ROC-AUC." },
      { step: "04. Pricing Dinámico", desc: "Tres perfiles de riesgo fijan límites de LTV y descuentos para clientes con probabilidad de abandono ≥ 0.82." },
      { step: "05. Dashboard Streamlit", desc: "Simulador de ROI, inferencia individual por cliente y mapa de LTV en riesgo por estado." }
    ],
    codeSnippet: {
      lang: "python",
      code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

# Modelo espacial: las distancias exigen escalar las variables
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Modelo KNN definitivo (K=250, Manhattan, pesos por distancia)
knn_model = KNeighborsClassifier(
    n_neighbors=250,
    weights='distance',
    p=1,
    n_jobs=-1
)
knn_model.fit(X_train_scaled, y_train)

# Umbral de intervención definido por negocio
y_prob = knn_model.predict_proba(X_test_scaled)[:, 1]
y_pred_business = (y_prob >= 0.82).astype(int)`
    },
    tags: ["Python", "PostgreSQL", "Streamlit", "Scikit-learn", "KNN", "XGBoost", "Machine Learning"]
  },
  {
    id: "ekis-graph-social-network",
    title: "EKIS: Base de Datos de Grafos y Red Social",
    category: "Graph Data Science · Neo4j · Arquitectura de Datos",
    badge: "Grafos & Modelado de Datos",
    year: "2025",
    githubUrl: "https://github.com/jesurod/ekis-graph-network",
    fallbackGithubUrl: "https://github.com/jesurod",
    lossOrObjective: "\\mathcal{G} = (\\mathcal{V}, \\mathcal{E}, \\mathcal{P}), \\quad \\text{Centrality}(u) = \\sum_{s \\ne u \\ne t} \\frac{\\sigma_{st}(u)}{\\sigma_{st}}",
    formattedObjective: `<span class="text-white font-mono">G = (V, E, P)</span> <span class="text-brand-muted mx-1">·</span> <span class="text-brand-accent font-mono">Centrality(u)</span> <span class="text-slate-300">= ∑<sub>s≠u≠t</sub> (σ<sub>st</sub>(u) / σ<sub>st</sub>)</span>`,
    tagline: "Modelado e implementación de una red social mediante bases de datos orientadas a grafos con formulación estricta de restricciones.",
    abstract: "Modelado e implementación de una red social mediante bases de datos orientadas a grafos en Neo4j. Formulación estricta de restricciones, relaciones y consultas complejas sobre entidades interconectadas. Documentación formal en LaTeX justificando el diseño conceptual, las propiedades ontológicas y los algoritmos de caminos mínimos y comunidades.",
    businessImpact: "Evita los JOIN encadenados de un modelo relacional al consultar relaciones entre entidades, lo que simplifica las recomendaciones de contenido y la detección de comunidades.",
    metrics: [
      { label: "Base de Datos", value: "Neo4j", delta: "Orientada a grafos" },
      { label: "Lenguaje", value: "Cypher", delta: "Consultas y restricciones" },
      { label: "Modelo", value: "LPG", delta: "Labeled Property Graph" },
      { label: "Documentación", value: "LaTeX", delta: "Justificación formal del diseño" }
    ],
    pipeline: [
      { step: "01. Modelado Conceptual", desc: "Definición ontológica estricta de esquemas LPG (Labeled Property Graphs)." },
      { step: "02. Ingesta con Cypher", desc: "Diseño de restricciones de unicidad, existencia e índices." },
      { step: "03. Consultas Complejas", desc: "Construcción de patrones de emparejamiento para detección de comunidades." },
      { step: "04. Algoritmia de Centralidad", desc: "Evaluación de métricas de intermediación y PageRank personalizado." },
      { step: "05. Documento Formal", desc: "Justificación teórica y empírica en LaTeX." }
    ],
    codeSnippet: {
      lang: "cypher",
      code: `// Consulta Cypher: Detección de influencers comunitarios y caminos de propagación
MATCH (u:User)-[:INTERACTED_WITH*1..3]->(target:User)
WHERE u.community_id = target.community_id
WITH target, count(DISTINCT u) AS reach_score
ORDER BY reach_score DESC
LIMIT 10
RETURN target.username, reach_score, target.reputation;`
    },
    tags: ["Neo4j", "Cypher", "Graph Data Science", "LaTeX", "Bases de Datos"]
  },
  {
    id: "ml-predictive-modeling-practices",
    title: "Prácticas de Machine Learning y Modelado Predictivo",
    category: "Machine Learning · Modelado Estadístico",
    badge: "Supervised Learning & EDA",
    year: "2025 - 2026",
    githubUrl: "https://github.com/jesurod/ml-predictive-modeling",
    fallbackGithubUrl: "https://github.com/jesurod",
    lossOrObjective: "\\mathcal{L}(\\theta) = \\frac{1}{N} \\sum_{i=1}^N \\ell(y_i, f(x_i; \\theta)) + \\Omega(\\theta)",
    formattedObjective: `<span class="text-emerald-400 font-mono font-medium">L(θ)</span> <span class="text-slate-300">= 1/N ∑<sub>i=1</sub><sup>N</sup> ℓ(y<sub>i</sub>, f(x<sub>i</sub>; θ)) + Ω(θ)</span>`,
    tagline: "Desarrollo y entrenamiento de múltiples modelos de machine learning en diversos conjuntos de datos para clasificación y regresión.",
    abstract: "Desarrollo y entrenamiento de múltiples modelos de machine learning en diversos conjuntos de datos para resolver problemas de clasificación y regresión. Implementación de pipelines de datos completos, incluyendo limpieza de datos, ingeniería de características (feature engineering) y análisis exploratorio de datos (EDA) para preparar los conjuntos de entrenamiento y optimizar la generalización fuera de muestra.",
    businessImpact: "Establece metodologías rigurosas de validación cruzada y preprocesamiento robusto que evitan la fuga de datos (data leakage) y aseguran la reproducibilidad de inferencia estadística.",
    metrics: [
      { label: "Problemas", value: "Clasificación y Regresión", delta: "Aprendizaje supervisado" },
      { label: "Pipelines", value: "End-to-End", delta: "Limpieza, EDA y modelado" },
      { label: "Librerías Core", value: "Scikit-Learn, Pandas", delta: "Ecosistema Python" },
      { label: "Generalización", value: "Validación Cruzada", delta: "Fuera de muestra" }
    ],
    pipeline: [
      { step: "01. Ingesta & Limpieza", desc: "Tratamiento de valores nulos, codificación de variables categóricas y normalización." },
      { step: "02. Análisis Exploratorio (EDA)", desc: "Estudio de correlaciones, distribuciones multivariables y detección de outliers." },
      { step: "03. Feature Engineering", desc: "Generación de interacciones y transformaciones para aumentar la señal explicativa." },
      { step: "04. Entrenamiento Comparativo", desc: "Evaluación de modelos lineales, árboles de decisión y ensembles." },
      { step: "05. Métricas de Evaluación", desc: "Curvas ROC, matrices de confusión y métricas de error cuadrático." }
    ],
    codeSnippet: {
      lang: "python",
      code: `import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier

# Pipeline modular de preprocesamiento y entrenamiento
cv_strat = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv_strat, scoring='roc_auc')
print(f"ROC-AUC CV Media: {scores.mean():.4f} (+/- {scores.std():.4f})")`
    },
    tags: ["Python", "Scikit-learn", "Pandas", "NumPy", "EDA", "Machine Learning"]
  },
  {
    id: "systems-monitoring-observability",
    title: "Monitorización de Sistemas y Observabilidad",
    category: "Infraestructura & DevOps",
    badge: "Prometheus, Grafana & Linux",
    year: "2025",
    githubUrl: "https://github.com/jesurod/systems-monitoring",
    fallbackGithubUrl: "https://github.com/jesurod",
    lossOrObjective: "\\text{SLI} = \\frac{\\sum \\text{Requests}_{\\text{good}}}{\\sum \\text{Requests}_{\\text{total}}}",
    formattedObjective: `<span class="text-brand-accent font-mono font-medium">SLI</span> <span class="text-slate-300">= ∑ Req<sub>good</sub> / ∑ Req<sub>total</sub></span>`,
    tagline: "Configuración de pipelines de observabilidad con Prometheus y Grafana y automatización Bash en Linux.",
    abstract: "Configuración de pipelines de observabilidad utilizando Prometheus y Grafana para rastrear y visualizar métricas de infraestructura en tiempo real. Desarrollo de scripts de Bash automatizados en entornos Linux avanzados (Arch Linux, Ubuntu) para optimizar la eficiencia del flujo de trabajo, monitorizar cargas de trabajo y mantener la fiabilidad de la infraestructura de datos.",
    businessImpact: "Da visibilidad sobre el estado de los servicios de datos y permite detectar antes los cuellos de botella de memoria y CPU, lo que ayuda a mantener la fiabilidad de la infraestructura.",
    metrics: [
      { label: "Métricas en Tiempo Real", value: "Prometheus", delta: "Series temporales" },
      { label: "Dashboards", value: "Grafana", delta: "Visualización técnica" },
      { label: "Automatización", value: "Bash Scripts", delta: "Linux Arch / Ubuntu" },
      { label: "Objetivo", value: "Fiabilidad", delta: "Infraestructura de datos" }
    ],
    pipeline: [
      { step: "01. Exportadores de Métricas", desc: "Configuración de Node Exporter y métricas de aplicaciones de datos." },
      { step: "02. Ingesta Prometheus", desc: "Definición de intervalos de scraping y reglas de agregación de series." },
      { step: "03. Dashboards Grafana", desc: "Diseño de paneles de control con visibilidad de saturación, latencia y errores." },
      { step: "04. Scripts Bash", desc: "Automatización de mantenimiento, backups y monitorización de procesos en UNIX." }
    ],
    codeSnippet: {
      lang: "bash",
      code: `#!/usr/bin/env bash
# Script automatizado de telemetría y salud de servicios en Linux
set -euo pipefail

METRIC_FILE="/tmp/node_custom_metrics.prom"
LOAD_AVG=$(awk '{print $1}' /proc/loadavg)
MEM_FREE=$(awk '/MemAvailable/ {print $2}' /proc/meminfo)

cat <<EOF > "$METRIC_FILE"
system_custom_load_average $LOAD_AVG
system_custom_memory_available_kb $MEM_FREE
EOF`
    },
    tags: ["Prometheus", "Grafana", "Linux", "Arch Linux", "Ubuntu", "Bash", "DevOps"]
  }
];
