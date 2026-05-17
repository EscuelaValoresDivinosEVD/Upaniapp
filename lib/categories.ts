export interface Category {
  name: string
  slug: string
  group: string
}

export const CATEGORY_GROUPS = ['Mirada Interna', 'Tiempo Presente', 'Efemérides'] as const

export const CATEGORIES: Category[] = [
  { name: 'Editorial del Mes', slug: 'editorial', group: 'Mirada Interna' },
  { name: 'Voces del Gurú', slug: 'voces-del-guru', group: 'Mirada Interna' },
  { name: 'Expedientes E.T.', slug: 'expedientes-e-t', group: 'Mirada Interna' },
  { name: 'Punctum', slug: 'punctum', group: 'Mirada Interna' },
  { name: 'Autores Universales', slug: 'autores-universales', group: 'Tiempo Presente' },
  { name: 'Bienestar', slug: 'bienestar', group: 'Tiempo Presente' },
  { name: 'Cine Consciente', slug: 'cine-consciente', group: 'Tiempo Presente' },
  { name: 'Consciencia', slug: 'consciencia', group: 'Tiempo Presente' },
  { name: 'Cuestionario Upaninews', slug: 'cuestionario-upaninews', group: 'Tiempo Presente' },
  { name: 'Espiritualidad', slug: 'espiritualidad', group: 'Tiempo Presente' },
  { name: 'Figura Védica', slug: 'figura-vedica', group: 'Tiempo Presente' },
  { name: 'La Frase', slug: 'la-frase', group: 'Tiempo Presente' },
  { name: 'Música Sana', slug: 'musica-sana', group: 'Tiempo Presente' },
  { name: 'Piedras y Cristales', slug: 'piedras-y-cristales', group: 'Tiempo Presente' },
  { name: 'SATTvores', slug: 'sattvores', group: 'Tiempo Presente' },
  { name: 'Símbolos', slug: 'simbolos', group: 'Tiempo Presente' },
  { name: 'Enero', slug: 'enero', group: 'Efemérides' },
  { name: 'Febrero', slug: 'febrero', group: 'Efemérides' },
  { name: 'Marzo', slug: 'marzo', group: 'Efemérides' },
  { name: 'Abril', slug: 'abril', group: 'Efemérides' },
  { name: 'Mayo', slug: 'mayo', group: 'Efemérides' },
  { name: 'Junio', slug: 'junio', group: 'Efemérides' },
  { name: 'Julio', slug: 'julio', group: 'Efemérides' },
  { name: 'Agosto', slug: 'agosto', group: 'Efemérides' },
  { name: 'Septiembre', slug: 'septiembre', group: 'Efemérides' },
  { name: 'Octubre', slug: 'octubre', group: 'Efemérides' },
  { name: 'Noviembre', slug: 'noviembre', group: 'Efemérides' },
  { name: 'Diciembre', slug: 'diciembre', group: 'Efemérides' },
]

export function categoryNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function slugToCategoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug
}
