import type { ParsedProject, RequiredField } from '../types'
import { REQUIRED_FIELDS } from '../types'

export function parseNaturalLanguage(input: string): ParsedProject {
  const text = input.trim()
  const result: ParsedProject = {}

  const priceMatch = text.match(/(\d+(?:\.\d+)?)\s*元/)
  if (priceMatch) {
    result.price = parseFloat(priceMatch[1])
  }

  const titlePatterns = [
    /(?:做|设计|制作)(?:一个|一套|一张)?(.{2,20}?)(?:，|,|，?\d)/,
    /(.{2,20}?)(?:海报|logo|包装|banner|主图|详情页)/i,
  ]
  for (const re of titlePatterns) {
    const m = text.match(re)
    if (m && m[1]) {
      result.title = m[1].trim()
      break
    }
  }
  if (!result.title && text.length <= 30) {
    const withoutPrice = text.replace(/\d+\s*元/g, '').replace(/[，,]/g, '').trim()
    if (withoutPrice) result.title = withoutPrice
  }

  const dayMatch = text.match(/(\d+)\s*天(?:内)?(?:交付|完成)?/)
  if (dayMatch) {
    result.deadline = `${dayMatch[1]}天`
  }
  const weekMatch = text.match(/(\d+)\s*周/)
  if (weekMatch) {
    result.deadline = `${weekMatch[1]}周`
  }

  const conceptMatch = text.match(/(\d+)\s*(?:版|稿|方案)/)
  if (conceptMatch) {
    result.concept_count = parseInt(conceptMatch[1], 10)
  }

  const sizeMatch = text.match(/(\d+)\s*[x×*]\s*(\d+)/i)
  if (sizeMatch) {
    result.size = `${sizeMatch[1]}×${sizeMatch[2]}`
  }

  const usages = ['海报', '小红书', '电商', '朋友圈', 'banner']
  for (const u of usages) {
    if (text.includes(u)) {
      result.usage = u
      break
    }
  }

  return result
}

export function getMissingFields(parsed: ParsedProject): RequiredField[] {
  return REQUIRED_FIELDS.filter((key) => {
    const v = parsed[key]
    return v === undefined || v === null || v === ''
  })
}
