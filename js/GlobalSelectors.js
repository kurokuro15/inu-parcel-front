// Acá estarán ubicados selectores para usar globalmente y funciones que requieren del dom

// Selectors
export const container = document.querySelector('div.container')

// Functions
export const createElement = (element) => globalThis.document.createElement(element)
