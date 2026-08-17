# NachUI

[English](./README.md) | [Español]

### Componentes de sistema de diseño que realmente te pertenecen, y que tu IA puede leer.

**NachUI** es un conjunto de componentes de UI **copy-paste y sin dependencias**, construido con **React**, **Next.js**, **Tailwind** y **Motion**. Ofrece una base de código de alta propiedad y fácil mantenimiento, en lugar de librerías externas infladas.

También está escrito para el agente que tengas abierto al lado. Nada queda compilado, así que un asistente de código trabaja sobre el mismo código plano que vos, y la documentación se publica en un formato que puede leer de verdad.

## La Visión

El desarrollo estándar suele sacrificar la propiedad del código por la velocidad. **NachUI** ofrece ambos mundos:

- **Propiedad total del código**: Sin bloqueos por `node_modules`. Eres el dueño del código fuente de las primitivas.
- **Sin wrappers de paquetes**: Diseñado con **Tailwind CSS v4** y animado con **Framer Motion** sin sobrecarga de dependencias en tiempo de ejecución.
- **Estrategia sin exceso**: Cada componente es independiente, legible y está listo para ser modificado.
- **Legible para la IA por diseño**: Archivos fuente locales, un índice `llms.txt`, documentación en markdown crudo y skills instalables para agentes. No hay ninguna caja negra que un asistente tenga que adivinar.

## Stack Tecnológico

Este monorepo utiliza herramientas modernas para garantizar la escalabilidad y la eficiencia en el desarrollo.

| Tecnología             | Propósito                                                         | Razón                                                                         |
| :--------------------- | :---------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Espacio de Trabajo** | [Turbo](https://turbo.build/) + [pnpm](https://pnpm.io/)          | Ejecución rápida y almacenamiento en caché compartido eficiente.              |
| **Motor Principal**    | [Next.js 16](https://nextjs.org/)                                 | Patrones avanzados de React 19 con soporte total para App Router y RSC.       |
| **Capa Visual**        | [Tailwind CSS v4](https://tailwindcss.com/)                       | Arquitectura de variables CSS puras sin sobrecarga en tiempo de ejecución.    |
| **Contenido**          | [Velite](https://velite.js.org/)                                  | Transformación de contenido con seguridad de tipos para un esquema unificado. |
| **Integración de IA**  | [Google Gemini 2.5](https://deepmind.google/technologies/gemini/) | Razonamiento contextual a través del [Vercel AI SDK](https://sdk.vercel.ai/). |
| **Movimiento**         | [Framer Motion](https://www.framer.com/motion/)                   | Interacciones basadas en física.                                              |

## Estructura del Repositorio

El proyecto está estructurado como un **monorepo de Turborepo** con límites arquitectónicos claros:

### Aplicaciones

- **[apps/docs](apps/docs)**: El Portal de Documentación. Con previsualizaciones de componentes en tiempo real y un asistente de IA.

### Lógica Central y Paquetes

- **[packages/ui](packages/ui)**: La Capa de Primitivas. Componentes React de alta fidelidad estilizados con los últimos estándares de Tailwind v4.
- **[packages/ai](packages/ai)**: El Asistente de IA. Orquesta las interacciones con LLMs y proporciona respuestas contextuales.
- **[packages/typescript-config](packages/typescript-config)** y **[packages/eslint-config](packages/eslint-config)**: Ajustes predeterminados de modo estricto unificados y cumplimiento de estilo en todo el espacio de trabajo.

## Documentación Asistida por IA

NachUI incluye un **asistente potenciado por Gemini**. Construido con el Vercel AI SDK, ofrece orientación contextual, proporcionando una experiencia de programación en pareja centrada en los patrones arquitectónicos de NachUI y la personalización de componentes.

## También hecho para agentes de IA

La documentación no es solo un sitio web. Cada página también se sirve en un formato que tu propio agente puede leer:

| Recurso                                               | Qué le da a un agente                                                  |
| :---------------------------------------------------- | :--------------------------------------------------------------------- |
| [`/llms.txt`](https://nachui.tech/llms.txt)           | Un índice de todas las páginas publicadas, cada una con su markdown.   |
| `/{locale}/docs/**.md`                                | La fuente en markdown de una página. Agregá `.md` a cualquier URL.     |
| [`/api/docs`](https://nachui.tech/api/docs)           | El mismo catálogo en JSON, por si querés armar tu propio índice.       |
| [Skills](https://nachui.tech/es/docs/concepts/skills) | Instrucciones instalables que le enseñan las convenciones a un agente. |

Solo tenés que apuntar Claude Code, Cursor o Windsurf al índice una vez. La [guía de llms.txt](https://nachui.tech/es/docs/concepts/llms-txt) tiene la configuración de cada herramienta.

## Inicio Rápido

Asegúrate de tener [pnpm](https://pnpm.io/) instalado:

```bash
# Inicializar el espacio de trabajo
pnpm install

# Iniciar el entorno de desarrollo unificado
pnpm dev

# Generar los paquetes listos para producción
pnpm build
```

## Desarrollado por Ignacio Figueroa

Si NachUI acelera tu flujo de trabajo, considera apoyar el proyecto con una ⭐ en GitHub.
