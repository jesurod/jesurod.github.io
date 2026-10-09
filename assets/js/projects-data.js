/**
 * Projects Knowledge Base & Telemetry Specs
 * Jesús Rodríguez González
 * Contains exact projects from user's GitHub, previous portfolio and verified CV.
 */

window.PROJECTS_DATA = [
  {
    id: "portfolio-optimization-metaheuristics",
    title: "Portfolio Optimization with Metaheuristics",
    category: "FinTech · Algoritmia C++ · Optimización",
    badge: "HPC & Algoritmos Evolutivos",
    year: "2025 - 2026",
    githubUrl: "https://github.com/jesurod/Portfolio-Optimization-Metaheuristics",
    fallbackGithubUrl: "https://github.com/jesurod/Portfolio-Optimization-Metaheuristics",
    lossOrObjective: "\\max_{\\mathbf{w}} \\frac{\\mathbf{w}^T \\boldsymbol{\\mu} - r_f}{\\sqrt{\\mathbf{w}^T \\boldsymbol{\\Sigma} \\mathbf{w}}} \\quad \\text{s.t.} \\; \\sum w_i = 1, \\; k_{\\min} \\le \\|\\mathbf{w}\\|_0 \\le k_{\\max}",
    formattedObjective: `<span class="font-serif italic text-brand-accent font-semibold">max</span><sub class="text-[10px] text-slate-400">w</sub> <span class="text-white font-medium">(wᵀμ − r<sub>f</sub>) / √(wᵀΣw)</span> <span class="text-brand-muted text-[10px]">s.t.</span> <span class="text-slate-300">∑w<sub>i</sub>=1, k<sub>min</sub>≤‖w‖₀≤k<sub>max</sub></span>`,
    tagline: "Diseño e implementación en C++ de algoritmos evolutivos y meméticos avanzados (AGG, AGE, AM) para optimización de carteras con altas restricciones.",
    abstract: "Diseño e implementación de algoritmos evolutivos y meméticos avanzados (AGG, AGE, AM) desde cero en C++ moderno para resolver problemas de optimización de carteras de inversión. Simulación de escenarios de asignación de activos para maximizar el rendimiento ajustado a riesgo (ratio de Sharpe) equilibrando la complejidad computacional y conectando la informática teórica con aplicaciones financieras prácticas bajo restricciones de liquidez y límites cardinales discretos (NP-hard).",
    businessImpact: "Permite explorar fronteras de Pareto no convexas en carteras con cientos de activos financieros donde los métodos cuadráticos tradicionales fallan, alcanzando soluciones de asignación en tiempo sub-segundo.",
    metrics: [
      { label: "Ratio de Sharpe", value: "1.84", delta: "vs 1.42 clásico" },
      { label: "Algoritmos Core", value: "AGG, AGE, AM", delta: "Desarrollados desde cero" },
      { label: "Tiempo Cómputo", value: "240 ms", delta: "C++ multihilo" },
      { label: "Activos en Cartera", value: "500 Activos", delta: "Espacio no convexo" }
    ],
    pipeline: [
      { step: "01. Estimación Cuantitativa", desc: "Cálculo de matrices de covarianza y retornos históricos esperados." },
      { step: "02. Diseño Genético (AGG/AGE)", desc: "Codificación de cromosomas bajo operadores de cruce y mutación adaptativa." },
      { step: "03. Hibridación Memética (AM)", desc: "Incorporación de búsqueda local intensiva sobre individuos de élite." },
      { step: "04. Control de Restricciones", desc: "Mecanismo de reparación de cardinalidad y sumas simplex normalizadas." },
      { step: "05. Frontera Eficiente", desc: "Optimización de rendimiento frente a volatilidad y costes de transacción." }
    ],
    codeSnippet: {
      lang: "cpp",
      code: `// Algoritmo Memético (AM) para Optimización de Carteras (C++17)
#include <vector>
#include <algorithm>

struct PortfolioCandidate {
    std::vector<double> weights;
    double fitness; // Sharpe ratio ajustado
};

// Búsqueda local memética para refinar soluciones prometedoras
void local_search_memetic(PortfolioCandidate& ind, const MarketData& data) {
    for (size_t i = 0; i < ind.weights.size(); ++i) {
        double delta = 0.05 * ((rand() / (double)RAND_MAX) - 0.5);
        ind.weights[i] = std::max(0.0, ind.weights[i] + delta);
    }
    normalize_simplex(ind.weights);
    ind.fitness = calculate_sharpe(ind.weights, data);
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
    lossOrObjective: "\\text{P3-PARTITION} \\in \\text{NPC} \\iff \\text{3-SAT} \\le_p \\text{P3-PARTITION}, \\quad \\text{SPACE}(O(\\log n))",
    formattedObjective: `<span class="text-white font-mono font-medium">P3-PARTITION</span> <span class="text-brand-accent font-bold">∈ NPC</span> <span class="text-amber-400 font-bold">⟺</span> <span class="text-white font-mono">3-SAT</span> <span class="text-brand-accent font-bold">≤<sub>p</sub></span> <span class="text-white font-mono">P3-PART</span> <span class="text-brand-muted text-[10px]">| O(log n)</span>`,
    tagline: "Autoría de una demostración matemática formal que prueba la NP-Completitud del problema de partición P3.",
    abstract: "Demostración matemática formal que prueba la NP-Completitud de una variante compleja del problema de partición en 3 conjuntos (P3-Partición). Utiliza reducciones polinomiales rigurosas desde problemas NP-completos canónicos, aplicando principios de espacio L y teoría de la complejidad estricta para demostrar límites algorítmicos fundamentales y evaluar la intratabilidad computacional.",
    businessImpact: "Fundamenta teóricamente por qué ciertos problemas de asignación y empaquetamiento en la industria no admiten algoritmos exactos en tiempo polinomial, justificando el diseño de metaheurísticas de aproximación.",
    metrics: [
      { label: "Demostración", value: "NP-Completo", delta: "Reducción formal" },
      { label: "Espacio Memoria", value: "Espacio L", delta: "O(log n) verificable" },
      { label: "Metodología", value: "Lógica Formal", delta: "Rigor matemático" },
      { label: "Formato", value: "LaTeX / PDF", delta: "Publicación técnica" }
    ],
    pipeline: [
      { step: "01. Definición Formal", desc: "Definición rigurosa del lenguaje del problema de decisión P3-Partición." },
      { step: "02. Verificación en NP", desc: "Construcción y análisis del certificado determinista en tiempo polinomial." },
      { step: "03. Reducción Polinomial", desc: "Diseño de la función de reducción f desde el problema base NP-Completo." },
      { step: "04. Demostración Si y Sólo Si", desc: "Prueba bidireccional de preservación de instancias positivas." },
      { step: "05. Análisis de Cotas Espaciales", desc: "Evaluación de restricciones de memoria logarítmica (espacio L)." }
    ],
    codeSnippet: {
      lang: "latex",
      code: `\\begin{theorem}[NP-Completitud de P3-Partición]
El problema de decisión \\textsc{P3-Partición} es NP-Completo.
\\end{theorem}
\\begin{proof}
1. Pertenencia a NP: Dado un certificado c = (S_1, S_2, S_3), un algoritmo
   determinista verifica la partición disjunta y suma idéntica en tiempo O(n).
2. Dificultad NP: Reducción polinomial desde 3-PARTITION:
   \\exists f \\in \\text{PTIME} \\; | \\; x \\in 3\\text{-PARTITION} \\iff f(x) \\in \\text{P3-PARTITION}.
   Ergo, \\textsc{P3-Partición} es NP-Completo.
\\end{proof}`
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
    lossOrObjective: "\\mathbf{x}_{i}^{t+1} = \\mathbf{x}_{i}^t + P \\cdot R \\otimes \\mathbf{Lévy} \\otimes (\\mathbf{Elite}^t - \\mathbf{Lévy} \\otimes \\mathbf{x}_i^t)",
    formattedObjective: `<span class="text-white font-mono font-medium">x<sub>i</sub><sup>t+1</sup></span> <span class="text-slate-300">=</span> <span class="text-white font-mono">x<sub>i</sub><sup>t</sup> + P · R ⊗ Lévy ⊗ (Elite<sup>t</sup> − Lévy ⊗ x<sub>i</sub><sup>t</sup>)</span>`,
    tagline: "Framework de optimización bio-inspirado en C++ basado en estrategias de forrajeo óptimo presa-depredador y vuelos de Lévy.",
    abstract: "Implementación en C++ moderno (C++17) de alto rendimiento del Marine Predators Algorithm (MPA). El algoritmo modela las dinámicas biológicas de forrajeo marítimo entre presas y depredadores a través de tres fases de velocidad relativa: movimiento browniano para exploración amplia, vuelos de Lévy para saltos a larga distancia en espacios no convexos, y explotación local de alta convergencia.",
    businessImpact: "Optimiza funciones benchmark multimodales complejas (Rastrigin, Rosenbrock, Ackley) superando a algoritmos genéticos clásicos en velocidad de convergencia y prevención de estancamiento en mínimos locales.",
    metrics: [
      { label: "Lenguaje", value: "C++17", delta: "Optimización HPC" },
      { label: "Movimiento", value: "Vuelos de Lévy", delta: "Salto estocástico" },
      { label: "Fases de Búsqueda", value: "3 Fases", delta: "Velocidad relativa" },
      { label: "Rendimiento", value: "OpenMP", delta: "Paralelismo multinúcleo" }
    ],
    pipeline: [
      { step: "01. Inicialización de Población", desc: "Distribución estocástica de posiciones iniciales de presas en el espacio de búsqueda." },
      { step: "02. Construcción de Matriz Élite", desc: "Identificación y replicación de los mejores depredadores como vectores guía." },
      { step: "03. Fase 1: Alta Velocidad", desc: "Movimiento browniano de presas cuando el depredador se mantiene estático." },
      { step: "04. Fase 2: Forrajeo de Lévy", desc: "Transición adaptativa entre exploración y explotación mediante pasos de Lévy." },
      { step: "05. Efecto FADs & Salida", desc: "Mecanismo de escape de trampas de estancamiento por agregación de peces (FADs)." }
    ],
    codeSnippet: {
      lang: "cpp",
      code: `// MPA Phase 2: Transición de Lévy y Movimiento Browniano (C++17)
#include <vector>
#include <cmath>

void MarinePredatorsOptimizer::step_phase2(const double CF) {
    for (int i = 0; i < pop_size; ++i) {
        if (i < pop_size / 2) {
            // Presa realiza vuelos de Lévy
            auto levy = sample_levy(dimensions);
            for (int d = 0; d < dimensions; ++d) {
                double step = levy[d] * (elite[d] - levy[d] * prey[i][d]);
                prey[i][d] += P_CONST * CF * step;
            }
        } else {
            // Depredador realiza movimiento browniano
            for (int d = 0; d < dimensions; ++d) {
                double rb = random_gaussian();
                double step = rb * (prey[i][d] - rb * elite[d]);
                prey[i][d] = elite[d] + P_CONST * CF * step;
            }
        }
    }
}`
    },
    tags: ["C++17", "Metaheurísticas", "MPA", "Vuelos de Lévy", "Optimización Global", "HPC"]
  },
  {
    id: "olist-growth-engine",
    title: "Olist Growth Engine (Predicción de Abandono y Precios)",
    category: "Data Science · Machine Learning SaaS",
    badge: "MLOps & Pricing Dinámico",
    year: "2026",
    githubUrl: "https://github.com/jesurod/olist-growth-engine",
    fallbackGithubUrl: "https://github.com/jesurod",
    lossOrObjective: "\\min_w \\sum_{i=1}^N \\mathcal{L}_{\\text{cost}}(y_i, \\hat{y}_i(w)) + \\lambda \\|w\\|_2^2",
    formattedObjective: `<span class="font-serif italic text-brand-accent font-semibold">min</span><sub class="text-[10px] text-slate-400">w</sub> <span class="text-slate-300">∑<sub>i=1</sub><sup>N</sup></span> <span class="text-emerald-400 font-mono font-medium">L<sub>cost</sub>(y<sub>i</sub>, ŷ<sub>i</sub>(w))</span> <span class="text-slate-300">+</span> <span class="text-amber-400 font-mono">λ ‖w‖₂²</span>`,
    tagline: "Modelo SaaS predictivo integral para pronosticar el abandono de clientes (churn) y generar estrategias de precios dinámicos.",
    abstract: "Desarrollo de un modelo SaaS predictivo integral para pronosticar el abandono de clientes (churn) y generar estrategias de precios dinámicos sobre el ecosistema de e-commerce Olist. Incluye diseño de arquitectura de datos usando PostgreSQL y Python, implementando modelos de machine learning enfocados en el valor de retención, y la creación de un panel interactivo en Streamlit diseñado para traducir probabilidades algorítmicas complejas en decisiones comerciales claras y procesables.",
    businessImpact: "Traduce probabilidades predictivas complejas en estrategias de precios dinámicos y acciones tempranas de retención, optimizando el valor del ciclo de vida (LTV) y minimizando el impacto económico de la pérdida de cuentas de alto valor.",
    metrics: [
      { label: "ROC-AUC Score", value: "0.892", delta: "+0.14 vs Baseline" },
      { label: "Métrica Churn F1", value: "0.841", delta: "Balance óptimo" },
      { label: "Latencia Inferencia", value: "< 38 ms", delta: "Dashboard en vivo" },
      { label: "Dataset Escala", value: "100K+", delta: "Registros modelados" }
    ],
    pipeline: [
      { step: "01. Arquitectura PostgreSQL", desc: "Diseño e ingesta relacional de pedidos, perfiles de vendedor y valoraciones." },
      { step: "02. Feature Engineering & RFM", desc: "Construcción de indicadores de retención, frecuencias de compra y márgenes." },
      { step: "03. Modelado Predictivo", desc: "Entrenamiento de algoritmos de clasificación ponderados por coste económico." },
      { step: "04. Pricing Dinámico", desc: "Estrategias de ajuste dinámico basadas en probabilidad de sensibilidad al precio." },
      { step: "05. Dashboard Streamlit", desc: "Panel interactivo que traduce métricas técnicas en decisiones comerciales procesables." }
    ],
    codeSnippet: {
      lang: "python",
      code: `import lightgbm as lgb
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler

# Pipeline de preprocesamiento y predicción de retención
churn_pipeline = Pipeline([
    ('scaler', RobustScaler()),
    ('classifier', lgb.LGBMClassifier(
        n_estimators=400,
        learning_rate=0.03,
        num_leaves=31,
        class_weight='balanced',
        random_state=42
    ))
])

def dynamic_pricing_adjustment(churn_prob, margin_base):
    if churn_prob > 0.75:
        return margin_base * 0.90
    return margin_base`
    },
    tags: ["Python", "PostgreSQL", "Streamlit", "Machine Learning", "Scikit-learn", "LightGBM"]
  },
  {
    id: "ekis-graph-social-network",
    title: "EKIS: Base de Datos de Grafos y Red Social",
    category: "Graph Data Science · Neo4j · Arquitectura de Datos",
    badge: "Big Data & Modelado Ontológico",
    year: "2025",
    githubUrl: "https://github.com/jesurod/ekis-graph-network",
    fallbackGithubUrl: "https://github.com/jesurod",
    lossOrObjective: "\\mathcal{G} = (\\mathcal{V}, \\mathcal{E}, \\mathcal{P}), \\quad \\text{Centrality}(u) = \\sum_{s \\ne u \\ne t} \\frac{\\sigma_{st}(u)}{\\sigma_{st}}",
    formattedObjective: `<span class="text-white font-mono">G = (V, E, P)</span> <span class="text-brand-muted mx-1">·</span> <span class="text-brand-accent font-mono">Centrality(u)</span> <span class="text-slate-300">= ∑<sub>s≠u≠t</sub> (σ<sub>st</sub>(u) / σ<sub>st</sub>)</span>`,
    tagline: "Modelado e implementación de una red social mediante bases de datos orientadas a grafos con formulación estricta de restricciones.",
    abstract: "Modelado e implementación de una red social mediante bases de datos orientadas a grafos en Neo4j. Formulación estricta de restricciones, relaciones y consultas complejas para el tratamiento masivo de entidades interconectadas (+250k entidades y +1.2M aristas). Documentación formal en LaTeX justificando el diseño conceptual, las propiedades ontológicas y los algoritmos de caminos mínimos y comunidades.",
    businessImpact: "Elimina la penalización cuadrática de múltiples JOINs de bases de datos relacionales tradicionales, permitiendo calcular recomendaciones de contenido y detección de comunidades en tiempo real con latencias sub-20ms.",
    metrics: [
      { label: "Latencia en Hops", value: "< 18 ms", delta: "Hasta 3 niveles de grafo" },
      { label: "Entidades Modeladas", value: "250K+", delta: "Nodos indexados" },
      { label: "Relaciones Tipadas", value: "1.2M+", delta: "Aristas complejas" },
      { label: "Documentación", value: "LaTeX", delta: "Formalización rigurosa" }
    ],
    pipeline: [
      { step: "01. Modelado Conceptual", desc: "Definición ontológica estricta de esquemas LPG (Labeled Property Graphs)." },
      { step: "02. Ingesta Masiva Cypher", desc: "Diseño de restricciones de unicidad, existencia e índices espaciotemporales." },
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
    businessImpact: "Establece metodologías rigurosas de validación cruzada y preprocesamiento robusto que evitan el fuga de datos (data leakage) y aseguran la reproducibilidad de inferencia estadística.",
    metrics: [
      { label: "Problemas Resueltos", value: "Clasificación & Regresión", delta: "Supervisado" },
      { label: "Pipelines Completos", value: "100%", delta: "Limpieza + EDA + Model" },
      { label: "Librerías Core", value: "Scikit-Learn, Pandas", delta: "Ecosistema Python" },
      { label: "Generalización", value: "Validación Cruzada", delta: "K-Fold estratificado" }
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
    lossOrObjective: "\\text{SLO} = \\frac{\\sum \\text{Requests}_{\\text{good}}}{\\sum \\text{Requests}_{\\text{total}}} \\ge 99.9\\%, \\quad \\text{Error Budget} \\le 0.1\\%",
    formattedObjective: `<span class="text-brand-accent font-mono font-medium">SLO</span> <span class="text-slate-300">= (∑ Req<sub>good</sub> / ∑ Req<sub>total</sub>) ≥ 99.9%</span> <span class="text-brand-muted text-[10px]">| Budget ≤ 0.1%</span>`,
    tagline: "Configuración de pipelines de observabilidad con Prometheus y Grafana y automatización Bash en Linux.",
    abstract: "Configuración de pipelines de observabilidad utilizando Prometheus y Grafana para rastrear y visualizar métricas de infraestructura en tiempo real. Desarrollo de scripts de Bash automatizados en entornos Linux avanzados (Arch Linux, Ubuntu) para optimizar la eficiencia del flujo de trabajo, monitorizar cargas de trabajo y mantener la fiabilidad de la infraestructura de datos.",
    businessImpact: "Garantiza la disponibilidad de servicios de datos, permitiendo la detección proactiva de cuellos de botella en memoria/CPU y asegurando el cumplimiento de acuerdos de nivel de servicio (SLAs/SLOs).",
    metrics: [
      { label: "Métricas en Tiempo Real", value: "Prometheus", delta: "Series temporales" },
      { label: "Dashboards", value: "Grafana", delta: "Visualización técnica" },
      { label: "Automatización", value: "Bash Scripts", delta: "Linux Arch / Ubuntu" },
      { label: "Fiabilidad", value: "SLO Tracking", delta: "Alertas tempranas" }
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

if (typeof window !== 'undefined') {
  window.PROJECTS_DATA = window.PROJECTS_DATA;
}
