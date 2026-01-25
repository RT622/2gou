'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { useState } from 'react'

export default function Page() {
  const { siteContent } = useConfigStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  
  // 直接定义文章数据
  const articles = []
  
  // 筛选出分类为"软件"的文章
  const softwareArticles = articles.filter(item => item.category === '软件')
  
  // 获取所有标签
  const allTags = Array.from(new Set(softwareArticles.flatMap(article => article.tags)))
  
  // 根据搜索词和标签筛选文章
  const filteredArticles = softwareArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === 'all' || article.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })
  
  console.log('Total articles:', articles.length)
  console.log('softwareArticles length:', softwareArticles.length)
  console.log('filteredArticles length:', filteredArticles.length)
  console.log('allTags:', allTags)

  const loading = false

  // 截断文本函数
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className='mx-auto w-full max-w-[1920px] px-6 pt-24 pb-12'>
      <div className='mb-8 space-y-4'>
        <input
          type='text'
          placeholder='搜索软件...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='focus:ring-brand mx-auto block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
        />

        <div className='flex flex-wrap justify-center gap-2'>
          <button
            onClick={() => setSelectedTag('all')}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              selectedTag === 'all' ? 'bg-brand text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
              全部
            </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                selectedTag === tag ? 'bg-brand text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
                {tag}
              </button>
            ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '1920px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-start' }}>
          {filteredArticles.map((article, index) => (
            <motion.div 
              key={article.slug} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.3 }}
              style={{ 
                width: '350px', 
                height: '150px',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(4px)',
                flexShrink: 0,
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden'
              }}
            >
              <Link href={`/blog/${article.slug}`} style={{ display: 'block', height: '100%', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  {article.cover && (
                    <div style={{ width: '85px', height: '85px', borderRadius: '0.5rem', marginRight: '12px', overflow: 'hidden', flexShrink: 0, transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      <Image
                        src={article.cover}
                        alt={article.title}
                        width={85}
                        height={85}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '8px', wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#000', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#000'}>
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px', flex: 1, wordBreak: 'break-all', overflow: 'hidden', lineHeight: '1.3' }}>
                        {truncateText(article.summary, 63)}
                      </p>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'right', marginTop: '8px' }}>
                      {new Date(article.date).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className='mt-12 text-center text-gray-500'>
            <p>没有找到相关软件</p>
          </div>
        )}
      </div>
    </div>
  )
}
