'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { loadBlog } from '@/lib/load-blog'

type PasswordVerifyProps = {
	category?: string
	articleSlug?: string
	onVerify: () => void
}

export function PasswordVerify({ category, articleSlug, onVerify }: PasswordVerifyProps) {
	const { siteContent } = useConfigStore()
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [articlePassword, setArticlePassword] = useState<string | null>(null)

	// 加载文章密码配置
	useEffect(() => {
		if (articleSlug) {
			loadBlog(articleSlug).then(blog => {
				if (blog.config.passwordProtected && blog.config.password) {
					setArticlePassword(blog.config.password)
				}
			}).catch(() => {
				// 加载失败，保持articlePassword为null
			})
		}
	}, [articleSlug])

	const handleVerify = () => {
		if (articleSlug && articlePassword) {
			// 文章级密码验证
			if (password === articlePassword) {
				// 验证成功，存储到localStorage，同时存储密码的哈希值
				const passwordHash = articlePassword
				localStorage.setItem(`article_password_${articleSlug}`, 'verified')
				localStorage.setItem(`article_password_${articleSlug}_hash`, passwordHash)
				onVerify()
			} else {
				setError('密码错误，请重新输入')
			}
		} else if (category && siteContent.passwordAccessPassword) {
			// 分类级密码验证
			if (password === siteContent.passwordAccessPassword) {
				// 验证成功，存储到localStorage，同时存储密码的哈希值
				const passwordHash = siteContent.passwordAccessPassword
				localStorage.setItem(`password_${category}`, 'verified')
				localStorage.setItem(`password_${category}_hash`, passwordHash)
				onVerify()
			} else {
				setError('密码错误，请重新输入')
			}
		}
	}

	const handleClose = () => {
		// 关闭模态框，返回上一页
		history.back()
	}

	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
				className='bg-white/80 backdrop-blur-sm rounded-xl border p-6 w-full max-w-md shadow-lg'
			>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-medium'>密码访问</h2>
					<button
						className='text-secondary hover:text-primary'
						onClick={handleClose}
					>
						×
					</button>
				</div>
				<p className='text-sm text-secondary mb-4'>
					{articleSlug ? '该文章需要密码访问，请输入密码' : '该分类需要密码访问，请输入密码'}
				</p>
				
				<div className='space-y-3'>
					<input
						type='password'
						placeholder='请输入密码'
						className='bg-white/60 backdrop-blur-sm w-full rounded-lg border px-3 py-2 text-sm'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
					/>
					
					{error && (
						<p className='text-sm text-red-500'>{error}</p>
					)}
					
					<div className='flex gap-3'>
						<button
							className='flex-1 rounded-lg border bg-white/60 backdrop-blur-sm px-3 py-2 text-sm whitespace-nowrap hover:bg-white/80 transition-colors'
							onClick={handleClose}
						>
							取消
						</button>
						<button
							className='flex-1 rounded-lg border bg-white/60 backdrop-blur-sm px-3 py-2 text-sm whitespace-nowrap hover:bg-white/80 transition-colors'
							onClick={handleVerify}
						>
							验证
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
