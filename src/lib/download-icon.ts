import { svgItems } from '@/svgs'

interface IconMatch {
	keywords: string[]
	iconName: string
}

const iconMatches: IconMatch[] = [
	{ keywords: ['百度', 'baidu'], iconName: './百度网盘.svg' },
	{ keywords: ['豆包', 'doubao'], iconName: './豆包.svg' },
	{ keywords: ['蓝奏', 'lanzou'], iconName: './蓝奏.svg' },
	{ keywords: ['迅雷', 'xunlei'], iconName: './迅雷.svg' },
	{ keywords: ['夸克', 'quark'], iconName: './夸克.svg' },
	{ keywords: ['阿里', 'ali', '阿里云盘'], iconName: './阿里云盘.svg' },
	{ keywords: ['github'], iconName: './github.svg' },
	{ keywords: ['本地', 'local'], iconName: './Local.svg' }
]

export function getDownloadIcon(name: string, url: string) {
	const combinedText = `${name} ${url}`.toLowerCase()
	
	for (const match of iconMatches) {
		if (match.keywords.some(keyword => combinedText.includes(keyword.toLowerCase()))) {
			const icon = svgItems.find(item => item.key === match.iconName)
			if (icon) {
				return icon.Component
			}
		}
	}
	
	return null
}
